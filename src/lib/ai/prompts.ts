import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";

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

const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash";
const RETRY_DELAYS_MS = [1500, 4000];

function isTransient(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return /(429|500|502|503|504)|UNAVAILABLE|RESOURCE_EXHAUSTED|DEADLINE_EXCEEDED|overloaded|high demand|fetch failed/i.test(
    msg
  );
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function countParagraphs(html: string): number {
  return (html.match(/<p[s>]/gi) ?? []).length;
}

async function generate(
  ai: GoogleGenAI,
  model: string,
  rawText: string,
  categoryNames: string[],
  opts: { maxParagraphs?: number },
  correction?: string
): Promise<AiResult> {
  const response = await ai.models.generateContent({
    model,
    contents: `Borrador original:
"""${rawText}"""${correction ? `

${correction}` : ""}`,
    config: {
      systemInstruction: buildEditorialPrompt(categoryNames, opts),
      // Reescritura editorial simple, no requiere razonamiento profundo — el
      // nivel de thinking por default de gemini-3.6-flash es la causa
      // principal de la lentitud reportada en el autocompletado.
      thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          category: { type: Type.STRING, enum: categoryNames },
          contentHtml: { type: Type.STRING },
          socialCopy: { type: Type.STRING },
        },
        required: ["title", "summary", "category", "contentHtml", "socialCopy"],
      },
    },
  });

  return JSON.parse(response.text ?? "{}") as AiResult;
}

// Gemini responde 503 "high demand" en picos: se reintenta con espera y, si el
// modelo principal sigue saturado, se cae al modelo de respaldo. Con tope de
// párrafos, además se valida el resultado y se pide una corrección si el
// modelo se pasó (o se quedó corto).
export async function transformArticle(
  rawText: string,
  categoryNames: string[],
  apiKey: string,
  opts: { maxParagraphs?: number } = {}
): Promise<AiResult> {
  const ai = new GoogleGenAI({ apiKey });
  const models = [PRIMARY_MODEL, ...RETRY_DELAYS_MS.map(() => PRIMARY_MODEL), FALLBACK_MODEL];

  async function run(correction?: string): Promise<AiResult> {
    let lastError: unknown;
    for (let attempt = 0; attempt < models.length; attempt++) {
      try {
        return await generate(ai, models[attempt], rawText, categoryNames, opts, correction);
      } catch (error) {
        lastError = error;
        if (!isTransient(error)) throw error;
        const delay = RETRY_DELAYS_MS[attempt];
        if (delay) await sleep(delay);
      }
    }
    throw lastError;
  }

  let result = await run();

  const max = opts.maxParagraphs;
  if (max) {
    const found = countParagraphs(result.contentHtml);
    if (found !== max) {
      try {
        const retry = await run(
          `Tu respuesta anterior tenía ${found} párrafos. Reescribila con EXACTAMENTE ${max} párrafos <p> cortos (40 a 70 palabras cada uno).`
        );
        if (countParagraphs(retry.contentHtml) === max) result = retry;
      } catch {
        // Nos quedamos con el primer resultado válido.
      }
    }
  }

  return result;
}
