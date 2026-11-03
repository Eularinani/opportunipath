import HeroSection from '@/components/sections/HeroSection';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { valores } from '@/data/equipa';
import { Mail, MapPin, Globe, ExternalLink, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Conhece a missão do OportuniPath, um projeto da SecuraDist, a plataforma de bolsas de estudo internacionais verificadas.',
};

export default function SobrePage() {
  return (
    <main>
      <HeroSection
        title="A Nossa Missão"
        description="O OportuniPath nasceu da crença de que a educação é o caminho mais seguro para o desenvolvimento de qualquer país. A nossa missão é democratizar o acesso a informação verificada sobre bolsas de estudo internacionais."
        breadcrumb={[
          { label: 'Início', href: '/' },
          { label: 'Sobre', href: '/sobre' },
        ]}
      />

      {/* Nossa História */}
      <section className="py-20 bg-white">
        <div className="container-ango max-w-[900px]">
          <ScrollReveal>
            <h2 className="font-poppins font-bold text-2xl md:text-3xl text-path-navy mb-6">
              Porque o OportuniPath?
            </h2>
            <div className="space-y-4 text-path-slate-dark leading-relaxed">
              <p>
                Em 2023, percebemos que muitos jovens talentosos perdiam oportunidades de bolsas
                de estudo internacionais simplesmente por falta de informação. Os processos de candidatura
                eram complexos, a documentação confusa, e não havia nenhuma plataforma centralizada que
                orientasse os estudantes nesta jornada.
              </p>
              <p>
                Foi assim que nasceu o OportuniPath — uma plataforma nascida em Angola e aberta a estudantes
                de todo o mundo, com o objetivo de descomplicar o acesso à educação internacional. Cada bolsa
                que publicamos é verificada na fonte oficial, criamos guias práticos de documentação e
                partilhamos histórias inspiradoras de quem já conseguiu.
              </p>
              <p>
                Sonhamos com um futuro onde qualquer jovem, independentemente da sua origem,
                possa aceder a informação de qualidade sobre oportunidades de educação no exterior.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-path-cream">
        <div className="container-ango max-w-[1000px]">
          <ScrollReveal>
            <h2 className="font-poppins font-bold text-2xl md:text-3xl text-path-navy text-center mb-12">
              Os Nossos Valores
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {valores.map((valor, i) => (
              <ScrollReveal key={valor.titulo} delay={i * 0.1}>
                <div className="bg-white rounded-xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-path-teal/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{valor.icon}</span>
                  </div>
                  <h3 className="font-poppins font-semibold text-lg text-path-navy mb-2">
                    {valor.titulo}
                  </h3>
                  <p className="text-path-slate text-sm leading-relaxed">
                    {valor.descricao}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quem Somos */}
      <section className="py-20 bg-white">
        <div className="container-ango max-w-[900px]">
          <ScrollReveal>
            <h2 className="font-poppins font-bold text-2xl md:text-3xl text-path-navy text-center mb-12">
              Quem Somos
            </h2>
          </ScrollReveal>

          <ScrollReveal>
            <div className="bg-path-cream rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-path-navy flex items-center justify-center shrink-0">
                <ShieldCheck className="w-8 h-8 text-path-teal" />
              </div>
              <div className="space-y-4">
                <h3 className="font-poppins font-semibold text-xl text-path-navy">
                  O OportuniPath é um projeto da SecuraDist
                </h3>
                <p className="text-path-slate-dark leading-relaxed">
                  A SecuraDist é uma empresa de cibersegurança, sistemas e formação que atua em Portugal e
                  Angola. É a SecuraDist que desenvolve e mantém a plataforma OportuniPath.
                </p>
                <a
                  href="https://securadist.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-path-navy text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-path-teal transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  securadist.com
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-20 bg-white">
        <div className="container-ango max-w-[900px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-poppins font-bold text-2xl md:text-3xl text-path-navy mb-3">
                Fala Connosco
              </h2>
              <p className="text-path-slate text-base">
                Tens dúvidas, encontraste um erro numa bolsa ou queres colaborar? Entra em contacto.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ScrollReveal delay={0.2}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-path-teal/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-path-teal" />
                  </div>
                  <div>
                    <p className="font-medium text-path-navy text-sm">Email</p>
                    <a href="mailto:geral@securadist.com" className="text-path-slate text-sm hover:text-path-teal">
                      geral@securadist.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-path-teal/10 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-path-teal" />
                  </div>
                  <div>
                    <p className="font-medium text-path-navy text-sm">Website</p>
                    <a href="https://securadist.com" target="_blank" rel="noopener noreferrer" className="text-path-slate text-sm hover:text-path-teal">
                      securadist.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-path-teal/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-path-teal" />
                  </div>
                  <div>
                    <p className="font-medium text-path-navy text-sm">Onde estamos</p>
                    <p className="text-path-slate text-sm">Portugal e Angola</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-path-cream rounded-xl p-6 text-center">
                <Mail className="w-10 h-10 text-path-teal mx-auto mb-3" />
                <h3 className="font-poppins font-semibold text-lg text-path-navy mb-2">Envia-nos uma mensagem</h3>
                <p className="text-path-slate text-sm mb-4">
                  Se encontraste informação errada ou desatualizada numa bolsa, indica o link da página e o que está errado.
                </p>
                <a
                  href="mailto:geral@securadist.com?subject=OportuniPath"
                  className="inline-flex items-center gap-2 bg-path-teal text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-path-teal-dark transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Enviar email
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
