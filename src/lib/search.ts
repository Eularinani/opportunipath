import { db } from './db';
import type { Prisma } from '@prisma/client';

export interface BolsaFilters {
  q?: string;
  pais?: string | string[];
  nivel?: string | string[];
  area?: string | string[];
  tipo?: string | string[];
  status?: string | string[];
  destaque?: boolean;
  page?: number;
  limit?: number;
  orderBy?: 'prazo' | 'createdAt' | 'visualizacoes';
}

export async function searchBolsas(filters: BolsaFilters) {
  const {
    q,
    pais,
    nivel,
    area,
    tipo,
    status,
    destaque,
    page = 1,
    limit = 12,
    orderBy = 'prazo',
  } = filters;

  const where: Prisma.BolsaWhereInput = {};

  // Full-text search via PostgreSQL ILIKE
  if (q?.trim()) {
    where.OR = [
      { titulo: { contains: q, mode: 'insensitive' } },
      { universidade: { contains: q, mode: 'insensitive' } },
      { descricao: { contains: q, mode: 'insensitive' } },
      { pais: { contains: q, mode: 'insensitive' } },
      { area: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (pais) {
    const paises = Array.isArray(pais) ? pais : [pais];
    where.pais = { in: paises };
  }

  if (nivel) {
    const niveis = Array.isArray(nivel) ? nivel : [nivel];
    where.nivel = { in: niveis };
  }

  if (area) {
    const areas = Array.isArray(area) ? area : [area];
    where.area = { in: areas };
  }

  if (tipo) {
    const tipos = Array.isArray(tipo) ? tipo : [tipo];
    where.tipo = { in: tipos as Prisma.EnumTipoBolsaFilter['in'] };
  }

  if (status) {
    const statuses = Array.isArray(status) ? status : [status];
    where.status = { in: statuses as Prisma.EnumStatusBolsaFilter['in'] };
  }

  if (destaque !== undefined) {
    where.destaque = destaque;
  }

  const [total, bolsas] = await Promise.all([
    db.bolsa.count({ where }),
    db.bolsa.findMany({
      where,
      include: { processo: true, dicas: true },
      orderBy: { [orderBy]: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    bolsas,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
}

export async function getPaisesComContagem() {
  const result = await db.bolsa.groupBy({
    by: ['pais', 'bandeira', 'paisCode'],
    _count: { id: true },
    where: { status: { not: 'FECHADA' } },
    orderBy: { _count: { id: 'desc' } },
  });

  return result.map((r) => ({
    pais: r.pais,
    bandeira: r.bandeira,
    paisCode: r.paisCode,
    total: r._count.id,
  }));
}
