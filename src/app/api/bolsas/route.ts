import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { searchBolsas } from '@/lib/search';
import { slugify } from '@/lib/utils';
import { calcularStatus } from '@/lib/bolsas';
import { z } from 'zod';

const orderByValues = ['prazo', 'createdAt', 'visualizacoes'] as const;

const bolsaSchema = z.object({
  titulo: z.string().min(3, 'Título obrigatório'),
  universidade: z.string().min(2, 'Universidade obrigatória'),
  pais: z.string().min(2, 'País obrigatório'),
  paisCode: z.string().length(2, 'Código de país deve ter 2 caracteres'),
  bandeira: z.string().min(1, 'Bandeira obrigatória'),
  nivel: z.string().min(1).nullable().default(null),
  area: z.string().min(1).nullable().default(null),
  tipo: z.enum(['TOTAL', 'PARCIAL', 'PESQUISA', 'INTERCAMBIO'], {
    errorMap: () => ({ message: 'Tipo inválido' }),
  }).nullable().default(null),
  prazo: z.string().datetime('Prazo inválido').nullable().default(null),
  dataAbertura: z.string().datetime().optional().nullable(),
  duracao: z.string().min(1, 'Duração obrigatória'),
  valor: z.string().min(1, 'Valor obrigatório'),
  descricao: z.string().min(10, 'Descrição muito curta'),
  requisitos: z.array(z.string()).default([]),
  documentos: z.array(z.string()).default([]),
  linkOficial: z.string().url('Link oficial inválido').nullable().default(null),
  paisesElegiveis: z.array(z.string().min(1)).default([]),
  destaque: z.boolean().default(false),
  processo: z.array(z.object({
    passo: z.number().int().positive(),
    titulo: z.string().min(1),
    descricao: z.string().min(1),
    deadline: z.string().optional(),
  })).default([]),
  dicas: z.array(z.object({
    titulo: z.string().min(1),
    descricao: z.string().min(1),
  })).default([]),
});

const querySchema = z.object({
  q: z.string().optional(),
  pais: z.array(z.string()).default([]),
  nivel: z.array(z.string()).default([]),
  area: z.array(z.string()).default([]),
  tipo: z.array(z.string()).default([]),
  status: z.array(z.string()).default([]),
  destaque: z.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  orderBy: z.enum(orderByValues).default('prazo'),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const parsed = querySchema.safeParse({
      q: searchParams.get('q') ?? undefined,
      pais: searchParams.getAll('pais'),
      nivel: searchParams.getAll('nivel'),
      area: searchParams.getAll('area'),
      tipo: searchParams.getAll('tipo'),
      status: searchParams.getAll('status'),
      destaque: searchParams.has('destaque') ? searchParams.get('destaque') === 'true' : undefined,
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      orderBy: searchParams.get('orderBy') ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const result = await searchBolsas(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[GET /api/bolsas]', err);
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
    const data = bolsaSchema.parse(body);
    const { processo, dicas, prazo, dataAbertura, ...rest } = data;

    const slug = `${slugify(data.titulo)}-${Date.now().toString(36)}`;
    const prazoDate = prazo ? new Date(prazo) : null;
    const aberturaDate = dataAbertura ? new Date(dataAbertura) : null;

    // Criada como RASCUNHO — só fica pública depois de verificada (POST /api/bolsas/[id]/verificar)
    const bolsa = await db.bolsa.create({
      data: {
        ...rest,
        slug,
        prazo: prazoDate,
        dataAbertura: aberturaDate,
        status: calcularStatus({ prazo: prazoDate, dataAbertura: aberturaDate }),
        processo: { create: processo },
        dicas: { create: dicas },
      },
      include: { processo: true, dicas: true },
    });

    return NextResponse.json(bolsa, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    if (err instanceof Error && err.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Slug já existe' }, { status: 409 });
    }
    console.error('[POST /api/bolsas]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
