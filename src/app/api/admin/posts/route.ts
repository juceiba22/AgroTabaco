import { NextResponse } from "next/server";
import slugify from "slugify";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    categoryId: string;
    status: "published" | "draft";
    featured?: boolean;
    publishedAt?: string | null;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de petición inválido" }, { status: 400 });
  }

  const { title, excerpt, content, categoryId, status, featured, publishedAt } = body;
  let rawSlug = body.slug;

  if (!title?.trim()) {
    return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
  }
  if (!categoryId) {
    return NextResponse.json({ error: "La categoría es obligatoria" }, { status: 400 });
  }

  if (!rawSlug?.trim()) {
    rawSlug = slugify(title, { lower: true, strict: true, locale: "es" });
  }

  let cleanSlug = slugify(rawSlug, { lower: true, strict: true, locale: "es" });
  if (!cleanSlug) {
    cleanSlug = `noticia-${Date.now()}`;
  }

  // Handle cover image if it's base64 data URL
  let finalCoverImage = body.coverImage || null;

  if (finalCoverImage && finalCoverImage.startsWith("data:image/")) {
    try {
      const match = finalCoverImage.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        let ext = match[1].toLowerCase();
        if (ext === "jpeg") ext = "jpg";
        if (ext === "svg+xml") ext = "svg";
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, "base64");
        const filePath = `posts/${cleanSlug}-${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(filePath, buffer, {
            contentType: `image/${match[1]}`,
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from("media")
            .getPublicUrl(filePath);
          finalCoverImage = publicUrlData.publicUrl;
        } else {
          console.error("Error al subir imagen a storage:", uploadError);
        }
      }
    } catch (err) {
      console.error("Error al procesar base64 image:", err);
    }
  }

  // Check unique slug and append suffix if exists
  let candidateSlug = cleanSlug;
  let suffix = 1;
  while (true) {
    const query = supabase.from("posts").select("id").eq("slug", candidateSlug);
    if (body.id) {
      query.neq("id", body.id);
    }
    const { data: existing } = await query.maybeSingle();
    if (!existing) {
      break;
    }
    suffix++;
    candidateSlug = `${cleanSlug}-${suffix}`;
  }

  const nowIso = new Date().toISOString();
  const effectivePublishedAt =
    status === "published" ? (publishedAt || nowIso) : null;

  const authorName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Redacción AgroTabaco";

  const postData = {
    title: title.trim(),
    slug: candidateSlug,
    excerpt: excerpt ? excerpt.trim() : "",
    content: content || "",
    cover_image: finalCoverImage,
    category_id: categoryId,
    author_id: user.id,
    author_name: authorName,
    status,
    featured: !!featured,
    published_at: effectivePublishedAt,
    updated_at: nowIso,
  };

  let savedPost;
  if (body.id) {
    const { data, error } = await supabase
      .from("posts")
      .update(postData)
      .eq("id", body.id)
      .select("*, categories(*)")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    savedPost = data;
  } else {
    const { data, error } = await supabase
      .from("posts")
      .insert(postData)
      .select("*, categories(*)")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    savedPost = data;
  }

  return NextResponse.json({ ok: true, post: savedPost });
}
