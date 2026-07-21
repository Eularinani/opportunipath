import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { sendContactConfirmation, notifyAdminNewContact } from '@/lib/resend';
import { escapeHtml } from '@/lib/html';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const contactoSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido').toLowerCase(),
  assunto: z.string().min(3, 'Assunto obrigatório'),
  mensagem: z.string().min(10, 'Mensagem muito curta'),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`${ip}:contacto`, {
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
    const data = contactoSchema.parse(await req.json());

    const contacto = await db.contacto.create({ data });

    const safeMensagem = escapeHtml(data.mensagem);

    // Emails são enviados de forma não bloqueante; falhas são logadas.
    // Nota: em produção, considerar uma queue para envio de emails.
    sendContactConfirmation(data.nome, data.email, data.assunto).catch(console.error);
    notifyAdminNewContact(data.nome, data.email, data.assunto, safeMensagem).catch(console.error);

    return NextResponse.json({ message: 'Mensagem enviada com sucesso!', id: contacto.id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error('[POST /api/contacto]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  lido: z.boolean().optional(),
});

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
      lido: searchParams.has('lido') ? searchParams.get('lido') === 'true' : undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const { page, limit, lido } = parsed.data;
    const where = lido !== undefined ? { lido } : {};

    const [total, contactos] = await Promise.all([
      db.contacto.count({ where }),
      db.contacto.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({ contactos, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[GET /api/contacto]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
