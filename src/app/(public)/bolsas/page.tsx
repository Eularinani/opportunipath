import type { Metadata } from 'next';
import { searchBolsas } from '@/lib/search';
import CardBolsa from '@/components/shared/CardBolsa';
import SearchBar from '@/components/shared/SearchBar';
import BolsasFiltros from '@/components/bolsas/BolsasFiltros';
import BolsasPaginacao from '@/components/bolsas/BolsasPaginacao';

export const metadata: Metadata = {
  title: 'Bolsas de Estudo',
  description: 'Encontra e filtra bolsas de estudo internacionais para angolanos por país, nível, área e prazo.',
};

interface BolsasPageProps {
  searchParams: Promise<{
    q?: string;
    pais?: string | string[];
    nivel?: string | string[];
    area?: string | string[];
    tipo?: string | string[];
    status?: string | string[];
    page?: string;
    orderBy?: string;
  }>;
}

export default async function BolsasPage({ searchParams }: BolsasPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);

  const result = await searchBolsas({
    q: params.q,
    pais: params.pais,
    nivel: params.nivel,
    area: params.area,
    tipo: params.tipo,
    status: params.status,
    page,
    limit: 12,
    orderBy: (params.orderBy as 'prazo' | 'createdAt' | 'visualizacoes') ?? 'prazo',
  });

  return (
    <main className="pt-20">
      {/* Header */}
      <section className="bg-path-navy py-16">
        <div className="container-ango">
          <h1 className="font-poppins font-bold text-3xl md:text-5xl text-white mb-3">
            Bolsas de Estudo
          </h1>
          <p className="text-white/70 text-base mb-8">
            {result.total} bolsas disponíveis para estudantes angolanos
          </p>
          <SearchBar variant="hero" className="max-w-2xl" defaultValue={params.q} />
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="container-ango">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar de filtros */}
            <aside className="lg:w-64 shrink-0">
              <BolsasFiltros />
            </aside>

            {/* Resultados */}
            <div className="flex-1">
              {params.q && (
                <p className="text-path-slate text-sm mb-6">
                  Resultados para <strong className="text-path-navy">&ldquo;{params.q}&rdquo;</strong> — {result.total} bolsas
                </p>
              )}

              {result.bolsas.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-path-slate text-lg">Nenhuma bolsa encontrada.</p>
                  <p className="text-path-slate text-sm mt-2">Tenta ajustar os filtros de pesquisa.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                    {result.bolsas.map((bolsa) => (
                      <CardBolsa key={bolsa.id} bolsa={bolsa} />
                    ))}
                  </div>
                  <BolsasPaginacao
                    currentPage={result.page}
                    totalPages={result.totalPages}
                    total={result.total}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
