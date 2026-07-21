'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Props {
  id: string;
  status: string;
}

export default function ContactoStatusActions({ id, status }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/contacto/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        toast.error('Erro ao atualizar estado.');
        return;
      }

      toast.success('Estado atualizado.');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-3">
      {status !== 'RESPONDIDO' && (
        <button
          type="button"
          disabled={loading}
          onClick={() => updateStatus('RESPONDIDO')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
        >
          Marcar como respondido
        </button>
      )}
      {status !== 'ARQUIVADO' && (
        <button
          type="button"
          disabled={loading}
          onClick={() => updateStatus('ARQUIVADO')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
        >
          Arquivar
        </button>
      )}
    </div>
  );
}
