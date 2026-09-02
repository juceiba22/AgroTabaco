"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMarketShare, getTopProducers } from "@/lib/panels/mercado-internacional/filters";
import type { TobaccoProduction } from "@/lib/panels/mercado-internacional/types";

const RankingBarChart = dynamic(() => import("@/components/panels/mercado-internacional/charts/ranking-bar-chart").then((m) => m.RankingBarChart), { ssr: false });
const MarketSharePieChart = dynamic(() => import("@/components/panels/mercado-internacional/charts/market-share-pie-chart").then((m) => m.MarketSharePieChart), { ssr: false });

const TOP_N_OPTIONS = [10, 15, 20, 25, 30];

export function ModuloRanking({ data, evalYear, unit }: { data: TobaccoProduction[]; evalYear: number; unit: string }) {
  const [topN, setTopN] = useState(15);

  const ranked = useMemo(() => getTopProducers(data, evalYear, topN, true), [data, evalYear, topN]);
  const { rows: shareRows } = useMemo(() => getMarketShare(data, evalYear, 5), [data, evalYear]);
  const top5Pct = shareRows.filter((r) => r.category === "Top Productores").reduce((s, r) => s + r.percentage, 0);

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-bold text-brand-green-dark">🏆 Estructura Competitiva Global – Año {evalYear}</h3>
        <Select value={String(topN)} onValueChange={(v) => v && setTopN(Number(v))}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TOP_N_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                Top {n} países
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-xl border border-border bg-card p-2 lg:col-span-3">
          <RankingBarChart
            data={ranked.map((r) => ({ entity: r.entity, entityDisplay: r.entityDisplay, valueTonnes: r.valueTonnes }))}
            year={evalYear}
            unit={unit}
          />
        </div>
        <div className="flex flex-col gap-3 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-2">
            <MarketSharePieChart data={shareRows.map((r) => ({ entityDisplay: r.entityDisplay, value: r.value }))} year={evalYear} unit={unit} />
          </div>
          <div className="rounded-lg border border-border bg-brand-gray p-4 text-sm">
            <strong>📌 Concentración de la Producción ({evalYear}):</strong>
            <br />
            Los <strong>5 principales países</strong> representan el <strong>{top5Pct.toFixed(1)}%</strong> del volumen global producido en el planeta.
          </div>
        </div>
      </div>
    </>
  );
}
