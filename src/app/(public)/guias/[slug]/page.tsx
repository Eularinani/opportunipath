import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import ScrollReveal from '@/components/shared/ScrollReveal';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guia = await db.guia.findUnique({ where: { slug } });
  if (!guia) return { title: 'Guia não encontrado' };
  return {
    title: guia.titulo,
    description: guia.resumo.slice(0, 160),
  };
}

export default async function GuiaDetailPage({ params }: Props) {
  const { slug } = await params;
  const guia = await db.guia.findUnique({
    where: { slug, publicado: true },
  });

  if (!guia) notFound();

  return (
    <main className="pt-20">
      {/* Header */}
      <section className="bg-path-navy py-12">
        <div className="container-ango">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-6">
            <Link href="/" className="hover:text-white">Início</Link>
            <span>/</span>
            <Link href="/guias" className="hover:text-white">Guias</Link>
            <span>/</span>
            <span className="text-white">{guia.titulo}</span>
          </div>
          <div className="max-w-3xl">
            <span className="inline-block text-path-amber font-semibold text-xs uppercase tracking-widest mb-3">
              {guia.categoria}
            </span>
            <h1 className="font-poppins font-bold text-2xl md:text-4xl text-white mb-4 leading-tight">
              {guia.titulo}
            </h1>
            <p className="text-white/70 text-base">{guia.resumo}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-ango">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="lg:col-span-2">
              <ScrollReveal>
                <div className="bg-white rounded-xl p-6 md:p-8 shadow-card">
                  {guia.imagem && (
                    <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
                      <Image src={guia.imagem} alt={guia.titulo} fill className="object-cover" />
                    </div>
                  )}
                  <div className="prose prose-slate max-w-none">
                    {guia.conteudo.split('\n').map((paragraph, i) => (
                      <p key={i} className="text-path-slate-dark leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <aside className="space-y-5">
              <ScrollReveal>
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <h3 className="font-poppins font-semibold text-path-navy mb-4">Sobre este guia</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-path-slate">Autor</p>
                      <p className="font-medium text-path-navy">{guia.autor}</p>
                    </div>
                    <div>
                      <p className="text-path-slate">Categoria</p>
                      <p className="font-medium text-path-navy">{guia.categoria}</p>
                    </div>
                    <div>
                      <p className="text-path-slate">Publicado em</p>
                      <p className="font-medium text-path-navy">{formatDate(guia.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <Link
                  href="/guias"
                  className="flex items-center justify-center w-full bg-path-teal text-white font-semibold py-3 rounded-xl hover:bg-path-teal-dark transition-colors"
                >
                  ← Ver todos os guias
                </Link>
              </ScrollReveal>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
