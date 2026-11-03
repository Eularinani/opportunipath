import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bolsaAtivaWhere } from '@/lib/bolsas';

export async function GET() {
  try {
    const bolsas = await db.bolsa.findMany({
      where: { ...bolsaAtivaWhere(), destaque: true },
      orderBy: { prazo: { sort: 'asc', nulls: 'last' } },
      take: 6,
      include: { processo: true, dicas: true },
    });

    return NextResponse.json({ bolsas });
  } catch (err) {
    console.error('[GET /api/bolsas/destaque]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
