'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus } from 'lucide-react';
import type { Bolsa, ProcessoStep, Dica } from '@prisma/client';

const bolsaSchema = z.object({
  titulo: z.string().min(3, 'Título obrigatório'),
  universidade: z.string().min(2, 'Universidade obrigatória'),
  pais: z.string().min(2, 'País obrigatório'),
  paisCode: z.string().length(2, 'Código de país deve ter 2 caracteres'),
  bandeira: z.string().min(1, 'Bandeira obrigatória'),
  nivel: z.string().min(1, 'Nível obrigatório'),
  area: z.string().min(1, 'Área obrigatória'),
  tipo: z.enum(['TOTAL', 'PARCIAL', 'PESQUISA', 'INTERCAMBIO']),
  prazo: z.string().min(1, 'Prazo obrigatório'),
  dataAbertura: z.string().optional(),
  duracao: z.string().min(1, 'Duração obrigatória'),
  valor: z.string().min(1, 'Valor obrigatório'),
  descricao: z.string().min(10, 'Descrição muito curta'),
  requisitos: z.array(z.string()),
  documentos: z.array(z.string()),
  linkOficial: z.string().url('Link oficial inválido'),
  status: z.enum(['ABERTA', 'FECHADA', 'URGENTE', 'EM_BREVE']),
  destaque: z.boolean().default(false),
  processo: z.array(z.object({
    passo: z.number().int().positive(),
    titulo: z.string().min(1),
    descricao: z.string().min(1),
    deadline: z.string().optional(),
  })),
  dicas: z.array(z.object({
    titulo: z.string().min(1),
    descricao: z.string().min(1),
  })),
});

type BolsaFormData = z.infer<typeof bolsaSchema>;

interface BolsaFormProps {
  initialData?: Bolsa & { processo: ProcessoStep[]; dicas: Dica[] };
  mode: 'create' | 'edit';
}

const niveis = ['Licenciatura', 'Mestrado', 'Doutoramento', 'Pós-Doutoramento', 'Curta Duração'];
const areas = ['Engenharia', 'Ciências', 'Humanidades', 'Negócios', 'Saúde', 'Artes', 'Tecnologia', 'Direito', 'Outra'];

export default function BolsaForm({ initialData, mode }: BolsaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<BolsaFormData>({
    titulo: initialData?.titulo ?? '',
    universidade: initialData?.universidade ?? '',
    pais: initialData?.pais ?? '',
    paisCode: initialData?.paisCode ?? '',
    bandeira: initialData?.bandeira ?? '',
    nivel: initialData?.nivel ?? '',
    area: initialData?.area ?? '',
    tipo: (initialData?.tipo as BolsaFormData['tipo']) ?? 'TOTAL',
    prazo: initialData ? new Date(initialData.prazo).toISOString().slice(0, 16) : '',
    dataAbertura: initialData?.dataAbertura ? new Date(initialData.dataAbertura).toISOString().slice(0, 16) : '',
    duracao: initialData?.duracao ?? '',
    valor: initialData?.valor ?? '',
    descricao: initialData?.descricao ?? '',
    requisitos: initialData?.requisitos ?? [],
    documentos: initialData?.documentos ?? [],
    linkOficial: initialData?.linkOficial ?? '',
    status: (initialData?.status as BolsaFormData['status']) ?? 'ABERTA',
    destaque: initialData?.destaque ?? false,
    processo: initialData?.processo.map((p) => ({
      passo: p.passo,
      titulo: p.titulo,
      descricao: p.descricao,
      deadline: p.deadline ?? '',
    })) ?? [],
    dicas: initialData?.dicas.map((d) => ({
      titulo: d.titulo,
      descricao: d.descricao,
    })) ?? [],
  });

  function updateField<K extends keyof BolsaFormData>(field: K, value: BolsaFormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  }

  function addItem(field: 'requisitos' | 'documentos') {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  }

  function updateItem(field: 'requisitos' | 'documentos', index: number, value: string) {
    setForm((prev) => {
      const next = [...prev[field]];
      next[index] = value;
      return { ...prev, [field]: next };
    });
  }

  function removeItem(field: 'requisitos' | 'documentos', index: number) {
    setForm((prev) => {
      const next = [...prev[field]];
      next.splice(index, 1);
      return { ...prev, [field]: next };
    });
  }

  function addProcesso() {
    setForm((prev) => ({
      ...prev,
      processo: [...prev.processo, { passo: prev.processo.length + 1, titulo: '', descricao: '', deadline: '' }],
    }));
  }

  function updateProcesso(index: number, data: Partial<BolsaFormData['processo'][number]>) {
    setForm((prev) => {
      const next = [...prev.processo];
      next[index] = { ...next[index], ...data };
      return { ...prev, processo: next };
    });
  }

  function removeProcesso(index: number) {
    setForm((prev) => {
      const next = prev.processo.filter((_, i) => i !== index);
      return { ...prev, processo: next.map((p, i) => ({ ...p, passo: i + 1 })) };
    });
  }

  function addDica() {
    setForm((prev) => ({ ...prev, dicas: [...prev.dicas, { titulo: '', descricao: '' }] }));
  }

  function updateDica(index: number, data: Partial<BolsaFormData['dicas'][number]>) {
    setForm((prev) => {
      const next = [...prev.dicas];
      next[index] = { ...next[index], ...data };
      return { ...prev, dicas: next };
    });
  }

  function removeDica(index: number) {
    setForm((prev) => ({ ...prev, dicas: prev.dicas.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = bolsaSchema.safeParse(form);
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
      const url = mode === 'create' ? '/api/bolsas' : `/api/bolsas/${initialData?.id}`;
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

      toast.success(mode === 'create' ? 'Bolsa criada com sucesso!' : 'Bolsa atualizada com sucesso!');
      router.push('/admin/bolsas');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const fieldClass = (name: keyof BolsaFormData) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-path-teal ${errors[name] ? 'border-red-300' : 'border-gray-200'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-poppins font-bold text-2xl text-gray-900">
          {mode === 'create' ? 'Nova Bolsa' : 'Editar Bolsa'}
        </h1>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/bolsas')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="bg-path-teal hover:bg-path-teal-dark text-white">
            {loading ? 'A guardar...' : 'Guardar Bolsa'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
          <TabsTrigger value="processo">Processo</TabsTrigger>
          <TabsTrigger value="dicas">Dicas</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4 bg-white p-6 rounded-xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <Input value={form.titulo} onChange={(e) => updateField('titulo', e.target.value)} className={fieldClass('titulo')} />
              {errors.titulo && <p className="text-xs text-red-500 mt-1">{errors.titulo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Universidade *</label>
              <Input value={form.universidade} onChange={(e) => updateField('universidade', e.target.value)} className={fieldClass('universidade')} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">País *</label>
              <Input value={form.pais} onChange={(e) => updateField('pais', e.target.value)} className={fieldClass('pais')} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código do país (2 letras) *</label>
              <Input value={form.paisCode} onChange={(e) => updateField('paisCode', e.target.value.toUpperCase())} maxLength={2} className={fieldClass('paisCode')} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bandeira (emoji) *</label>
              <Input value={form.bandeira} onChange={(e) => updateField('bandeira', e.target.value)} className={fieldClass('bandeira')} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nível *</label>
              <select value={form.nivel} onChange={(e) => updateField('nivel', e.target.value)} className={fieldClass('nivel')}>
                <option value="">Selecionar...</option>
                {niveis.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área *</label>
              <select value={form.area} onChange={(e) => updateField('area', e.target.value)} className={fieldClass('area')}>
                <option value="">Selecionar...</option>
                {areas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
              <select value={form.tipo} onChange={(e) => updateField('tipo', e.target.value as BolsaFormData['tipo'])} className={fieldClass('tipo')}>
                <option value="TOTAL">Total</option>
                <option value="PARCIAL">Parcial</option>
                <option value="PESQUISA">Pesquisa</option>
                <option value="INTERCAMBIO">Intercâmbio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select value={form.status} onChange={(e) => updateField('status', e.target.value as BolsaFormData['status'])} className={fieldClass('status')}>
                <option value="ABERTA">Aberta</option>
                <option value="FECHADA">Fechada</option>
                <option value="URGENTE">Urgente</option>
                <option value="EM_BREVE">Abre em Breve</option>
              </select>
            </div>

            <div className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                id="destaque"
                checked={form.destaque}
                onChange={(e) => updateField('destaque', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="destaque" className="text-sm text-gray-700">Marcar como destaque</label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="detalhes" className="space-y-4 bg-white p-6 rounded-xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prazo *</label>
              <Input type="datetime-local" value={form.prazo} onChange={(e) => updateField('prazo', e.target.value)} className={fieldClass('prazo')} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de abertura</label>
              <Input type="datetime-local" value={form.dataAbertura} onChange={(e) => updateField('dataAbertura', e.target.value)} className={fieldClass('dataAbertura')} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duração *</label>
              <Input value={form.duracao} onChange={(e) => updateField('duracao', e.target.value)} className={fieldClass('duracao')} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor *</label>
              <Input value={form.valor} onChange={(e) => updateField('valor', e.target.value)} className={fieldClass('valor')} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Link oficial *</label>
              <Input value={form.linkOficial} onChange={(e) => updateField('linkOficial', e.target.value)} className={fieldClass('linkOficial')} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
              <Textarea value={form.descricao} onChange={(e) => updateField('descricao', e.target.value)} rows={6} className={fieldClass('descricao')} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Requisitos</label>
            {form.requisitos.map((req, i) => (
              <div key={i} className="flex gap-2">
                <Input value={req} onChange={(e) => updateItem('requisitos', i, e.target.value)} placeholder="Requisito" />
                <Button type="button" variant="outline" size="icon" onClick={() => removeItem('requisitos', i)}><X className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addItem('requisitos')}><Plus className="w-4 h-4" /> Adicionar requisito</Button>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Documentos necessários</label>
            {form.documentos.map((doc, i) => (
              <div key={i} className="flex gap-2">
                <Input value={doc} onChange={(e) => updateItem('documentos', i, e.target.value)} placeholder="Documento" />
                <Button type="button" variant="outline" size="icon" onClick={() => removeItem('documentos', i)}><X className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addItem('documentos')}><Plus className="w-4 h-4" /> Adicionar documento</Button>
          </div>
        </TabsContent>

        <TabsContent value="processo" className="space-y-4 bg-white p-6 rounded-xl border border-gray-100">
          {form.processo.map((p, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Passo {p.passo}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeProcesso(i)}><X className="w-4 h-4" /></Button>
              </div>
              <Input value={p.titulo} onChange={(e) => updateProcesso(i, { titulo: e.target.value })} placeholder="Título do passo" />
              <Textarea value={p.descricao} onChange={(e) => updateProcesso(i, { descricao: e.target.value })} placeholder="Descrição" rows={3} />
              <Input value={p.deadline} onChange={(e) => updateProcesso(i, { deadline: e.target.value })} placeholder="Deadline (opcional)" />
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addProcesso}><Plus className="w-4 h-4" /> Adicionar passo</Button>
        </TabsContent>

        <TabsContent value="dicas" className="space-y-4 bg-white p-6 rounded-xl border border-gray-100">
          {form.dicas.map((d, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Dica {i + 1}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeDica(i)}><X className="w-4 h-4" /></Button>
              </div>
              <Input value={d.titulo} onChange={(e) => updateDica(i, { titulo: e.target.value })} placeholder="Título da dica" />
              <Textarea value={d.descricao} onChange={(e) => updateDica(i, { descricao: e.target.value })} placeholder="Descrição" rows={3} />
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addDica}><Plus className="w-4 h-4" /> Adicionar dica</Button>
        </TabsContent>
      </Tabs>
    </form>
  );
}
