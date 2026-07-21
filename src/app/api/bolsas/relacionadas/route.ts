import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const querySchema = z.object({
  id: z.string().min(1),
  pais: z.string().optional(),
  area: z.string().optional(),
  limit: z.coerce.number().int().positive().max(20).default(4),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const parsed = querySchema.safeParse({
      id: searchParams.get('id') ?? undefined,
      pais: searchParams.get('pais') ?? undefined,
      area: searchParams.get('area') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const { id, pais, area, limit } = parsed.data;

    const bolsas = await db.bolsa.findMany({
      where: {
        id: { not: id },
        status: { not: 'FECHADA' },
        OR: [
          ...(pais ? [{ pais }] : []),
          ...(area ? [{ area }] : []),
        ],
      },
      orderBy: { prazo: 'asc' },
      take: limit,
      include: { processo: true, dicas: true },
    });

    return NextResponse.json({ bolsas });
  } catch (err) {
    console.error('[GET /api/bolsas/relacionadas]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
