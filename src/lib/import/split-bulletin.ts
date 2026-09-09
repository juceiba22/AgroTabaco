export type ParsedBulletinBlock = {
  rawText: string;
  coverImage: string | null;
};

// Alfredo separa cada noticia del boletín semanal con una línea que es
// únicamente el caracter "7" repetido (ej. "7777777777777777777777777").
// La cantidad de noticias por semana varía — no hay que asumir un número
// fijo, solo partir por esa marca y descartar bloques vacíos o de ruido.
const DELIMITER_HTML = /(?:<p[^>]*>)?\s*7{5,}\s*(?:<\/p>)?/i;
const DELIMITER_TEXT = /^7{5,}\s*$/m;
const MIN_BLOCK_LENGTH = 30;

function stripHtml(html: string): string {
  return html
    .replace(/<img[^>]*>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();
}

export function splitBulletinFromHtml(html: string): ParsedBulletinBlock[] {
  // Dividir el HTML por el delimitador de 7777...
  const chunks = html.split(DELIMITER_HTML);

  const results: ParsedBulletinBlock[] = [];

  for (const chunk of chunks) {
    const trimmedChunk = chunk.trim();
    if (!trimmedChunk) continue;

    // Buscar imagen embebida (data URL)
    const imgMatch = trimmedChunk.match(/<img[^>]+src=["'](data:[^"']+)["'][^>]*>/i);
    const coverImage = imgMatch ? imgMatch[1] : null;

    const rawText = stripHtml(trimmedChunk);
    if (rawText.length >= MIN_BLOCK_LENGTH) {
      results.push({
        rawText,
        coverImage,
      });
    }
  }

  // Si no se dividió en bloques pero hay texto suficiente
  if (results.length === 0) {
    const rawText = stripHtml(html);
    if (rawText.length >= MIN_BLOCK_LENGTH) {
      const imgMatch = html.match(/<img[^>]+src=["'](data:[^"']+)["'][^>]*>/i);
      results.push({
        rawText,
        coverImage: imgMatch ? imgMatch[1] : null,
      });
    }
  }

  return results;
}

export function splitBulletin(rawText: string): string[] {
  return rawText
    .split(DELIMITER_TEXT)
    .map((block) => block.trim())
    .filter((block) => block.length >= MIN_BLOCK_LENGTH);
}

