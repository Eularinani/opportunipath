import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const bodySchema = z.object({
  acao: z.enum(['publicar', 'despublicar', 'arquivar']),
});

/**
 * publicar    → o admin confirmou os dados na fonte oficial; regista quem e quando.
 *               Também serve para reverificar uma bolsa já publicada.
 * despublicar → volta a RASCUNHO (deixa de aparecer no site).
 * arquivar    → retira do site e da fila de revisão.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { acao } = bodySchema.parse(await req.json());

    const bolsa = await db.bolsa.findUnique({
      where: { id },
      select: { id: true, linkOficial: true, urlOriginal: true },
    });
    if (!bolsa) return NextResponse.json({ error: 'Não encontrada' }, { status: 404 });

    if (acao === 'publicar') {
      if (!bolsa.linkOficial) {
        return NextResponse.json(
          { error: 'Indica o link oficial (página da instituição que oferece a bolsa) antes de publicar.' },
          { status: 400 }
        );
      }
      if (bolsa.urlOriginal && bolsa.linkOficial === bolsa.urlOriginal) {
        return NextResponse.json(
          { error: 'O link oficial ainda aponta para o agregador de onde a bolsa foi importada. Substitui pela página oficial.' },
          { status: 400 }
        );
      }

      const updated = await db.bolsa.update({
        where: { id },
        data: {
          estadoRevisao: 'PUBLICADA',
          verificadoEm: new Date(),
          verificadoPor: session.user.name ?? session.user.email ?? 'admin',
        },
      });
      return NextResponse.json(updated);
    }

    const updated = await db.bolsa.update({
      where: { id },
      data: { estadoRevisao: acao === 'arquivar' ? 'ARQUIVADA' : 'RASCUNHO', destaque: false },
    });
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 400 });
    console.error('[POST /api/bolsas/[id]/verificar]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
