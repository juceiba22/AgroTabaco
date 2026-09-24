import Anthropic from "@anthropic-ai/sdk";

export type AiResult = {
  title: string;
  summary: string;
  category: string;
  contentHtml: string;
  socialCopy: string;
};

// Prompt editorial compartido entre /api/ai/transform (un artículo pegado a
// mano) y /api/ai/import-bulletin (el boletín semanal de Alfredo, un bloque
// por noticia). El único parámetro que varía entre ambos es el tope de
// párrafos: el boletín semanal necesita copys cortos (hasta 3 párrafos),
// mientras que pegar una noticia suelta no tiene ese límite.
export function buildEditorialPrompt(
  categoryNames: string[],
  { maxParagraphs }: { maxParagraphs?: number } = {}
): string {
  const contentRule = maxParagraphs
    ? `4. Contenido (HTML): EXACTAMENTE ${maxParagraphs} párrafos <p>, cortos y
       sintéticos (entre 40 y 70 palabras cada uno). Primero lo más importante
       (qué pasó, quién, cuándo/dónde), luego contexto y datos clave, y el
       último párrafo cierra con el dato o la consecuencia más relevante. No
       agregues subtítulos, listas, citas ni más párrafos: solo ${maxParagraphs}
       etiquetas <p>. No uses <script>, estilos inline ni clases CSS.`
    : `4. Contenido (HTML): estructurado con <p>, subtítulos <h2>/<h3> si
       corresponde, <ul>/<li> si aplica y <blockquote> para citas textuales.
       No uses <script>, estilos inline ni clases CSS.`;

  return `
    Sos el editor periodístico jefe de "AgroTabaco", un portal de noticias del
    agro, la ganadería, el tabaco y las economías regionales.

    Tu tarea es transformar un borrador o noticia en bruto en un artículo
    periodístico final, listo para publicar.

    Criterios editoriales:
    1. Título: directo, periodístico y atractivo (máximo 90 caracteres).
    2. Categoría: elegí estrictamente una de estas opciones, tal como están
       escritas: ${categoryNames.join(", ")}.
    3. Copete/resumen: 2 o 3 oraciones claras con lo esencial de la noticia.
    ${contentRule}
    5. Copy para redes: texto para Instagram/Facebook con tono profesional,
       emojis moderados y 4-5 hashtags relevantes.

    Redactá siempre en español, con tono de prensa profesional, sin inventar
    datos que no estén en el borrador original.
  `;
}

// Modelo barato y rápido: la reescritura editorial corta no necesita más.
// Se puede cambiar sin tocar código con ANTHROPIC_MODEL (ej. claude-sonnet-5).
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";

function countParagraphs(html: string): number {
  return (html.match(/<p[\s>]/gi) ?? []).length;
}

async function generate(
  client: Anthropic,
  rawText: string,
  categoryNames: string[],
  opts: { maxParagraphs?: number },
  correction?: string
): Promise<AiResult> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: buildEditorialPrompt(categoryNames, opts),
    messages: [
      {
        role: "user",
        content: `Borrador original:\n"""${rawText}"""${correction ? `\n\n${correction}` : ""}`,
      },
    ],
    // Salida estructurada: el JSON siempre cumple este esquema.
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            summary: { type: "string" },
            category: { type: "string", enum: categoryNames },
            contentHtml: { type: "string" },
            socialCopy: { type: "string" },
          },
          required: ["title", "summary", "category", "contentHtml", "socialCopy"],
          additionalProperties: false,
        },
      },
    },
  });

  if (response.stop_reason === "max_tokens") {
    throw new Error("La respuesta de la IA se cortó por longitud. Probá de nuevo.");
  }

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("La IA no devolvió texto.");
  }
  return JSON.parse(textBlock.text) as AiResult;
}

function friendlyError(error: unknown): Error {
  if (error instanceof Anthropic.AuthenticationError) {
    return new Error("La ANTHROPIC_API_KEY del servidor no es válida.");
  }
  if (error instanceof Anthropic.BadRequestError && /credit balance/i.test(error.message)) {
    return new Error("Se agotó el crédito de la cuenta de Anthropic: cargá saldo en console.anthropic.com.");
  }
  if (error instanceof Anthropic.RateLimitError) {
    return new Error("Límite de uso de Anthropic alcanzado (429). Esperá un momento y reintentá.");
  }
  return error instanceof Error ? error : new Error(String(error));
}

// El SDK ya reintenta solo ante 429/5xx/errores de red (maxRetries). Con tope
// de párrafos, además se valida el resultado y se pide una corrección si el
// modelo se pasó (o se quedó corto).
export async function transformArticle(
  rawText: string,
  categoryNames: string[],
  apiKey: string,
  opts: { maxParagraphs?: number } = {}
): Promise<AiResult> {
  const client = new Anthropic({ apiKey, maxRetries: 4 });

  try {
    let result = await generate(client, rawText, categoryNames, opts);

    const max = opts.maxParagraphs;
    if (max) {
      const found = countParagraphs(result.contentHtml);
      if (found !== max) {
        try {
          const retry = await generate(
            client,
            rawText,
            categoryNames,
            opts,
            `Tu respuesta anterior tenía ${found} párrafos. Reescribila con EXACTAMENTE ${max} párrafos <p> cortos (40 a 70 palabras cada uno).`
          );
          if (countParagraphs(retry.contentHtml) === max) result = retry;
        } catch {
          // Nos quedamos con el primer resultado válido.
        }
      }
    }

    return result;
  } catch (error) {
    throw friendlyError(error);
  }
}
