import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import ContactoStatusActions from './ContactoStatusActions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Detalhe do Contacto — Admin' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ContactoDetalhePage({ params }: Props) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') notFound();

  const { id } = await params;
  const contacto = await db.contacto.findUnique({ where: { id } });
  if (!contacto) notFound();

  // Marcar como lido automaticamente ao abrir
  if (!contacto.lido) {
    await db.contacto.update({ where: { id }, data: { lido: true } });
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/contactos" className="text-sm text-gray-500 hover:text-path-teal">← Voltar</Link>
          <h1 className="font-poppins font-bold text-2xl text-gray-900 mt-1">{contacto.assunto}</h1>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          contacto.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-700'
          : contacto.status === 'RESPONDIDO' ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-600'
        }`}>
          {contacto.status}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Nome</p>
            <p className="font-medium text-gray-900">{contacto.nome}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{contacto.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Recebido em</p>
            <p className="font-medium text-gray-900">{formatDate(contacto.createdAt)}</p>
          </div>
        </div>

        <div>
          <p className="text-gray-500 text-sm mb-1">Mensagem</p>
          <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 text-sm">{contacto.mensagem}</p>
        </div>
      </div>

      <ContactoStatusActions id={contacto.id} status={contacto.status} />
    </div>
  );
}
