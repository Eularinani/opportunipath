import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPrazoColor(prazo: Date | string): string {
  const dias = Math.ceil((new Date(prazo).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (dias < 7) return 'text-path-rose';
  if (dias < 30) return 'text-path-amber';
  return 'text-path-teal';
}

export function getPrazoLabel(prazo: Date | string): string {
  const dias = Math.ceil((new Date(prazo).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (dias < 0) return 'Encerrado';
  if (dias === 0) return 'Encerra hoje';
  if (dias === 1) return 'Falta 1 dia';
  if (dias < 30) return `Faltam ${dias} dias`;
  const meses = Math.floor(dias / 30);
  return meses === 1 ? 'Falta 1 mês' : `Faltam ${meses} meses`;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function tipoBolsaLabel(tipo: string): string {
  const map: Record<string, string> = {
    TOTAL: 'Bolsa Total',
    PARCIAL: 'Bolsa Parcial',
    PESQUISA: 'Pesquisa',
    INTERCAMBIO: 'Intercâmbio & Línguas',
  };
  return map[tipo] ?? tipo;
}

export function tipoBolsaColor(tipo: string): string {
  const map: Record<string, string> = {
    TOTAL: 'bg-path-teal/10 text-path-teal',
    PARCIAL: 'bg-path-amber/10 text-path-amber',
    PESQUISA: 'bg-path-blue/10 text-path-blue',
    INTERCAMBIO: 'bg-path-rose/10 text-path-rose',
  };
  return map[tipo] ?? 'bg-path-cream text-path-slate';
}

export function statusBolsaLabel(status: string): string {
  const map: Record<string, string> = {
    ABERTA: 'Aberta',
    FECHADA: 'Fechada',
    URGENTE: 'Urgente',
    EM_BREVE: 'Abre em Breve',
  };
  return map[status] ?? status;
}

export function statusBolsaColor(status: string): string {
  const map: Record<string, string> = {
    ABERTA: 'bg-path-teal/10 text-path-teal',
    FECHADA: 'bg-path-cream text-path-slate',
    URGENTE: 'bg-path-rose/10 text-path-rose',
    EM_BREVE: 'bg-path-blue/10 text-path-blue',
  };
  return map[status] ?? 'bg-path-cream text-path-slate';
}

export function getAberturaLabel(dataAbertura: Date | string | null | undefined): string | null {
  if (!dataAbertura) return null;
  const dias = Math.ceil((new Date(dataAbertura).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (dias <= 0) return 'Abre agora';
  if (dias === 1) return 'Abre amanhã';
  if (dias < 30) return `Abre em ${dias} dias`;
  const meses = Math.floor(dias / 30);
  return meses === 1 ? 'Abre em 1 mês' : `Abre em ${meses} meses`;
}
