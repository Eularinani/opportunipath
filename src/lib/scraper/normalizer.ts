import { slugify } from '@/lib/utils';
import type { StatusBolsa } from '@prisma/client';
import { calcularStatus } from '@/lib/bolsas';
import type { ScrapedBolsa, RawBolsa } from './types';

const PAIS_TO_CODE: Record<string, string> = {
  'alemanha': 'DE', 'germany': 'DE', 'deutschland': 'DE',
  'reino unido': 'GB', 'united kingdom': 'GB', 'uk': 'GB',
  'estados unidos': 'US', 'united states': 'US', 'usa': 'US',
  'frança': 'FR', 'france': 'FR',
  'portugal': 'PT',
  'espanha': 'ES', 'spain': 'ES',
  'itália': 'IT', 'italy': 'IT',
  'holanda': 'NL', 'netherlands': 'NL',
  'bélgica': 'BE', 'belgium': 'BE',
  'suíça': 'CH', 'switzerland': 'CH',
  'suécia': 'SE', 'sweden': 'SE',
  'noruega': 'NO', 'norway': 'NO',
  'dinamarca': 'DK', 'denmark': 'DK',
  'finlândia': 'FI', 'finland': 'FI',
  'austria': 'AT', 'áustria': 'AT',
  'irlanda': 'IE', 'ireland': 'IE',
  'canadá': 'CA', 'canada': 'CA',
  'australia': 'AU', 'austrlia': 'AU', 'austrália': 'AU',
  'china': 'CN',
  'japão': 'JP', 'japan': 'JP',
  'coreia do sul': 'KR', 'south korea': 'KR',
  'brasil': 'BR', 'brazil': 'BR',
  'áfrica do sul': 'ZA', 'south africa': 'ZA',
  'angola': 'AO',
};

const BANDEIRAS: Record<string, string> = {
  DE: '🇩🇪', GB: '🇬🇧', US: '🇺🇸', FR: '🇫🇷', PT: '🇵🇹', ES: '🇪🇸',
  IT: '🇮🇹', NL: '🇳🇱', BE: '🇧🇪', CH: '🇨🇭', SE: '🇸🇪', NO: '🇳🇴',
  DK: '🇩🇰', FI: '🇫🇮', AT: '🇦🇹', IE: '🇮🇪', CA: '🇨🇦', AU: '🇦🇺',
  CN: '🇨🇳', JP: '🇯🇵', KR: '🇰🇷', BR: '🇧🇷', ZA: '🇿🇦', AO: '🇦🇴',
};

function detectarPaisCode(pais?: string): string {
  if (!pais) return 'XX';
  const normalized = pais.toLowerCase().trim();
  return PAIS_TO_CODE[normalized] ?? 'XX';
}

function getBandeira(code: string): string {
  return BANDEIRAS[code] ?? '🌍';
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

function inferirNivel(titulo: string, descricao?: string): string | null {
  const texto = `${titulo} ${descricao ?? ''}`;
  if (contem(texto, 'postdoctoral', 'post-doctoral', 'pós-doutoramento')) return 'Pós-Doutoramento';
  if (contem(texto, 'phd', 'doctoral', 'doutoramento')) return 'Doutoramento';
  if (contem(texto, 'masters?', 'mestrado', 'msc', 'mba', 'llm')) return 'Mestrado';
  if (contem(texto, 'bachelor', 'undergraduate', 'licenciatura')) return 'Licenciatura';
  return null;
}

function inferirArea(titulo: string, descricao?: string): string | null {
  const texto = `${titulo} ${descricao ?? ''}`;
  if (contem(texto, 'engineering', 'engenharia')) return 'Engenharia';
  if (contem(texto, 'medicine', 'medicina', 'public health', 'saúde pública', 'nursing')) return 'Saúde';
  if (contem(texto, 'business', 'mba', 'management', 'gestão', 'negócios')) return 'Negócios';
  if (contem(texto, 'computer science', 'information technology', 'informática', 'data science')) return 'Tecnologia';
  if (contem(texto, 'law', 'direito', 'llm')) return 'Direito';
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
  const paisCode = raw.paisCode && raw.paisCode !== 'XX' ? raw.paisCode : detectarPaisCode(raw.pais);
  const bandeira = raw.bandeira && raw.bandeira !== '🌍' ? raw.bandeira : getBandeira(paisCode);
  const pais = raw.pais && raw.pais.trim() ? raw.pais.trim() : 'Internacional';

  // Sem prazo explícito na fonte → fica vazio ("Prazo por confirmar"), nunca inventado
  const prazo = parseDate(raw.prazo);
  const dataAbertura = parseDate(raw.dataAbertura);

  const titulo = raw.titulo.trim();
  const descricao = (raw.descricao ?? titulo).trim();

  const tipo = raw.tipo ?? inferirTipo(titulo, descricao);
  const nivel = raw.nivel ?? inferirNivel(titulo, descricao);
  const area = raw.area ?? inferirArea(titulo, descricao);
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
    requisitos: raw.requisitos?.length ? raw.requisitos : ['Consultar requisitos no site oficial'],
    documentos: raw.documentos?.length ? raw.documentos : ['Consultar documentos no site oficial'],
    // O link de um agregador não é oficial — o admin indica o oficial na revisão
    linkOficial: raw.linkOficial && raw.linkOficial !== raw.urlOriginal ? raw.linkOficial : null,
    status,
    urlOriginal: raw.urlOriginal,
    idiomaOriginal: raw.idiomaOriginal,
  };
}
