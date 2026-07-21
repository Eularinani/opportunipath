import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateSchema = z.object({
  role: z.enum(['USER', 'ADMIN']),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { role } = updateSchema.parse(await req.json());

    // Impedir que o próprio admin se despromova ou seja eliminado
    if (id === session.user.id) {
      return NextResponse.json({ error: 'Não podes alterar o teu próprio papel.' }, { status: 403 });
    }

    const user = await db.user.update({ where: { id }, data: { role } });
    return NextResponse.json(user);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error('[PUT /api/utilizadores/[id]]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (id === session.user.id) {
      return NextResponse.json({ error: 'Não podes eliminar a tua própria conta.' }, { status: 403 });
    }

    await db.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/utilizadores/[id]]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
