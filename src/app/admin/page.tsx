import Link from 'next/link';
import { db } from '@/lib/db';
import { statusBolsaLabel } from '@/lib/utils';
import ChartCard from '@/components/admin/ChartCard';
import BolsasPorPaisChart from '@/components/admin/charts/BolsasPorPaisChart';
import BolsasPorStatusChart from '@/components/admin/charts/BolsasPorStatusChart';
import BolsasPorMesChart from '@/components/admin/charts/BolsasPorMesChart';
import ContactosPorStatusChart from '@/components/admin/charts/ContactosPorStatusChart';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard — Admin' };

async function getStats() {
  const [totalBolsas, bolsasAbertas, totalGuias, totalSubscribers, totalContactos, contactosNaoLidos] =
    await Promise.all([
      db.bolsa.count(),
      db.bolsa.count({ where: { status: { in: ['ABERTA', 'URGENTE'] } } }),
      db.guia.count({ where: { publicado: true } }),
      db.newsletterSubscriber.count({ where: { ativo: true } }),
      db.contacto.count(),
      db.contacto.count({ where: { lido: false } }),
    ]);
  return { totalBolsas, bolsasAbertas, totalGuias, totalSubscribers, totalContactos, contactosNaoLidos };
}

async function getRecentBolsas() {
  return db.bolsa.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
}

async function getBolsasPorPais() {
  const result = await db.bolsa.groupBy({
    by: ['pais'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 8,
  });
  return result.map((r) => ({ pais: r.pais, total: r._count.id }));
}

async function getBolsasPorStatus() {
  const result = await db.bolsa.groupBy({
    by: ['status'],
    _count: { id: true },
  });
  return result.map((r) => ({ status: statusBolsaLabel(r.status), total: r._count.id }));
}

async function getBolsasPorMes() {
  const hoje = new Date();
  const meses: { mes: string; inicio: Date; fim: Date }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const fim = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    meses.push({
      mes: d.toLocaleDateString('pt-AO', { month: 'short', year: '2-digit' }),
      inicio: d,
      fim,
    });
  }

  const counts = await Promise.all(
    meses.map((m) =>
      db.bolsa.count({
        where: { createdAt: { gte: m.inicio, lte: m.fim } },
      })
    )
  );

  return meses.map((m, i) => ({ mes: m.mes, total: counts[i] }));
}

async function getContactosPorStatus() {
  const result = await db.contacto.groupBy({
    by: ['status'],
    _count: { id: true },
  });
  return result.map((r) => ({ status: r.status, total: r._count.id }));
}

export default async function AdminDashboard() {
  const [stats, recentBolsas, bolsasPorPais, bolsasPorStatus, bolsasPorMes, contactosPorStatus] =
    await Promise.all([
      getStats(),
      getRecentBolsas(),
      getBolsasPorPais(),
      getBolsasPorStatus(),
      getBolsasPorMes(),
      getContactosPorStatus(),
    ]);

  const statCards = [
    { label: 'Total de Bolsas', value: stats.totalBolsas, sub: `${stats.bolsasAbertas} abertas`, color: 'bg-path-teal' },
    { label: 'Guias Publicados', value: stats.totalGuias, sub: 'artigos activos', color: 'bg-path-amber' },
    { label: 'Subscritores', value: stats.totalSubscribers, sub: 'newsletter activa', color: 'bg-path-teal' },
    { label: 'Contactos', value: stats.totalContactos, sub: `${stats.contactosNaoLidos} não lidos`, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Bem-vindo(a) ao painel administrativo do OportuniPath</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-white font-bold text-lg">
                {String(card.value).length <= 3 ? card.value : card.value.toLocaleString()}
              </span>
            </div>
            <p className="font-poppins font-semibold text-2xl text-gray-900">{card.value.toLocaleString()}</p>
            <p className="text-sm font-medium text-gray-700">{card.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Bolsas por País" description="Top países com mais oportunidades registadas">
          <BolsasPorPaisChart data={bolsasPorPais} />
        </ChartCard>

        <ChartCard title="Bolsas por Estado" description="Distribuição do status das bolsas">
          <BolsasPorStatusChart data={bolsasPorStatus} />
        </ChartCard>

        <ChartCard title="Novas Bolsas por Mês" description="Evolução das publicações nos últimos 6 meses">
          <BolsasPorMesChart data={bolsasPorMes} />
        </ChartCard>

        <ChartCard title="Contactos por Estado" description="Mensagens recebidas e tratadas">
          <ContactosPorStatusChart data={contactosPorStatus} />
        </ChartCard>
      </div>

      {/* Recent Bolsas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-poppins font-semibold text-gray-900">Bolsas Recentes</h2>
          <Link href="/admin/bolsas" className="text-sm text-path-teal hover:underline">Ver todas →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentBolsas.map((b) => (
            <div key={b.id} className="px-5 py-3.5 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-gray-900 line-clamp-1">{b.titulo}</p>
                <p className="text-xs text-gray-400">{b.pais} · {b.nivel} · {b.area}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  b.status === 'ABERTA' ? 'bg-green-100 text-green-700'
                  : b.status === 'URGENTE' ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-500'
                }`}>
                  {b.status}
                </span>
                <Link href={`/admin/bolsas/${b.id}`} className="text-xs text-gray-400 hover:text-path-teal">Editar</Link>
              </div>
            </div>
          ))}
          {recentBolsas.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-gray-400">Nenhuma bolsa ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}
