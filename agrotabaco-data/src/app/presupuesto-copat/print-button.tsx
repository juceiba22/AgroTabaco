"use client";

import { Printer, Share2, Check } from "lucide-react";
import { useState } from "react";

export function ProposalActions() {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }
      } catch (e) {
        console.error("Error copiando URL", e);
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        title="Copiar enlace directo"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-600" />
            <span>Enlace copiado</span>
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4 text-muted-foreground" />
            <span>Compartir link</span>
          </>
        )}
      </button>

      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        title="Imprimir o guardar como PDF"
      >
        <Printer className="h-4 w-4 text-muted-foreground" />
        <span>Guardar en PDF / Imprimir</span>
      </button>
    </div>
  );
}
