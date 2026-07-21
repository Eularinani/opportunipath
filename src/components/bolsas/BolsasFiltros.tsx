'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

const niveis = ['Licenciatura', 'Mestrado', 'Doutoramento', 'Pós-Doutoramento', 'Curso Técnico', 'Curso de Línguas'];
const areas = ['Engenharia', 'Ciências da Saúde', 'Tecnologia', 'Ciências Sociais', 'Artes', 'Negócios', 'Línguas'];
const tipos = [
  { value: 'TOTAL', label: 'Bolsa Total' },
  { value: 'PARCIAL', label: 'Bolsa Parcial' },
  { value: 'PESQUISA', label: 'Pesquisa' },
  { value: 'INTERCAMBIO', label: 'Intercâmbio & Línguas' },
];
const statusOpts = [
  { value: 'ABERTA', label: 'Abertas' },
  { value: 'URGENTE', label: 'Urgentes' },
  { value: 'EM_BREVE', label: 'A Abrir em Breve' },
];
const ordenacao = [
  { value: 'prazo', label: 'Prazo (próximo)' },
  { value: 'createdAt', label: 'Mais recentes' },
  { value: 'visualizacoes', label: 'Mais vistas' },
];

export default function BolsasFiltros() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = useCallback(
    (key: string, value: string, multi = false) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');

      if (multi) {
        const existing = params.getAll(key);
        if (existing.includes(value)) {
          const updated = existing.filter((v) => v !== value);
          params.delete(key);
          updated.forEach((v) => params.append(key, v));
        } else {
          params.append(key, value);
        }
      } else {
        if (params.get(key) === value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clear = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  function isChecked(key: string, value: string) {
    return searchParams.getAll(key).includes(value);
  }

  return (
    <div className="bg-white rounded-xl border border-path-cream p-6 space-y-6 sticky top-20">
      <div className="flex items-center justify-between">
        <h3 className="font-poppins font-semibold text-path-navy">Filtros</h3>
        <button onClick={clear} className="text-xs text-path-teal hover:underline">Limpar</button>
      </div>

      <div>
        <p className="text-xs font-semibold text-path-slate uppercase tracking-wide mb-3">Ordenar por</p>
        {ordenacao.map((o) => (
          <label key={o.value} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
            <input
              type="radio"
              name="orderBy"
              checked={(searchParams.get('orderBy') ?? 'prazo') === o.value}
              onChange={() => update('orderBy', o.value)}
              className="accent-path-teal"
            />
            <span className="text-sm text-path-slate-dark">{o.label}</span>
          </label>
        ))}
      </div>

      <div>
        <p className="text-xs font-semibold text-path-slate uppercase tracking-wide mb-3">Estado</p>
        {statusOpts.map((s) => (
          <label key={s.value} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked('status', s.value)}
              onChange={() => update('status', s.value, true)}
              className="accent-path-teal rounded"
            />
            <span className="text-sm text-path-slate-dark">{s.label}</span>
          </label>
        ))}
      </div>

      <div>
        <p className="text-xs font-semibold text-path-slate uppercase tracking-wide mb-3">Nível</p>
        {niveis.map((n) => (
          <label key={n} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked('nivel', n)}
              onChange={() => update('nivel', n, true)}
              className="accent-path-teal rounded"
            />
            <span className="text-sm text-path-slate-dark">{n}</span>
          </label>
        ))}
      </div>

      <div>
        <p className="text-xs font-semibold text-path-slate uppercase tracking-wide mb-3">Tipo</p>
        {tipos.map((t) => (
          <label key={t.value} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked('tipo', t.value)}
              onChange={() => update('tipo', t.value, true)}
              className="accent-path-teal rounded"
            />
            <span className="text-sm text-path-slate-dark">{t.label}</span>
          </label>
        ))}
      </div>

      <div>
        <p className="text-xs font-semibold text-path-slate uppercase tracking-wide mb-3">Área</p>
        {areas.map((a) => (
          <label key={a} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked('area', a)}
              onChange={() => update('area', a, true)}
              className="accent-path-teal rounded"
            />
            <span className="text-sm text-path-slate-dark">{a}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
