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
  // Las imágenes vienen embebidas como data URL en base64 (cientos de KB), y
  // esa cadena puede contener "77777" por casualidad: si se corta el HTML con
  // las imágenes adentro, el delimitador parte una foto al medio y aparecen
  // "noticias" de basura. Por eso se sacan a una lista antes de cortar y se
  // reponen después en el bloque al que pertenecen.
  const images: string[] = [];
  const lightHtml = html.replace(/<img[^>]+src=["'](data:[^"']+)["'][^>]*>/gi, (_m, src: string) => {
    images.push(src);
    return `<img data-idx="${images.length - 1}">`;
  });

  const chunks = lightHtml.split(DELIMITER_HTML);

  const results: ParsedBulletinBlock[] = [];

  for (const chunk of chunks) {
    const trimmedChunk = chunk.trim();
    if (!trimmedChunk) continue;

    const rawText = stripHtml(trimmedChunk);
    if (rawText.length < MIN_BLOCK_LENGTH) continue;

    const imgMatch = trimmedChunk.match(/<img data-idx="(\d+)">/);
    results.push({
      rawText,
      coverImage: imgMatch ? images[Number(imgMatch[1])] : null,
    });
  }

  return results;
}

export function splitBulletin(rawText: string): string[] {
  return rawText
    .split(DELIMITER_TEXT)
    .map((block) => block.trim())
    .filter((block) => block.length >= MIN_BLOCK_LENGTH);
}

