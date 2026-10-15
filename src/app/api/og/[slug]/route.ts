import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getPostBySlug } from "@/lib/data";

// WhatsApp (y otros) descartan imágenes de vista previa pesadas o en formatos
// que no soportan (SVG, PNG enormes). Acá se redimensiona la portada a
// 1200x630 JPEG liviano, que es el formato que todos los scrapers aceptan.
const WIDTH = 1200;
const HEIGHT = 630;

async function loadCover(src: string): Promise<Buffer> {
  if (src.startsWith("/")) {
    return readFile(path.join(process.cwd(), "public", src));
  }
  const res = await fetch(src);
  if (!res.ok) throw new Error(`No se pudo descargar la portada (${res.status})`);
  return Buffer.from(await res.arrayBuffer());
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") {
    return new Response("Not found", { status: 404 });
  }

  try {
    const input = await loadCover(post.coverImage);
    const jpeg = await sharp(input)
      .resize(WIDTH, HEIGHT, { fit: "cover", position: "attention" })
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();

    return new Response(new Uint8Array(jpeg), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Error generando imagen og:", error);
    // Si no se pudo procesar, redirigimos a la portada original.
    return Response.redirect(new URL(post.coverImage, "https://www.agrotabaco.com"), 302);
  }
}
