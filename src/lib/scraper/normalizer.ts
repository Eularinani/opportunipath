import { slugify } from '@/lib/utils';
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

function inferirTipo(titulo: string, descricao?: string): RawBolsa['tipo'] {
  const texto = `${titulo} ${descricao ?? ''}`.toLowerCase();
  if (texto.includes('phd') || texto.includes('doutoramento') || texto.includes('doctoral') || texto.includes('research')) return 'PESQUISA';
  if (texto.includes('language') || texto.includes('língua') || texto.includes('exchange') || texto.includes('intercâmbio') || texto.includes('summer school')) return 'INTERCAMBIO';
  if (texto.includes('partial') || texto.includes('parcial') || texto.includes('tuition waiver') || texto.includes('fee waiver')) return 'PARCIAL';
  return 'TOTAL';
}

function inferirNivel(titulo: string, descricao?: string): string {
  const texto = `${titulo} ${descricao ?? ''}`.toLowerCase();
  if (texto.includes('phd') || texto.includes('doutoramento') || texto.includes('doctoral')) return 'Doutoramento';
  if (texto.includes('master') || texto.includes('mestrado') || texto.includes('msc') || texto.includes('ma ')) return 'Mestrado';
  if (texto.includes('bachelor') || texto.includes('licenciatura') || texto.includes('undergraduate')) return 'Licenciatura';
  if (texto.includes('language') || texto.includes('língua') || texto.includes('summer school')) return 'Curso de Línguas';
  if (texto.includes('postdoctoral') || texto.includes('pós-doutoramento')) return 'Pós-Doutoramento';
  return 'Mestrado';
}

function inferirArea(titulo: string, descricao?: string): string {
  const texto = `${titulo} ${descricao ?? ''}`.toLowerCase();
  if (texto.includes('engenharia') || texto.includes('engineering')) return 'Engenharia';
  if (texto.includes('medicina') || texto.includes('medicine') || texto.includes('saúde') || texto.includes('health')) return 'Ciências da Saúde';
  if (texto.includes('negócios') || texto.includes('business') || texto.includes('mba') || texto.includes('gestão')) return 'Negócios';
  if (texto.includes('tecnologia') || texto.includes('technology') || texto.includes('computer') || texto.includes('it ')) return 'Tecnologia';
  if (texto.includes('ciências sociais') || texto.includes('social science') || texto.includes('sociology')) return 'Ciências Sociais';
  if (texto.includes('direito') || texto.includes('law')) return 'Direito';
  if (texto.includes('arte') || texto.includes('art')) return 'Artes';
  if (texto.includes('ciência') || texto.includes('science')) return 'Ciências';
  return 'Geral';
}

function inferirStatus(prazo?: Date | string | null): RawBolsa['status'] {
  if (!prazo) return 'ABERTA';
  const data = new Date(prazo);
  if (isNaN(data.getTime())) return 'ABERTA';
  const dias = Math.ceil((data.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (dias < 0) return 'FECHADA';
  if (dias < 14) return 'URGENTE';
  return 'ABERTA';
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
  nivel: string;
  area: string;
  tipo: 'TOTAL' | 'PARCIAL' | 'PESQUISA' | 'INTERCAMBIO';
  prazo: Date;
  dataAbertura: Date | null;
  duracao: string;
  valor: string;
  descricao: string;
  requisitos: string[];
  documentos: string[];
  linkOficial: string;
  status: 'ABERTA' | 'FECHADA' | 'URGENTE' | 'EM_BREVE';
  urlOriginal: string;
  idiomaOriginal: string;
}

export function normalizeBolsa(raw: ScrapedBolsa): NormalizedBolsa {
  const paisCode = raw.paisCode && raw.paisCode !== 'XX' ? raw.paisCode : detectarPaisCode(raw.pais);
  const bandeira = raw.bandeira && raw.bandeira !== '🌍' ? raw.bandeira : getBandeira(paisCode);
  const pais = raw.pais && raw.pais.trim() ? raw.pais.trim() : 'Internacional';

  const prazo = parseDate(raw.prazo) ?? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // fallback: 90 dias
  const dataAbertura = parseDate(raw.dataAbertura);

  const titulo = raw.titulo.trim();
  const descricao = (raw.descricao ?? titulo).trim();

  const tipo = (raw.tipo ?? inferirTipo(titulo, descricao)) as NormalizedBolsa['tipo'];
  const nivel = raw.nivel ?? inferirNivel(titulo, descricao);
  const area = raw.area ?? inferirArea(titulo, descricao);
  const status = (raw.status ?? inferirStatus(prazo)) as NormalizedBolsa['status'];

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
    linkOficial: raw.linkOficial,
    status,
    urlOriginal: raw.urlOriginal,
    idiomaOriginal: raw.idiomaOriginal,
  };
}
