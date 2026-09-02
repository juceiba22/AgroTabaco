"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { KpiCard } from "@/components/kpi-card";
import type { MercadoInternacional } from "@/lib/panels/tabacostats/types";

const InternationalLineChart = dynamic(
  () => import("@/components/panels/tabacostats/charts/international-line-chart").then((m) => m.InternationalLineChart),
  { ssr: false }
);

function lastTwo(rows: MercadoInternacional[]): [number, number | null] {
  const sorted = [...rows].sort((a, b) => a.year - b.year);
  if (sorted.length === 0) return [0, null];
  const last = sorted[sorted.length - 1].valueUsd;
  const prev = sorted.length > 1 ? sorted[sorted.length - 2].valueUsd : null;
  const delta = prev ? ((last - prev) / prev) * 100 : null;
  return [last, delta];
}

export function ModuloMercadoInternacional({ data }: { data: MercadoInternacional[] }) {
  const anual = data.filter((d) => !d.isYtd);
  const ytd = data.filter((d) => d.isYtd);

  const virginiaAnnual = useMemo(() => anual.filter((d) => d.variety === "Virginia").sort((a, b) => a.year - b.year), [anual]);
  const burleyAnnual = useMemo(() => anual.filter((d) => d.variety === "Burley").sort((a, b) => a.year - b.year), [anual]);

  const [virginiaLast, virginiaDelta] = lastTwo(virginiaAnnual);
  const [burleyLast, burleyDelta] = lastTwo(burleyAnnual);
  const lastYear = anual.length > 0 ? Math.max(...anual.map((d) => d.year)) : null;
  const totalLast = virginiaLast + burleyLast;
  const virginiaShare = totalLast > 0 ? (virginiaLast / totalLast) * 100 : 0;

  const ytdYears = Array.from(new Set(ytd.map((d) => d.year))).sort((a, b) => a - b);
  const ytdCurr = ytdYears[ytdYears.length - 1];
  const ytdPrev = ytdYears.length > 1 ? ytdYears[ytdYears.length - 2] : undefined;
  const valCurr = ytdCurr ? ytd.filter((d) => d.year === ytdCurr).reduce((a, d) => a + d.valueUsd, 0) : 0;
  const valPrev = ytdPrev ? ytd.filter((d) => d.year === ytdPrev).reduce((a, d) => a + d.valueUsd, 0) : null;
  const ytdDelta = valPrev ? ((valCurr - valPrev) / valPrev) * 100 : null;

  const tableRows = useMemo(() => {
    const years = Array.from(new Set(anual.map((d) => d.year))).sort((a, b) => b - a);
    return years.map((year) => ({
      year,
      virginia: anual.find((d) => d.year === year && d.variety === "Virginia")?.valueUsd ?? null,
      burley: anual.find((d) => d.year === year && d.variety === "Burley")?.valueUsd ?? null,
    }));
  }, [anual]);

  return (
    <>
      <div className="executive-header">
        <h1>Comercio Exterior de EE. UU.: Virginia y Burley</h1>
        <p>
          Valor FOB de exportaciones estadounidenses de tabaco trillado al mundo, como referencia del mercado
          internacional (USDA GATS / Census Bureau, 2002-2025). Serie empalmada por el corte de subpartidas
          arancelarias de 2011.
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        ⚠️ Esta fuente reporta valor FOB en USD, no volumen: es un indicador de mercado internacional, no un precio en
        $/kg.
      </p>

      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard title={`Virginia (${lastYear ?? ""})`} value={`US$ ${(virginiaLast / 1e6).toFixed(1)} M`} subtitle="Valor FOB exportado por EE.UU." delta={virginiaDelta} color="amber" />
        <KpiCard title={`Burley (${lastYear ?? ""})`} value={`US$ ${(burleyLast / 1e6).toFixed(1)} M`} subtitle="Valor FOB exportado por EE.UU." delta={burleyDelta} color="blue" />
        <KpiCard title="Participación Virginia" value={`${virginiaShare.toFixed(1)}%`} subtitle={`Sobre Virginia + Burley (${lastYear ?? ""})`} color="emerald" />
        <KpiCard
          title={ytdCurr ? `Ene-Jun ${ytdCurr}` : "Acumulado"}
          value={ytdCurr ? `US$ ${(valCurr / 1e6).toFixed(1)} M` : "S/D"}
          subtitle="Virginia + Burley, acumulado"
          delta={ytdDelta}
          color="purple"
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-2">
        <InternationalLineChart virginia={virginiaAnnual} burley={burleyAnnual} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-3 py-2">Año</th>
              <th className="px-3 py-2">Virginia (USD)</th>
              <th className="px-3 py-2">Burley (USD)</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((r) => (
              <tr key={r.year} className="border-b border-border/50">
                <td className="px-3 py-1.5">{r.year}</td>
                <td className="px-3 py-1.5">{r.virginia !== null ? `$${r.virginia.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "—"}</td>
                <td className="px-3 py-1.5">{r.burley !== null ? `$${r.burley.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Fuente: USDA Global Agricultural Trade System (GATS) sobre datos de U.S. Census Bureau. Códigos HS
        2401208005/2401208011/2401208010 (Virginia) y 2401208015/2401208021/2401208020 (Burley).
      </p>
    </>
  );
}
