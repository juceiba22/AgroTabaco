import type { TobaccoProduction } from "@/lib/types";

/** Port de get_top_producers() en data_loader.py (líneas 262-273). */
export function getTopProducers(
  data: TobaccoProduction[],
  year: number,
  topN: number,
  onlyCountries = true
): TobaccoProduction[] {
  let filtered = data.filter((d) => d.year === year);
  filtered = onlyCountries ? filtered.filter((d) => d.entityType === "Country") : filtered.filter((d) => d.entity !== "World");
  return [...filtered].sort((a, b) => b.valueTonnes - a.valueTonnes).slice(0, topN);
}

export type ShareRow = { entity: string; entityDisplay: string; code: string | null; value: number; percentage: number; category: string };

/** Port de get_market_share() en data_loader.py (líneas 276-317). */
export function getMarketShare(data: TobaccoProduction[], year: number, topN = 5): { rows: ShareRow[]; totalWorld: number } {
  const yearData = data.filter((d) => d.year === year);
  const worldRow = yearData.find((d) => d.entity === "World");
  const totalWorld = worldRow ? worldRow.valueTonnes : yearData.filter((d) => d.entityType === "Country").reduce((s, d) => s + d.valueTonnes, 0);

  const countries = yearData.filter((d) => d.entityType === "Country").sort((a, b) => b.valueTonnes - a.valueTonnes);
  const topCountries = countries.slice(0, topN);
  const topSum = topCountries.reduce((s, d) => s + d.valueTonnes, 0);
  const restVal = Math.max(0, totalWorld - topSum);

  const rows: ShareRow[] = topCountries.map((d) => ({
    entity: d.entity,
    entityDisplay: d.entityDisplay,
    code: d.code,
    value: d.valueTonnes,
    percentage: totalWorld > 0 ? (d.valueTonnes / totalWorld) * 100 : 0,
    category: "Top Productores",
  }));

  if (restVal > 0) {
    rows.push({
      entity: "Rest of the World",
      entityDisplay: "🌍 Resto del Mundo",
      code: "ROW",
      value: restVal,
      percentage: totalWorld > 0 ? (restVal / totalWorld) * 100 : 0,
      category: "Resto del Mundo",
    });
  }

  return { rows, totalWorld };
}

export function sum(values: number[]): number {
  return values.reduce((a, v) => a + v, 0);
}
