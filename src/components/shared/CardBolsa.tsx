import Link from 'next/link';
import { Calendar, GraduationCap, BookOpen, Sparkles, BellRing, FlaskConical, Languages, Wallet } from 'lucide-react';
import {
  cn,
  getPrazoColor,
  getPrazoLabel,
  getAberturaLabel,
  tipoBolsaLabel,
  tipoBolsaColor,
} from '@/lib/utils';
import type { Bolsa } from '@prisma/client';

interface CardBolsaProps {
  bolsa: Bolsa;
  variant?: 'default' | 'destaque' | 'compacto';
  className?: string;
}

const tipoIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  TOTAL: GraduationCap,
  PARCIAL: Wallet,
  PESQUISA: FlaskConical,
  INTERCAMBIO: Languages,
};

function TipoIcon({ tipo, className }: { tipo: string; className?: string }) {
  const Icon = tipoIcons[tipo] ?? GraduationCap;
  return <Icon className={className} />;
}

function StatusRibbon({ bolsa }: { bolsa: Bolsa }) {
  if (bolsa.status === 'EM_BREVE') {
    const label = getAberturaLabel(bolsa.dataAbertura);
    return (
      <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-path-blue text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-sm">
        <BellRing className="w-3 h-3" />
        {label ?? 'Abre em Breve'}
      </span>
    );
  }
  if (bolsa.status === 'URGENTE') {
    return (
      <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-path-rose text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-sm animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-white" />
        Últimos Dias
      </span>
    );
  }
  if (bolsa.destaque) {
    return (
      <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-path-amber text-white text-[11px] font-medium px-3 py-1.5 rounded-full shadow-sm">
        <Sparkles className="w-3 h-3" />
        Em Destaque
      </span>
    );
  }
  return null;
}

function MetaRow({ bolsa }: { bolsa: Bolsa }) {
  const isEmBreve = bolsa.status === 'EM_BREVE';
  const prazoColor = getPrazoColor(bolsa.prazo);
  const prazoLabel = getPrazoLabel(bolsa.prazo);
  const aberturaLabel = getAberturaLabel(bolsa.dataAbertura);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-path-slate">
      <span className="flex items-center gap-1">
        <GraduationCap className="w-3.5 h-3.5" />
        {bolsa.nivel}
      </span>
      {isEmBreve && aberturaLabel ? (
        <span className="flex items-center gap-1 text-path-blue font-medium">
          <BellRing className="w-3.5 h-3.5" />
          {aberturaLabel}
        </span>
      ) : (
        <span className={cn('flex items-center gap-1 font-medium', prazoColor)}>
          <Calendar className="w-3.5 h-3.5" />
          {prazoLabel}
        </span>
      )}
      <span className="flex items-center gap-1">
        <BookOpen className="w-3.5 h-3.5" />
        {bolsa.area}
      </span>
    </div>
  );
}

export default function CardBolsa({ bolsa, variant = 'default', className }: CardBolsaProps) {
  const tipoLabel = tipoBolsaLabel(bolsa.tipo);
  const tipoColor = tipoBolsaColor(bolsa.tipo);

  if (variant === 'compacto') {
    return (
      <Link
        href={`/bolsa/${bolsa.slug}`}
        className={cn(
          'group block bg-white rounded-xl p-4 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 border border-transparent hover:border-path-teal/20',
          className
        )}
      >
        <h4 className="font-poppins font-semibold text-base text-path-navy line-clamp-2 mb-2 group-hover:text-path-teal transition-colors">
          {bolsa.titulo}
        </h4>
        <MetaRow bolsa={bolsa} />
      </Link>
    );
  }

  return (
    <Link
      href={`/bolsa/${bolsa.slug}`}
      className={cn(
        'group relative block bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-path-cream hover:border-path-teal/20',
        className
      )}
    >
      <div
        className={cn(
          'h-1.5 w-full',
          bolsa.status === 'EM_BREVE'
            ? 'bg-gradient-to-r from-path-blue to-path-blue-light'
            : bolsa.status === 'URGENTE'
            ? 'bg-gradient-to-r from-path-rose to-path-rose-light'
            : 'bg-gradient-gold'
        )}
      />
      <div className="p-6 relative">
        <StatusRibbon bolsa={bolsa} />

        <div className="flex items-center gap-2 mb-3 pr-28">
          <span className="flex items-center gap-1.5 text-xs text-path-slate bg-path-cream px-2.5 py-1 rounded-full">
            <span className="text-base leading-none">{bolsa.bandeira}</span>
            {bolsa.pais}
          </span>
          <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full', tipoColor)}>
            <TipoIcon tipo={bolsa.tipo} className="w-3 h-3" />
            {tipoLabel}
          </span>
        </div>

        <h3 className="font-poppins font-semibold text-lg text-path-navy line-clamp-2 mb-2 group-hover:text-path-teal transition-colors">
          {bolsa.titulo}
        </h3>
        <p className="text-sm text-path-slate flex items-center gap-1.5 mb-4 line-clamp-1">
          <BookOpen className="w-4 h-4 shrink-0" />
          {bolsa.universidade}
        </p>
        <div className="h-px bg-path-cream mb-3" />
        <MetaRow bolsa={bolsa} />
      </div>
    </Link>
  );
}
