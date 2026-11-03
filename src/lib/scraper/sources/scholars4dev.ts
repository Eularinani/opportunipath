import { XMLParser } from 'fast-xml-parser';
import type { ScrapedBolsa, ScraperSource } from '../types';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

interface RssItem {
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
  'content:encoded'?: string;
}

interface RssChannel {
  item?: RssItem | RssItem[];
}

interface RssFeed {
  rss?: {
    channel?: RssChannel;
  };
}

async function fetchXml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'application/rss+xml, application/xml, text/xml',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }

  return res.text();
}

function parseDeadline(text?: string): Date | null {
  if (!text) return null;

  const patterns = [
    /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i,
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})[a-z]*,?\s+(\d{4})/i,
    /(\d{4})-(\d{2})-(\d{2})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const parsed = new Date(match[0]);
      if (!isNaN(parsed.getTime())) return parsed;
    }
  }

  return null;
}

const ENTIDADES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&([a-z]+);/gi, (m, nome) => ENTIDADES[nome.toLowerCase()] ?? m);
}

function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
  ).trim();
}

export class Scholars4DevSource implements ScraperSource {
  nome = 'Scholars4Dev';
  urlBase = 'https://www.scholars4dev.com';

  private feeds = [
    'https://www.scholars4dev.com/category/level-of-study/masters-scholarships/feed/',
    'https://www.scholars4dev.com/category/level-of-study/undergraduate-scholarships/feed/',
    'https://www.scholars4dev.com/category/level-of-study/phd-scholarships/feed/',
  ];

  async scrape(): Promise<ScrapedBolsa[]> {
    const bolsas: ScrapedBolsa[] = [];

    for (const feedUrl of this.feeds) {
      try {
        const xml = await fetchXml(feedUrl);
        const parser = new XMLParser({ ignoreAttributes: false });
        const parsed = parser.parse(xml) as RssFeed;
        const items = parsed.rss?.channel?.item;

        if (!items) continue;

        const arrayItems = Array.isArray(items) ? items : [items];

        for (const item of arrayItems.slice(0, 10)) {
          const bolsa = this.parseItem(item);
          if (bolsa) bolsas.push(bolsa);
        }
      } catch (err) {
        console.error(`[Scholars4Dev] Erro ao processar feed ${feedUrl}:`, err);
      }
    }

    return bolsas;
  }

  private parseItem(item: RssItem): ScrapedBolsa | null {
    const titulo = item.title ? decodeEntities(item.title).trim() : undefined;
    const link = item.link?.trim();

    if (!titulo || !link || titulo.length < 5) return null;

    const content = item['content:encoded'] ?? item.description ?? '';
    const text = stripHtml(content);

    const deadlineText = text.match(/(deadline|closes?|applications? close|due).{0,60}(\d{1,2}\s+[A-Za-z]{3,}\s+\d{4}|\d{4}-\d{2}-\d{2}|[A-Za-z]{3,}\s+\d{1,2}(st|nd|rd|th)?,?\s+\d{4})/i)?.[0];
    // Só aceita uma data que apareça junto a "deadline"/"closes" — qualquer outra data
    // no texto (publicação, início do curso…) não é o prazo.
    const prazo = parseDeadline(deadlineText);

    const paisMatch = text.match(/(?:study\s+in|country|location)\s*:?\s*([A-Za-z\s]{3,40})(?:\n|\.|,|\(|;)/i);
    const pais = paisMatch?.[1]?.trim();

    const descricao = text.length > 30 ? text.slice(0, 800) : titulo;

    return {
      titulo,
      // O link é do artigo no agregador, não da instituição; o normalizer deixa linkOficial vazio
      linkOficial: link,
      urlOriginal: link,
      idiomaOriginal: 'en',
      pais: pais && pais.length < 40 ? pais : undefined,
      prazo,
      descricao,
    };
  }
}
