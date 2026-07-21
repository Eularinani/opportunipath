import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { sendNewsletterWelcome } from '@/lib/resend';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`${ip}:newsletter`, {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
  });

  if (!limit.success) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tenta novamente mais tarde.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const { email } = subscribeSchema.parse(await req.json());

    const existing = await db.newsletterSubscriber.findUnique({ where: { email } });

    if (existing?.ativo) {
      return NextResponse.json({ message: 'Já estás subscrito!' }, { status: 200 });
    }

    if (existing && !existing.ativo) {
      await db.newsletterSubscriber.update({
        where: { email },
        data: { ativo: true, canceladoEm: null },
      });
    } else {
      await db.newsletterSubscriber.create({ data: { email } });
    }

    sendNewsletterWelcome(email).catch(console.error);

    return NextResponse.json({ message: 'Subscrito com sucesso!' }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error('[POST /api/newsletter]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const email = searchParams.get('email')?.toLowerCase().trim();
    if (!email) return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 });

    await db.newsletterSubscriber.update({
      where: { email },
      data: { ativo: false, canceladoEm: new Date() },
    });

    return NextResponse.json({ message: 'Subscrição cancelada.' });
  } catch (err) {
    if (err instanceof Error && err.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Email não encontrado' }, { status: 404 });
    }
    console.error('[DELETE /api/newsletter]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const parsed = listQuerySchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const { page, limit } = parsed.data;

    const [total, subscribers] = await Promise.all([
      db.newsletterSubscriber.count(),
      db.newsletterSubscriber.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({ subscribers, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[GET /api/newsletter]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
