import type { GuiaDocumento, DocumentoChecklist, ProcessoAuthStep } from './types-documentos';

export const documentosBasicos: DocumentoChecklist[] = [
  { id: 'doc-1', nome: 'Certificado de Habilitacoes (original + 2 copias)', descricao: 'Certificado de conclusao do ensino medio ou superior, consoante o nivel da bolsa.', requerAutenticacao: true },
  { id: 'doc-2', nome: 'Certificado de Nacionalidade Angolana', descricao: 'Documento comprobatorio da nacionalidade angolana.', requerAutenticacao: true },
  { id: 'doc-3', nome: 'Bilhete de Identidade (copia autenticada)', descricao: 'BI valido com copia autenticada.', requerAutenticacao: true },
  { id: 'doc-4', nome: 'Passaporte biometrico valido (minimo 6 meses)', descricao: 'Passaporte com validade superior a 6 meses.', requerAutenticacao: false },
  { id: 'doc-5', nome: 'Certidao de Nascimento', descricao: 'Certidao original ou copia autenticada.', requerAutenticacao: true },
  { id: 'doc-6', nome: 'Atestado Medico', descricao: 'Atestado de saude emitido por hospital publico ou privado reconhecido.', requerAutenticacao: false },
  { id: 'doc-7', nome: 'Certidao de Casamento (se aplicavel)', descricao: 'Para candidatos casados que precisam de visto para conjuge.', requerAutenticacao: true },
  { id: 'doc-8', nome: 'Certificado de Idiomas', descricao: 'IELTS, TOEFL, DELF, TestDaF, HSK, etc., consoante o pais de destino.', requerAutenticacao: false },
];

export const processoAutenticacao: ProcessoAuthStep[] = [
  {
    passo: 1,
    titulo: 'Ministerio da Educacao',
    descricao: 'Leva os originais + copias para autenticacao. O Ministerio certifica que os documentos sao autenticos e foram emitidos por instituicoes reconhecidas.',
    custo: '5.000 Kz por documento',
    tempo: '3-5 dias uteis',
  },
  {
    passo: 2,
    titulo: 'MIREX (Ministerio das Relacoes Exteriores)',
    descricao: 'Legalizacao dos documentos ja autenticados pelo Ministerio da Educacao. O MIREX confirma que as assinaturas do MinEd sao validas.',
    custo: '3.000 Kz por documento',
    tempo: '5-10 dias uteis',
  },
  {
    passo: 3,
    titulo: 'Traducao Juramentada',
    descricao: 'Traducao dos documentos para o idioma do pais de destino por um tradutor juramentado. A traducao deve incluir todos os selos e assinaturas.',
    custo: '10.000 - 25.000 Kz por documento',
    tempo: '2-7 dias',
  },
  {
    passo: 4,
    titulo: 'Apostilha / Legalizacao Consular',
    descricao: 'Consoante o pais de destino: paises signatarios da Convencao da Apostila de Haia necessitam apenas da apostilha; outros requerem legalizacao no consulado.',
    custo: 'Varia conforme o pais',
    tempo: '3-10 dias',
  },
];

export const guiasDocumentos: Record<string, GuiaDocumento> = {
  geral: {
    pais: 'Geral',
    documentosBasicos,
    processoAutenticacao,
    requisitosEspecificos: [
      'Todos os documentos devem ter menos de 6 meses na data da candidatura',
      'Copias devem ser autenticadas por notario ou orgao emissor',
      'Documentos em portugues geralmente necessitam de traducao juramentada',
      'Verifica sempre os requisitos atualizados no site oficial da bolsa',
    ],
    reconhecimentoDiplomas: `O reconhecimento de diplomas e o processo pelo qual um pais valida que o teu diploma angolano e equivalente ao seu sistema educativo. Este processo e diferente da autenticacao:

**Autenticacao** = Confirma que o documento e original
**Reconhecimento** = Confirma que o diploma tem valor equivalente

Em alguns paises (como Portugal), este processo chama-se NOSTRIFICATION. Em outros, e simplesmente "recognition of prior learning".`,
  },
  portugal: {
    pais: 'Portugal',
    documentosBasicos,
    processoAutenticacao,
    requisitosEspecificos: [
      'NOSTRIFICATION: O reconhecimento de diploma e feito pela Direcao-Geral do Ensino Superior (DGES)',
      'Cartao de Cidadao ou Visto de Estudante (consoante a bolsa)',
      'NIF provisorio (pode ser obtido atraves da universidade)',
      'Contrato de accommodation (algumas bolsas exigem)',
      'Para cursos em portugues: certificado de proficiencia nao e necessario para angolanos',
    ],
    reconhecimentoDiplomas: `Em Portugal, o reconhecimento de diplomas chama-se **NOSTRIFICATION** ou **Reconhecimento de Grau Estrangeiro**.

**Quem pede:** A universidade portuguesa (nao o estudante diretamente)
**Quando:** Geralmente apos a aceitacao na universidade
**Custo:** Gratuito para bolsas do Santander; ate €100 para candidaturas independentes
**Tempo:** 30-90 dias

**Documentos necessarios:**
- Diploma original legalizado
- Programa das disciplinas (transcript)
- Certificado de conclusao`,
  },
  alemanha: {
    pais: 'Alemanha',
    documentosBasicos,
    processoAutenticacao,
    requisitosEspecificos: [
      'A DAAD exige o reconhecimento previo pelo anabin.kmk.org',
      'Para licenciatura: o 12o ano angolano e geralmente aceite diretamente',
      'Para mestrado: e necessario que a licenciatura seja equivalente ao Bach alemão (3-4 anos)',
      'TestDaF 4 ou DSH-2 para cursos em alemao; IELTS 6.5 para cursos em ingles',
      'Blocked account (€11.208/ano) se nao houver bolsa completa',
    ],
    reconhecimentoDiplomas: `Na Alemanha, o reconhecimento de diplomas e feito atraves do portal **anabin.kmk.org**.

**Como funciona:**
1. Acede a anabin.kmk.org
2. Pesquisa a tua instituicao de ensino
3. Verifica se o teu curso tem equivalencia H+ (Hochschulreife)
4. Se nao estiver listada, contacta a ZAB (Central Office for Foreign Education)

**Para bolsas DAAD:**
- O processo de reconhecimento e geralmente simplificado
- A universidade alema ajuda no processo
- Pode levar 4-8 semanas`,
  },
  china: {
    pais: 'China',
    documentosBasicos,
    processoAutenticacao,
    requisitosEspecificos: [
      'Exame HSK nivel 4 (para cursos em chines) ou IELTS 6.0 (para cursos em ingles)',
      'Formulario de candidatura CSC preenchido',
      'Carta de aceitacao preliminar da universidade chinesa',
      'Plano de estudo detalhado em chines ou ingles',
      'Sem antecedentes criminais (certificado emitido em Angola)',
      'Exame medico completo (formulario especifico da China)',
    ],
    reconhecimentoDiplomas: `Na China, o reconhecimento de diplomas e feito durante o processo de candidatura a bolsa CSC.

**Processo:**
1. A universidade chinesa avalia os documentos academicos
2. O CSC (China Scholarship Council) faz uma segunda verificacao
3. Nao ha necessidade de reconhecimento previo separado

**Nota importante:**
- Os documentos devem ser traduzidos para chines ou ingles
- A traducao deve ser feita por tradutor juramentado reconhecido pela embaixada chinesa
- A embaixada da China em Luanda pode ajudar com a lista de tradutores autorizados`,
  },
  brasil: {
    pais: 'Brasil',
    documentosBasicos,
    processoAutenticacao,
    requisitosEspecificos: [
      'Para medicina e odontologia: o Revalida e obrigatorio para exercer no Brasil',
      'Carta de aceitacao de orientador brasileiro e essencial',
      'Projeto de pesquisa aprovado pelo orientador',
      'Nao e necessario exame de idioma para angolanos (portugues)',
      'CPF provisorio (para abertura de conta bancaria)',
    ],
    reconhecimentoDiplomas: `No Brasil, o reconhecimento de diplomas e feito pelo **MEC (Ministerio da Educacao)**.

**Processo:**
1. A universidade brasileira faz a equivalencia durante a candidatura
2. Para mestrado/doutoramento: a PPG (Pos-Graduacao) avalia o curriculo
3. O MEC pode solicitar documentacao adicional

**Para bolsas CAPES/CNPq:**
- O reconhecimento e facilitado pelo acordo cultural entre Angola e Brasil
- Documentos em portugues nao necessitam de traducao`,
  },
};

export const paisesDocumento = ['Geral', 'Portugal', 'Alemanha', 'China', 'Brasil'];
