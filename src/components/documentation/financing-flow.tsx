"use client";

import { useState } from "react";
import { CheckCircle2, ClipboardList, MessageCircle, Sprout, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DocumentationForm } from "@/components/documentation/documentation-form";
import { REQUIRED_DOCUMENTS } from "@/lib/documentation/constants";
import { cn } from "@/lib/utils";

// Número de AgroTabaco para WhatsApp: 549 + 11 2369-4772 (formato internacional
// que exige wa.me para celulares argentinos).
const WHATSAPP_NUMBER = "5491123694772";
const WHATSAPP_MESSAGE =
  "Estuve explorando la posibilidad de solicitar financiamiento para el Agro y necesito contactarme con un representante";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

type Sector = "tabacalera" | "otro";
type Path = "cargar" | "contacto";

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
}

function OptionCard({ selected, onClick, icon, title }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-card p-4 text-left text-sm font-medium shadow-sm transition-colors hover:border-brand-green-light",
        selected && "border-brand-green-light bg-brand-gray ring-1 ring-brand-green-light",
      )}
    >
      <span className="text-brand-green-dark">{icon}</span>
      <span className="flex-1">{title}</span>
      {selected && <CheckCircle2 className="size-5 shrink-0 text-brand-green-light" />}
    </button>
  );
}

export function FinancingFlow() {
  const [sector, setSector] = useState<Sector | null>(null);
  const [otherSector, setOtherSector] = useState("");
  const [path, setPath] = useState<Path | null>(null);

  const sectorReady = sector === "tabacalera" || (sector === "otro" && otherSector.trim().length > 0);
  const sectorLabel = sector === "otro" ? otherSector.trim() : undefined;

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="font-serif text-2xl font-bold text-brand-green-dark">
          Conseguí financiamiento si sos una empresa de Agro
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <OptionCard
            selected={sector === "tabacalera"}
            onClick={() => setSector("tabacalera")}
            icon={<Sprout className="size-5" />}
            title="Soy una cooperativa o empresa tabacalera"
          />
          <OptionCard
            selected={sector === "otro"}
            onClick={() => setSector("otro")}
            icon={<Building2 className="size-5" />}
            title="Soy de otro rubro"
          />
        </div>

        {sector === "otro" && (
          <div className="mt-4 flex flex-col gap-2">
            <Label htmlFor="otherSector">¿De qué rubro sos?</Label>
            <Input
              id="otherSector"
              maxLength={100}
              placeholder="Ej.: yerba mate, caña de azúcar, ganadería…"
              value={otherSector}
              onChange={(e) => setOtherSector(e.target.value)}
            />
          </div>
        )}
      </section>

      {sectorReady && (
        <section className="flex flex-col gap-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-brand-green-dark">
              <ClipboardList className="size-5" />
              Requisitos
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Para calificar como Persona Jurídica necesitamos la siguiente documentación:
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {REQUIRED_DOCUMENTS.map((doc) => (
                <li key={doc.key} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-olive" />
                  <span>{doc.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <OptionCard
              selected={path === "cargar"}
              onClick={() => setPath("cargar")}
              icon={<ClipboardList className="size-5" />}
              title="Tengo todos los requisitos, voy a cargar toda la información"
            />
            <OptionCard
              selected={path === "contacto"}
              onClick={() => setPath("contacto")}
              icon={<MessageCircle className="size-5" />}
              title="Quiero que se contacte un representante de AgroTabaco, para terminar la operación"
            />
          </div>

          {path === "contacto" && (
            <div className="rounded-xl border bg-card p-6 text-center shadow-sm">
              <p className="text-sm text-muted-foreground">
                Escribinos por WhatsApp y un representante de AgroTabaco se va a comunicar con vos.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle className="size-5" />
                Contactar por WhatsApp
              </a>
            </div>
          )}

          {path === "cargar" && <DocumentationForm sector={sectorLabel} />}
        </section>
      )}
    </div>
  );
}
