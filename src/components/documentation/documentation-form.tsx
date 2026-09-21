"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Circle, FileText, ImageIcon, Loader2, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  ACCEPTED_MIME_TYPES,
  ACCEPT_ATTR,
  DOCUMENTATION_BUCKET,
  MAX_FILES_PER_DOCUMENT,
  MAX_FILE_SIZE_BYTES,
  REQUIRED_DOCUMENTS,
  formatBytes,
  type DocumentKey,
} from "@/lib/documentation/constants";

interface PickedFile {
  localId: string;
  file: File;
  mime: string;
}

type FilesByDoc = Record<DocumentKey, PickedFile[]>;

const EXT_TO_MIME: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

function resolveMime(file: File): string | null {
  const byType = (ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type) ? file.type : null;
  if (byType) return byType;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_MIME[ext] ?? null;
}

function safeFileName(name: string): string {
  const cleaned = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return (cleaned || "archivo").slice(-100);
}

const emptyFiles = (): FilesByDoc =>
  Object.fromEntries(REQUIRED_DOCUMENTS.map((d) => [d.key, []])) as unknown as FilesByDoc;

function isValidCuit(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = weights.reduce((acc, w, i) => acc + w * Number(digits[i]), 0);
  const mod = 11 - (sum % 11);
  const check = mod === 11 ? 0 : mod === 10 ? 9 : mod;
  return check === Number(digits[10]);
}

export function DocumentationForm() {
  const [companyName, setCompanyName] = useState("");
  const [cuit, setCuit] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSA, setIsSA] = useState(false);
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<FilesByDoc>(emptyFiles);
  const [dragOver, setDragOver] = useState<DocumentKey | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [sent, setSent] = useState(false);

  // Sobreviven a reintentos: si falla a mitad de camino, no se repite lo ya hecho.
  const [submissionId] = useState(() => crypto.randomUUID());
  const submissionInserted = useRef(false);
  const uploaded = useRef<Map<string, { path: string; file: PickedFile; key: DocumentKey }>>(new Map());
  const filesRecorded = useRef<Set<string>>(new Set());

  const loading = progress !== null;
  const visibleDocs = REQUIRED_DOCUMENTS.filter((d) => !d.onlyIfSA || isSA);

  const lineasFieldsComplete = Boolean(amount.trim() && term.trim() && purpose.trim());

  function isDocComplete(key: DocumentKey): boolean {
    if (key === "lineas_solicitadas") return lineasFieldsComplete;
    return files[key].length > 0;
  }

  const completed = visibleDocs.filter((d) => isDocComplete(d.key)).length;
  const allComplete = completed === visibleDocs.length;

  function addFiles(key: DocumentKey, incoming: FileList | File[]) {
    const current = files[key];
    const accepted: PickedFile[] = [];
    for (const file of Array.from(incoming)) {
      const mime = resolveMime(file);
      if (!mime) {
        toast.error(`"${file.name}": formato no soportado. Subí imágenes (JPG, PNG, WebP) o PDF.`);
        continue;
      }
      if (file.size === 0) {
        toast.error(`"${file.name}" está vacío.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`"${file.name}" supera el máximo de ${formatBytes(MAX_FILE_SIZE_BYTES)}.`);
        continue;
      }
      const duplicate = [...current, ...accepted].some(
        (p) => p.file.name === file.name && p.file.size === file.size,
      );
      if (duplicate) continue;
      if (current.length + accepted.length >= MAX_FILES_PER_DOCUMENT) {
        toast.error(`Máximo ${MAX_FILES_PER_DOCUMENT} archivos por documento.`);
        break;
      }
      accepted.push({ localId: crypto.randomUUID(), file, mime });
    }
    if (accepted.length > 0) setFiles((prev) => ({ ...prev, [key]: [...prev[key], ...accepted] }));
  }

  function removeFile(key: DocumentKey, localId: string) {
    setFiles((prev) => ({ ...prev, [key]: prev[key].filter((p) => p.localId !== localId) }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    if (!isValidCuit(cuit)) {
      toast.error("El CUIT ingresado no es válido.");
      return;
    }
    if (!allComplete) {
      toast.error("Completá toda la documentación requerida antes de enviar.");
      return;
    }

    const supabase = createClient();
    const id = submissionId;
    // Sólo se envían los documentos vigentes (libro de accionistas depende de is_sa).
    const toUpload = visibleDocs.flatMap((d) => files[d.key].map((p) => ({ key: d.key, picked: p })));
    const pending = toUpload.filter((u) => !uploaded.current.has(u.picked.localId));
    setProgress({ done: 0, total: pending.length });

    try {
      if (!submissionInserted.current) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { error } = await supabase.from("documentation_submissions").insert({
          id,
          user_id: user?.id ?? null,
          company_name: companyName.trim(),
          cuit: cuit.replace(/\D/g, ""),
          contact_name: contactName.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          is_sa: isSA,
          requested_amount: amount.trim(),
          requested_term: term.trim(),
          requested_purpose: purpose.trim(),
          notes: notes.trim() || null,
        });
        if (error) throw error;
        submissionInserted.current = true;
      }

      let done = 0;
      for (const { key, picked } of pending) {
        const path = `${id}/${key}/${crypto.randomUUID()}-${safeFileName(picked.file.name)}`;
        const { error } = await supabase.storage
          .from(DOCUMENTATION_BUCKET)
          .upload(path, picked.file, { contentType: picked.mime, upsert: false });
        if (error) throw error;
        uploaded.current.set(picked.localId, { path, file: picked, key });
        done += 1;
        setProgress({ done, total: pending.length });
      }

      const rows = [...uploaded.current.entries()]
        .filter(([localId]) => toUpload.some((u) => u.picked.localId === localId))
        .filter(([localId]) => !filesRecorded.current.has(localId))
        .map(([localId, u]) => ({
          localId,
          row: {
            submission_id: id,
            document_key: u.key,
            storage_path: u.path,
            file_name: u.file.file.name.slice(0, 300),
            mime_type: u.file.mime,
            size_bytes: u.file.file.size,
          },
        }));
      if (rows.length > 0) {
        const { error } = await supabase.from("documentation_files").insert(rows.map((r) => r.row));
        if (error) throw error;
        rows.forEach((r) => filesRecorded.current.add(r.localId));
      }

      setSent(true);
    } catch (err) {
      console.error("Error al enviar la documentación", err);
      toast.error(
        "No pudimos completar el envío. Revisá tu conexión y volvé a intentar: los archivos ya subidos no se repiten.",
      );
    } finally {
      setProgress(null);
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto size-10 text-brand-green-light" />
        <h2 className="mt-4 font-serif text-2xl font-bold text-brand-green-dark">
          ¡Documentación recibida!
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
          Recibimos la documentación de <strong>{companyName}</strong>. El equipo de AgroTabaco la va a
          revisar y se comunicará con vos a <strong>{email}</strong>.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Código de referencia: <span className="font-mono">{submissionId}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="font-serif text-lg font-bold text-brand-green-dark">Datos de la empresa</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="companyName">Razón social</Label>
            <Input
              id="companyName"
              required
              maxLength={200}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cuit">CUIT</Label>
            <Input
              id="cuit"
              required
              inputMode="numeric"
              placeholder="30-12345678-9"
              maxLength={13}
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contactName">Nombre y apellido de contacto</Label>
            <Input
              id="contactName"
              required
              maxLength={200}
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              maxLength={200}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Teléfono (opcional)</Label>
            <Input
              id="phone"
              type="tel"
              maxLength={50}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 self-end pb-2 text-sm">
            <input
              type="checkbox"
              className="size-4 accent-[var(--brand-green-light)]"
              checked={isSA}
              onChange={(e) => setIsSA(e.target.checked)}
            />
            La sociedad es S.A.
          </label>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-serif text-lg font-bold text-brand-green-dark">Documentación requerida</h2>
          <span className="text-sm text-muted-foreground" aria-live="polite">
            {completed} de {visibleDocs.length} completos
          </span>
        </div>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-gray"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={visibleDocs.length}
          aria-valuenow={completed}
        >
          <div
            className="h-full bg-brand-green-light transition-all"
            style={{ width: `${(completed / visibleDocs.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Formatos admitidos: PDF, JPG, PNG o WebP. Hasta {formatBytes(MAX_FILE_SIZE_BYTES)} por archivo y{" "}
          {MAX_FILES_PER_DOCUMENT} archivos por documento. La casilla se tilda sola al adjuntar.
        </p>

        <ul className="mt-4 flex flex-col gap-4">
          {visibleDocs.map((doc) => {
            const complete = isDocComplete(doc.key);
            const picked = files[doc.key];
            const isLineas = doc.key === "lineas_solicitadas";
            const inputId = `file-${doc.key}`;
            return (
              <li
                key={doc.key}
                className={cn(
                  "rounded-xl border bg-card p-4 shadow-sm transition-colors",
                  complete && "border-brand-green-light/60",
                )}
              >
                <div className="flex items-start gap-3">
                  {complete ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-green-light" aria-label="Completo" />
                  ) : (
                    <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-label="Pendiente" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{doc.label}</p>
                    {doc.hint && <p className="text-xs text-muted-foreground">{doc.hint}</p>}

                    {isLineas && (
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="amount">Monto</Label>
                          <Input
                            id="amount"
                            placeholder="Ej.: USD 200.000"
                            maxLength={200}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="term">Plazo</Label>
                          <Input
                            id="term"
                            placeholder="Ej.: 180 días"
                            maxLength={200}
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col gap-2 sm:col-span-2">
                          <Label htmlFor="purpose">Destino del financiamiento</Label>
                          <Textarea
                            id="purpose"
                            rows={2}
                            maxLength={2000}
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground sm:col-span-2">
                          Si tenés un documento con el detalle, también podés adjuntarlo (opcional).
                        </p>
                      </div>
                    )}

                    <label
                      htmlFor={inputId}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(doc.key);
                      }}
                      onDragLeave={() => setDragOver((k) => (k === doc.key ? null : k))}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(null);
                        if (!loading) addFiles(doc.key, e.dataTransfer.files);
                      }}
                      className={cn(
                        "mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-brand-green-light hover:text-foreground",
                        dragOver === doc.key && "border-brand-green-light bg-brand-gray",
                        loading && "pointer-events-none opacity-60",
                      )}
                    >
                      <UploadCloud className="size-4" />
                      <span>Arrastrá archivos acá o hacé clic para seleccionarlos</span>
                      <input
                        id={inputId}
                        type="file"
                        multiple
                        accept={ACCEPT_ATTR}
                        className="sr-only"
                        disabled={loading}
                        onChange={(e) => {
                          if (e.target.files) addFiles(doc.key, e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>

                    {picked.length > 0 && (
                      <ul className="mt-3 flex flex-col gap-2">
                        {picked.map((p) => {
                          const Icon = p.mime === "application/pdf" ? FileText : ImageIcon;
                          return (
                            <li
                              key={p.localId}
                              className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm"
                            >
                              <Icon className="size-4 shrink-0 text-brand-olive" />
                              <span className="min-w-0 flex-1 truncate">{p.file.name}</span>
                              <span className="shrink-0 text-xs text-muted-foreground">
                                {formatBytes(p.file.size)}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile(doc.key, p.localId)}
                                disabled={loading}
                                className="shrink-0 text-muted-foreground hover:text-destructive disabled:opacity-50"
                                aria-label={`Quitar ${p.file.name}`}
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <Label htmlFor="notes">Comentarios (opcional)</Label>
        <Textarea id="notes" rows={3} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </section>

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          disabled={loading || !allComplete}
          className="w-fit bg-brand-green-dark text-white hover:bg-brand-green-darker"
        >
          {progress ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Subiendo {progress.done} de {progress.total}...
            </>
          ) : (
            "Enviar documentación"
          )}
        </Button>
        {!allComplete && (
          <p className="text-xs text-muted-foreground">
            El envío se habilita cuando la documentación está completa (se envía todo junto, en un único envío).
          </p>
        )}
      </div>
    </form>
  );
}
