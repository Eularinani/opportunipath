import { NextResponse } from 'next/server';
import { getPaisesComContagem } from '@/lib/search';

export async function GET() {
  try {
    const paises = await getPaisesComContagem();
    return NextResponse.json({ paises });
  } catch (err) {
    console.error('[GET /api/bolsas/paises]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
