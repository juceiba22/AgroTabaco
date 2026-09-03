"use client";

import { useState } from "react";
import { AlertTriangle, Check, Sparkles, UploadCloud } from "lucide-react";
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
import type { Category } from "@/lib/types";

type AiResult = {
  title: string;
  summary: string;
  category: string;
  contentHtml: string;
  socialCopy: string;
};

type BulletinItemResult = { rawText: string } & (
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
  published: boolean;
  rawText: string;
  aiFailed: boolean;
  aiError?: string;
  status: DraftStatus;
};

function draftsFromResults(results: BulletinItemResult[], categories: Category[]): Draft[] {
  const fallbackCategoryId = categories[0]?.id ?? "";

  return results.map((result, index) => {
    const base = {
      id: `bloque-${index}-${Date.now()}`,
      slugTouched: false,
      published: true,
      rawText: result.rawText,
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
  const [savingAll, setSavingAll] = useState(false);

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
      toast.success(`${results.length} noticias detectadas.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al procesar el boletín.");
    } finally {
      setProcessing(false);
    }
  }

  async function saveDraft(draft: Draft): Promise<boolean> {
    if (!draft.title.trim() || !draft.slug.trim() || !draft.categoryId) {
      toast.error(`"${draft.title || "Sin título"}": completá título, slug y categoría.`);
      updateDraft(draft.id, { status: "error" });
      return false;
    }

    updateDraft(draft.id, { status: "saving" });
    const supabase = createClient();
    const nowIso = new Date().toISOString();
    const { error } = await supabase.from("posts").insert({
      title: draft.title.trim(),
      slug: draft.slug.trim(),
      excerpt: draft.excerpt.trim(),
      content: draft.contentHtml,
      cover_image: null,
      category_id: draft.categoryId,
      status: draft.published ? ("published" as const) : ("draft" as const),
      featured: false,
      published_at: draft.published ? nowIso : null,
    });

    if (error) {
      toast.error(`"${draft.title}": ${error.message}`);
      updateDraft(draft.id, { status: "error" });
      return false;
    }

    updateDraft(draft.id, { status: "saved" });
    return true;
  }

  async function handleSaveAllPending() {
    if (!drafts) return;
    const pending = drafts.filter((d) => d.status === "pending" || d.status === "error");
    if (pending.length === 0) return;

    setSavingAll(true);
    let savedCount = 0;
    for (const draft of pending) {
      const ok = await saveDraft(draft);
      if (ok) savedCount++;
    }
    setSavingAll(false);

    if (savedCount > 0) toast.success(`${savedCount} noticias guardadas.`);
  }

  if (!drafts) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border bg-card p-8">
        <div className="mb-2 flex items-center gap-2 text-brand-green-dark">
          <Sparkles className="size-5" />
          <h2 className="font-serif text-lg font-bold">Importar boletín semanal</h2>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          Subí el .docx con las noticias de la semana (separadas por una línea de
          7777...). Gemini genera título, copete, cuerpo de hasta 3 párrafos y
          categoría para cada una — después las revisás y publicás.
        </p>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-brand-gray p-8 transition-colors hover:border-brand-olive">
          <UploadCloud className="size-8 text-muted-foreground" />
          <span className="mt-2 text-sm font-medium text-foreground">
            {file ? file.name : "Elegir archivo .docx"}
          </span>
          <input
            type="file"
            accept=".docx"
            className="hidden"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>

        <Button
          type="button"
          disabled={!file || processing}
          onClick={handleProcess}
          className="mt-4 w-full bg-brand-green-dark text-white hover:bg-brand-green-darker"
        >
          <Sparkles className="size-4" />
          {processing ? "Procesando con Gemini..." : "Procesar boletín"}
        </Button>
      </div>
    );
  }

  const pendingCount = drafts.filter((d) => d.status === "pending" || d.status === "error").length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-green-dark">
            Revisar boletín ({drafts.length} noticias)
          </h1>
          <p className="text-sm text-muted-foreground">
            Editá lo que haga falta y guardá cada una, o publicá todas las pendientes.
          </p>
        </div>
        <Button
          type="button"
          disabled={savingAll || pendingCount === 0}
          onClick={handleSaveAllPending}
          className="bg-brand-green-dark text-white hover:bg-brand-green-darker"
        >
          {savingAll ? "Guardando..." : `Publicar todas las pendientes (${pendingCount})`}
        </Button>
      </div>

      <div className="space-y-6">
        {drafts.map((draft) => (
          <div key={draft.id} className="rounded-xl border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {draft.status === "saved" && (
                  <span className="flex items-center gap-1 text-sm font-medium text-brand-green-dark">
                    <Check className="size-4" /> Guardada
                  </span>
                )}
                {draft.aiFailed && (
                  <span className="flex items-center gap-1 text-sm font-medium text-destructive">
                    <AlertTriangle className="size-4" />
                    Gemini no pudo procesar este bloque — completá a mano.
                  </span>
                )}
              </div>
              {draft.status !== "saved" && (
                <Button
                  type="button"
                  size="sm"
                  disabled={draft.status === "saving"}
                  onClick={() => saveDraft(draft)}
                  className="bg-brand-green-dark text-white hover:bg-brand-green-darker"
                >
                  {draft.status === "saving" ? "Guardando..." : "Guardar"}
                </Button>
              )}
            </div>

            <fieldset disabled={draft.status === "saved" || draft.status === "saving"} className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                  <div className="space-y-1.5">
                    <Label>Título</Label>
                    <Input
                      value={draft.title}
                      onChange={(event) => applyTitle(draft.id, event.target.value, draft)}
                      placeholder="Titular de la noticia"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Slug (URL)</Label>
                    <Input
                      value={draft.slug}
                      onChange={(event) =>
                        updateDraft(draft.id, { slug: event.target.value, slugTouched: true })
                      }
                      className="font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Copete / Bajada</Label>
                    <Textarea
                      rows={2}
                      value={draft.excerpt}
                      onChange={(event) => updateDraft(draft.id, { excerpt: event.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Cuerpo de la noticia</Label>
                    <TiptapEditor
                      content={draft.contentHtml}
                      onChange={(html) => updateDraft(draft.id, { contentHtml: html })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Categoría</Label>
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

                  <div className="flex items-center justify-between border-t pt-3">
                    <Label className="text-sm font-normal">
                      {draft.published ? "Publicado" : "Borrador"}
                    </Label>
                    <Switch
                      checked={draft.published}
                      onCheckedChange={(checked) => updateDraft(draft.id, { published: checked })}
                    />
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
