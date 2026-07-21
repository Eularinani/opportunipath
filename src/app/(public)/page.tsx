import Link from 'next/link';
import { GraduationCap, BellRing, Wallet, FlaskConical, Languages, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { db } from '@/lib/db';
import CardBolsa from '@/components/shared/CardBolsa';
import ScrollReveal from '@/components/shared/ScrollReveal';
import ContadorAnimado from '@/components/shared/ContadorAnimado';
import SearchBar from '@/components/shared/SearchBar';
import NewsletterSection from '@/components/sections/NewsletterSection';
import DepoimentosCarousel from '@/components/sections/DepoimentosCarousel';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OportuniPath — O Teu Caminho para o Mundo',
  description: 'Descobre bolsas de estudo internacionais para angolanos. De cursos de línguas a Doutoramento, em qualquer parte do mundo.',
};

async function getHomeStats() {
  const [totalBolsas, totalPaises, totalGuias, totalSubscribers] = await Promise.all([
    db.bolsa.count({ where: { status: { not: 'FECHADA' } } }),
    db.bolsa.groupBy({ by: ['pais'] }).then((r) => r.length),
    db.guia.count({ where: { publicado: true } }),
    db.newsletterSubscriber.count({ where: { ativo: true } }),
  ]);

  return [
    { number: totalBolsas, label: 'Bolsas Ativas' },
    { number: totalPaises, label: 'Países' },
    { number: totalGuias, label: 'Guias Publicados' },
    { number: totalSubscribers, label: 'Subscritores' },
  ];
}

async function getPaisesComBolsas() {
  return db.bolsa.groupBy({
    by: ['pais', 'bandeira'],
    _count: { id: true },
    where: { status: { not: 'FECHADA' } },
    orderBy: { _count: { id: 'desc' } },
    take: 6,
  });
}

async function getBolsasDestaque() {
  return db.bolsa.findMany({
    where: { destaque: true, status: { not: 'FECHADA' } },
    orderBy: { prazo: 'asc' },
    take: 3,
    include: { processo: true, dicas: true },
  });
}

async function getBolsasEmBreve() {
  return db.bolsa.findMany({
    where: { status: 'EM_BREVE' },
    orderBy: { dataAbertura: 'asc' },
    take: 3,
    include: { processo: true, dicas: true },
  });
}

async function getBolsasIntercambio() {
  return db.bolsa.findMany({
    where: { tipo: 'INTERCAMBIO', status: { not: 'FECHADA' } },
    orderBy: { prazo: 'asc' },
    take: 3,
    include: { processo: true, dicas: true },
  });
}

const tiposBolsa = [
  {
    tipo: 'TOTAL',
    icon: GraduationCap,
    titulo: 'Bolsas Totais',
    descricao: 'Propinas, alojamento e estipêndio mensal cobertos — para Licenciatura, Mestrado ou Doutoramento.',
    accent: 'bg-path-teal/10 text-path-teal',
  },
  {
    tipo: 'PARCIAL',
    icon: Wallet,
    titulo: 'Bolsas Parciais',
    descricao: 'Cobertura de parte das propinas ou despesas — uma ótima forma de reduzir custos de estudar fora.',
    accent: 'bg-path-amber/10 text-path-amber',
  },
  {
    tipo: 'PESQUISA',
    icon: FlaskConical,
    titulo: 'Bolsas de Pesquisa',
    descricao: 'Para quem quer investigar a sério — doutoramentos e pós-doutoramentos com financiamento dedicado.',
    accent: 'bg-path-blue/10 text-path-blue',
  },
  {
    tipo: 'INTERCAMBIO',
    icon: Languages,
    titulo: 'Intercâmbio & Línguas',
    descricao: 'Programas de imersão para aprender francês, inglês, alemão, italiano e mais — sem curso superior.',
    accent: 'bg-path-rose/10 text-path-rose',
  },
];

const passos = [
  { num: 1, titulo: 'Pesquisa', descricao: 'Explora centenas de bolsas filtradas por país, nível e área de estudo.' },
  { num: 2, titulo: 'Compara', descricao: 'Compara requisitos, prazos e benefícios para encontrar a ideal.' },
  { num: 3, titulo: 'Prepara', descricao: 'Usa os nossos guias para preparar todos os documentos necessários.' },
  { num: 4, titulo: 'Candidata', descricao: 'Segue o link oficial e candidata-te com confiança.' },
];

export default async function HomePage() {
  const [bolsasDestaque, paises, bolsasEmBreve, bolsasIntercambio, stats] = await Promise.all([
    getBolsasDestaque(),
    getPaisesComBolsas(),
    getBolsasEmBreve(),
    getBolsasIntercambio(),
    getHomeStats(),
  ]);

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[92vh] gradient-hero flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-path-navy/80 via-path-navy/70 to-path-navy/95" />
          <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-path-teal/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-32 w-[32rem] h-[32rem] bg-path-amber/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative z-10 container-ango text-center py-20">
          <div className="max-w-[800px] mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-white text-sm font-medium px-4 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-path-teal" />
              Bolsas selecionadas para angolanos
            </span>
            <h1 className="font-poppins font-extrabold text-4xl md:text-6xl lg:text-7xl text-white leading-tight">
              O Teu Caminho <span className="text-transparent bg-clip-text bg-gradient-teal">Internacional</span>
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-[640px] mx-auto leading-relaxed">
              Descobre bolsas totais, parciais, de pesquisa e programas de intercâmbio. 
              De Angola para qualquer parte do mundo.
            </p>
            <SearchBar variant="hero" className="max-w-[700px] mx-auto" />
            <div className="flex items-center justify-center gap-6 md:gap-10 text-white">
              {stats.slice(0, 3).map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-6">
                  {i > 0 && <span className="text-white/30">|</span>}
                  <div className="text-center">
                    <span className="font-poppins font-bold text-xl md:text-2xl text-path-teal">{stat.number}+</span>
                    <p className="text-white/60 text-xs md:text-sm">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-20 bg-path-cream">
        <div className="container-ango">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1} className="text-center bg-white rounded-2xl p-6 shadow-card">
                <ContadorAnimado
                  end={stat.number}
                  className={`font-poppins font-bold text-3xl md:text-5xl ${i % 2 === 0 ? 'text-path-teal' : 'text-path-navy'}`}
                />
                <p className="text-path-slate text-sm mt-2 font-medium">{stat.label}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tipos de Bolsa */}
      <section className="py-24 bg-white">
        <div className="container-ango">
          <ScrollReveal>
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <span className="inline-block text-path-teal font-semibold text-xs uppercase tracking-widest mb-3">
                Para cada objetivo
              </span>
              <h2 className="font-poppins font-bold text-3xl md:text-4xl text-path-navy mb-4">
                Todos os Tipos de Oportunidade
              </h2>
              <p className="text-path-slate text-base">
                Quer queiras tirar um doutoramento ou simplesmente aprender uma língua nova — temos uma oportunidade para ti.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiposBolsa.map((t, i) => {
              const Icon = t.icon;
              return (
                <ScrollReveal key={t.tipo} delay={i * 0.1}>
                  <Link
                    href={`/bolsas?tipo=${t.tipo}`}
                    className="group flex flex-col h-full p-7 bg-path-cream rounded-2xl border border-path-cream hover:border-path-teal/20 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-5', t.accent)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-poppins font-semibold text-lg text-path-navy mb-2">{t.titulo}</h3>
                    <p className="text-path-slate text-sm leading-relaxed flex-1">{t.descricao}</p>
                    <span className="inline-flex items-center gap-1 text-path-teal text-sm font-semibold mt-5 group-hover:gap-2 transition-all">
                      Explorar <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bolsas em Destaque */}
      <section className="py-24 bg-path-cream">
        <div className="container-ango">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="inline-flex items-center gap-2 text-path-teal font-semibold text-xs uppercase tracking-widest mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Em destaque
                </span>
                <h2 className="font-poppins font-bold text-3xl md:text-4xl text-path-navy">Bolsas em Destaque</h2>
                <p className="text-path-slate text-base mt-2">As oportunidades com prazo mais próximo e maior relevância</p>
              </div>
              <Link href="/bolsas" className="text-path-teal font-inter font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all shrink-0">
                Ver todas →
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bolsasDestaque.map((bolsa, i) => (
              <ScrollReveal key={bolsa.id} delay={i * 0.15}>
                <CardBolsa bolsa={bolsa} variant="destaque" />
              </ScrollReveal>
            ))}
            {bolsasDestaque.length === 0 && (
              <div className="col-span-3 text-center py-12 text-path-slate">
                Nenhuma bolsa em destaque de momento.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bolsas a Abrir em Breve */}
      {bolsasEmBreve.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container-ango">
            <ScrollReveal>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                <div>
                  <span className="inline-flex items-center gap-2 text-path-blue font-semibold text-xs uppercase tracking-widest mb-2">
                    <BellRing className="w-3.5 h-3.5" />
                    Fica à frente
                  </span>
                  <h2 className="font-poppins font-bold text-3xl md:text-4xl text-path-navy">Bolsas que Vão Abrir em Breve</h2>
                  <p className="text-path-slate text-base mt-2">
                    Prepara os teus documentos agora — estas candidaturas ainda não abriram.
                  </p>
                </div>
                <Link href="/bolsas?status=EM_BREVE" className="text-path-blue font-inter font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all shrink-0">
                  Ver todas →
                </Link>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bolsasEmBreve.map((bolsa, i) => (
                <ScrollReveal key={bolsa.id} delay={i * 0.15}>
                  <CardBolsa bolsa={bolsa} variant="destaque" />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Intercâmbio & Línguas */}
      {bolsasIntercambio.length > 0 && (
        <section className="py-24 bg-path-navy relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-path-teal/10 rounded-full blur-3xl" />
          <div className="container-ango relative">
            <ScrollReveal>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                <div>
                  <span className="inline-flex items-center gap-2 text-path-teal font-semibold text-xs uppercase tracking-widest mb-2">
                    <Languages className="w-3.5 h-3.5" />
                    Sem curso superior necessário
                  </span>
                  <h2 className="font-poppins font-bold text-3xl md:text-4xl text-white mb-2">
                    Intercâmbio para Aprender Línguas
                  </h2>
                  <p className="text-white/70 text-base max-w-xl">
                    Programas de imersão total em França, Alemanha, Irlanda, Itália e mais — perfeitos para quem quer estudar uma língua nova lá fora.
                  </p>
                </div>
                <Link href="/bolsas?tipo=INTERCAMBIO" className="text-path-teal font-inter font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all shrink-0">
                  Ver todas →
                </Link>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bolsasIntercambio.map((bolsa, i) => (
                <ScrollReveal key={bolsa.id} delay={i * 0.15}>
                  <CardBolsa bolsa={bolsa} variant="destaque" />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Por País */}
      <section className="py-24 bg-path-cream">
        <div className="container-ango">
          <ScrollReveal>
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <span className="inline-block text-path-teal font-semibold text-xs uppercase tracking-widest mb-3">
                Explora o mundo
              </span>
              <h2 className="font-poppins font-bold text-3xl md:text-4xl text-path-navy mb-4">Bolsas por País</h2>
              <p className="text-path-slate text-base">Encontra oportunidades nos destinos mais populares para angolanos</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paises.map((p, i) => (
              <ScrollReveal key={p.pais} delay={i * 0.1}>
                <Link
                  href={`/bolsas?pais=${encodeURIComponent(p.pais)}`}
                  className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-path-cream hover:border-path-teal/30 hover:shadow-card transition-all duration-200 group"
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform">{p.bandeira}</span>
                  <div>
                    <h3 className="font-poppins font-semibold text-lg text-path-navy">{p.pais}</h3>
                    <p className="text-path-slate text-sm flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {p._count.id} bolsas
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-24 bg-white">
        <div className="container-ango">
          <ScrollReveal>
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="inline-block text-path-teal font-semibold text-xs uppercase tracking-widest mb-3">
                Simples e direto
              </span>
              <h2 className="font-poppins font-bold text-3xl md:text-4xl text-path-navy mb-4">Como Funciona</h2>
              <p className="text-path-slate text-base">O teu caminho para uma bolsa em 4 passos simples</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-6 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-path-teal/30" />
            {passos.map((passo, i) => (
              <ScrollReveal key={passo.num} delay={i * 0.2} className="relative text-center">
                <div className="w-12 h-12 rounded-full border-2 border-path-teal flex items-center justify-center mx-auto mb-5 bg-white relative z-10">
                  <span className="font-poppins font-bold text-lg text-path-teal">{passo.num}</span>
                </div>
                <h3 className="font-poppins font-semibold text-xl text-path-navy mb-2">{passo.titulo}</h3>
                <p className="text-path-slate text-sm max-w-[240px] mx-auto leading-relaxed">{passo.descricao}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <DepoimentosCarousel />

      {/* Newsletter CTA */}
      <NewsletterSection />
    </main>
  );
}
