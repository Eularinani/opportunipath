interface TranslateResponse {
  data: {
    translations: { translatedText: string }[];
  };
}

export async function translateToPortuguese(texts: string[]): Promise<string[]> {
  const apiKey = process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY;
  if (!apiKey) {
    console.warn('[Translator] GOOGLE_CLOUD_TRANSLATE_API_KEY não configurada. Devolvendo textos originais.');
    return texts;
  }

  if (texts.length === 0) return [];

  // Filtra textos vazios para evitar chamadas desnecessárias
  const nonEmpty = texts.map((t) => (t ?? '').trim()).filter((t) => t.length > 0);
  if (nonEmpty.length === 0) return texts;

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: nonEmpty,
          target: 'pt',
          format: 'text',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google Translate API error: ${response.status} ${error}`);
    }

    const data = (await response.json()) as TranslateResponse;
    const translated = data.data.translations.map((t) => t.translatedText);

    // Reinsere textos vazios nas posições originais
    const result: string[] = [];
    let translatedIndex = 0;
    for (const text of texts) {
      const trimmed = (text ?? '').trim();
      if (trimmed.length === 0) {
        result.push(text ?? '');
      } else {
        result.push(translated[translatedIndex++] ?? trimmed);
      }
    }
    return result;
  } catch (err) {
    console.error('[Translator] Erro ao traduzir:', err);
    return texts;
  }
}

export async function detectLanguage(text: string): Promise<string> {
  const apiKey = process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY;
  if (!apiKey) return 'en';

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2/detect?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text }),
      }
    );

    if (!response.ok) return 'en';

    const data = (await response.json()) as { data: { detections: { language: string }[][] } };
    return data.data.detections[0]?.[0]?.language ?? 'en';
  } catch {
    return 'en';
  }
}
