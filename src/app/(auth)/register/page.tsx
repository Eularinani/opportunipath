'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  function update(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Erro ao registar.');
        return;
      }
      // Auto-login after register
      await signIn('credentials', { email: form.email, password: form.password, redirect: false });
      toast.success('Conta criada com sucesso!');
      router.push('/');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-path-cream px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <GraduationCap className="w-7 h-7 text-path-amber" />
            <span className="font-poppins font-bold text-2xl text-path-navy">
              Oportuni<span className="text-path-teal">Path</span>
            </span>
          </Link>
          <h1 className="font-poppins font-bold text-2xl text-path-navy">Criar conta</h1>
          <p className="text-path-slate text-sm mt-1">Começa a tua jornada hoje</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-path-navy mb-1.5">Nome completo</label>
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                required
                placeholder="O teu nome"
                className="w-full border border-path-cream rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-path-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-path-navy mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                required
                placeholder="o.teu@email.com"
                className="w-full border border-path-cream rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-path-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-path-navy mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={update('password')}
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                className="w-full border border-path-cream rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-path-teal"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-path-teal text-white font-inter font-semibold py-3 rounded-lg hover:bg-path-teal-dark transition-colors disabled:opacity-60"
            >
              {loading ? 'A criar conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-sm text-path-slate mt-6">
            Já tens conta?{' '}
            <Link href="/login" className="text-path-teal font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
