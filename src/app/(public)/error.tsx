'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function PublicError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <h1 className="font-poppins font-bold text-3xl text-path-navy mb-3">Algo correu mal</h1>
        <p className="text-path-slate mb-6">Ocorreu um erro ao carregar esta página. Tenta novamente.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-path-teal text-white rounded-lg text-sm font-medium hover:bg-path-teal-dark transition-colors"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 border border-gray-200 text-path-navy rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Ir para início
          </Link>
        </div>
      </div>
    </div>
  );
}
