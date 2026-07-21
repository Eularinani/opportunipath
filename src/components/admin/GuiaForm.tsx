'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { Guia } from '@prisma/client';

const guiaSchema = z.object({
  titulo: z.string().min(3, 'Título obrigatório'),
  categoria: z.string().min(1, 'Categoria obrigatória'),
  resumo: z.string().min(10, 'Resumo muito curto'),
  conteudo: z.string().min(20, 'Conteúdo muito curto'),
  imagem: z.string().url('Imagem inválida').optional().or(z.literal('')),
  autor: z.string().min(1, 'Autor obrigatório'),
  publicado: z.boolean().default(false),
});

type GuiaFormData = z.infer<typeof guiaSchema>;

interface GuiaFormProps {
  initialData?: Guia;
  mode: 'create' | 'edit';
}

export default function GuiaForm({ initialData, mode }: GuiaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<GuiaFormData>({
    titulo: initialData?.titulo ?? '',
    categoria: initialData?.categoria ?? '',
    resumo: initialData?.resumo ?? '',
    conteudo: initialData?.conteudo ?? '',
    imagem: initialData?.imagem ?? '',
    autor: initialData?.autor ?? '',
    publicado: initialData?.publicado ?? false,
  });

  function updateField<K extends keyof GuiaFormData>(field: K, value: GuiaFormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = guiaSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      toast.error('Verifica os campos marcados.');
      return;
    }

    try {
      const url = mode === 'create' ? '/api/guias' : `/api/guias/${initialData?.id}`;
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error?.[0]?.message ?? json.error ?? 'Erro ao guardar.');
        return;
      }

      toast.success(mode === 'create' ? 'Guia criado com sucesso!' : 'Guia atualizado com sucesso!');
      router.push('/admin/guias');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const fieldClass = (name: keyof GuiaFormData) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-path-teal ${errors[name] ? 'border-red-300' : 'border-gray-200'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-poppins font-bold text-2xl text-gray-900">
          {mode === 'create' ? 'Novo Guia' : 'Editar Guia'}
        </h1>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/guias')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="bg-path-teal hover:bg-path-teal-dark text-white">
            {loading ? 'A guardar...' : 'Guardar Guia'}
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
          <Input value={form.titulo} onChange={(e) => updateField('titulo', e.target.value)} className={fieldClass('titulo')} />
          {errors.titulo && <p className="text-xs text-red-500 mt-1">{errors.titulo}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
            <Input value={form.categoria} onChange={(e) => updateField('categoria', e.target.value)} className={fieldClass('categoria')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Autor *</label>
            <Input value={form.autor} onChange={(e) => updateField('autor', e.target.value)} className={fieldClass('autor')} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL da imagem</label>
          <Input value={form.imagem} onChange={(e) => updateField('imagem', e.target.value)} placeholder="https://..." className={fieldClass('imagem')} />
          {errors.imagem && <p className="text-xs text-red-500 mt-1">{errors.imagem}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resumo *</label>
          <Textarea value={form.resumo} onChange={(e) => updateField('resumo', e.target.value)} rows={3} className={fieldClass('resumo')} />
          {errors.resumo && <p className="text-xs text-red-500 mt-1">{errors.resumo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo *</label>
          <Textarea value={form.conteudo} onChange={(e) => updateField('conteudo', e.target.value)} rows={12} className={fieldClass('conteudo')} />
          {errors.conteudo && <p className="text-xs text-red-500 mt-1">{errors.conteudo}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="publicado"
            checked={form.publicado}
            onChange={(e) => updateField('publicado', e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="publicado" className="text-sm text-gray-700">Publicar guia</label>
        </div>
      </div>
    </form>
  );
}
