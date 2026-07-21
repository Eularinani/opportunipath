'use client';

import { useState, useEffect, useRef } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { documentosBasicos, processoAutenticacao, guiasDocumentos, paisesDocumento } from '@/data/documentos';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

export default function DocumentosPage() {
  const [paisAtivo, setPaisAtivo] = useState('geral');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState('');
  const [mounted, setMounted] = useState(false);

  const sectionsRef = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('opportunipath-checklist');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('opportunipath-checklist', JSON.stringify(checkedItems));
    }
  }, [checkedItems, mounted]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['documentos-basicos', 'processo-autenticacao', 'requisitos-especificos', 'reconhecimento', 'checklist'];
      for (const id of sections) {
        const el = sectionsRef.current[id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 80 && rect.top <= 400) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [paisAtivo]);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalChecks = documentosBasicos.length;
  const checkedCount = documentosBasicos.filter((d) => checkedItems[d.id]).length;
  const progressPercent = Math.round((checkedCount / totalChecks) * 100);

  const guia = guiasDocumentos[paisAtivo] || guiasDocumentos['geral'];

  const sidebarLinks = [
    { id: 'documentos-basicos', label: 'Documentos Básicos' },
    { id: 'processo-autenticacao', label: 'Processo de Autenticação' },
    { id: 'requisitos-especificos', label: 'Requisitos Específicos' },
    { id: 'reconhecimento', label: 'Reconhecimento de Diplomas' },
    { id: 'checklist', label: 'Checklist' },
  ];

  const scrollToSection = (id: string) => {
    const el = sectionsRef.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!mounted) return null;

  return (
    <main>
      <HeroSection
        title="Guia de Documentos para Angolanos"
        description="Tudo o que precisas saber sobre como preparar e autenticar os teus documentos para candidaturas internacionais. De Angola para o mundo."
        breadcrumb={[
          { label: 'Início', href: '/' },
          { label: 'Documentos', href: '/documentos' },
        ]}
      />

      {/* Tabs por País */}
      <section className="py-8 bg-white border-b border-path-cream">
        <div className="container-ango">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {paisesDocumento.map((pais) => (
              <button
                key={pais}
                onClick={() => setPaisAtivo(pais.toLowerCase())}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  paisAtivo === pais.toLowerCase()
                    ? 'bg-path-teal text-white'
                    : 'bg-transparent border border-path-cream text-path-navy hover:border-path-teal'
                }`}
              >
                {pais}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-12 bg-white">
        <div className="container-ango">
          <div className="flex flex-col lg:flex-row gap-10 max-w-[1100px] mx-auto">
            {/* Conteúdo Principal */}
            <div className="flex-1 min-w-0">
              <ScrollReveal>
                <h2 className="font-poppins font-bold text-2xl md:text-3xl text-path-navy mb-8">
                  Documentação — {guia.pais}
                </h2>
              </ScrollReveal>

              {/* Documentos Básicos */}
              <div
                ref={(el) => { sectionsRef.current['documentos-basicos'] = el; }}
                className="mb-10"
              >
                <ScrollReveal>
                  <h3 className="font-poppins font-semibold text-xl text-path-navy mb-4">
                    Documentos Básicos Necessários
                  </h3>
                  <div className="space-y-3">
                    {documentosBasicos.map((doc) => (
                      <div key={doc.id} className="flex items-start gap-3 p-4 bg-path-cream rounded-lg">
                        <Checkbox
                          id={doc.id}
                          checked={!!checkedItems[doc.id]}
                          onCheckedChange={() => toggleCheck(doc.id)}
                          className="mt-0.5"
                        />
                        <div>
                          <label htmlFor={doc.id} className="font-medium text-sm text-path-navy cursor-pointer">
                            {doc.nome}
                          </label>
                          <p className="text-xs text-path-slate mt-0.5">{doc.descricao}</p>
                          {doc.requerAutenticacao && (
                            <span className="inline-block mt-1 text-[10px] bg-path-teal/10 text-path-teal px-2 py-0.5 rounded-full">
                              Requer autenticação
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>

              {/* Processo de Autenticação */}
              <div
                ref={(el) => { sectionsRef.current['processo-autenticacao'] = el; }}
                className="mb-10"
              >
                <ScrollReveal>
                  <h3 className="font-poppins font-semibold text-xl text-path-navy mb-4">
                    Processo de Autenticação em Angola
                  </h3>
                  <div className="relative pl-8 border-l-2 border-path-cream space-y-8">
                    {processoAutenticacao.map((step) => (
                      <div key={step.passo} className="relative">
                        <span className="absolute -left-[41px] w-7 h-7 rounded-full border-2 border-path-amber text-path-amber bg-white flex items-center justify-center text-xs font-semibold">
                          {step.passo}
                        </span>
                        <h4 className="font-poppins font-semibold text-base text-path-navy mb-1">
                          {step.titulo}
                        </h4>
                        <p className="text-path-slate-dark text-sm mb-3 leading-relaxed">{step.descricao}</p>
                        <div className="bg-path-cream rounded-lg p-3 space-y-1">
                          <p className="text-xs text-path-slate">
                            <span className="font-semibold">Custo:</span> {step.custo}
                          </p>
                          <p className="text-xs text-path-slate">
                            <span className="font-semibold">Tempo:</span> {step.tempo}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>

              {/* Requisitos Específicos */}
              <div
                ref={(el) => { sectionsRef.current['requisitos-especificos'] = el; }}
                className="mb-10"
              >
                <ScrollReveal>
                  <h3 className="font-poppins font-semibold text-xl text-path-navy mb-4">
                    Requisitos Específicos do País
                  </h3>
                  <div className="space-y-3">
                    {guia.requisitosEspecificos.map((req, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-path-cream rounded-lg">
                        <span className="text-path-amber text-lg shrink-0">★</span>
                        <p className="text-sm text-path-slate-dark leading-relaxed">{req}</p>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>

              {/* Reconhecimento de Diplomas */}
              <div
                ref={(el) => { sectionsRef.current['reconhecimento'] = el; }}
                className="mb-10"
              >
                <ScrollReveal>
                  <h3 className="font-poppins font-semibold text-xl text-path-navy mb-4">
                    Reconhecimento de Diplomas
                  </h3>
                  <div className="bg-path-cream rounded-xl p-6">
                    <div className="text-path-slate-dark text-sm leading-relaxed whitespace-pre-line">
                      {guia.reconhecimentoDiplomas}
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Checklist */}
              <div
                ref={(el) => { sectionsRef.current['checklist'] = el; }}
                className="mb-10"
              >
                <ScrollReveal>
                  <h3 className="font-poppins font-semibold text-xl text-path-navy mb-4">
                    Checklist Completo
                  </h3>
                  <div className="bg-white border border-path-cream rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-path-slate">
                        <span className="font-semibold text-path-navy">{checkedCount}</span> de {totalChecks} documentos prontos
                      </span>
                      <span className="text-sm font-semibold text-path-teal">{progressPercent}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-2 mb-6" />
                    <div className="space-y-3">
                      {documentosBasicos.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-3">
                          <Checkbox
                            id={`checklist-${doc.id}`}
                            checked={!!checkedItems[doc.id]}
                            onCheckedChange={() => toggleCheck(doc.id)}
                          />
                          <label htmlFor={`checklist-${doc.id}`} className="text-sm text-path-navy cursor-pointer">
                            {doc.nome}
                          </label>
                          <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                            checkedItems[doc.id]
                              ? 'bg-path-teal/10 text-path-teal'
                              : 'bg-path-cream text-path-slate'
                          }`}>
                            {checkedItems[doc.id] ? 'Pronto' : 'Pendente'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Sidebar Navegação */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-white rounded-xl border border-path-cream p-5 sticky top-24">
                <h4 className="font-poppins font-semibold text-sm mb-4">Nesta Página</h4>
                <nav className="space-y-1">
                  {sidebarLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      className={`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                        activeSection === link.id
                          ? 'text-path-teal font-semibold border-l-2 border-path-teal pl-3'
                          : 'text-path-slate hover:text-path-navy pl-3'
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
