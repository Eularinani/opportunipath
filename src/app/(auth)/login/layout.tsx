import type { Metadata } from 'next';

// Login só para administradores: não indexar nos motores de busca
export const metadata: Metadata = {
  title: 'Administração',
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
