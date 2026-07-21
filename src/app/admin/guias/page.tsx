import Link from 'next/link';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Gerir Guias — Admin' };

export default async function AdminGuiasPage() {
  const guias = await db.guia.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, titulo: true, categoria: true, autor: true, publicado: true, createdAt: true },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-gray-900">Guias</h1>
          <p className="text-gray-500 text-sm">{guias.length} guias registados</p>
        </div>
        <Link
          href="/admin/guias/novo"
          className="inline-flex items-center gap-2 bg-path-teal text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-path-teal-dark transition-colors text-sm"
        >
          + Novo Guia
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Título</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Categoria</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Estado</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Data</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {guias.map((g) => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 line-clamp-1">{g.titulo}</p>
                  <p className="text-gray-400 text-xs">{g.autor}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-600">{g.categoria}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${g.publicado ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {g.publicado ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                  {formatDate(g.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/guias/${g.id}`} className="text-xs text-blue-600 hover:underline">Editar</Link>
                </td>
              </tr>
            ))}
            {guias.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-gray-400">Nenhum guia ainda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
