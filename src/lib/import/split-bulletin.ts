// Alfredo separa cada noticia del boletín semanal con una línea que es
// únicamente el caracter "7" repetido (ej. "7777777777777777777777777").
// La cantidad de noticias por semana varía — no hay que asumir un número
// fijo, solo partir por esa marca y descartar bloques vacíos o de ruido.
const DELIMITER = /^7{5,}\s*$/m;
const MIN_BLOCK_LENGTH = 30;

export function splitBulletin(rawText: string): string[] {
  return rawText
    .split(DELIMITER)
    .map((block) => block.trim())
    .filter((block) => block.length >= MIN_BLOCK_LENGTH);
}
