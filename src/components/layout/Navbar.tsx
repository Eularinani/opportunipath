'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { label: 'Início', href: '/' },
  { label: 'Bolsas', href: '/bolsas' },
  { label: 'Documentos', href: '/documentos' },
  { label: 'Guias', href: '/guias' },
  { label: 'Sobre', href: '/sobre' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const isTransparent = isHome && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-18 transition-all duration-300 ${
        isTransparent ? 'bg-transparent' : 'bg-path-white/95 backdrop-blur-md shadow-soft'
      }`}
    >
      <div className="container-ango h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            isTransparent ? 'bg-path-teal' : 'bg-path-teal/10'
          }`}>
            <Compass className={`w-5 h-5 transition-colors ${isTransparent ? 'text-white' : 'text-path-teal'}`} />
          </div>
          <span className={`font-poppins font-bold text-xl tracking-tight ${isTransparent ? 'text-white' : 'text-path-navy'}`}>
            Oportuni<span className="text-path-teal">Path</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-full font-inter font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-path-teal text-white shadow-sm'
                    : isTransparent
                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                    : 'text-path-slate hover:text-path-navy hover:bg-path-cream'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/bolsas"
          className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full font-inter font-semibold text-sm bg-path-teal text-white hover:bg-path-teal-dark transition-all shadow-soft hover:shadow-md"
        >
          Explorar Bolsas
        </Link>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button className={`p-2 rounded-lg transition-colors ${isTransparent ? 'text-white' : 'text-path-navy hover:bg-path-cream'}`}>
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-80 bg-path-navy border-none p-0">
            <div className="flex flex-col h-full p-8">
              <div className="flex items-center justify-between mb-12">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-path-teal flex items-center justify-center">
                    <Compass className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-poppins font-bold text-xl text-white">
                    Oportuni<span className="text-path-teal">Path</span>
                  </span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-xl font-inter font-medium text-base transition-colors ${
                      pathname === link.href ? 'bg-path-teal text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto pt-8">
                <Link
                  href="/bolsas"
                  className="flex items-center justify-center w-full px-5 py-3 rounded-xl font-inter font-semibold text-sm bg-path-teal text-white hover:bg-path-teal-dark transition-colors"
                >
                  Explorar Bolsas
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
