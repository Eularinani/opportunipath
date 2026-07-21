import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contactos — Admin' };

interface Props {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function AdminContactosPage({ searchParams }: Props) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') notFound();

  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const limit = 20;
  const statusFilter = params.status;

  const where = statusFilter ? { status: statusFilter as 'PENDENTE' | 'RESPONDIDO' | 'ARQUIVADO' } : {};

  const [total, contactos] = await Promise.all([
    db.contacto.count({ where }),
    db.contacto.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'PENDENTE', label: 'Pendentes' },
    { value: 'RESPONDIDO', label: 'Respondidos' },
    { value: 'ARQUIVADO', label: 'Arquivados' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-gray-900">Contactos</h1>
          <p className="text-gray-500 text-sm">{total} mensagens recebidas</p>
        </div>
      </div>

      <div className="flex gap-2">
        {statusOptions.map((s) => (
          <Link
            key={s.value}
            href={`/admin/contactos${s.value ? `?status=${s.value}` : ''}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              (statusFilter ?? '') === s.value
                ? 'bg-path-teal text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Remetente</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Assunto</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Estado</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Data</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contactos.map((c) => (
              <tr key={c.id} className={`hover:bg-gray-50 ${!c.lido ? 'bg-blue-50/30' : ''}`}>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{c.nome}</p>
                  <p className="text-gray-400 text-xs">{c.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">{c.assunto}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    c.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-700'
                    : c.status === 'RESPONDIDO' ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                  {formatDate(c.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/contactos/${c.id}`} className="text-xs text-blue-600 hover:underline">Ver</Link>
                </td>
              </tr>
            ))}
            {contactos.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-gray-400">Nenhuma mensagem.</td></tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">Página {page} de {totalPages}</span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/contactos?page=${page - 1}${statusFilter ? `&status=${statusFilter}` : ''}`} className="px-3 py-1 border rounded hover:bg-gray-50">←</Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/contactos?page=${page + 1}${statusFilter ? `&status=${statusFilter}` : ''}`} className="px-3 py-1 border rounded hover:bg-gray-50">→</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
