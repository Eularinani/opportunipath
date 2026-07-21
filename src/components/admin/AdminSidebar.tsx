'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, LayoutDashboard, BookOpen, FileText, Users, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/bolsas', icon: GraduationCap, label: 'Bolsas' },
  { href: '/admin/guias', icon: BookOpen, label: 'Guias' },
  { href: '/admin/utilizadores', icon: Users, label: 'Utilizadores' },
  { href: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
  { href: '/admin/contactos', icon: FileText, label: 'Contactos' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside className="w-60 bg-path-navy text-white flex flex-col shrink-0">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-path-amber" />
          <span className="font-poppins font-bold text-lg">
            Oportuni<span className="text-path-teal">Path</span>
          </span>
        </Link>
        <p className="text-white/40 text-xs mt-1 ml-8">Admin</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, icon: Icon, label, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
              isActive(href, exact)
                ? 'bg-path-teal text-white font-medium'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
          <span>←</span>
          Voltar ao site
        </Link>
      </div>
    </aside>
  );
}
