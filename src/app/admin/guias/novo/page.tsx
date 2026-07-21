import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import GuiaForm from '@/components/admin/GuiaForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Novo Guia — Admin' };

export default async function NovoGuiaPage() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') notFound();

  return <GuiaForm mode="create" />;
}
