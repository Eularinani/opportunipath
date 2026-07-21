import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.guia.groupBy({
      by: ['categoria'],
      where: { publicado: true },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const categorias = result.map((r) => ({
      nome: r.categoria,
      total: r._count.id,
    }));

    return NextResponse.json({ categorias });
  } catch (err) {
    console.error('[GET /api/guias/categorias]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
