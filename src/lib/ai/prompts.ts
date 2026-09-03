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
    ? `4. Contenido (HTML): estructurado con <p>, de hasta ${maxParagraphs} párrafos
       de desarrollo (no cuentan <h2>/<h3>/<blockquote> si hacen falta). No
       uses <script>, estilos inline ni clases CSS.`
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

export async function transformArticle(
  rawText: string,
  categoryNames: string[],
  apiKey: string,
  opts: { maxParagraphs?: number } = {}
): Promise<AiResult> {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: `Borrador original:\n"""${rawText}"""`,
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
