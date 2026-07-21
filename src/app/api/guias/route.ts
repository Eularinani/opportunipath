import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { slugify } from '@/lib/utils';
import { z } from 'zod';

const guiaSchema = z.object({
  titulo: z.string().min(3, 'Título obrigatório'),
  categoria: z.string().min(1, 'Categoria obrigatória'),
  resumo: z.string().min(10, 'Resumo muito curto'),
  conteudo: z.string().min(20, 'Conteúdo muito curto'),
  imagem: z.string().url().optional(),
  autor: z.string().min(1, 'Autor obrigatório'),
  publicado: z.boolean().default(false),
});

const querySchema = z.object({
  q: z.string().optional(),
  categoria: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(9),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const parsed = querySchema.safeParse({
      q: searchParams.get('q') ?? undefined,
      categoria: searchParams.get('categoria') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const { q, categoria, page, limit } = parsed.data;

    // O parâmetro publicado=false só é permitido para admins.
    const includeNaoPublicados = searchParams.get('publicado') === 'false';
    if (includeNaoPublicados) {
      const session = await auth();
      if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
      }
    }

    const where = {
      ...(includeNaoPublicados ? {} : { publicado: true }),
      ...(categoria ? { categoria } : {}),
      ...(q ? {
        OR: [
          { titulo: { contains: q, mode: 'insensitive' as const } },
          { resumo: { contains: q, mode: 'insensitive' as const } },
          { categoria: { contains: q, mode: 'insensitive' as const } },
        ],
      } : {}),
    };

    const [total, guias] = await Promise.all([
      db.guia.count({ where }),
      db.guia.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, slug: true, titulo: true, categoria: true,
          resumo: true, imagem: true, autor: true, publicado: true, createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({ guias, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[GET /api/guias]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = guiaSchema.parse(body);
    const slug = `${slugify(data.titulo)}-${Date.now().toString(36)}`;

    const guia = await db.guia.create({ data: { ...data, slug } });
    return NextResponse.json(guia, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 400 });
    console.error('[POST /api/guias]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
