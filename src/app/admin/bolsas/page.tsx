import Link from 'next/link';
import { db } from '@/lib/db';
import { getPrazoLabel, getPrazoColor, cn } from '@/lib/utils';
import AdminBolsaActions from '@/components/admin/AdminBolsaActions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Gerir Bolsas — Admin' };

interface Props {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminBolsasPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const limit = 15;

  const where = params.q
    ? {
        OR: [
          { titulo: { contains: params.q, mode: 'insensitive' as const } },
          { pais: { contains: params.q, mode: 'insensitive' as const } },
          { universidade: { contains: params.q, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [total, bolsas] = await Promise.all([
    db.bolsa.count({ where }),
    db.bolsa.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-gray-900">Bolsas</h1>
          <p className="text-gray-500 text-sm">{total} bolsas registadas</p>
        </div>
        <Link
          href="/admin/bolsas/nova"
          className="inline-flex items-center gap-2 bg-path-teal text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-path-teal-dark transition-colors text-sm"
        >
          + Nova Bolsa
        </Link>
      </div>

      {/* Search */}
      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Pesquisar bolsas..."
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm flex-1 max-w-sm focus:outline-none focus:border-path-teal"
        />
        <button type="submit" className="bg-path-teal text-white px-4 py-2 rounded-lg text-sm hover:bg-path-teal-dark">Pesquisar</button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Bolsa</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">País</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Prazo</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Estado</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Destaque</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bolsas.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 line-clamp-1 max-w-xs">{b.titulo}</p>
                  <p className="text-gray-400 text-xs">{b.nivel} · {b.area}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                  {b.bandeira} {b.pais}
                </td>
                <td className={cn('px-4 py-3 hidden lg:table-cell text-xs', getPrazoColor(b.prazo))}>
                  {getPrazoLabel(b.prazo)}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    b.status === 'ABERTA' ? 'bg-green-100 text-green-700'
                    : b.status === 'URGENTE' ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-500'
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className={`text-xs ${b.destaque ? 'text-path-amber' : 'text-gray-300'}`}>
                    {b.destaque ? '★ Sim' : '— Não'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <AdminBolsaActions id={b.id} />
                </td>
              </tr>
            ))}
            {bolsas.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Nenhuma bolsa encontrada.</td></tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">Página {page} de {totalPages}</span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/bolsas?page=${page - 1}${params.q ? `&q=${params.q}` : ''}`} className="px-3 py-1 border rounded hover:bg-gray-50">←</Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/bolsas?page=${page + 1}${params.q ? `&q=${params.q}` : ''}`} className="px-3 py-1 border rounded hover:bg-gray-50">→</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
