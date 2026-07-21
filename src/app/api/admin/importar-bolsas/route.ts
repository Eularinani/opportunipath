import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { runScraper } from '@/lib/scraper/engine';

export async function POST() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const results = await runScraper();
    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error('[POST /api/admin/importar-bolsas]', err);
    return NextResponse.json({ error: 'Erro interno ao importar bolsas' }, { status: 500 });
  }
}
