import { db } from '@/lib/db';
import { translateToPortuguese, detectLanguage } from './translator';
import { normalizeBolsa } from './normalizer';
import { Scholars4DevSource } from './sources/scholars4dev';
import type { ScraperResult, ScraperSource, ScrapedBolsa } from './types';

const sources: ScraperSource[] = [
  new Scholars4DevSource(),
];

async function translateBolsa(bolsa: ScrapedBolsa): Promise<ScrapedBolsa> {
  const textsToTranslate = [
    bolsa.titulo,
    bolsa.descricao ?? '',
    bolsa.universidade ?? '',
    bolsa.valor ?? '',
    bolsa.duracao ?? '',
    ...(bolsa.requisitos ?? []),
    ...(bolsa.documentos ?? []),
  ];

  const translated = await translateToPortuguese(textsToTranslate);

  let idx = 0;
  const translatedBolsa: ScrapedBolsa = {
    ...bolsa,
    titulo: translated[idx++],
    descricao: translated[idx++],
    universidade: translated[idx++],
    valor: translated[idx++],
    duracao: translated[idx++],
    requisitos: bolsa.requisitos ? translated.slice(idx, idx + bolsa.requisitos.length) : undefined,
    documentos: bolsa.documentos ? translated.slice(idx + (bolsa.requisitos?.length ?? 0), idx + (bolsa.requisitos?.length ?? 0) + bolsa.documentos.length) : undefined,
  };

  return translatedBolsa;
}

async function syncSource(source: ScraperSource): Promise<ScraperResult> {
  console.log(`[Scraper] A sincronizar fonte: ${source.nome}`);

  const rawBolsas = await source.scrape();
  console.log(`[Scraper] ${rawBolsas.length} bolsas encontradas em ${source.nome}`);

  const fonte = await db.fonteBolsa.upsert({
    where: { nome: source.nome },
    update: { ultimaSync: new Date() },
    create: { nome: source.nome, urlBase: source.urlBase, ultimaSync: new Date() },
  });

  let novas = 0;
  let atualizadas = 0;
  let falhas = 0;

  for (const raw of rawBolsas) {
    try {
      // Detecta idioma original (amostra do título + descrição)
      const sample = `${raw.titulo} ${raw.descricao ?? ''}`.slice(0, 200);
      raw.idiomaOriginal = await detectLanguage(sample);

      // Traduz se não estiver já em português
      const bolsaToNormalize = raw.idiomaOriginal.startsWith('pt')
        ? raw
        : await translateBolsa(raw);

      const normalized = normalizeBolsa(bolsaToNormalize);

      const existing = normalized.urlOriginal
        ? await db.bolsa.findFirst({ where: { urlOriginal: normalized.urlOriginal } })
        : null;

      if (existing) {
        await db.bolsa.update({
          where: { id: existing.id },
          data: {
            titulo: normalized.titulo,
            descricao: normalized.descricao,
            prazo: normalized.prazo,
            status: normalized.status,
            valor: normalized.valor,
            duracao: normalized.duracao,
            sincronizadoEm: new Date(),
          },
        });
        atualizadas++;
      } else {
        await db.bolsa.create({
          data: {
            slug: normalized.slug,
            titulo: normalized.titulo,
            universidade: normalized.universidade,
            pais: normalized.pais,
            paisCode: normalized.paisCode,
            bandeira: normalized.bandeira,
            nivel: normalized.nivel,
            area: normalized.area,
            tipo: normalized.tipo,
            prazo: normalized.prazo,
            dataAbertura: normalized.dataAbertura,
            duracao: normalized.duracao,
            valor: normalized.valor,
            descricao: normalized.descricao,
            requisitos: normalized.requisitos,
            documentos: normalized.documentos,
            linkOficial: normalized.linkOficial,
            status: normalized.status,
            destaque: false,
            fonteId: fonte.id,
            urlOriginal: normalized.urlOriginal,
            importadoEm: new Date(),
            idiomaOriginal: normalized.idiomaOriginal,
            sincronizadoEm: new Date(),
          },
        });
        novas++;
      }
    } catch (err) {
      console.error(`[Scraper] Erro ao processar bolsa ${raw.titulo}:`, err);
      falhas++;
    }
  }

  return {
    fonte: source.nome,
    total: rawBolsas.length,
    novas,
    atualizadas,
    falhas,
  };
}

export async function runScraper(): Promise<ScraperResult[]> {
  const results: ScraperResult[] = [];

  for (const source of sources) {
    try {
      const result = await syncSource(source);
      results.push(result);
    } catch (err) {
      console.error(`[Scraper] Fonte ${source.nome} falhou:`, err);
      results.push({ fonte: source.nome, total: 0, novas: 0, atualizadas: 0, falhas: 1 });
    }
  }

  return results;
}

export { sources };
