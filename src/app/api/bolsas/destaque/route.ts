import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const bolsas = await db.bolsa.findMany({
      where: { destaque: true, status: { not: 'FECHADA' } },
      orderBy: { prazo: 'asc' },
      take: 6,
      include: { processo: true, dicas: true },
    });

    return NextResponse.json({ bolsas });
  } catch (err) {
    console.error('[GET /api/bolsas/destaque]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
