import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'OportuniPath — O Teu Caminho para o Mundo', template: '%s | OportuniPath' },
  description: 'Descobre bolsas de estudo internacionais para angolanos. De Licenciatura a Doutoramento, guiamos cada passo da tua candidatura.',
  keywords: ['bolsas de estudo', 'angola', 'estudar no exterior', 'mestrado', 'doutoramento', 'oportunidades'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://opportunipath.ao'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'OportuniPath',
  },
  icons: {
    icon: '/icons/icon.svg',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  openGraph: {
    siteName: 'OportuniPath',
    locale: 'pt_AO',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0D9488',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-path-cream antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
