'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { toast } from 'sonner';

const navLinks = [
  { label: 'Início', href: '/' },
  { label: 'Bolsas', href: '/bolsas' },
  { label: 'Documentos', href: '/documentos' },
  { label: 'Guias', href: '/guias' },
  { label: 'Sobre', href: '/sobre' },
];

const recursosLinks = [
  { label: 'Checklist de Documentos', href: '/documentos' },
  { label: 'Modelo de Carta de Motivação', href: '/guias' },
  { label: 'Dicas de Entrevista', href: '/guias' },
  { label: 'Perguntas Frequentes', href: '/sobre' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message ?? 'Subscrito com sucesso!');
        setEmail('');
      } else {
        toast.error(data.error ?? 'Erro ao subscrever.');
      }
    } catch {
      toast.error('Erro de ligação. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="bg-path-navy pt-20 pb-10">
      <div className="container-ango">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-path-teal flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="font-poppins font-bold text-xl text-white">
                Oportuni<span className="text-path-teal">Path</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-[280px]">
              Conectamos talento angolano a oportunidades de estudo no mundo inteiro. O teu caminho começa aqui.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-white/50 hover:text-path-teal transition-colors text-sm">Facebook</a>
              <a href="#" className="text-white/50 hover:text-path-teal transition-colors text-sm">Instagram</a>
              <a href="#" className="text-white/50 hover:text-path-teal transition-colors text-sm">WhatsApp</a>
            </div>
          </div>

          <div>
            <h4 className="font-poppins font-semibold text-sm text-white mb-4">Navegação</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-path-teal transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-poppins font-semibold text-sm text-white mb-4">Recursos</h4>
            <ul className="space-y-3">
              {recursosLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/60 hover:text-path-teal transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-poppins font-semibold text-sm text-white mb-4">Fica Atualizado</h4>
            <p className="text-white/60 text-sm mb-4">Recebe alertas de novas bolsas e prazos no teu email.</p>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="o.teu@email.com"
                required
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-path-teal focus:ring-1 focus:ring-path-teal/30"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-path-teal text-white font-inter font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-path-teal-dark transition-colors shrink-0 disabled:opacity-60"
              >
                {loading ? '...' : 'Subscrever'}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">&copy; 2025 OportuniPath. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 text-white/40 text-xs">
            <a href="#" className="hover:text-path-teal transition-colors">Termos de Uso</a>
            <span>|</span>
            <a href="#" className="hover:text-path-teal transition-colors">Política de Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
