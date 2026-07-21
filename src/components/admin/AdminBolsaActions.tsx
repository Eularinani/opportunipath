'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminBolsaActions({ id }: { id: string }) {
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

  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/bolsas/${id}`} className="text-xs text-blue-600 hover:underline">Editar</Link>
      <button onClick={handleDelete} className="text-xs text-red-500 hover:underline">Eliminar</button>
    </div>
  );
}
