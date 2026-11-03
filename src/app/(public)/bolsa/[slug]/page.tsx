import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Calendar, GraduationCap, BookOpen, Globe, BellRing, ShieldCheck, AlertTriangle, Users } from 'lucide-react';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { bolsaAtivaWhere, bolsaPublicadaWhere, calcularStatus, verificacaoExpirada } from '@/lib/bolsas';
import { getPrazoLabel, getPrazoColor, getAberturaLabel, formatDate, tipoBolsaLabel, tipoBolsaColor, statusBolsaLabel, statusBolsaColor, cn } from '@/lib/utils';
import ScrollReveal from '@/components/shared/ScrollReveal';
import CardBolsa from '@/components/shared/CardBolsa';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bolsa = await db.bolsa.findFirst({ where: { slug, ...bolsaPublicadaWhere } });
  if (!bolsa) return { title: 'Bolsa não encontrada' };
  return {
    title: bolsa.titulo,
    description: bolsa.descricao.slice(0, 160),
  };
}

async function getBolsa(slug: string, isAdmin: boolean) {
  // Rascunhos só são visíveis para admins (pré-visualização antes de publicar)
  const bolsa = await db.bolsa.findFirst({
    where: { slug, ...(isAdmin ? {} : bolsaPublicadaWhere) },
    include: {
      processo: { orderBy: { passo: 'asc' } },
      dicas: true,
    },
  });
  if (bolsa && !isAdmin) {
    await db.bolsa.update({ where: { id: bolsa.id }, data: { visualizacoes: { increment: 1 } } });
  }
  return bolsa;
}

async function getRelacionadas(bolsa: { id: string; pais: string; area: string | null }) {
  return db.bolsa.findMany({
    where: {
      AND: [
        bolsaAtivaWhere(),
        { id: { not: bolsa.id } },
        { OR: [{ pais: bolsa.pais }, ...(bolsa.area ? [{ area: bolsa.area }] : [])] },
      ],
    },
    take: 3,
    include: { processo: true, dicas: true },
  });
}

export default async function BolsaDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  const isAdmin = session?.user.role === 'ADMIN';
  const bolsa = await getBolsa(slug, isAdmin);
  if (!bolsa) notFound();

  const relacionadas = await getRelacionadas(bolsa);
  const status = calcularStatus(bolsa);
  const verificacaoAntiga = verificacaoExpirada(bolsa.verificadoEm);

  return (
    <main className="pt-20">
      {bolsa.estadoRevisao !== 'PUBLICADA' && (
        <div className="bg-path-amber text-white text-sm text-center py-2 px-4">
          Pré-visualização de admin — esta bolsa está em <strong>{bolsa.estadoRevisao}</strong> e não é visível ao público.
        </div>
      )}
      {/* Header */}
      <section className="bg-path-navy py-12">
        <div className="container-ango">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-6">
            <Link href="/" className="hover:text-white">Início</Link>
            <span>/</span>
            <Link href="/bolsas" className="hover:text-white">Bolsas</Link>
            <span>/</span>
            <span className="text-white">{bolsa.titulo}</span>
          </div>
          <div className="flex flex-wrap items-start gap-4 justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className={cn('text-xs font-medium px-3 py-1 rounded-full', tipoBolsaColor(bolsa.tipo))}>
                  {tipoBolsaLabel(bolsa.tipo)}
                </span>
                <span className={cn('text-xs font-medium px-3 py-1 rounded-full', statusBolsaColor(status))}>
                  {statusBolsaLabel(status)}
                </span>
                {status === 'EM_BREVE' && getAberturaLabel(bolsa.dataAbertura) && (
                  <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-600">
                    <BellRing className="w-3 h-3" />
                    {getAberturaLabel(bolsa.dataAbertura)}
                  </span>
                )}
                <span className="flex items-center gap-1 text-path-amber text-sm">
                  <span className="text-lg">{bolsa.bandeira}</span>
                  {bolsa.pais}
                </span>
              </div>
              <h1 className="font-poppins font-bold text-2xl md:text-4xl text-white mb-2">{bolsa.titulo}</h1>
              <p className="text-white/70 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {bolsa.universidade}
              </p>
            </div>
            {bolsa.linkOficial && (
              <a
                href={bolsa.linkOficial}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-path-teal text-white font-inter font-semibold px-6 py-3 rounded-lg hover:bg-path-teal-dark transition-colors"
              >
                {status === 'FECHADA' ? 'Ver Página Oficial' : 'Candidatar no Site Oficial'}
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-ango">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              <ScrollReveal>
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <h2 className="font-poppins font-semibold text-xl text-path-navy mb-4">Sobre a Bolsa</h2>
                  <p className="text-path-slate-dark leading-relaxed">{bolsa.descricao}</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <h2 className="font-poppins font-semibold text-xl text-path-navy mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-path-teal" />
                    Quem se pode candidatar
                  </h2>
                  {bolsa.paisesElegiveis.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {bolsa.paisesElegiveis.map((p) => (
                        <span key={p} className="text-sm bg-path-cream text-path-navy px-3 py-1 rounded-full">{p}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-path-slate-dark text-sm">
                      A elegibilidade por nacionalidade não está especificada. Confirma no site oficial se o teu país é elegível.
                    </p>
                  )}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <h2 className="font-poppins font-semibold text-xl text-path-navy mb-4">Requisitos</h2>
                  {bolsa.requisitos.length === 0 && (
                    <p className="text-path-slate-dark text-sm">Consulta os requisitos no site oficial.</p>
                  )}
                  <ul className="space-y-2">
                    {bolsa.requisitos.map((req, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-path-slate-dark text-sm">
                        <span className="w-5 h-5 rounded-full bg-path-teal/10 text-path-teal flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <h2 className="font-poppins font-semibold text-xl text-path-navy mb-4">Documentos Necessários</h2>
                  {bolsa.documentos.length === 0 && (
                    <p className="text-path-slate-dark text-sm">Consulta a lista de documentos no site oficial.</p>
                  )}
                  <ul className="space-y-2">
                    {bolsa.documentos.map((doc, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-path-slate-dark text-sm">
                        <span className="text-path-amber">📄</span>
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              {bolsa.processo.length > 0 && (
                <ScrollReveal delay={0.2}>
                  <div className="bg-white rounded-xl p-6 shadow-card">
                    <h2 className="font-poppins font-semibold text-xl text-path-navy mb-6">Processo de Candidatura</h2>
                    <div className="space-y-6">
                      {bolsa.processo.map((step, i) => (
                        <div key={step.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-path-teal text-white flex items-center justify-center font-bold text-sm shrink-0">
                              {step.passo}
                            </div>
                            {i < bolsa.processo.length - 1 && <div className="w-0.5 flex-1 bg-path-cream mt-2" />}
                          </div>
                          <div className="pb-4">
                            <h3 className="font-poppins font-semibold text-path-navy">{step.titulo}</h3>
                            <p className="text-path-slate-dark text-sm mt-1">{step.descricao}</p>
                            {step.deadline && (
                              <span className="inline-flex items-center gap-1 mt-2 text-xs text-path-amber bg-path-amber/10 px-2.5 py-1 rounded-full">
                                <Calendar className="w-3 h-3" />
                                {step.deadline}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {bolsa.dicas.length > 0 && (
                <ScrollReveal delay={0.25}>
                  <div className="bg-path-amber/5 border border-path-amber/20 rounded-xl p-6">
                    <h2 className="font-poppins font-semibold text-xl text-path-navy mb-4">💡 Dicas de Candidatura</h2>
                    <div className="space-y-4">
                      {bolsa.dicas.map((dica) => (
                        <div key={dica.id}>
                          <h3 className="font-semibold text-path-navy text-sm">{dica.titulo}</h3>
                          <p className="text-path-slate-dark text-sm mt-1">{dica.descricao}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              <ScrollReveal>
                <div className="bg-white rounded-xl p-6 shadow-card space-y-4">
                  <h3 className="font-poppins font-semibold text-path-navy">Resumo</h3>
                  {[
                    { icon: <GraduationCap className="w-4 h-4" />, label: 'Nível', value: bolsa.nivel ?? 'Por confirmar' },
                    { icon: <BookOpen className="w-4 h-4" />, label: 'Área', value: bolsa.area ?? 'Por confirmar' },
                    { icon: <Globe className="w-4 h-4" />, label: 'País', value: `${bolsa.bandeira} ${bolsa.pais}` },
                    ...(bolsa.dataAbertura
                      ? [{ icon: <BellRing className="w-4 h-4" />, label: 'Abertura', value: getAberturaLabel(bolsa.dataAbertura) ?? formatDate(bolsa.dataAbertura), valueClass: 'text-blue-600' }]
                      : []),
                    { icon: <Calendar className="w-4 h-4" />, label: 'Prazo', value: bolsa.prazo ? `${formatDate(bolsa.prazo)} · ${getPrazoLabel(bolsa.prazo)}` : getPrazoLabel(null), valueClass: getPrazoColor(bolsa.prazo) },
                    { icon: <span>⏱</span>, label: 'Duração', value: bolsa.duracao },
                    { icon: <span>💶</span>, label: 'Valor', value: bolsa.valor },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <span className="text-path-teal mt-0.5">{item.icon}</span>
                      <div>
                        <p className="text-xs text-path-slate">{item.label}</p>
                        <p className={cn('font-semibold text-sm text-path-navy', item.valueClass)}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <div
                  className={cn(
                    'rounded-xl p-5 text-sm space-y-2 border',
                    verificacaoAntiga ? 'bg-path-amber/5 border-path-amber/30' : 'bg-path-teal/5 border-path-teal/20'
                  )}
                >
                  {bolsa.verificadoEm ? (
                    <p className="flex items-start gap-2 font-semibold text-path-navy">
                      {verificacaoAntiga ? (
                        <AlertTriangle className="w-4 h-4 text-path-amber shrink-0 mt-0.5" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-path-teal shrink-0 mt-0.5" />
                      )}
                      Verificado na fonte oficial em {formatDate(bolsa.verificadoEm)}
                    </p>
                  ) : (
                    <p className="flex items-start gap-2 font-semibold text-path-navy">
                      <AlertTriangle className="w-4 h-4 text-path-amber shrink-0 mt-0.5" />
                      Ainda não verificado
                    </p>
                  )}
                  {verificacaoAntiga && bolsa.verificadoEm && (
                    <p className="text-path-slate-dark">
                      Esta verificação tem mais de 2 meses — a informação pode ter mudado.
                    </p>
                  )}
                  <p className="text-path-slate">
                    O OportuniPath não é a entidade que atribui a bolsa. Confirma sempre prazos, valores e
                    requisitos no site oficial antes de te candidatares.
                  </p>
                </div>
              </ScrollReveal>

              {bolsa.linkOficial && (
                <ScrollReveal delay={0.1}>
                  <a
                    href={bolsa.linkOficial}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-path-teal text-white font-inter font-semibold py-3.5 rounded-xl hover:bg-path-teal-dark transition-colors"
                  >
                    {status === 'FECHADA' ? 'Ver Página Oficial' : 'Candidatar no Site Oficial'}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </ScrollReveal>
              )}
            </aside>
          </div>

          {/* Relacionadas */}
          {relacionadas.length > 0 && (
            <div className="mt-16">
              <h2 className="font-poppins font-bold text-2xl text-path-navy mb-6">Bolsas Relacionadas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relacionadas.map((b) => (
                  <CardBolsa key={b.id} bolsa={b} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
