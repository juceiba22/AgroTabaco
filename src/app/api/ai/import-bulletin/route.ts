import mammoth from "mammoth";
import { NextResponse } from "next/server";
import { transformArticle, type AiResult } from "@/lib/ai/prompts";
import { splitBulletin } from "@/lib/import/split-bulletin";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/data";

const MAX_PARAGRAPHS = 3;
const CONCURRENCY = 3;

type BulletinItemResult = { rawText: string } & ({ ok: true; data: AiResult } | { ok: false; error: string });

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

// Recibe el .docx del boletín semanal, lo separa en un bloque en bruto por
// noticia (ver splitBulletin) y corre cada bloque por el mismo motor de
// Gemini que /api/ai/transform, con un tope de 3 párrafos por copy. Un
// bloque que falla no tira abajo el resto del lote — se devuelve marcado
// como error para que la pantalla de revisión lo muestre en bruto.
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

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo .docx" }, { status: 400 });
  }

  let rawText: string;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    ({ value: rawText } = await mammoth.extractRawText({ buffer }));
  } catch {
    return NextResponse.json(
      { error: "No se pudo leer el archivo. ¿Es un .docx válido?" },
      { status: 400 }
    );
  }

  const blocks = splitBulletin(rawText);
  if (blocks.length === 0) {
    return NextResponse.json(
      { error: "No se encontró ninguna noticia separada por 7777... en el documento." },
      { status: 400 }
    );
  }

  const categories = await getCategories();
  const categoryNames = categories.map((c) => c.name);

  const results = await mapWithConcurrency<string, BulletinItemResult>(
    blocks,
    CONCURRENCY,
    async (block) => {
      try {
        const data = await transformArticle(block, categoryNames, apiKey, {
          maxParagraphs: MAX_PARAGRAPHS,
        });
        return { ok: true, data, rawText: block };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        return { ok: false, error: message, rawText: block };
      }
    }
  );

  return NextResponse.json({ results });
}
