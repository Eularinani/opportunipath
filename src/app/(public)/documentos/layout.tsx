import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guia de Documentos',
  description: 'Tudo o que precisas saber sobre como preparar e autenticar os teus documentos para candidaturas internacionais.',
};

export default function DocumentosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
