import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import ScrollReveal from '@/components/shared/ScrollReveal';

export const metadata: Metadata = {
  title: 'Guias & Dicas',
  description: 'Artigos e guias práticos para angolanos que querem estudar no exterior.',
};

const categorias = ['Todos', 'Candidatura', 'Documentos', 'Visa', 'Financeiro', 'Vida no Exterior'];

interface Props {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}

export default async function GuiasPage({ searchParams }: Props) {
  const params = await searchParams;
  const where = {
    publicado: true,
    ...(params.categoria && params.categoria !== 'Todos' ? { categoria: params.categoria } : {}),
    ...(params.q ? {
      OR: [
        { titulo: { contains: params.q, mode: 'insensitive' as const } },
        { resumo: { contains: params.q, mode: 'insensitive' as const } },
      ],
    } : {}),
  };

  const guias = await db.guia.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: { id: true, slug: true, titulo: true, categoria: true, resumo: true, imagem: true, autor: true, createdAt: true },
  });

  return (
    <main className="pt-20">
      <section className="bg-path-navy py-16">
        <div className="container-ango">
          <h1 className="font-poppins font-bold text-3xl md:text-5xl text-white mb-3">Guias & Dicas</h1>
          <p className="text-white/70 text-base">Tudo o que precisas de saber para candidatares com sucesso</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container-ango">
          {/* Filtros por categoria */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categorias.map((cat) => {
              const active = (params.categoria ?? 'Todos') === cat;
              return (
                <Link
                  key={cat}
                  href={cat === 'Todos' ? '/guias' : `/guias?categoria=${encodeURIComponent(cat)}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    active ? 'bg-path-teal text-white' : 'bg-white border border-path-cream text-path-slate-dark hover:border-path-teal hover:text-path-teal'
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {guias.length === 0 ? (
            <div className="text-center py-20 text-path-slate">
              Nenhum guia encontrado. Em breve teremos mais conteúdo!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guias.map((guia, i) => (
                <ScrollReveal key={guia.id} delay={i * 0.05}>
                  <Link href={`/guias/${guia.slug}`} className="block bg-white rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all overflow-hidden">
                    <div className="h-40 bg-path-cream flex items-center justify-center">
                      {guia.imagem ? (
                        <Image src={guia.imagem} alt={guia.titulo} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                      ) : (
                        <span className="text-4xl">📖</span>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-medium text-path-teal bg-path-teal/10 px-2.5 py-1 rounded-full">
                        {guia.categoria}
                      </span>
                      <h3 className="font-poppins font-semibold text-lg text-path-navy mt-3 mb-2 line-clamp-2">
                        {guia.titulo}
                      </h3>
                      <p className="text-path-slate text-sm line-clamp-2 mb-4">{guia.resumo}</p>
                      <div className="flex items-center justify-between text-xs text-path-slate">
                        <span>{guia.autor}</span>
                        <span>{formatDate(guia.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
