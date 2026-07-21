import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateSchema = z.object({
  titulo: z.string().min(3).optional(),
  categoria: z.string().optional(),
  resumo: z.string().optional(),
  conteudo: z.string().optional(),
  imagem: z.string().url().optional().nullable(),
  autor: z.string().optional(),
  publicado: z.boolean().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const guia = await db.guia.findFirst({
      where: { OR: [{ id }, { slug: id }], publicado: true },
    });
    if (!guia) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json(guia);
  } catch (_err) {
    console.error('[GET /api/guias/[id]]', _err);
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
    const data = updateSchema.parse(await req.json());
    const guia = await db.guia.update({ where: { id }, data });
    return NextResponse.json(guia);
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 400 });
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
    await db.guia.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
