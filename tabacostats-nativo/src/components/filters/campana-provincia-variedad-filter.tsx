"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TODAS_LAS_PROVINCIAS, TODAS_LAS_VARIEDADES } from "@/lib/filters";
import { cn } from "@/lib/utils";

type Props = {
  campanaLabel: string;
  campanas: string[];
  provincias: string[];
  variedades: string[];
  campana: string;
  provincia: string;
  variedad: string;
  onCampanaChange: (value: string) => void;
  onProvinciaChange: (value: string) => void;
  onVariedadChange: (value: string) => void;
  /** Se puede ocultar el selector de variedad para pestañas que no lo usan. */
  showVariedad?: boolean;
};

export function CampanaProvinciaVariedadFilter({
  campanaLabel,
  campanas,
  provincias,
  variedades,
  campana,
  provincia,
  variedad,
  onCampanaChange,
  onProvinciaChange,
  onVariedadChange,
  showVariedad = true,
}: Props) {
  return (
    <div className={cn("grid gap-4", showVariedad ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">📅 {campanaLabel}</label>
        <Select value={campana} onValueChange={(v) => v && onCampanaChange(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {campanas.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">📍 Provincia</label>
        <Select value={provincia} onValueChange={(v) => v && onProvinciaChange(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODAS_LAS_PROVINCIAS}>{TODAS_LAS_PROVINCIAS}</SelectItem>
            {provincias.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showVariedad && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">🍂 Variedad de Tabaco</label>
          <Select value={variedad} onValueChange={(v) => v && onVariedadChange(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODAS_LAS_VARIEDADES}>{TODAS_LAS_VARIEDADES}</SelectItem>
              {variedades.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
