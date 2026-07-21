export interface Bolsa {
  id: string;
  slug: string;
  titulo: string;
  universidade: string;
  pais: string;
  paisCode: string;
  bandeira: string;
  nivel: string;
  area: string;
  tipo: 'total' | 'parcial' | 'pesquisa';
  prazo: string;
  duracao: string;
  valor: string;
  descricao: string;
  requisitos: string[];
  documentos: string[];
  processo: ProcessoStep[];
  dicas: Dica[];
  linkOficial: string;
  status: 'aberta' | 'fechada' | 'urgente';
  destaque: boolean;
}

export interface ProcessoStep {
  passo: number;
  titulo: string;
  descricao: string;
  deadline?: string;
}

export interface Dica {
  titulo: string;
  descricao: string;
}

export interface Guia {
  id: string;
  slug: string;
  titulo: string;
  categoria: string;
  resumo: string;
  conteudo: string;
  imagem: string;
  autor: string;
  data: string;
}

export interface Depoimento {
  id: string;
  nome: string;
  curso: string;
  pais: string;
  texto: string;
  imagem: string;
}

export interface PaisCategoria {
  nome: string;
  bandeira: string;
  bolsas: number;
}

export interface MembroEquipa {
  nome: string;
  funcao: string;
  bio: string;
  imagem: string;
  linkedin?: string;
  twitter?: string;
}

export interface DocumentoChecklist {
  id: string;
  nome: string;
  descricao: string;
  requerAutenticacao: boolean;
}

export interface GuiaDocumento {
  pais: string;
  documentosBasicos: DocumentoChecklist[];
  processoAutenticacao: ProcessoAuthStep[];
  requisitosEspecificos: string[];
  reconhecimentoDiplomas: string;
}

export interface ProcessoAuthStep {
  passo: number;
  titulo: string;
  descricao: string;
  custo: string;
  tempo: string;
}
