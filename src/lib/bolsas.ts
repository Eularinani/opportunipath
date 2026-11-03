import type { Prisma, StatusBolsa } from '@prisma/client';
import { db } from './db';

const DIA_MS = 24 * 60 * 60 * 1000;

/** Prazo a menos de N dias → URGENTE */
export const DIAS_URGENTE = 14;

/** Uma verificação com mais de N dias é considerada desactualizada */
export const VALIDADE_VERIFICACAO_DIAS = 60;

type DataLike = Date | string | null | undefined;

function toDate(d: DataLike): Date | null {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Estado real da bolsa, derivado das datas. O campo `status` na BD é apenas
 * uma cache deste valor — nunca deve ser definido à mão.
 */
export function calcularStatus(
  bolsa: { prazo: DataLike; dataAbertura?: DataLike },
  agora = new Date()
): StatusBolsa {
  const abertura = toDate(bolsa.dataAbertura);
  const prazo = toDate(bolsa.prazo);
  if (abertura && abertura > agora) return 'EM_BREVE';
  if (!prazo) return 'ABERTA';
  if (prazo < agora) return 'FECHADA';
  if (prazo.getTime() - agora.getTime() < DIAS_URGENTE * DIA_MS) return 'URGENTE';
  return 'ABERTA';
}

/** Filtro Prisma equivalente a calcularStatus(), para usar em queries. */
export function statusWhere(status: StatusBolsa, agora = new Date()): Prisma.BolsaWhereInput {
  const limiteUrgente = new Date(agora.getTime() + DIAS_URGENTE * DIA_MS);
  const jaAbriu: Prisma.BolsaWhereInput = { OR: [{ dataAbertura: null }, { dataAbertura: { lte: agora } }] };

  switch (status) {
    case 'EM_BREVE':
      return { dataAbertura: { gt: agora } };
    case 'FECHADA':
      return { AND: [jaAbriu, { prazo: { lt: agora } }] };
    case 'URGENTE':
      return { AND: [jaAbriu, { prazo: { gte: agora, lt: limiteUrgente } }] };
    case 'ABERTA':
      return { AND: [jaAbriu, { OR: [{ prazo: null }, { prazo: { gte: limiteUrgente } }] }] };
  }
}

/** Bolsas visíveis ao público: verificadas por um admin e publicadas. */
export const bolsaPublicadaWhere: Prisma.BolsaWhereInput = { estadoRevisao: 'PUBLICADA' };

/** Bolsas publicadas e que ainda não fecharam. */
export function bolsaAtivaWhere(agora = new Date()): Prisma.BolsaWhereInput {
  return {
    ...bolsaPublicadaWhere,
    OR: [{ prazo: null }, { prazo: { gte: agora } }],
  };
}

export function verificacaoExpirada(verificadoEm: DataLike, agora = new Date()): boolean {
  const data = toDate(verificadoEm);
  if (!data) return true;
  return agora.getTime() - data.getTime() > VALIDADE_VERIFICACAO_DIAS * DIA_MS;
}

/** Sincroniza a cache `status` de todas as bolsas com o estado calculado. */
export async function atualizarStatusBolsas(agora = new Date()) {
  const estados: StatusBolsa[] = ['EM_BREVE', 'FECHADA', 'URGENTE', 'ABERTA'];
  await db.$transaction(
    estados.map((status) =>
      db.bolsa.updateMany({
        where: { AND: [statusWhere(status, agora), { status: { not: status } }] },
        data: { status },
      })
    )
  );
}
