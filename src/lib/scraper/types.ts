export interface RawBolsa {
  titulo: string;
  universidade?: string;
  pais?: string;
  paisCode?: string;
  bandeira?: string;
  nivel?: string;
  area?: string;
  tipo?: 'TOTAL' | 'PARCIAL' | 'PESQUISA' | 'INTERCAMBIO';
  prazo?: Date | string | null;
  dataAbertura?: Date | string | null;
  duracao?: string;
  valor?: string;
  descricao?: string;
  requisitos?: string[];
  documentos?: string[];
  linkOficial: string;
  status?: 'ABERTA' | 'FECHADA' | 'URGENTE' | 'EM_BREVE';
}

export interface ScrapedBolsa extends RawBolsa {
  urlOriginal: string;
  idiomaOriginal: string;
}

export interface ScraperSource {
  nome: string;
  urlBase: string;
  scrape(): Promise<ScrapedBolsa[]>;
}

export interface ScraperResult {
  fonte: string;
  total: number;
  novas: number;
  atualizadas: number;
  falhas: number;
}
