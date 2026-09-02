import { createClient } from "@/lib/supabase/server";
import type { TobaccoProduction } from "@/lib/panels/mercado-internacional/types";

const PAGE_SIZE = 1000;

/**
 * fact_tobacco_production tiene ~10.700 filas — supera el límite default de
 * PostgREST de 1000 filas por request. A diferencia de los otros datasets
 * del ecosistema nativo (todos por debajo de ese límite), acá hace falta
 * paginar explícitamente con .range() hasta agotar la tabla.
 */
export async function getTobaccoProduction(): Promise<TobaccoProduction[]> {
  const supabase = await createClient();
  const rows: TobaccoProduction[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("fact_tobacco_production")
      .select("*")
      .order("year", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;

    for (const row of data) {
      rows.push({
        entity: row.entity,
        code: row.code,
        year: row.year,
        valueTonnes: row.value_tonnes,
        entityType: row.entity_type,
        entityDisplay: row.entity_display,
      });
    }

    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}
