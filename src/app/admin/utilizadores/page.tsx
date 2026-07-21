import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import UtilizadorActions from './UtilizadorActions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Utilizadores — Admin' };

export default async function AdminUtilizadoresPage() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') notFound();

  const utilizadores = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-gray-900">Utilizadores</h1>
        <p className="text-gray-500 text-sm">{utilizadores.length} utilizadores registados</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Nome</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Papel</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Registado em</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {utilizadores.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{u.name ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    u.role === 'ADMIN' ? 'bg-path-teal/10 text-path-teal' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                  {formatDate(u.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <UtilizadorActions id={u.id} role={u.role} currentUserId={session.user.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
