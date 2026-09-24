import mammoth from "mammoth";
import { NextResponse } from "next/server";
import { splitBulletinFromHtml, type ParsedBulletinBlock } from "@/lib/import/split-bulletin";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;

export type BulletinSplitResponse = { blocks: ParsedBulletinBlock[] };

// Recibe el .docx del boletín semanal y lo separa en bloques (texto + imagen)
// por noticia (ver splitBulletinFromHtml). NO llama a la IA: es rápido a
// propósito. El navegador manda después cada bloque a /api/ai/transform de a
// uno, así el progreso se ve en pantalla y ninguna petición larga puede
// cortarse por límite de tiempo del servidor.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
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

  let html: string;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const conversion = await mammoth.convertToHtml(
      { buffer },
      {
        convertImage: mammoth.images.imgElement(async (image) => {
          const base64 = await image.read("base64");
          return {
            src: `data:${image.contentType};base64,${base64}`,
          };
        }),
      }
    );
    html = conversion.value;
  } catch {
    return NextResponse.json(
      { error: "No se pudo leer el archivo. ¿Es un .docx válido?" },
      { status: 400 }
    );
  }

  const blocks = splitBulletinFromHtml(html);
  if (blocks.length === 0) {
    return NextResponse.json(
      { error: "No se encontró ninguna noticia en el documento." },
      { status: 400 }
    );
  }

  return NextResponse.json({ blocks } satisfies BulletinSplitResponse);
}
