"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Check,
  ExternalLink,
  Globe,
  ImageIcon,
  Send,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/lib/types";

type AiResult = {
  title: string;
  summary: string;
  category: string;
  contentHtml: string;
  socialCopy: string;
};

type BulletinItemResult = {
  rawText: string;
  coverImage: string | null;
} & (
  | { ok: true; data: AiResult }
  | { ok: false; error: string }
);

type DraftStatus = "pending" | "saving" | "saved" | "error";

type Draft = {
  id: string;
  title: string;
  slug: string;
  slugTouched: boolean;
  excerpt: string;
  contentHtml: string;
  categoryId: string;
  coverImage: string | null;
  published: boolean;
  rawText: string;
  aiFailed: boolean;
  aiError?: string;
  status: DraftStatus;
  savedPost?: { id: string; slug: string; status: string };
};

function draftsFromResults(results: BulletinItemResult[], categories: Category[]): Draft[] {
  const fallbackCategoryId = categories[0]?.id ?? "";

  return results.map((result, index) => {
    const base = {
      id: `bloque-${index}-${Date.now()}`,
      slugTouched: false,
      published: true,
      rawText: result.rawText,
      coverImage: result.coverImage ?? null,
      status: "pending" as DraftStatus,
    };

    if (result.ok) {
      const matched = categories.find((c) => c.name === result.data.category);
      const title = result.data.title;
      return {
        ...base,
        title,
        slug: slugify(title, { lower: true, strict: true, locale: "es" }),
        excerpt: result.data.summary,
        contentHtml: result.data.contentHtml,
        categoryId: matched?.id ?? fallbackCategoryId,
        aiFailed: false,
      };
    }

    return {
      ...base,
      title: "",
      slug: "",
      excerpt: "",
      contentHtml: `<p>${result.rawText}</p>`,
      categoryId: fallbackCategoryId,
      aiFailed: true,
      aiError: result.error,
    };
  });
}

export function BulletinImport({ categories }: { categories: Category[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [drafts, setDrafts] = useState<Draft[] | null>(null);
  const [batchActionRunning, setBatchActionRunning] = useState(false);

  function updateDraft(id: string, patch: Partial<Draft>) {
    setDrafts((prev) => prev?.map((d) => (d.id === id ? { ...d, ...patch } : d)) ?? prev);
  }

  function applyTitle(id: string, title: string, draft: Draft) {
    const patch: Partial<Draft> = { title };
    if (!draft.slugTouched) {
      patch.slug = slugify(title, { lower: true, strict: true, locale: "es" });
    }
    updateDraft(id, patch);
  }

  function handleImageUpload(id: string, file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      updateDraft(id, { coverImage: base64 });
    };
    reader.readAsDataURL(file);
  }

  async function handleProcess() {
    if (!file) return;
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/ai/import-bulletin", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo procesar el boletín.");

      const results = data.results as BulletinItemResult[];
      setDrafts(draftsFromResults(results, categories));
      toast.success(`${results.length} noticias detectadas y formateadas.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al procesar el boletín.");
    } finally {
      setProcessing(false);
    }
  }

  async function saveDraft(draft: Draft, targetStatus: "published" | "draft"): Promise<boolean> {
    if (!draft.title.trim() || !draft.slug.trim() || !draft.categoryId) {
      toast.error(`"${draft.title || "Sin título"}": completá título, slug y categoría.`);
      updateDraft(draft.id, { status: "error" });
      return false;
    }

    updateDraft(draft.id, { status: "saving", published: targetStatus === "published" });

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title.trim(),
          slug: draft.slug.trim(),
          excerpt: draft.excerpt.trim(),
          content: draft.contentHtml,
          coverImage: draft.coverImage,
          categoryId: draft.categoryId,
          status: targetStatus,
          featured: false,
          publishedAt: targetStatus === "published" ? new Date().toISOString() : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar la noticia.");

      updateDraft(draft.id, {
        status: "saved",
        published: targetStatus === "published",
        slug: data.post.slug,
        coverImage: data.post.cover_image,
        savedPost: {
          id: data.post.id,
          slug: data.post.slug,
          status: data.post.status,
        },
      });

      toast.success(
        `"${draft.title}": ${targetStatus === "published" ? "Publicada con éxito" : "Guardada como borrador"}.`
      );
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al guardar noticia.";
      toast.error(`"${draft.title}": ${message}`);
      updateDraft(draft.id, { status: "error" });
      return false;
    }
  }

  async function handleBatchSave(targetStatus: "published" | "draft") {
    if (!drafts) return;
    const pending = drafts.filter((d) => d.status === "pending" || d.status === "error");
    if (pending.length === 0) return;

    setBatchActionRunning(true);
    let savedCount = 0;
    for (const draft of pending) {
      const ok = await saveDraft(draft, targetStatus);
      if (ok) savedCount++;
    }
    setBatchActionRunning(false);

    if (savedCount > 0) {
      toast.success(
        `${savedCount} noticias ${targetStatus === "published" ? "publicadas" : "guardadas como borrador"}.`
      );
    }
  }

  if (!drafts) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border bg-card p-8 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-brand-green-dark">
          <Sparkles className="size-5" />
          <h2 className="font-serif text-lg font-bold">Importar boletín semanal</h2>
        </div>
        <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
          Subí el archivo Word (<strong>.docx</strong>) con las noticias de la semana separadas por una línea de
          7777... El sistema detecta y asocia automáticamente las <strong>fotos</strong> de cada noticia, y Gemini
          genera título, copete, cuerpo y categoría para que puedas revisarlas y publicarlas con un clic.
        </p>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-brand-gray/50 hover:bg-brand-gray p-8 transition-colors hover:border-brand-green-dark">
          <UploadCloud className="size-10 text-brand-green-dark/70 mb-2" />
          <span className="text-sm font-semibold text-foreground">
            {file ? file.name : "Elegir archivo Word (.docx)"}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {file ? `${(file.size / 1024).toFixed(1)} KB` : "Texto e imágenes correspondientes"}
          </span>
          <input
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>

        <Button
          type="button"
          disabled={!file || processing}
          onClick={handleProcess}
          className="mt-5 w-full bg-brand-green-dark text-white hover:bg-brand-green-darker h-11 text-base font-semibold shadow"
        >
          <Sparkles className="size-4" />
          {processing ? "Procesando noticias e imágenes con IA..." : "Procesar boletín completo"}
        </Button>
      </div>
    );
  }

  const pendingCount = drafts.filter((d) => d.status === "pending" || d.status === "error").length;
  const savedCount = drafts.filter((d) => d.status === "saved").length;

  return (
    <div className="space-y-6">
      {/* Header Sticky / Action Bar */}
      <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-bold text-brand-green-dark">
              Revisar boletín ({drafts.length} noticias detectadas)
            </h1>
            {savedCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                <Check className="size-3.5" /> {savedCount} guardadas/publicadas
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Revisá el contenido y las fotos de cada noticia. Podés publicar cada una individualmente o todas juntas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={batchActionRunning || pendingCount === 0}
            onClick={() => handleBatchSave("draft")}
            className="text-xs"
          >
            Guardar todas como borrador ({pendingCount})
          </Button>

          <Button
            type="button"
            disabled={batchActionRunning || pendingCount === 0}
            onClick={() => handleBatchSave("published")}
            className="bg-brand-green-dark text-white hover:bg-brand-green-darker font-semibold text-xs shadow-md"
          >
            <Send className="size-3.5" />
            {batchActionRunning ? "Publicando..." : `Publicar todas las pendientes (${pendingCount})`}
          </Button>
        </div>
      </div>

      {/* Lista de Tarjetas de Noticias */}
      <div className="space-y-6">
        {drafts.map((draft, index) => (
          <div
            key={draft.id}
            className={`rounded-xl border bg-card p-6 shadow-sm transition-all ${
              draft.status === "saved"
                ? "border-emerald-300 bg-emerald-50/20"
                : draft.status === "error"
                  ? "border-destructive/40"
                  : "border-border"
            }`}
          >
            {/* Top Bar of Draft Card */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                  #{index + 1}
                </span>

                {draft.status === "saved" && (
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                      <Check className="size-4 text-emerald-600" />
                      {draft.published ? "Noticia Publicada" : "Guardada como borrador"}
                    </span>

                    {draft.published && (
                      <Link
                        href={`/post/${draft.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-green-dark hover:underline"
                      >
                        <Globe className="size-3.5" />
                        Ver en la web
                        <ExternalLink className="size-3" />
                      </Link>
                    )}

                    {draft.savedPost && (
                      <Link
                        href={`/admin/posts/${draft.savedPost.id}/edit`}
                        className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                      >
                        Editar en panel
                      </Link>
                    )}
                  </div>
                )}

                {draft.status === "saving" && (
                  <span className="text-xs font-semibold text-brand-green-dark animate-pulse">
                    Guardando y subiendo imagen...
                  </span>
                )}

                {draft.aiFailed && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
                    <AlertTriangle className="size-4 text-amber-600" />
                    Gemini no pudo formatear automáticamente este bloque — completá los campos.
                  </span>
                )}
              </div>

              {/* Action Buttons for this card */}
              {draft.status !== "saved" && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={draft.status === "saving"}
                    onClick={() => saveDraft(draft, "draft")}
                    className="text-xs"
                  >
                    Guardar borrador
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    disabled={draft.status === "saving"}
                    onClick={() => saveDraft(draft, "published")}
                    className="bg-brand-green-dark text-white hover:bg-brand-green-darker text-xs font-semibold shadow-sm"
                  >
                    <Send className="size-3.5" />
                    {draft.status === "saving" ? "Publicando..." : "Publicar noticia"}
                  </Button>
                </div>
              )}
            </div>

            {/* Editable Form */}
            <fieldset
              disabled={draft.status === "saved" || draft.status === "saving"}
              className="space-y-4"
            >
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Main 2 columns: Text, Title, Excerpt, Content */}
                <div className="space-y-4 lg:col-span-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">Título</Label>
                    <Input
                      value={draft.title}
                      onChange={(event) => applyTitle(draft.id, event.target.value, draft)}
                      placeholder="Titular impactante de la noticia"
                      className="font-semibold text-base"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">Slug (URL pública)</Label>
                    <Input
                      value={draft.slug}
                      onChange={(event) =>
                        updateDraft(draft.id, { slug: event.target.value, slugTouched: true })
                      }
                      className="font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">Copete / Bajada (Resumen)</Label>
                    <Textarea
                      rows={2}
                      value={draft.excerpt}
                      onChange={(event) => updateDraft(draft.id, { excerpt: event.target.value })}
                      placeholder="Resumen de 1 a 2 oraciones..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">Cuerpo de la noticia</Label>
                    <TiptapEditor
                      content={draft.contentHtml}
                      onChange={(html) => updateDraft(draft.id, { contentHtml: html })}
                    />
                  </div>
                </div>

                {/* Right Column: Image Preview + Category */}
                <div className="space-y-5">
                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">Categoría</Label>
                    <Select
                      value={draft.categoryId}
                      onValueChange={(value) => updateDraft(draft.id, { categoryId: value ?? "" })}
                    >
                      <SelectTrigger className="w-full">
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

                  {/* Image Box */}
                  <div className="space-y-2 rounded-lg border bg-muted/20 p-3.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <ImageIcon className="size-3.5 text-brand-green-dark" />
                        Foto de portada
                      </Label>
                      {draft.coverImage && draft.status !== "saved" && (
                        <button
                          type="button"
                          onClick={() => updateDraft(draft.id, { coverImage: null })}
                          className="text-[11px] text-destructive hover:underline flex items-center gap-0.5"
                        >
                          <Trash2 className="size-3" /> Quitar
                        </button>
                      )}
                    </div>

                    {draft.coverImage ? (
                      <div className="relative group overflow-hidden rounded-lg border bg-card">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={draft.coverImage}
                          alt="Vista previa de foto"
                          className="w-full h-44 object-cover transition-transform group-hover:scale-105 duration-300"
                        />
                        {draft.status !== "saved" && (
                          <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-xs font-medium">
                            <span>Cambiar foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(draft.id, e.target.files?.[0] ?? null)}
                            />
                          </label>
                        )}
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-36 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card hover:bg-muted/50 transition-colors cursor-pointer p-4 text-center">
                        <UploadCloud className="size-7 text-muted-foreground mb-1" />
                        <span className="text-xs font-semibold text-foreground">
                          Subir o adjuntar foto
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          PNG, JPG o WebP
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(draft.id, e.target.files?.[0] ?? null)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        ))}
      </div>
    </div>
  );
}
