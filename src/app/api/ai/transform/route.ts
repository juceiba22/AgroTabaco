import { NextResponse } from "next/server";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/data";

// Convierte un borrador en bruto en un artículo listo para publicar, usando
// Gemini con salida estructurada. Solo accesible para usuarios logueados
// (evita gasto de API por visitantes anónimos).
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta configurar GEMINI_API_KEY en el servidor." },
      { status: 500 }
    );
  }

  let rawText: unknown;
  try {
    ({ rawText } = await request.json());
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido" }, { status: 400 });
  }

  if (typeof rawText !== "string" || !rawText.trim()) {
    return NextResponse.json({ error: "Texto requerido" }, { status: 400 });
  }

  const categories = await getCategories();
  const categoryNames = categories.map((c) => c.name);

  const systemInstruction = `
    Sos el editor periodístico jefe de "AgroTabaco", un portal de noticias del
    agro, la ganadería, el tabaco y las economías regionales.

    Tu tarea es transformar un borrador o noticia en bruto en un artículo
    periodístico final, listo para publicar.

    Criterios editoriales:
    1. Título: directo, periodístico y atractivo (máximo 90 caracteres).
    2. Categoría: elegí estrictamente una de estas opciones, tal como están
       escritas: ${categoryNames.join(", ")}.
    3. Copete/resumen: 2 o 3 oraciones claras con lo esencial de la noticia.
    4. Contenido (HTML): estructurado con <p>, subtítulos <h2>/<h3> si
       corresponde, <ul>/<li> si aplica y <blockquote> para citas textuales.
       No uses <script>, estilos inline ni clases CSS.
    5. Copy para redes: texto para Instagram/Facebook con tono profesional,
       emojis moderados y 4-5 hashtags relevantes.

    Redactá siempre en español, con tono de prensa profesional, sin inventar
    datos que no estén en el borrador original.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Borrador original:\n"""${rawText}"""`,
      config: {
        systemInstruction,
        // Reescritura editorial simple, no requiere razonamiento profundo —
        // el nivel de thinking por default de gemini-3.6-flash es la causa
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

    const parsed = JSON.parse(response.text ?? "{}");
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
