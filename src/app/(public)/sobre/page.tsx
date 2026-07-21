import Image from 'next/image';
import HeroSection from '@/components/sections/HeroSection';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { equipa, valores } from '@/data/equipa';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Send } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Conhece a missão do OportuniPath e a equipa por detrás da plataforma de bolsas de estudo para angolanos.',
};

export default function SobrePage() {
  return (
    <main>
      <HeroSection
        title="A Nossa Missão"
        description="O OportuniPath nasceu da crença de que a educação é o caminho mais seguro para o desenvolvimento de Angola. A nossa missão é democratizar o acesso à informação sobre bolsas de estudo internacionais."
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
                Em 2023, percebemos que muitos jovens angolanos talentosos perdiam oportunidades de bolsas
                de estudo internacionais simplesmente por falta de informação. Os processos de candidatura
                eram complexos, a documentação confusa, e não havia nenhuma plataforma centralizada que
                orientasse os estudantes angolanos nesta jornada.
              </p>
              <p>
                Foi assim que nasceu o OportuniPath — uma plataforma criada por angolanos, para angolanos,
                com o objetivo de descomplicar o acesso à educação internacional. Reunimos informações
                sobre centenas de bolsas, criamos guias detalhados de documentação específicos para o
                contexto angolano, e partilhamos histórias inspiradoras de quem já conseguiu.
              </p>
              <p>
                Sonhamos com um futuro onde qualquer jovem angolano, independentemente da sua origem,
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

      {/* Equipa */}
      <section className="py-20 bg-white">
        <div className="container-ango max-w-[900px]">
          <ScrollReveal>
            <h2 className="font-poppins font-bold text-2xl md:text-3xl text-path-navy text-center mb-12">
              Quem Somos
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {equipa.map((membro, i) => (
              <ScrollReveal key={membro.nome} delay={i * 0.15} className="text-center">
                <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden mx-auto mb-4">
                  <Image src={membro.imagem} alt={membro.nome} fill className="object-cover" />
                </div>
                <h3 className="font-poppins font-semibold text-lg text-path-navy">{membro.nome}</h3>
                <p className="text-path-teal text-sm mb-2">{membro.funcao}</p>
                <p className="text-path-slate text-sm max-w-[280px] mx-auto mb-3">
                  {membro.bio}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {membro.linkedin && (
                    <a href={membro.linkedin} target="_blank" rel="noopener noreferrer" className="text-path-slate hover:text-path-teal transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {membro.twitter && (
                    <a href={membro.twitter} target="_blank" rel="noopener noreferrer" className="text-path-slate hover:text-path-teal transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
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
                Tens dúvidas, sugestões ou queres colaborar? Entra em contacto.
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
                    <p className="text-path-slate text-sm">geral@opportunipath.ao</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-path-teal/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-path-teal" />
                  </div>
                  <div>
                    <p className="font-medium text-path-navy text-sm">Telefone</p>
                    <p className="text-path-slate text-sm">+244 923 456 789</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-path-teal/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-path-teal" />
                  </div>
                  <div>
                    <p className="font-medium text-path-navy text-sm">Localização</p>
                    <p className="text-path-slate text-sm">Luanda, Angola</p>
                  </div>
                </div>

                <div className="pt-6">
                  <p className="font-medium text-path-navy text-sm mb-3">Redes Sociais</p>
                  <div className="flex items-center gap-3">
                    <a href="#" className="w-10 h-10 rounded-full bg-path-navy flex items-center justify-center text-white hover:bg-path-teal transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-path-navy flex items-center justify-center text-white hover:bg-path-teal transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-path-navy flex items-center justify-center text-white hover:bg-path-teal transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-path-cream rounded-xl p-6 text-center">
                <Send className="w-10 h-10 text-path-teal mx-auto mb-3" />
                <h3 className="font-poppins font-semibold text-lg text-path-navy mb-2">Envia-nos uma mensagem</h3>
                <p className="text-path-slate text-sm mb-4">
                  Usa o formulário de contacto na página inicial ou envia um email diretamente.
                </p>
                <a
                  href="mailto:geral@opportunipath.ao"
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
