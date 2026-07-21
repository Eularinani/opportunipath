import { PrismaClient, TipoBolsa, StatusBolsa } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function generatePassword(length = 12): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function main() {
  // Admin user — password aleatória gerada em cada seed
  const plainPassword = generatePassword(14);
  const adminPassword = await bcrypt.hash(plainPassword, 12);
  await prisma.user.upsert({
    where: { email: 'admin@opportunipath.ao' },
    update: {},
    create: {
      name: 'Admin OportuniPath',
      email: 'admin@opportunipath.ao',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('🔑 Admin criado/atualizado: admin@opportunipath.ao / ' + plainPassword);
  console.log('   Guarda esta password — não será mostrada novamente.');

  // Só cria bolsas de exemplo se ainda não existirem
  const existingCount = await prisma.bolsa.count();
  if (existingCount > 0) {
    console.log(`⏩ ${existingCount} bolsas já existem — seed de bolsas ignorado.`);
    return;
  }

  const bolsas = [
    // ─── Bolsas Totais (Mestrado/Doutoramento) ──────────────────────────────
    {
      slug: 'bolsa-merito-santander-universidades',
      titulo: 'Bolsa de Mérito do Santander Universidades',
      universidade: 'Universidade de Lisboa',
      pais: 'Portugal',
      paisCode: 'PT',
      bandeira: '🇵🇹',
      nivel: 'Mestrado',
      area: 'Engenharia',
      tipo: TipoBolsa.TOTAL,
      prazo: new Date('2026-09-15'),
      duracao: '2 anos',
      valor: '€1.200/mês + propinas',
      descricao:
        'A Bolsa de Mérito do Santander Universidades destina-se a estudantes internacionais de países de língua oficial portuguesa, cobrindo propinas e despesas de subsistência durante todo o mestrado.',
      requisitos: ['Nacionalidade angolana', 'Média mínima de 14/20', 'Idade até 35 anos'],
      documentos: ['Certificado de Habilitações', 'Passaporte biométrico', 'BI'],
      linkOficial: 'https://www.santander.com',
      status: StatusBolsa.ABERTA,
      destaque: true,
      processo: {
        create: [
          { passo: 1, titulo: 'Inscrição Online', descricao: 'Preenche o formulário no portal do Santander.', deadline: 'Até 15 Set 2026' },
          { passo: 2, titulo: 'Entrega de Documentos', descricao: 'Envia todos os documentos requeridos.', deadline: 'Até 15 Set 2026' },
          { passo: 3, titulo: 'Avaliação', descricao: 'O júri avalia as candidaturas.', deadline: 'Out 2026' },
          { passo: 4, titulo: 'Resultados', descricao: 'Publicação dos resultados finais.', deadline: 'Nov 2026' },
        ],
      },
      dicas: {
        create: [
          { titulo: 'Autentica documentos com 3 meses de antecedência', descricao: 'O processo de reconhecimento pode levar várias semanas — não deixes para a última hora.' },
        ],
      },
    },
    {
      slug: 'daad-scholarship-sub-saharan-africa',
      titulo: 'DAAD Scholarship for Sub-Saharan Africa',
      universidade: 'TU Munich',
      pais: 'Alemanha',
      paisCode: 'DE',
      bandeira: '🇩🇪',
      nivel: 'Mestrado',
      area: 'Tecnologia',
      tipo: TipoBolsa.TOTAL,
      prazo: new Date('2026-08-30'),
      duracao: '2 anos',
      valor: '€934/mês + seguro saúde',
      descricao: 'O programa DAAD oferece oportunidades de mestrado em universidades alemãs de excelência, com bolsa mensal, seguro de saúde e apoio para curso preparatório de alemão.',
      requisitos: ['Média mínima de 16/20', 'Experiência profissional de 2 anos', 'IELTS 6.5'],
      documentos: ['Certificado de Habilitações', 'Passaporte', 'Cartas de recomendação (2)'],
      linkOficial: 'https://www.daad.de',
      status: StatusBolsa.URGENTE,
      destaque: true,
      processo: {
        create: [
          { passo: 1, titulo: 'Preparação', descricao: 'Prepara todos os documentos e traduções certificadas.', deadline: '3 meses antes' },
          { passo: 2, titulo: 'Inscrição', descricao: 'Candidata-te via plataforma uni-assist.', deadline: 'Até 30 Ago 2026' },
        ],
      },
      dicas: {
        create: [
          { titulo: 'Reconhecimento de diploma é crucial', descricao: 'A DAAD exige reconhecimento prévio do diploma angolano — inicia este processo o quanto antes.' },
        ],
      },
    },
    {
      slug: 'chevening-scholarship',
      titulo: 'Chevening Scholarship',
      universidade: 'Várias Universidades',
      pais: 'Reino Unido',
      paisCode: 'GB',
      bandeira: '🇬🇧',
      nivel: 'Mestrado',
      area: 'Negócios',
      tipo: TipoBolsa.TOTAL,
      prazo: new Date('2026-07-05'),
      duracao: '1 ano',
      valor: '£18.000 + propinas + viagens',
      descricao: 'A Chevening é o programa de bolsas do governo britânico para futuros líderes — cobre propinas, alojamento, viagens e uma bolsa mensal para despesas de subsistência.',
      requisitos: ['Média mínima de 16/20', 'Experiência profissional de 2 anos', 'IELTS 6.5'],
      documentos: ['Certificado de Habilitações', 'Passaporte', 'Certificado IELTS'],
      linkOficial: 'https://www.chevening.org',
      status: StatusBolsa.URGENTE,
      destaque: true,
      processo: {
        create: [
          { passo: 1, titulo: 'Aplicação Online', descricao: 'Preenche a aplicação com 4 ensaios sobre liderança e impacto.', deadline: 'Até 5 Jul 2026' },
          { passo: 2, titulo: 'Entrevista', descricao: 'Entrevista presencial ou remota na embaixada britânica.', deadline: 'Set-Out 2026' },
        ],
      },
      dicas: {
        create: [
          { titulo: 'Os ensaios são o diferencial', descricao: 'Dedica 70% do teu tempo de preparação aos 4 ensaios — é o que mais pesa na seleção.' },
        ],
      },
    },
    {
      slug: 'fulbright-foreign-student-program',
      titulo: 'Fulbright Foreign Student Program',
      universidade: 'Universidades dos EUA (a definir)',
      pais: 'Estados Unidos',
      paisCode: 'US',
      bandeira: '🇺🇸',
      nivel: 'Doutoramento',
      area: 'Ciências Sociais',
      tipo: TipoBolsa.TOTAL,
      prazo: new Date('2027-02-10'),
      dataAbertura: new Date('2026-09-01'),
      duracao: '2 a 4 anos',
      valor: 'Propinas + estipêndio mensal + seguro de saúde',
      descricao: 'O programa Fulbright leva estudantes de todo o mundo a cursar mestrado ou doutoramento em universidades de prestígio nos Estados Unidos, com bolsa total e acompanhamento pessoal.',
      requisitos: ['Licenciatura concluída', 'TOEFL ou IELTS', 'Carta de motivação forte', 'Disponibilidade para regressar a Angola após o curso'],
      documentos: ['Certificado de Habilitações', 'Passaporte', 'Cartas de recomendação (3)', 'Plano de estudos'],
      linkOficial: 'https://foreign.fulbrightonline.org',
      status: StatusBolsa.EM_BREVE,
      destaque: true,
      processo: {
        create: [
          { passo: 1, titulo: 'Abertura das candidaturas', descricao: 'A plataforma de candidaturas abre para o novo ciclo.', deadline: 'A partir de Set 2026' },
          { passo: 2, titulo: 'Submissão', descricao: 'Submete o formulário, ensaios e testes de proficiência.', deadline: 'Até 10 Fev 2027' },
        ],
      },
      dicas: {
        create: [
          { titulo: 'Começa o TOEFL/IELTS já', descricao: 'A pontuação mínima exigida é alta — começa a estudar inglês académico com 6 meses de antecedência.' },
        ],
      },
    },

    // ─── Intercâmbio & Línguas ───────────────────────────────────────────────
    {
      slug: 'campus-france-imersao-linguistica',
      titulo: 'Bolsa de Imersão Linguística — Campus France',
      universidade: 'Alliance Française de Paris',
      pais: 'França',
      paisCode: 'FR',
      bandeira: '🇫🇷',
      nivel: 'Curso de Línguas',
      area: 'Línguas',
      tipo: TipoBolsa.INTERCAMBIO,
      prazo: new Date('2026-09-01'),
      duracao: '3 meses',
      valor: 'Propinas + alojamento em residência universitária',
      descricao: 'Programa de intercâmbio de curta duração para aprender ou aperfeiçoar o francês em imersão total em Paris, com aulas intensivas, atividades culturais e alojamento incluído.',
      requisitos: ['Idade entre 18-30 anos', 'Nível A2 de francês (ou disposição para curso intensivo de início)', 'Motivação para estudar línguas e culturas'],
      documentos: ['Passaporte biométrico', 'Carta de motivação', 'Comprovativo de inscrição escolar/universitária'],
      linkOficial: 'https://www.campusfrance.org',
      status: StatusBolsa.ABERTA,
      destaque: true,
      processo: {
        create: [
          { passo: 1, titulo: 'Candidatura Online', descricao: 'Preenche o formulário na plataforma Études en France.', deadline: 'Até 1 Set 2026' },
          { passo: 2, titulo: 'Teste de Nível', descricao: 'Realiza um teste de nivelamento de francês (online).', deadline: 'Set 2026' },
        ],
      },
      dicas: {
        create: [
          { titulo: 'Começa a praticar francês já', descricao: 'Usa apps gratuitas como Duolingo durante 30 min/dia — vais aproveitar muito mais a imersão.' },
        ],
      },
    },
    {
      slug: 'erasmus-curso-curta-duracao-ingles-irlanda',
      titulo: 'Erasmus+ — Curso Intensivo de Inglês na Irlanda',
      universidade: 'Atlantic Language School, Galway',
      pais: 'Irlanda',
      paisCode: 'IE',
      bandeira: '🇮🇪',
      nivel: 'Curso de Línguas',
      area: 'Línguas',
      tipo: TipoBolsa.INTERCAMBIO,
      prazo: new Date('2026-11-20'),
      dataAbertura: new Date('2026-08-01'),
      duracao: '8 semanas',
      valor: 'Bolsa de €2.500 (curso + alojamento em família anfitriã)',
      descricao: 'Programa de mobilidade Erasmus+ para jovens lusófonos estudarem inglês em imersão total numa cidade universitária irlandesa, vivendo com uma família anfitriã e participando em atividades culturais.',
      requisitos: ['Idade entre 18-29 anos', 'Inglês nível básico a intermédio (A2-B1)', 'Estar inscrito numa instituição de ensino'],
      documentos: ['Passaporte', 'Carta de motivação em inglês', 'Declaração da instituição de origem'],
      linkOficial: 'https://erasmus-plus.ec.europa.eu',
      status: StatusBolsa.EM_BREVE,
      destaque: true,
      processo: {
        create: [
          { passo: 1, titulo: 'Abertura de candidaturas', descricao: 'O formulário de candidatura é disponibilizado no portal Erasmus+.', deadline: 'A partir de Ago 2026' },
          { passo: 2, titulo: 'Seleção e Entrevista', descricao: 'Entrevista por videochamada com a equipa do programa.', deadline: 'Set-Out 2026' },
        ],
      },
      dicas: {
        create: [
          { titulo: 'A entrevista é em inglês simples', descricao: 'Não precisas de ser fluente — mostra vontade de aprender e disponibilidade para te imergires na cultura local.' },
        ],
      },
    },
    {
      slug: 'goethe-institut-sprachstipendium',
      titulo: 'Goethe-Institut Sprachstipendium (Bolsa de Alemão)',
      universidade: 'Goethe-Institut, Berlim',
      pais: 'Alemanha',
      paisCode: 'DE',
      bandeira: '🇩🇪',
      nivel: 'Curso de Línguas',
      area: 'Línguas',
      tipo: TipoBolsa.INTERCAMBIO,
      prazo: new Date('2026-08-20'),
      duracao: '2 meses',
      valor: 'Curso de alemão + alojamento + subsídio de refeição',
      descricao: 'Bolsa de estudo intensivo da língua alemã no Goethe-Institut em Berlim, ideal para quem pretende prosseguir estudos superiores na Alemanha e precisa de atingir o nível B2/C1 exigido pelas universidades.',
      requisitos: ['Nível A2 de alemão comprovado', 'Estar a planear estudar na Alemanha', 'Idade até 32 anos'],
      documentos: ['Certificado de nível de alemão', 'Passaporte', 'Carta de aceitação condicional de uma universidade alemã (se já tiver)'],
      linkOficial: 'https://www.goethe.de',
      status: StatusBolsa.ABERTA,
      destaque: false,
      processo: {
        create: [
          { passo: 1, titulo: 'Submissão do formulário', descricao: 'Envia o formulário com o teu nível atual de alemão.', deadline: 'Até 20 Ago 2026' },
          { passo: 2, titulo: 'Teste de colocação', descricao: 'Realiza o teste de colocação para a turma certa.', deadline: 'Set 2026' },
        ],
      },
      dicas: {
        create: [
          { titulo: 'Atingir B2 abre muitas portas', descricao: 'Com o B2 em alemão certificado, a maioria das universidades dispensa testes de língua adicionais.' },
        ],
      },
    },
    {
      slug: 'siena-italiano-verao',
      titulo: 'Programa de Verão de Italiano — Università per Stranieri di Siena',
      universidade: 'Università per Stranieri di Siena',
      pais: 'Itália',
      paisCode: 'IT',
      bandeira: '🇮🇹',
      nivel: 'Curso de Línguas',
      area: 'Línguas',
      tipo: TipoBolsa.INTERCAMBIO,
      prazo: new Date('2026-06-25'),
      duracao: '4 semanas',
      valor: 'Bolsa cobre propinas do curso + 50% do alojamento',
      descricao: 'Curso intensivo de verão de língua e cultura italiana numa das universidades mais prestigiadas do mundo no ensino do italiano para estrangeiros, com excursões culturais incluídas.',
      requisitos: ['Idade mínima de 18 anos', 'Nível A1 de italiano (cursos para iniciantes disponíveis)', 'Carta de motivação'],
      documentos: ['Passaporte', 'Carta de motivação', 'Comprovativo de matrícula escolar/universitária'],
      linkOficial: 'https://www.unistrasi.it',
      status: StatusBolsa.URGENTE,
      destaque: false,
      processo: {
        create: [
          { passo: 1, titulo: 'Candidatura', descricao: 'Submete o formulário de bolsa juntamente com a inscrição no curso.', deadline: 'Até 25 Jun 2026' },
        ],
      },
      dicas: {
        create: [
          { titulo: 'As vagas são limitadas — candidata-te já', descricao: 'Os programas de verão esgotam rápido; não esperes pelo prazo final para enviar os documentos.' },
        ],
      },
    },

    // ─── Pesquisa / Doutoramento ─────────────────────────────────────────────
    {
      slug: 'fct-bolsa-doutoramento-portugal',
      titulo: 'Bolsa de Doutoramento FCT',
      universidade: 'Universidade do Porto',
      pais: 'Portugal',
      paisCode: 'PT',
      bandeira: '🇵🇹',
      nivel: 'Doutoramento',
      area: 'Ciências da Saúde',
      tipo: TipoBolsa.PESQUISA,
      prazo: new Date('2026-12-01'),
      duracao: '4 anos',
      valor: '€1.500/mês + subsídio de investigação',
      descricao: 'Bolsa individual de doutoramento financiada pela Fundação para a Ciência e a Tecnologia, para desenvolvimento de projetos de investigação original em parceria com um laboratório de acolhimento.',
      requisitos: ['Mestrado concluído (ou em fase final)', 'Plano de investigação pré-aprovado por um orientador', 'Boa capacidade de escrita científica'],
      documentos: ['Certificado de Mestrado', 'Plano de investigação', 'Carta do orientador', 'CV científico'],
      linkOficial: 'https://www.fct.pt',
      status: StatusBolsa.ABERTA,
      destaque: false,
      processo: {
        create: [
          { passo: 1, titulo: 'Contacto com orientador', descricao: 'Encontra um investigador interessado em co-orientar o teu projeto.', deadline: '6 meses antes' },
          { passo: 2, titulo: 'Submissão do plano', descricao: 'Submete o plano de investigação na plataforma da FCT.', deadline: 'Até 1 Dez 2026' },
        ],
      },
      dicas: {
        create: [
          { titulo: 'O orientador é metade da candidatura', descricao: 'Investe tempo a escrever a investigadores cujo trabalho admiras — uma boa carta de aceitação pesa imenso.' },
        ],
      },
    },
    {
      slug: 'erasmus-mundus-joint-master-degrees',
      titulo: 'Erasmus Mundus Joint Master Degrees (EMJMD)',
      universidade: 'Consórcio de Universidades Europeias',
      pais: 'Vários (Europa)',
      paisCode: 'EU',
      bandeira: '🇪🇺',
      nivel: 'Mestrado',
      area: 'Ciências Sociais',
      tipo: TipoBolsa.TOTAL,
      prazo: new Date('2027-01-15'),
      dataAbertura: new Date('2026-10-01'),
      duracao: '2 anos (em 2-3 países)',
      valor: '€1.400/mês + propinas + viagem + instalação',
      descricao: 'Mestrados conjuntos de excelência lecionados por consórcios de universidades europeias — estudas em pelo menos dois países diferentes e recebes diploma reconhecido internacionalmente.',
      requisitos: ['Licenciatura concluída', 'Inglês fluente (IELTS 6.5+)', 'Disponibilidade para viver em vários países'],
      documentos: ['Certificado de Habilitações', 'Passaporte', 'Cartas de recomendação (2)', 'Carta de motivação'],
      linkOficial: 'https://www.eacea.ec.europa.eu',
      status: StatusBolsa.EM_BREVE,
      destaque: false,
      processo: {
        create: [
          { passo: 1, titulo: 'Escolha do programa', descricao: 'Pesquisa entre mais de 100 mestrados conjuntos disponíveis.', deadline: 'A partir de Out 2026' },
          { passo: 2, titulo: 'Candidatura direta', descricao: 'Cada consórcio tem o seu próprio formulário e prazo — verifica com atenção.', deadline: 'Até 15 Jan 2027' },
        ],
      },
      dicas: {
        create: [
          { titulo: 'Escolhe pela área, não só pelo país', descricao: 'A qualidade do consórcio académico importa mais do que o destino — pesquisa o currículo a fundo.' },
        ],
      },
    },

    // ─── Licenciatura & Cursos Técnicos (Parciais) ──────────────────────────
    {
      slug: 'bolsa-mais-talento-licenciatura-brasil',
      titulo: 'Bolsa Mais Talento — Licenciatura',
      universidade: 'Universidade de São Paulo (USP)',
      pais: 'Brasil',
      paisCode: 'BR',
      bandeira: '🇧🇷',
      nivel: 'Licenciatura',
      area: 'Ciências Sociais',
      tipo: TipoBolsa.PARCIAL,
      prazo: new Date('2026-09-30'),
      duracao: '4 anos',
      valor: 'Isenção de 70% das propinas + apoio em material',
      descricao: 'Programa de bolsas parciais para estudantes lusófonos que desejam realizar a licenciatura em universidades públicas brasileiras de referência, com acompanhamento académico dedicado.',
      requisitos: ['Ensino médio/secundário concluído', 'Média mínima de 12/20', 'Português fluente (língua nativa aceite)'],
      documentos: ['Certificado de Habilitações', 'Passaporte', 'Histórico escolar traduzido'],
      linkOficial: 'https://www5.usp.br',
      status: StatusBolsa.ABERTA,
      destaque: false,
      processo: {
        create: [
          { passo: 1, titulo: 'Inscrição no vestibular internacional', descricao: 'Regista-te na plataforma de ingresso para estudantes estrangeiros.', deadline: 'Até 30 Set 2026' },
          { passo: 2, titulo: 'Análise de candidatura à bolsa', descricao: 'Submete o pedido de bolsa parcial em simultâneo.', deadline: 'Até 30 Set 2026' },
        ],
      },
      dicas: {
        create: [
          { titulo: 'Pede a tradução juramentada cedo', descricao: 'O histórico escolar precisa de tradução juramentada — este processo demora e tem custo, planeia com antecedência.' },
        ],
      },
    },
    {
      slug: 'kgsp-curso-tecnico-coreia-do-sul',
      titulo: 'Korean Government Scholarship Program (KGSP) — Curso Técnico em TI',
      universidade: 'Korea Polytechnics',
      pais: 'Coreia do Sul',
      paisCode: 'KR',
      bandeira: '🇰🇷',
      nivel: 'Curso Técnico',
      area: 'Tecnologia',
      tipo: TipoBolsa.PARCIAL,
      prazo: new Date('2026-10-31'),
      duracao: '1 ano + curso de coreano de 6 meses',
      valor: 'Propinas + alojamento + estipêndio mensal de ₩900.000',
      descricao: 'Programa do governo sul-coreano para formação técnica em tecnologias da informação, incluindo um curso preparatório de língua coreana antes do início das aulas técnicas.',
      requisitos: ['Ensino secundário concluído', 'Idade até 25 anos', 'Interesse genuíno em tecnologia e cultura asiática'],
      documentos: ['Certificado de Habilitações', 'Passaporte', 'Atestado médico', 'Carta de motivação'],
      linkOficial: 'https://www.studyinkorea.go.kr',
      status: StatusBolsa.ABERTA,
      destaque: false,
      processo: {
        create: [
          { passo: 1, titulo: 'Candidatura via embaixada', descricao: 'Submete os documentos através da Embaixada da Coreia do Sul em Angola.', deadline: 'Até 31 Out 2026' },
          { passo: 2, titulo: 'Curso de coreano', descricao: 'Inicia o curso preparatório de língua coreana antes da fase técnica.', deadline: 'Mar 2027' },
        ],
      },
      dicas: {
        create: [
          { titulo: 'Mostra interesse pela cultura coreana', descricao: 'Os avaliadores valorizam candidatos que já demonstram curiosidade pela língua e cultura — menciona isso na tua carta.' },
        ],
      },
    },

    // ─── Bolsa já encerrada (para mostrar o ciclo completo) ─────────────────
    {
      slug: 'bolsa-pos-doutoramento-espanha-encerrada',
      titulo: 'Bolsa de Pós-Doutoramento — Universidade de Salamanca',
      universidade: 'Universidade de Salamanca',
      pais: 'Espanha',
      paisCode: 'ES',
      bandeira: '🇪🇸',
      nivel: 'Pós-Doutoramento',
      area: 'Ciências Sociais',
      tipo: TipoBolsa.PESQUISA,
      prazo: new Date('2026-04-10'),
      duracao: '2 anos',
      valor: '€2.100/mês',
      descricao: 'Programa de pós-doutoramento para investigadores que pretendem aprofundar a sua linha de investigação em parceria com grupos de investigação espanhóis de referência.',
      requisitos: ['Doutoramento concluído há menos de 5 anos', 'Publicações científicas relevantes', 'Espanhol ou inglês fluente'],
      documentos: ['Certificado de Doutoramento', 'Lista de publicações', 'Plano de investigação'],
      linkOficial: 'https://www.usal.es',
      status: StatusBolsa.FECHADA,
      destaque: false,
      processo: { create: [] },
      dicas: { create: [] },
    },
  ];

  for (const bolsa of bolsas) {
    await prisma.bolsa.create({ data: bolsa });
  }

  // Seed newsletter subscribers (example)
  await prisma.newsletterSubscriber.upsert({
    where: { email: 'teste@opportunipath.ao' },
    update: {},
    create: { email: 'teste@opportunipath.ao' },
  });

  console.log(`✅ Seed concluído com sucesso — ${bolsas.length} bolsas criadas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
