'use client';

import { useEffect } from 'react';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="font-poppins font-bold text-3xl text-gray-900 mb-3">Erro no painel</h1>
        <p className="text-gray-500 mb-6">Ocorreu um erro ao carregar esta página. Tenta novamente.</p>
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-path-teal text-white rounded-lg text-sm font-medium hover:bg-path-teal-dark transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
