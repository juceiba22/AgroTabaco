"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { breakdownByObjetoPrograma, topComponentes } from "@/lib/filters";
import type { PoaTabaco } from "@/lib/types";

const ProgramaDonutChart = dynamic(() => import("@/components/charts/programa-donut-chart").then((m) => m.ProgramaDonutChart), {
  ssr: false,
});

export function ModuloProgramas({ dataFiltrado }: { dataFiltrado: PoaTabaco[] }) {
  const breakdown = useMemo(() => breakdownByObjetoPrograma(dataFiltrado), [dataFiltrado]);
  const [programaSeleccionado, setProgramaSeleccionado] = useState<string | null>(breakdown[0]?.objetoPrograma ?? null);

  const componentesDelPrograma = useMemo(() => {
    if (!programaSeleccionado) return [];
    const subset = dataFiltrado.filter((r) => (r.objetoPrograma ?? "Sin Clasificar") === programaSeleccionado);
    return topComponentes(subset, 10);
  }, [dataFiltrado, programaSeleccionado]);

  return (
    <>
      <div>
        <h3 className="font-serif text-lg font-bold text-brand-green-dark">🧭 Composición del Gasto por Programa</h3>
        <p className="text-sm text-muted-foreground">
          Desglose por <code>objeto_programa</code> (única categoría estandarizada del dataset) y detalle de componentes/subcomponentes
          dentro del programa elegido.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-xl border border-border bg-card p-2 lg:col-span-3">
          <ProgramaDonutChart data={breakdown} />
        </div>
        <div className="flex flex-col gap-3 lg:col-span-2">
          <Select value={programaSeleccionado ?? undefined} onValueChange={(v) => v && setProgramaSeleccionado(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Elegí un programa" />
            </SelectTrigger>
            <SelectContent>
              {breakdown.map((p) => (
                <SelectItem key={p.objetoPrograma} value={p.objetoPrograma}>
                  {p.objetoPrograma}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-3 py-2">Componente</th>
                  <th className="px-3 py-2">POAs</th>
                </tr>
              </thead>
              <tbody>
                {componentesDelPrograma.map((c) => (
                  <tr key={c.label} className="border-b border-border/50">
                    <td className="px-3 py-1.5">{c.label}</td>
                    <td className="px-3 py-1.5">{c.countPoas}</td>
                  </tr>
                ))}
                {componentesDelPrograma.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-muted-foreground" colSpan={2}>
                      Sin componentes registrados para este programa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
