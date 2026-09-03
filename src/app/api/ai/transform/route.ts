import { NextResponse } from "next/server";
import { transformArticle } from "@/lib/ai/prompts";
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

  try {
    const result = await transformArticle(rawText, categoryNames, apiKey);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
