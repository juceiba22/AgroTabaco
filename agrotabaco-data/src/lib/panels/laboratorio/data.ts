import { cachedFetch } from "@/lib/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { ConsumoAnio, ParticipacionMes, VolumenPrecio } from "@/lib/panels/laboratorio/types";

const TTL_MS = 3600_000;

export const getVolumenPrecios = cachedFetch(
  "laboratorio-volumen-precios",
  TTL_MS,
  async (): Promise<VolumenPrecio[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("fact_volumen_precios")
      .select("*")
      .order("fecha", { ascending: true });
    if (error) throw error;

    return (data ?? []).map((row) => ({
      fecha: row.fecha,
      precioInferior: row.precio_inferior,
      precioPromedioPonderado: row.precio_promedio_ponderado,
      precioSuperior: row.precio_superior,
      primerQuartil: row.primer_quartil,
      segundoQuartil: row.segundo_quartil,
      tercerQuartil: row.tercer_quartil,
      cuartoQuartil: row.cuarto_quartil,
      totalPaquetes: row.total_paquetes,
    }));
  }
);

export const getParticipacionMercado = cachedFetch(
  "laboratorio-participacion-mercado",
  TTL_MS,
  async (): Promise<ParticipacionMes[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("fact_participacion_mercado")
      .select("*")
      .order("fecha", { ascending: true });
    if (error) throw error;

    return (data ?? []).map((row) => ({
      fecha: row.fecha,
      empresasGrandes: row.empresas_grandes,
      porcentajeParticipacionGrandes: row.porcentaje_participacion_grandes,
      empresasPymes: row.empresas_pymes,
      porcentajeParticipacionPymes: row.porcentaje_participacion_pymes,
      totalMercado: row.total_mercado,
    }));
  }
);

export const getConsumoAparente = cachedFetch(
  "laboratorio-consumo-aparente",
  TTL_MS,
  async (): Promise<ConsumoAnio[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("fact_consumo_aparente")
      .select("*")
      .order("anio", { ascending: true });
    if (error) throw error;

    return (data ?? []).map((row) => ({
      anio: row.anio,
      totalPaquetes: row.total_paquetes,
      poblacion: row.poblacion,
      consumoAparente: row.consumo_aparente,
    }));
  }
);
