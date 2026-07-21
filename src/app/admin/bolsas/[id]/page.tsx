import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import BolsaForm from '@/components/admin/BolsaForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Editar Bolsa — Admin' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarBolsaPage({ params }: Props) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') notFound();

  const { id } = await params;
  const bolsa = await db.bolsa.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { processo: true, dicas: true },
  });

  if (!bolsa) notFound();

  return <BolsaForm mode="edit" initialData={bolsa} />;
}
