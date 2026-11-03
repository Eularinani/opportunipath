import type { GuiaDocumento, DocumentoChecklist, ProcessoAuthStep } from './types-documentos';

// Conteúdo revisto em 2026-11-03. Valores (taxas, montantes, níveis de língua) mudam:
// só se indicam números confirmados numa fonte, sempre com a fonte listada em `fontes`.
export const GUIA_DOCUMENTOS_REVISTO_EM = '2026-11-03T12:00:00';

export const documentosBasicos: DocumentoChecklist[] = [
  { id: 'doc-1', nome: 'Certificado de Habilitações (original + cópias)', descricao: 'Certificado de conclusão do ensino secundário ou superior, consoante o nível da bolsa, com notas.', requerAutenticacao: true },
  { id: 'doc-2', nome: 'Certificado de Nacionalidade', descricao: 'Documento comprovativo da tua nacionalidade (só se a bolsa o exigir).', requerAutenticacao: true },
  { id: 'doc-3', nome: 'Documento de identificação (cópia certificada)', descricao: 'Bilhete de identidade ou equivalente do teu país.', requerAutenticacao: true },
  { id: 'doc-4', nome: 'Passaporte válido', descricao: 'Muitos consulados pedem validade de pelo menos 6 meses além da data prevista de entrada; confirma a regra do país de destino.', requerAutenticacao: false },
  { id: 'doc-5', nome: 'Certidão de Nascimento', descricao: 'Original ou cópia certificada.', requerAutenticacao: true },
  { id: 'doc-6', nome: 'Atestado / exame médico', descricao: 'Alguns países têm formulário próprio (ex.: China). Costuma ter validade limitada.', requerAutenticacao: false },
  { id: 'doc-7', nome: 'Certidão de Casamento (se aplicável)', descricao: 'Para quem pede visto também para o cônjuge.', requerAutenticacao: true },
  { id: 'doc-8', nome: 'Certificado de língua', descricao: 'IELTS, TOEFL, DELF/DALF, TestDaF, DSH, HSK, etc., consoante o país e a língua do curso.', requerAutenticacao: false },
];

// Processo para documentos emitidos em Angola.
export const processoAutenticacao: ProcessoAuthStep[] = [
  {
    passo: 1,
    titulo: 'Autenticação pelo ministério da tutela',
    descricao: 'Os certificados escolares são autenticados pelo ministério que tutela o nível de ensino: Ministério da Educação (MED) para o ensino geral e Ministério do Ensino Superior, Ciência, Tecnologia e Inovação (MESCTI) para o ensino superior.',
    custo: 'Consulta a tabela em vigor no serviço',
    tempo: 'Varia — pede uma estimativa no balcão',
  },
  {
    passo: 2,
    titulo: 'Reconhecimento de assinatura no MIREX',
    descricao: 'O Ministério das Relações Exteriores (MIREX) reconhece a assinatura do ministério que autenticou o documento. Só depois disto o consulado estrangeiro aceita legalizá-lo.',
    custo: 'Consulta a tabela em vigor no MIREX',
    tempo: 'Varia',
  },
  {
    passo: 3,
    titulo: 'Legalização consular',
    descricao: 'Angola não consta como parte da Convenção da Apostila de Haia, por isso os documentos angolanos não levam apostila: são legalizados na embaixada ou consulado do país de destino em Angola. Confirma o estado atual no quadro oficial da HCCH.',
    custo: 'Definido por cada consulado',
    tempo: 'Definido por cada consulado',
  },
  {
    passo: 4,
    titulo: 'Tradução certificada (se necessária)',
    descricao: 'Para destinos onde o português não é língua oficial, os documentos precisam normalmente de tradução certificada. Pergunta à universidade ou ao consulado se a tradução deve ser feita antes ou depois da legalização e por que tradutores.',
    custo: 'Varia conforme o tradutor e o número de páginas',
    tempo: 'Varia',
  },
];

const fonteHcch = { titulo: 'HCCH — estado da Convenção da Apostila (lista oficial de países)', url: 'https://www.hcch.net/en/instruments/conventions/status-table/?cid=41' };

export const guiasDocumentos: Record<string, GuiaDocumento> = {
  geral: {
    pais: 'Geral',
    documentosBasicos,
    processoAutenticacao,
    requisitosEspecificos: [
      'Alguns documentos têm validade curta (ex.: registo criminal, exame médico). Confirma na bolsa a idade máxima aceite para cada um.',
      'Cópias certificadas: confirma se a bolsa aceita cópias certificadas por notário ou se exige certificação pela entidade emissora.',
      'Para destinos onde o português não é língua oficial, conta com tradução certificada.',
      'O processo de autenticação acima é para documentos emitidos em Angola. Se os teus documentos são de outro país, informa-te junto do Ministério da Educação e do Ministério dos Negócios Estrangeiros locais, e vê no quadro da HCCH se o teu país usa apostila.',
      'Verifica sempre os requisitos atualizados no site oficial da bolsa.',
    ],
    reconhecimentoDiplomas: `Autenticação e reconhecimento são processos diferentes:

Autenticação/legalização — confirma que o documento é verdadeiro e que a assinatura é válida.
Reconhecimento — confirma que o teu grau tem valor equivalente a um grau do país de destino.

Para te candidatares a uma universidade, normalmente é a própria universidade que avalia o teu percurso. O reconhecimento formal do grau costuma ser necessário apenas quando precisas que ele produza efeitos legais ou profissionais nesse país.`,
    fontes: [fonteHcch],
  },
  portugal: {
    pais: 'Portugal',
    documentosBasicos,
    processoAutenticacao,
    requisitosEspecificos: [
      'Visto de estudo pedido no consulado de Portugal no teu país. Depois da chegada, a autorização de residência é tratada com a AIMA.',
      'NIF (Número de Identificação Fiscal), pedido nas Finanças — é necessário, por exemplo, para abrir conta bancária ou assinar contrato de arrendamento.',
      'Cursos em português: falantes nativos de português costumam estar dispensados de certificado de língua — confirma com a universidade.',
      'Documentos em português não precisam de tradução.',
    ],
    reconhecimentoDiplomas: `Em Portugal, o reconhecimento de graus estrangeiros é regulado pelo Decreto-Lei n.º 66/2018 (em vigor desde 1 de janeiro de 2019).

Existem três tipos de reconhecimento: automático, de nível e específico. O tipo depende do grau que tens e do fim para que precisas dele.

O pedido é feito pelo titular do grau, junto da DGES ou de uma instituição de ensino superior pública, consoante o tipo de reconhecimento. As taxas e prazos são fixados pela DGES e pelas instituições — consulta os valores atuais antes de submeteres.

Para te candidatares a um mestrado ou doutoramento, a universidade avalia o teu grau na própria candidatura; o reconhecimento formal só é necessário se precisares que o grau produza efeitos em Portugal.`,
    fontes: [
      { titulo: 'DGES — Decreto-Lei n.º 66/2018 (regime de reconhecimento)', url: 'https://www.dges.gov.pt/pt/content/decreto-lei-no-662018-aprova-o-regime-juridico-de-reconhecimento-de-graus-academicos-e' },
      { titulo: 'Diário da República — Decreto-Lei n.º 66/2018 (versão consolidada)', url: 'https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/2018-116101330' },
    ],
  },
  alemanha: {
    pais: 'Alemanha',
    documentosBasicos,
    processoAutenticacao,
    requisitosEspecificos: [
      'Conta bloqueada (Sperrkonto) para o visto de estudante, se não tiveres bolsa que cubra as despesas: €11.904 por ano (€992 por mês) em 2026. Confirma o valor atual no site do Ministério dos Negócios Estrangeiros alemão (Auswärtiges Amt).',
      'Cursos em alemão: normalmente é exigido TestDaF (nível 4 em todas as secções) ou DSH-2. Cursos em inglês: o nível de IELTS/TOEFL é definido por cada programa.',
      'Acesso à licenciatura: verifica no anabin (secção de certificados escolares) se o teu certificado do ensino secundário dá acesso direto ao ensino superior ou se precisas de passar por um Studienkolleg.',
      'Muitas universidades recebem candidaturas de estudantes internacionais através da uni-assist — confirma no site do programa.',
    ],
    reconhecimentoDiplomas: `Na Alemanha, a base de dados anabin indica como são avaliadas as instituições e os graus estrangeiros.

H+ — a instituição é reconhecida no país de origem e considerada instituição de ensino superior na Alemanha.
H+/- — só alguns cursos ou alguns períodos são reconhecidos.
H- — a instituição não é considerada instituição de ensino superior na Alemanha.

Mesmo numa instituição H+, o teu grau específico também tem de constar na lista de graus. Se não constar, podes pedir uma avaliação individual (Zeugnisbewertung) à ZAB — Zentralstelle für ausländisches Bildungswesen. Há uma taxa e o processo demora alguns meses; consulta o valor e o prazo atuais no site da ZAB.

Para te candidatares a um curso, é a universidade (ou a uni-assist) que avalia os teus documentos.`,
    fontes: [
      { titulo: 'Auswärtiges Amt — serviço de vistos (meios financeiros / conta bloqueada)', url: 'https://www.auswaertiges-amt.de/en/visa-service' },
      { titulo: 'anabin — base de dados oficial', url: 'https://anabin.kmk.org' },
      { titulo: 'Make it in Germany — como usar o anabin', url: 'https://www.make-it-in-germany.com/de/jobs/anerkennung/hochschulabschluesse/' },
      { titulo: 'ZAB — avaliação de certificados (Zeugnisbewertung)', url: 'https://www.kmk.org/zab/zentralstelle-fuer-auslaendisches-bildungswesen.html' },
    ],
  },
  china: {
    pais: 'China',
    documentosBasicos,
    processoAutenticacao,
    requisitosEspecificos: [
      'Bolsa do Governo Chinês (CSC): candidatura no portal do CSC e, consoante o tipo de programa, também na universidade ou na embaixada da China no teu país.',
      'Cursos em chinês: normalmente HSK 4 ou superior (alguns cursos de humanidades pedem HSK 5). Quem não tem o nível pode, em muitos programas, fazer primeiro um ano de chinês.',
      'Cursos em inglês: IELTS/TOEFL com o nível definido por cada universidade (há guias que pedem IELTS 5.5 e outros mais).',
      'Formulário de exame médico para estrangeiros (Foreigner Physical Examination Form), preenchido em inglês, com foto, carimbo e assinatura do médico. Os resultados costumam ser válidos por 6 meses.',
      'Certificado de registo criminal emitido no teu país.',
      'Plano de estudos ou de investigação e, frequentemente, carta de pré-admissão da universidade.',
    ],
    reconhecimentoDiplomas: `Não há um processo prévio separado de reconhecimento: a universidade chinesa e o CSC avaliam os teus documentos académicos durante a candidatura.

Os documentos devem ser apresentados em chinês ou inglês (tradução certificada).

A China aplica a Convenção da Apostila desde 7 de novembro de 2023. Isto só dispensa a legalização consular se o país que emitiu o documento também for parte da Convenção — os documentos de países que não são parte (como Angola) continuam a ser legalizados na embaixada ou consulado da China.`,
    fontes: [
      { titulo: 'HCCH — Convenção da Apostila em vigor para a China (7/11/2023)', url: 'https://www.hcch.net/en/news-archive/details/?varevent=947' },
      fonteHcch,
      { titulo: 'Campus China / CSC — portal de bolsas do Governo Chinês', url: 'https://www.campuschina.org' },
    ],
  },
  brasil: {
    pais: 'Brasil',
    documentosBasicos,
    processoAutenticacao,
    requisitosEspecificos: [
      'Em programas de pós-graduação, a carta de aceitação de um orientador e um projeto de investigação são frequentemente exigidos — confirma no edital.',
      'Falantes nativos de português normalmente não precisam de exame de língua.',
      'CPF (Cadastro de Pessoas Físicas): necessário, por exemplo, para abrir conta bancária.',
      'Documentos em português não precisam de tradução.',
    ],
    reconhecimentoDiplomas: `No Brasil distinguem-se dois processos:

Revalidação — para diplomas de graduação (licenciatura), feita por universidades públicas.
Reconhecimento — para diplomas de pós-graduação stricto sensu (mestrado e doutoramento), feito por universidades com programas avaliados pela CAPES.

Os pedidos são submetidos pela Plataforma Carolina Bori, do MEC.

Medicina tem um processo próprio: o Revalida (Exame Nacional de Revalidação de Diplomas Médicos, Lei n.º 13.959/2019), aplicado pelo Inep.

Para estudar no Brasil não precisas de revalidar o diploma — isso só é necessário para exerceres a profissão ou para o diploma produzir efeitos legais no país.`,
    fontes: [
      { titulo: 'Plataforma Carolina Bori — MEC', url: 'https://plataformacarolinabori.mec.gov.br' },
      { titulo: 'Gov.br — Revalida', url: 'https://www.gov.br/pt-br/servicos/fazer-o-exame-nacional-de-revalidacao-de-diplomas-medicos-expedidos-por-instituicao-de-educacao-superior-estrangeira' },
      { titulo: 'Lei n.º 13.959/2019', url: 'https://www2.camara.leg.br/legin/fed/lei/2019/lei-13959-18-dezembro-2019-789607-publicacaooriginal-159705-pl.html' },
    ],
  },
};

export const paisesDocumento = ['Geral', 'Portugal', 'Alemanha', 'China', 'Brasil'];
