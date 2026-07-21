'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  variant?: 'hero' | 'inline';
  className?: string;
  defaultValue?: string;
}

export default function SearchBar({ variant = 'inline', className, defaultValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/bolsas?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/bolsas');
    }
  }

  if (variant === 'hero') {
    return (
      <form
        onSubmit={handleSubmit}
        className={cn(
          'flex items-center bg-white rounded-2xl shadow-search overflow-hidden focus-within:shadow-search-focus ring-1 ring-path-cream focus-within:ring-path-teal/30',
          className
        )}
      >
        <div className="flex-1 flex items-center gap-3 px-5 py-3.5">
          <Search className="w-5 h-5 text-path-slate shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisa por país, área ou universidade..."
            className="flex-1 text-path-navy placeholder:text-path-slate text-base focus:outline-none bg-transparent"
          />
        </div>
        <button
          type="submit"
          className="bg-path-teal text-white font-inter font-semibold text-sm px-7 py-4 hover:bg-path-teal-dark transition-colors shrink-0"
        >
          Pesquisar
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-path-slate" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Pesquisar bolsas..."
        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-path-cream text-sm focus:outline-none focus:border-path-teal focus:shadow-search-focus bg-white"
      />
    </form>
  );
}
