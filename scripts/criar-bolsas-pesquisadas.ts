import { PrismaClient, type TipoBolsa } from '@prisma/client';
import { calcularStatus } from '../src/lib/bolsas';

// Bolsas pesquisadas em 2026-11-03. São criadas como RASCUNHO: um admin tem de abrir o
// link oficial, confirmar os dados e carregar em "Verificar e publicar".
// Datas marcadas "(provisório)" vêm do calendário habitual ou de guias — confirmar no edital.
// Idempotente: usa slugs fixos e não toca em bolsas já existentes com o mesmo slug.
const prisma = new PrismaClient();

interface BolsaPesquisada {
  slug: string;
  titulo: string;
  universidade: string;
  pais: string;
  paisCode: string;
  nivel: string | null;
  tipo: TipoBolsa | null;
  prazo: string | null;
  dataAbertura?: string | null;
  duracao: string;
  valor: string;
  descricao: string;
  requisitos: string[];
  linkOficial: string;
  paisesElegiveis: string[];
}

const bandeira = (code: string) => String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)));

const bolsas: BolsaPesquisada[] = [
  {
    slug: 'eth-zurich-excellence-scholarship-esop-2027',
    titulo: 'ETH Zurich Excellence Scholarship & Opportunity Programme (ESOP) 2027',
    universidade: 'ETH Zurich',
    pais: 'Suíça',
    paisCode: 'CH',
    nivel: 'Mestrado',
    tipo: 'TOTAL',
    prazo: '2026-11-30T11:59:00+01:00',
    duracao: 'Duração regular do mestrado',
    valor: "CHF 12.000 por semestre (CHF 13.500 a partir do outono de 2027) + isenção de propinas",
    descricao:
      'Bolsa de mérito da ETH Zurich para estudantes de mestrado, que cobre despesas de vida e estudo e isenta as propinas. ' +
      'Só é possível candidatar-se à ESOP na primeira janela de candidatura ao mestrado (1 a 30 de novembro, até às 11:59 CET), ' +
      'juntamente com a candidatura de admissão e uma pré-proposta.\n\n' +
      'Fontes consultadas: página oficial da ESOP (ethz.ch).',
    requisitos: [
      'Candidatura ao mestrado da ETH na primeira janela (1–30 de novembro)',
      'Pré-proposta enviada com a candidatura',
      'Não ter já um mestrado concluído',
    ],
    linkOficial: 'https://ethz.ch/students/en/studies/financial/scholarships/excellencescholarship.html',
    paisesElegiveis: ['Todos os países'],
  },
  {
    slug: 'epfl-master-excellence-fellowships-2027',
    titulo: 'EPFL Master Excellence Fellowships 2027',
    universidade: 'EPFL — École Polytechnique Fédérale de Lausanne',
    pais: 'Suíça',
    paisCode: 'CH',
    nivel: 'Mestrado',
    tipo: 'PARCIAL',
    prazo: '2026-12-15T23:59:00+01:00',
    duracao: 'Duração do mestrado',
    valor: 'CHF 10.000 por semestre',
    descricao:
      'Bolsas de excelência da EPFL para estudantes de mestrado. Não há formulário separado: a bolsa é pedida na própria candidatura ao mestrado, ' +
      'que tem de estar paga e validada até 15 de dezembro. As cartas de recomendação devem ser enviadas pelos referees até 31 de janeiro.\n\n' +
      'Fontes consultadas: páginas oficiais "Master Excellence Fellowships" e "How to apply" (epfl.ch).',
    requisitos: [
      'Candidatura ao mestrado paga e validada até 15 de dezembro',
      'Cartas de recomendação enviadas pelos referees até 31 de janeiro',
      'Não ter nem estar a frequentar um mestrado da EPFL',
    ],
    linkOficial: 'https://www.epfl.ch/education/master/master-excellence-fellowships/how-to-apply/',
    paisesElegiveis: ['Todos os países'],
  },
  {
    slug: 'gates-cambridge-scholarship-2027',
    titulo: 'Gates Cambridge Scholarship 2027/28',
    universidade: 'University of Cambridge',
    pais: 'Reino Unido',
    paisCode: 'GB',
    nivel: 'Doutoramento',
    tipo: 'TOTAL',
    prazo: '2026-12-08T23:59:00Z',
    duracao: 'Duração do curso de pós-graduação',
    valor: 'Custo total do curso (propinas e manutenção) — confirmar detalhes no site oficial',
    descricao:
      'Bolsas para pós-graduação a tempo inteiro em Cambridge (mestrado de investigação, MPhil, PhD), para candidatos de fora do Reino Unido. ' +
      'A candidatura é feita no portal de pós-graduação da universidade. Para candidatos internacionais (não residentes nos EUA), ' +
      'o prazo de financiamento é 8 de dezembro de 2026 ou 6 de janeiro de 2027, consoante o curso — vê a data na página do teu curso.\n\n' +
      'Fontes consultadas: gatescambridge.org; guias de bolsas (prazos 2027/28).',
    requisitos: [
      'Candidatura a um curso de pós-graduação a tempo inteiro em Cambridge até ao prazo de financiamento do curso',
      'Não ser cidadão do Reino Unido',
    ],
    linkOficial: 'https://www.gatescambridge.org/',
    paisesElegiveis: ['Todos os países, exceto Reino Unido'],
  },
  {
    slug: 'clarendon-scholarships-oxford-2027',
    titulo: 'Clarendon Scholarships 2027/28 — University of Oxford',
    universidade: 'University of Oxford',
    pais: 'Reino Unido',
    paisCode: 'GB',
    nivel: 'Mestrado',
    tipo: 'TOTAL',
    prazo: null,
    duracao: 'Duração do curso',
    valor: 'Propinas e subsídio de manutenção — confirmar valor no site oficial',
    descricao:
      'Bolsas de mérito de Oxford para mestrado e DPhil. Não há candidatura separada: todos os candidatos que se candidatam ao curso ' +
      'até ao prazo de dezembro de 2026 ou janeiro de 2027 (varia por curso) são considerados automaticamente. ' +
      'Candidaturas feitas em prazos de março ou posteriores não são consideradas para bolsas.\n\n' +
      'Fontes consultadas: guias de bolsas (2027/28). Confirmar na página oficial do Clarendon Fund e na página do curso.',
    requisitos: ['Candidatura a um curso de pós-graduação de Oxford até ao prazo de dezembro/janeiro do curso'],
    linkOficial: 'https://www.ox.ac.uk/clarendon',
    paisesElegiveis: ['Todos os países'],
  },
  {
    slug: 'stipendium-hungaricum-2027-2028',
    titulo: 'Stipendium Hungaricum 2027/28 (Bolsa do Governo da Hungria)',
    universidade: 'Universidades da Hungria',
    pais: 'Hungria',
    paisCode: 'HU',
    nivel: null,
    tipo: 'TOTAL',
    prazo: '2027-01-15T14:00:00+01:00',
    duracao: 'Duração do curso (licenciatura, mestrado ou doutoramento)',
    valor: 'Isenção de propinas, bolsa mensal, alojamento e seguro de saúde — confirmar no edital',
    descricao:
      'Bolsa do Governo da Hungria para licenciatura, mestrado integrado, mestrado e doutoramento. A candidatura tem duas etapas: ' +
      'a entidade parceira (Sending Partner) do teu país e o portal apply.stipendiumhungaricum.hu.\n\n' +
      'Prazo 15/01/2027 (provisório): indicado por vários guias; o edital oficial 2027/28 deve abrir em novembro de 2026.\n\n' +
      'Fontes consultadas: guias de bolsas (2027/28). Confirmar no edital oficial.',
    requisitos: ['Ser nomeado pela entidade parceira (Sending Partner) do teu país', 'Candidatura no portal oficial'],
    linkOficial: 'https://stipendiumhungaricum.hu/',
    paisesElegiveis: ['Países com acordo com a Hungria (ver lista de Sending Partners)'],
  },
  {
    slug: 'erasmus-mundus-joint-masters-2027',
    titulo: 'Erasmus Mundus Joint Masters — bolsas para 2027/28',
    universidade: 'Consórcios de universidades europeias',
    pais: 'Vários países europeus',
    paisCode: 'EU',
    nivel: 'Mestrado',
    tipo: 'TOTAL',
    prazo: null,
    duracao: '1 a 2 anos, em pelo menos dois países',
    valor: 'Propinas cobertas + subsídio mensal (cerca de €1.400/mês segundo guias) — confirmar por programa',
    descricao:
      'Mestrados conjuntos financiados pela União Europeia, em consórcios de universidades de vários países. ' +
      'Cada programa tem o seu próprio portal e prazo; para o início em 2027/28, a maioria dos prazos de bolsa cai entre outubro de 2026 e janeiro de 2027.\n\n' +
      'Fontes consultadas: catálogo oficial Erasmus Mundus (EACEA); guias de bolsas.',
    requisitos: ['Licenciatura (ou equivalente) concluída até ao início do curso', 'Candidatura no portal de cada programa'],
    linkOficial: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en',
    paisesElegiveis: ['Todos os países'],
  },
  {
    slug: 'swedish-institute-scholarships-global-professionals-2027',
    titulo: 'Swedish Institute Scholarships for Global Professionals 2027/28',
    universidade: 'Universidades da Suécia',
    pais: 'Suécia',
    paisCode: 'SE',
    nivel: 'Mestrado',
    tipo: 'TOTAL',
    prazo: '2027-02-24T14:59:00+01:00',
    dataAbertura: '2027-02-08T00:00:00+01:00',
    duracao: 'Duração do mestrado',
    valor: 'Propinas + subsídio mensal + subsídio de viagem — confirmar valores no site oficial',
    descricao:
      'Bolsa do Swedish Institute para mestrados na Suécia, dirigida a profissionais com experiência e potencial de liderança.\n\n' +
      'Datas oficiais: 16/10/2026–15/01/2027 candidatura ao mestrado em University Admissions; 13/11/2026 publicação dos documentos e programas elegíveis; ' +
      '8–24/02/2027 portal da bolsa SI aberto (fecha às 14:59 CET); 01/04/2027 resultados de admissão; 22/04/2027 resultados da bolsa.\n\n' +
      'Importante: tens de te candidatar ao mestrado até 15 de janeiro de 2027 para poderes pedir a bolsa em fevereiro.\n\n' +
      'Fontes consultadas: página oficial da bolsa (si.se).',
    requisitos: [
      'Candidatura a um mestrado elegível em University Admissions até 15/01/2027',
      'Ser cidadão de um país elegível (lista do Swedish Institute)',
      'Experiência profissional e de liderança',
    ],
    linkOficial: 'https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/',
    paisesElegiveis: ['Países elegíveis definidos pelo Swedish Institute (ver lista)'],
  },
  {
    slug: 'turkiye-burslari-2027',
    titulo: 'Türkiye Bursları 2027 (Bolsas do Governo da Turquia)',
    universidade: 'Universidades da Turquia',
    pais: 'Turquia',
    paisCode: 'TR',
    nivel: null,
    tipo: 'TOTAL',
    prazo: '2027-02-20T17:00:00+03:00',
    dataAbertura: '2027-01-10T00:00:00+03:00',
    duracao: 'Duração do curso + 1 ano de curso de turco',
    valor: 'Propinas, subsídio mensal, alojamento, seguro de saúde e curso de turco — confirmar no edital',
    descricao:
      'Bolsas do Governo da Turquia para licenciatura, mestrado e doutoramento. Candidatura única no portal oficial.\n\n' +
      'Datas (provisório): 10 de janeiro a 20 de fevereiro de 2027, segundo o calendário habitual. O edital de 2027 ainda não foi publicado.\n\n' +
      'Fontes consultadas: guias de bolsas (2027). Confirmar em turkiyeburslari.gov.tr.',
    requisitos: ['Não ter nacionalidade turca', 'Candidatura no portal oficial dentro do prazo'],
    linkOficial: 'https://www.turkiyeburslari.gov.tr/',
    paisesElegiveis: ['Todos os países'],
  },
  {
    slug: 'chinese-government-scholarship-2027-2028',
    titulo: 'Bolsa do Governo Chinês (CSC) 2027/28',
    universidade: 'Universidades da China',
    pais: 'China',
    paisCode: 'CN',
    nivel: null,
    tipo: 'TOTAL',
    prazo: null,
    duracao: 'Duração do curso',
    valor: 'Propinas, alojamento, seguro de saúde e subsídio mensal (consoante o tipo de bolsa)',
    descricao:
      'As candidaturas para 2027/28 estão abertas no portal Campus China. O prazo depende da via: pela embaixada da China no teu país ' +
      '(por exemplo, a embaixada nas Maldivas indica 29/01/2027) ou diretamente por universidades (prazos geralmente mais tarde).\n\n' +
      'Cursos em chinês: mestrado e doutoramento exigem nível HSK 4. Licenciatura com início em setembro de 2027: é preciso inscrição no teste CSCA ' +
      '(novembro/dezembro de 2026 ou janeiro de 2027).\n\n' +
      'Fontes consultadas: avisos oficiais das embaixadas da China (outubro de 2026).',
    requisitos: [
      'Candidatura no portal Campus China',
      'Carta de admissão ou de pré-admissão de uma universidade (consoante a via)',
      'HSK 4 para mestrado/doutoramento lecionado em chinês',
    ],
    linkOficial: 'https://www.campuschina.org/',
    paisesElegiveis: ['Cidadãos não chineses (requisitos e prazos variam por embaixada)'],
  },
  {
    slug: 'nl-scholarship-2027-2028',
    titulo: 'NL Scholarship 2027/28 (antiga Holland Scholarship)',
    universidade: 'Universidades participantes nos Países Baixos',
    pais: 'Países Baixos',
    paisCode: 'NL',
    nivel: 'Mestrado',
    tipo: 'PARCIAL',
    prazo: '2027-02-01T23:59:00+01:00',
    duracao: 'Pagamento único no primeiro ano',
    valor: '€5.000 (pagamento único no 1.º ano — não cobre as propinas todas)',
    descricao:
      'Bolsa financiada pelo Ministério da Educação dos Países Baixos e por instituições participantes, para estudantes de fora do EEE ' +
      'que iniciam licenciatura ou mestrado. Cada instituição define o seu prazo: 1 de fevereiro de 2027 em várias (ex.: Groningen), ' +
      'mas há instituições com prazos em abril ou maio.\n\n' +
      'Fontes consultadas: studyinnl.org (página oficial da NL Scholarship); página da University of Groningen.',
    requisitos: ['Nacionalidade de um país fora do EEE', 'Candidatura a um curso numa instituição participante'],
    linkOficial: 'https://www.studyinnl.org/finances/nl-scholarship',
    paisesElegiveis: ['Países fora do Espaço Económico Europeu'],
  },
];

async function main() {
  let criadas = 0;
  let existentes = 0;
  for (const b of bolsas) {
    if (await prisma.bolsa.findUnique({ where: { slug: b.slug } })) {
      existentes++;
      continue;
    }
    const prazo = b.prazo ? new Date(b.prazo) : null;
    const dataAbertura = b.dataAbertura ? new Date(b.dataAbertura) : null;
    await prisma.bolsa.create({
      data: {
        ...b,
        prazo,
        dataAbertura,
        bandeira: b.paisCode === 'EU' ? '🇪🇺' : bandeira(b.paisCode),
        area: null,
        documentos: [],
        status: calcularStatus({ prazo, dataAbertura }),
        estadoRevisao: 'RASCUNHO',
        destaque: false,
      },
    });
    criadas++;
  }
  console.log(`✅ ${criadas} bolsas criadas como rascunho (${existentes} já existiam).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
