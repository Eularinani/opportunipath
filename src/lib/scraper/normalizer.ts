import { slugify } from '@/lib/utils';
import type { StatusBolsa } from '@prisma/client';
import { calcularStatus } from '@/lib/bolsas';
import type { ScrapedBolsa, RawBolsa } from './types';

// Nomes (pt/en) → código ISO. Só são reconhecidos países desta lista; o resto fica "Por confirmar".
const PAIS_TO_CODE: Record<string, string> = {
  'alemanha': 'DE', 'germany': 'DE', 'deutschland': 'DE',
  'reino unido': 'GB', 'united kingdom': 'GB', 'uk': 'GB', 'britain': 'GB', 'england': 'GB', 'scotland': 'GB',
  'estados unidos': 'US', 'united states': 'US', 'usa': 'US',
  'frança': 'FR', 'france': 'FR',
  'portugal': 'PT',
  'espanha': 'ES', 'spain': 'ES',
  'itália': 'IT', 'italy': 'IT',
  'holanda': 'NL', 'países baixos': 'NL', 'netherlands': 'NL',
  'bélgica': 'BE', 'belgium': 'BE',
  'suíça': 'CH', 'switzerland': 'CH',
  'suécia': 'SE', 'sweden': 'SE',
  'noruega': 'NO', 'norway': 'NO',
  'dinamarca': 'DK', 'denmark': 'DK',
  'finlândia': 'FI', 'finland': 'FI',
  'áustria': 'AT', 'austria': 'AT',
  'irlanda': 'IE', 'ireland': 'IE',
  'hungria': 'HU', 'hungary': 'HU',
  'turquia': 'TR', 'turkey': 'TR', 'türkiye': 'TR',
  'canadá': 'CA', 'canada': 'CA',
  'austrália': 'AU', 'australia': 'AU',
  'nova zelândia': 'NZ', 'new zealand': 'NZ',
  'china': 'CN',
  'japão': 'JP', 'japan': 'JP',
  'coreia do sul': 'KR', 'south korea': 'KR', 'korea': 'KR',
  'singapura': 'SG', 'singapore': 'SG',
  'brasil': 'BR', 'brazil': 'BR',
  'áfrica do sul': 'ZA', 'south africa': 'ZA',
  'angola': 'AO',
};

const CODE_TO_NOME: Record<string, string> = {
  DE: 'Alemanha', GB: 'Reino Unido', US: 'Estados Unidos', FR: 'França', PT: 'Portugal', ES: 'Espanha',
  IT: 'Itália', NL: 'Países Baixos', BE: 'Bélgica', CH: 'Suíça', SE: 'Suécia', NO: 'Noruega',
  DK: 'Dinamarca', FI: 'Finlândia', AT: 'Áustria', IE: 'Irlanda', HU: 'Hungria', TR: 'Turquia',
  CA: 'Canadá', AU: 'Austrália', NZ: 'Nova Zelândia', CN: 'China', JP: 'Japão', KR: 'Coreia do Sul',
  SG: 'Singapura', BR: 'Brasil', ZA: 'África do Sul', AO: 'Angola',
};

function getBandeira(code: string): string {
  if (!/^[A-Z]{2}$/.test(code) || code === 'XX') return '🌍';
  // Emoji de bandeira a partir do código ISO (indicadores regionais)
  return String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}

/** Procura um país conhecido no texto (com limites de palavra). Nomes mais longos primeiro. */
function detectarPaisCode(texto?: string): string {
  if (!texto) return 'XX';
  const nomes = Object.keys(PAIS_TO_CODE).sort((a, b) => b.length - a.length);
  for (const nome of nomes) {
    if (new RegExp(`(^|[^\\p{L}])${nome}([^\\p{L}]|$)`, 'iu').test(texto)) return PAIS_TO_CODE[nome];
  }
  return 'XX';
}

// As inferências abaixo só devolvem um valor quando há uma palavra-chave clara
// (com limites de palavra). Sem certeza → null, e o admin preenche na revisão.
function contem(texto: string, ...termos: string[]): boolean {
  return termos.some((t) => new RegExp(`\\b${t}\\b`, 'i').test(texto));
}

function inferirTipo(titulo: string, descricao?: string): NonNullable<RawBolsa['tipo']> | null {
  const texto = `${titulo} ${descricao ?? ''}`;
  if (contem(texto, 'fully[- ]funded', 'full scholarships?', 'bolsa integral', 'bolsa total')) return 'TOTAL';
  if (contem(texto, 'partial scholarships?', 'partially funded', 'bolsa parcial', 'tuition waiver', 'fee waiver')) return 'PARCIAL';
  if (contem(texto, 'research fellowships?', 'research grants?')) return 'PESQUISA';
  if (contem(texto, 'exchange programme', 'exchange program', 'interc[aâ]mbio', 'summer school', 'language course')) return 'INTERCAMBIO';
  return null;
}

// Nível e área só a partir do título: a descrição costuma mencionar vários níveis/áreas
function inferirNivel(titulo: string): string | null {
  if (contem(titulo, 'postdoctoral', 'post-doctoral', 'postdoc', 'pós-doutoramento')) return 'Pós-Doutoramento';
  if (contem(titulo, 'phd', 'doctoral', 'doctorate', 'doutoramento')) return 'Doutoramento';
  if (contem(titulo, 'masters?', 'mestrado', 'msc', 'mba', 'llm')) return 'Mestrado';
  if (contem(titulo, 'bachelor', 'undergraduate', 'licenciatura')) return 'Licenciatura';
  return null;
}

function inferirArea(titulo: string): string | null {
  if (contem(titulo, 'engineering', 'engenharia')) return 'Engenharia';
  if (contem(titulo, 'medicine', 'medicina', 'public health', 'saúde pública', 'nursing')) return 'Saúde';
  if (contem(titulo, 'business', 'mba', 'management', 'finance', 'gestão', 'negócios')) return 'Negócios';
  if (contem(titulo, 'computer science', 'information technology', 'informática', 'data science')) return 'Tecnologia';
  if (contem(titulo, 'law', 'direito', 'llm')) return 'Direito';
  return null;
}

function parseDate(input?: string | Date | null): Date | null {
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
  const parsed = new Date(input);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export interface NormalizedBolsa {
  slug: string;
  titulo: string;
  universidade: string;
  pais: string;
  paisCode: string;
  bandeira: string;
  nivel: string | null;
  area: string | null;
  tipo: 'TOTAL' | 'PARCIAL' | 'PESQUISA' | 'INTERCAMBIO' | null;
  prazo: Date | null;
  dataAbertura: Date | null;
  duracao: string;
  valor: string;
  descricao: string;
  requisitos: string[];
  documentos: string[];
  linkOficial: string | null;
  status: StatusBolsa;
  urlOriginal: string;
  idiomaOriginal: string;
}

export function normalizeBolsa(raw: ScrapedBolsa): NormalizedBolsa {
  // País: código explícito da fonte, senão um país conhecido no título ou no campo país
  const paisCode =
    raw.paisCode && raw.paisCode !== 'XX'
      ? raw.paisCode
      : [raw.titulo, raw.pais].map(detectarPaisCode).find((c) => c !== 'XX') ?? 'XX';
  const bandeira = raw.bandeira && raw.bandeira !== '🌍' ? raw.bandeira : getBandeira(paisCode);
  const pais = CODE_TO_NOME[paisCode] ?? 'Por confirmar';

  // Sem prazo explícito na fonte → fica vazio ("Prazo por confirmar"), nunca inventado
  const prazo = parseDate(raw.prazo);
  const dataAbertura = parseDate(raw.dataAbertura);

  const titulo = raw.titulo.trim();
  const descricao = (raw.descricao ?? titulo).trim();

  const tipo = raw.tipo ?? inferirTipo(titulo, descricao);
  const nivel = raw.nivel ?? inferirNivel(titulo);
  const area = raw.area ?? inferirArea(titulo);
  const status = calcularStatus({ prazo, dataAbertura });

  const slug = `${slugify(titulo)}-${Date.now().toString(36)}`;

  return {
    slug,
    titulo,
    universidade: raw.universidade?.trim() || 'A definir',
    pais,
    paisCode,
    bandeira,
    nivel,
    area,
    tipo,
    prazo,
    dataAbertura,
    duracao: raw.duracao?.trim() || 'A definir',
    valor: raw.valor?.trim() || 'A consultar no site oficial',
    descricao,
    // Vazio = a página mostra "consulta no site oficial"
    requisitos: raw.requisitos ?? [],
    documentos: raw.documentos ?? [],
    // O link de um agregador não é oficial — o admin indica o oficial na revisão
    linkOficial: raw.linkOficial && raw.linkOficial !== raw.urlOriginal ? raw.linkOficial : null,
    status,
    urlOriginal: raw.urlOriginal,
    idiomaOriginal: raw.idiomaOriginal,
  };
}
