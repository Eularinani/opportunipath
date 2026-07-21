'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Mail, Send } from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    <section className="py-20 gradient-cta">
      <div className="container-ango text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Mail className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm font-medium">Newsletter semanal</span>
          </div>
          <h2 className="font-poppins font-bold text-2xl md:text-4xl text-white mb-3">
            Não Percas Nenhuma Oportunidade
          </h2>
          <p className="text-white/80 text-base max-w-[540px] mx-auto mb-8">
            Subscreve e recebe alertas semanais de novas bolsas, prazos a aproximar e dicas exclusivas para angolanos.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-[520px] mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="O teu email"
              required
              className="flex-1 w-full bg-white/15 border border-white/30 rounded-xl px-4 py-3.5 text-white placeholder:text-white/50 focus:outline-none focus:border-white focus:bg-white/20"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-white text-path-teal font-inter font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-path-teal-light transition-colors shrink-0 disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'A subscrever...' : 'Subscrever'}
            </button>
          </form>
          <p className="text-white/50 text-xs mt-4">
            Prometemos não enviar spam. Podes cancelar a qualquer momento.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
