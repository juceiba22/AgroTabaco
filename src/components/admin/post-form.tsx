"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, Copy, Sparkles, UploadCloud } from "lucide-react";
import slugify from "slugify";
import { toast } from "sonner";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { Category, Post } from "@/lib/types";

type PostFormProps = {
  mode: "create" | "edit";
  categories: Category[];
  post?: Post;
};

type AiResult = {
  title: string;
  summary: string;
  category: string;
  contentHtml: string;
  socialCopy: string;
};

// Los posts migrados sin imagen real usan este placeholder local como
// cover_image (ver src/lib/data.ts) — no lo tratamos como "ya tiene imagen".
const FALLBACK_COVER_PREFIX = "/images/posts/";

export function PostForm({ mode, categories, post }: PostFormProps) {
  const router = useRouter();

  const [rawText, setRawText] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [socialCopy, setSocialCopy] = useState("");
  const [copiedSocial, setCopiedSocial] = useState(false);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [contentHtml, setContentHtml] = useState(post?.content ?? "");
  const [categoryId, setCategoryId] = useState(
    post && post.category.id ? post.category.id : (categories[0]?.id ?? "")
  );
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [published, setPublished] = useState(
    mode === "create" ? true : post?.status === "published"
  );

  const initialCoverImage =
    post && !post.coverImage.startsWith(FALLBACK_COVER_PREFIX) ? post.coverImage : null;
  const [existingCoverImage, setExistingCoverImage] = useState(initialCoverImage);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialCoverImage);

  const [isSaving, setIsSaving] = useState(false);

  function applyTitle(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value, { lower: true, strict: true, locale: "es" }));
    }
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setSlug(value);
  }

  async function handleProcessAi() {
    if (!rawText.trim()) return;
    setLoadingAi(true);

    try {
      const res = await fetch("/api/ai/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo procesar el borrador.");

      const result = data as AiResult;
      applyTitle(result.title);
      setExcerpt(result.summary);
      setContentHtml(result.contentHtml);
      setSocialCopy(result.socialCopy);

      const matchedCategory = categories.find((c) => c.name === result.category);
      if (matchedCategory) setCategoryId(matchedCategory.id);

      toast.success("Borrador formateado con Gemini.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al procesar con Gemini.");
    } finally {
      setLoadingAi(false);
    }
  }

  function handleImageSelect(file: File | null) {
    setNewImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : existingCoverImage);
  }

  async function uploadCoverImage(file: File): Promise<string> {
    const supabase = createClient();
    const extension = file.name.split(".").pop() || "jpg";
    const filePath = `posts/${slug || "post"}-${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from("media")
      .upload(filePath, file, { upsert: true });
    if (error) throw error;

    const { data } = supabase.storage.from("media").getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!title.trim()) return toast.error("El título es obligatorio.");
    if (!slug.trim()) return toast.error("El slug es obligatorio.");
    if (!categoryId) return toast.error("Elegí una categoría.");

    setIsSaving(true);
    try {
      let coverImage = existingCoverImage;
      if (newImageFile) {
        coverImage = await uploadCoverImage(newImageFile);
        setExistingCoverImage(coverImage);
      }

      const nowIso = new Date().toISOString();
      const publishedAt = !published
        ? null
        : mode === "edit" && post?.status === "published" && post.publishedAt
          ? post.publishedAt
          : nowIso;

      const supabase = createClient();
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content: contentHtml,
        cover_image: coverImage,
        category_id: categoryId,
        status: published ? ("published" as const) : ("draft" as const),
        featured,
        published_at: publishedAt,
      };

      const { error } =
        mode === "create"
          ? await supabase.from("posts").insert(payload)
          : await supabase.from("posts").update(payload).eq("id", post!.id);

      if (error) throw error;

      toast.success(mode === "create" ? "Noticia creada." : "Noticia actualizada.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error guardando la noticia.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCopySocial() {
    navigator.clipboard.writeText(socialCopy);
    setCopiedSocial(true);
    setTimeout(() => setCopiedSocial(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="mb-6 -ml-2"
        nativeButton={false}
        render={<Link href="/admin" />}
      >
        <ArrowLeft className="size-4" />
        Volver a noticias
      </Button>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-brand-green-dark">
          {mode === "create" ? "Nueva noticia" : "Editar noticia"}
        </h1>
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-brand-green-dark text-white hover:bg-brand-green-darker"
        >
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </div>

      <div className="mb-8 rounded-xl border border-brand-olive/30 bg-brand-gray p-5">
        <div className="mb-2 flex items-center gap-2 text-brand-green-dark">
          <Sparkles className="size-5" />
          <h2 className="font-serif text-base font-bold">Asistente con Gemini</h2>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Pegá un borrador o noticia en bruto para generar título, copete,
          cuerpo formateado y un copy para redes automáticamente.
        </p>
        <Textarea
          rows={3}
          value={rawText}
          onChange={(event) => setRawText(event.target.value)}
          placeholder="Pegar texto en bruto acá..."
          className="bg-card"
        />
        <div className="mt-2 flex justify-end">
          <Button
            type="button"
            size="sm"
            disabled={loadingAi || !rawText.trim()}
            onClick={handleProcessAi}
            className="bg-brand-green-dark text-white hover:bg-brand-green-darker"
          >
            <Sparkles className="size-4" />
            {loadingAi ? "Procesando..." : "Formatear con IA"}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => applyTitle(event.target.value)}
                placeholder="Titular de la noticia"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(event) => handleSlugChange(event.target.value)}
                className="font-mono text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="excerpt">Copete / Bajada</Label>
              <Textarea
                id="excerpt"
                rows={2}
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                placeholder="Breve resumen para la portada..."
              />
            </div>

            <div className="space-y-1.5">
              <Label>Cuerpo de la noticia</Label>
              <TiptapEditor content={contentHtml} onChange={setContentHtml} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4 rounded-xl border bg-card p-5">
            <h3 className="border-b pb-2 font-serif text-sm font-bold text-brand-green-dark">
              Configuración
            </h3>

            <div className="space-y-1.5">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={categoryId}
                onValueChange={(value) => setCategoryId(value ?? "")}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Elegí una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <Label htmlFor="featured" className="text-sm font-normal">
                Destacar en Home
              </Label>
              <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <Label htmlFor="published" className="text-sm font-normal">
                {published ? "Publicado" : "Borrador"}
              </Label>
              <Switch id="published" checked={published} onCheckedChange={setPublished} />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border bg-card p-5">
            <h3 className="font-serif text-sm font-bold text-brand-green-dark">
              Imagen destacada
            </h3>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-brand-gray p-4 transition-colors hover:border-brand-olive">
              {imagePreview ? (
                // Preview de un blob local o una URL externa: next/image no puede optimizar ninguno de los dos.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="h-32 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-muted-foreground">
                  <UploadCloud className="size-8" />
                  <span className="mt-2 text-xs font-medium">Subir imagen principal</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleImageSelect(event.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          {socialCopy && (
            <div className="space-y-3 rounded-xl bg-brand-green-darker p-5 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-brand-olive-light">
                  Copy para redes
                </span>
                <button
                  type="button"
                  onClick={handleCopySocial}
                  className="flex items-center gap-1 text-xs text-white/70 hover:text-white"
                >
                  {copiedSocial ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copiedSocial ? "Copiado" : "Copiar"}
                </button>
              </div>
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-white/90">
                {socialCopy}
              </p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
