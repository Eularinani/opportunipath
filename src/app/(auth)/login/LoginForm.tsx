'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });
      if (res?.error) {
        toast.error('Email ou password incorretos.');
      } else {
        toast.success('Bem-vindo(a) de volta!');
        router.push(callbackUrl);
        router.refresh();
      }
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
          <h1 className="font-poppins font-bold text-2xl text-path-navy">Entrar na conta</h1>
          <p className="text-path-slate text-sm mt-1">Bem-vindo(a) de volta!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-path-navy mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="o.teu@email.com"
                className="w-full border border-path-cream rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-path-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-path-navy mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="A tua password"
                  className="w-full border border-path-cream rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-path-teal pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-path-slate"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-path-teal text-white font-inter font-semibold py-3 rounded-lg hover:bg-path-teal-dark transition-colors disabled:opacity-60"
            >
              {loading ? 'A entrar...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-path-slate mt-6">
            Ainda não tens conta?{' '}
            <Link href="/register" className="text-path-teal font-medium hover:underline">
              Regista-te
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
