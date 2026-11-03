'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { EstadoRevisao } from '@prisma/client';

interface Props {
  id: string;
  slug: string;
  estadoRevisao: EstadoRevisao;
  precisaReverificar: boolean;
}

export default function AdminBolsaActions({ id, slug, estadoRevisao, precisaReverificar }: Props) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm('Tens a certeza que queres eliminar esta bolsa?')) return;
    try {
      const res = await fetch(`/api/bolsas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Bolsa eliminada com sucesso.');
        router.refresh();
      } else {
        toast.error('Erro ao eliminar bolsa.');
      }
    } catch {
      toast.error('Erro de ligação.');
    }
  }

  async function handleRevisao(acao: 'publicar' | 'despublicar' | 'arquivar') {
    if (
      acao === 'publicar' &&
      !confirm(
        'Confirmas que abriste o link oficial e verificaste prazo, valor, requisitos e elegibilidade? ' +
          'O teu nome e a data de hoje ficarão registados como verificação.'
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/bolsas/${id}/verificar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(typeof json.error === 'string' ? json.error : 'Erro ao atualizar a bolsa.');
        return;
      }
      toast.success(
        acao === 'publicar' ? 'Bolsa verificada e publicada.' : acao === 'arquivar' ? 'Bolsa arquivada.' : 'Bolsa despublicada.'
      );
      router.refresh();
    } catch {
      toast.error('Erro de ligação.');
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      <Link href={`/bolsa/${slug}`} target="_blank" className="text-xs text-gray-500 hover:underline">Ver</Link>
      <Link href={`/admin/bolsas/${id}`} className="text-xs text-blue-600 hover:underline">Editar</Link>
      {estadoRevisao !== 'PUBLICADA' && (
        <button onClick={() => handleRevisao('publicar')} className="text-xs text-green-600 font-medium hover:underline">
          Verificar e publicar
        </button>
      )}
      {estadoRevisao === 'PUBLICADA' && precisaReverificar && (
        <button onClick={() => handleRevisao('publicar')} className="text-xs text-amber-600 font-medium hover:underline">
          Reverificar
        </button>
      )}
      {estadoRevisao === 'PUBLICADA' && (
        <button onClick={() => handleRevisao('despublicar')} className="text-xs text-gray-500 hover:underline">
          Despublicar
        </button>
      )}
      {estadoRevisao === 'RASCUNHO' && (
        <button onClick={() => handleRevisao('arquivar')} className="text-xs text-gray-500 hover:underline">
          Arquivar
        </button>
      )}
      <button onClick={handleDelete} className="text-xs text-red-500 hover:underline">Eliminar</button>
    </div>
  );
}
