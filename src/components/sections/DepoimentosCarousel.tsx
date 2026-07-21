import { db } from '@/lib/db';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ScrollReveal from '@/components/shared/ScrollReveal';

const fallbackDepoimentos = [
  { id: '1', nome: 'Maria João Silva', curso: 'Mestrado em Engenharia, Alemanha', texto: 'A OportuniPath foi fundamental na minha candidatura à DAAD. Os guias passo-a-passo fizeram toda a diferença!', imagem: null },
  { id: '2', nome: 'Carlos António', curso: 'Licenciatura em Medicina, China', texto: 'Encontrei a bolsa CGS aqui e hoje estudo em Xangai. Sem esta plataforma seria muito mais difícil.', imagem: null },
  { id: '3', nome: 'Ana Luísa', curso: 'Mestrado em Negócios, Portugal', texto: 'A checklist de documentos poupou-me imenso tempo. Candidatura aprovada na primeira tentativa!', imagem: null },
];

export default async function DepoimentosCarousel() {
  const depoimentosDB = await db.depoimento.findMany({ where: { aprovado: true }, take: 6 });
  const depoimentos = depoimentosDB.length > 0 ? depoimentosDB : fallbackDepoimentos;

  return (
    <section className="py-24 bg-path-cream">
      <div className="container-ango">
        <ScrollReveal>
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="inline-block text-path-teal font-semibold text-xs uppercase tracking-widest mb-3">
              Histórias reais
            </span>
            <h2 className="font-poppins font-bold text-3xl md:text-4xl text-path-navy mb-4">Histórias de Sucesso</h2>
            <p className="text-path-slate text-base">Angolanos que realizaram o sonho de estudar no exterior</p>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <Carousel opts={{ align: 'start', loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {depoimentos.map((d) => (
                <CarouselItem key={d.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-white rounded-2xl p-8 h-full shadow-card">
                    <span className="font-poppins font-bold text-5xl text-path-amber/30 leading-none">&ldquo;</span>
                    <p className="text-path-slate-dark text-base italic leading-relaxed -mt-4 mb-6">{d.texto}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-path-teal/10 flex items-center justify-center text-path-teal font-bold text-lg">
                        {d.nome[0]}
                      </div>
                      <div>
                        <p className="font-poppins font-semibold text-sm text-path-navy">{d.nome}</p>
                        <p className="text-path-slate text-xs">{d.curso}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-4 mt-8">
              <CarouselPrevious className="static translate-y-0 border-path-cream hover:border-path-teal hover:bg-path-teal hover:text-white" />
              <CarouselNext className="static translate-y-0 border-path-cream hover:border-path-teal hover:bg-path-teal hover:text-white" />
            </div>
          </Carousel>
        </ScrollReveal>
      </div>
    </section>
  );
}
