import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const depoimentoSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  curso: z.string().min(2, 'Curso obrigatório'),
  pais: z.string().min(2, 'País obrigatório'),
  texto: z.string().min(20, 'Texto muito curto'),
  imagem: z.string().url().optional(),
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  aprovado: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const parsed = listQuerySchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      aprovado: searchParams.has('aprovado') ? searchParams.get('aprovado') === 'true' : true,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const { page, limit, aprovado } = parsed.data;

    // Listar depoimentos não aprovados só para admins.
    if (!aprovado) {
      const session = await auth();
      if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
      }
    }

    const [total, depoimentos] = await Promise.all([
      db.depoimento.count({ where: { aprovado } }),
      db.depoimento.findMany({
        where: { aprovado },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({ depoimentos, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[GET /api/depoimentos]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`${ip}:depoimentos`, {
    windowMs: 60 * 60 * 1000,
    maxRequests: 3,
  });

  if (!limit.success) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tenta novamente mais tarde.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const data = depoimentoSchema.parse(await req.json());

    const depoimento = await db.depoimento.create({
      data: { ...data, aprovado: false },
    });

    return NextResponse.json(depoimento, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error('[POST /api/depoimentos]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
