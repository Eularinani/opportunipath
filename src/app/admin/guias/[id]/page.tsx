import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import GuiaForm from '@/components/admin/GuiaForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Editar Guia — Admin' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarGuiaPage({ params }: Props) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') notFound();

  const { id } = await params;
  const guia = await db.guia.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });

  if (!guia) notFound();

  return <GuiaForm mode="edit" initialData={guia} />;
}
