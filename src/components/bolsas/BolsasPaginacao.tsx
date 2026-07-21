'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface Props {
  currentPage: number;
  totalPages: number;
  total: number;
}

export default function BolsasPaginacao({ currentPage, totalPages, total }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2);

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-path-slate">
        Página {currentPage} de {totalPages} ({total} bolsas)
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg text-sm border border-path-cream hover:border-path-teal hover:text-path-teal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ←
        </button>
        {visible.map((page, i) => {
          const prev = visible[i - 1];
          const showEllipsis = prev && page - prev > 1;
          return (
            <span key={page} className="flex items-center gap-1">
              {showEllipsis && <span className="px-2 text-path-slate text-sm">...</span>}
              <button
                onClick={() => goTo(page)}
                className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                  page === currentPage
                    ? 'bg-path-teal text-white font-semibold'
                    : 'border border-path-cream hover:border-path-teal hover:text-path-teal'
                }`}
              >
                {page}
              </button>
            </span>
          );
        })}
        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-lg text-sm border border-path-cream hover:border-path-teal hover:text-path-teal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>
    </div>
  );
}
