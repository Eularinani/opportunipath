'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Props {
  id: string;
  role: string;
  currentUserId?: string;
}

export default function UtilizadorActions({ id, role, currentUserId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isSelf = currentUserId === id;

  async function toggleRole() {
    if (isSelf) {
      toast.error('Não podes alterar o teu próprio papel.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/utilizadores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: role === 'ADMIN' ? 'USER' : 'ADMIN' }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? 'Erro ao atualizar papel.');
        return;
      }

      toast.success('Papel atualizado.');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser() {
    if (isSelf) {
      toast.error('Não podes eliminar a tua própria conta.');
      return;
    }

    if (!confirm('Tens a certeza que queres eliminar este utilizador?')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/utilizadores/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? 'Erro ao eliminar.');
        return;
      }

      toast.success('Utilizador eliminado.');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={loading || isSelf}
        onClick={toggleRole}
        className="text-xs px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
      >
        {role === 'ADMIN' ? 'Tornar USER' : 'Tornar ADMIN'}
      </button>
      <button
        type="button"
        disabled={loading || isSelf}
        onClick={deleteUser}
        className="text-xs px-2.5 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
      >
        Eliminar
      </button>
    </div>
  );
}
