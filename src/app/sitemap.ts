import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://opportunipath.ao';

  const [bolsas, guias] = await Promise.all([
    db.bolsa.findMany({ where: { status: { not: 'FECHADA' } }, select: { slug: true, updatedAt: true } }),
    db.guia.findMany({ where: { publicado: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/bolsas`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/guias`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/documentos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const bolsaRoutes: MetadataRoute.Sitemap = bolsas.map((b) => ({
    url: `${baseUrl}/bolsa/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const guiaRoutes: MetadataRoute.Sitemap = guias.map((g) => ({
    url: `${baseUrl}/guias/${g.slug}`,
    lastModified: g.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...bolsaRoutes, ...guiaRoutes];
}
