import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const cuidOrSlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

const updateSchema = z.object({
  titulo: z.string().min(3).optional(),
  universidade: z.string().min(2).optional(),
  pais: z.string().min(2).optional(),
  paisCode: z.string().length(2).optional(),
  bandeira: z.string().optional(),
  nivel: z.string().optional(),
  area: z.string().optional(),
  tipo: z.enum(['TOTAL', 'PARCIAL', 'PESQUISA', 'INTERCAMBIO']).optional(),
  prazo: z.string().datetime().optional(),
  dataAbertura: z.string().datetime().optional().nullable(),
  duracao: z.string().optional(),
  valor: z.string().optional(),
  descricao: z.string().min(10).optional(),
  requisitos: z.array(z.string()).optional(),
  documentos: z.array(z.string()).optional(),
  linkOficial: z.string().url().optional(),
  status: z.enum(['ABERTA', 'FECHADA', 'URGENTE', 'EM_BREVE']).optional(),
  destaque: z.boolean().optional(),
});

function validateId(id: string): { ok: false; response: NextResponse } | { ok: true } {
  if (!id || id.length > 128 || !cuidOrSlugRegex.test(id)) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'ID inválido' }, { status: 400 }),
    };
  }
  return { ok: true };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const validation = validateId(id);
    if (!validation.ok) return validation.response;

    const bolsa = await db.bolsa.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { processo: { orderBy: { passo: 'asc' } }, dicas: true },
    });

    if (!bolsa) return NextResponse.json({ error: 'Não encontrada' }, { status: 404 });

    // Incrementa visualizações de forma não bloqueante
    db.bolsa.update({
      where: { id: bolsa.id },
      data: { visualizacoes: { increment: 1 } },
    }).catch(() => {});

    return NextResponse.json(bolsa);
  } catch (err) {
    console.error('[GET /api/bolsas/[id]]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const validation = validateId(id);
    if (!validation.ok) return validation.response;

    const body = await req.json();
    const data = updateSchema.parse(body);

    const bolsa = await db.bolsa.update({
      where: { id },
      data: {
        ...data,
        ...(data.prazo ? { prazo: new Date(data.prazo) } : {}),
        ...(data.dataAbertura !== undefined ? { dataAbertura: data.dataAbertura ? new Date(data.dataAbertura) : null } : {}),
      },
      include: { processo: true, dicas: true },
    });

    return NextResponse.json(bolsa);
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 400 });
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: 'Não encontrada' }, { status: 404 });
    }
    console.error('[PUT /api/bolsas/[id]]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const validation = validateId(id);
    if (!validation.ok) return validation.response;

    await db.bolsa.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: 'Não encontrada' }, { status: 404 });
    }
    console.error('[DELETE /api/bolsas/[id]]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
