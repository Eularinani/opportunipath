import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import BolsaForm from '@/components/admin/BolsaForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Nova Bolsa — Admin' };

export default async function NovaBolsaPage() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') notFound();

  return <BolsaForm mode="create" />;
}
