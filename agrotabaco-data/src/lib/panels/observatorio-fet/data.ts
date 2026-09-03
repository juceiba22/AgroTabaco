import { cachedFetch } from "@/lib/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { PoaTabaco } from "@/lib/panels/observatorio-fet/types";

const PAGE_SIZE = 1000;

/**
 * fact_poas_tabaco tiene ~2.737 filas — supera el límite default de
 * PostgREST de 1000 filas por request, igual que fact_tobacco_production en
 * mercado-global-nativo. Hace falta paginar explícitamente con .range()
 * hasta agotar la tabla.
 *
 * Cacheado 1h en memoria del proceso: son ~3 round-trips secuenciales a
 * Supabase — repetirlos en cada visita (la página es force-dynamic por la
 * sesión) era el principal cuello de botella de este panel. Nota: el
 * dataset serializado pesa ~2.6MB, por eso no se usa unstable_cache de Next
 * (su Data Cache rechaza entradas de más de 2MB).
 */
export const getPoasTabaco = cachedFetch(
  "observatorio-fet-poas-tabaco",
  3600_000,
  async (): Promise<PoaTabaco[]> => {
    const supabase = createPublicClient();
    const rows: PoaTabaco[] = [];
    let from = 0;

    while (true) {
      const { data, error } = await supabase
        .from("fact_poas_tabaco")
        .select("*")
        .order("anio_resolucion", { ascending: true })
        .range(from, from + PAGE_SIZE - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;

      for (const row of data) {
        rows.push({
          archivoOrigen: row.archivo_origen,
          provincia: row.provincia,
          provinciaDisplay: row.provincia_display,
          anioResolucion: row.anio_resolucion,
          fecha: row.fecha,
          campanaDisplay: row.campana_display,
          norma: row.norma,
          nroExpediente: row.nro_expediente,
          componente: row.componente,
          subcomponente: row.subcomponente,
          objetoPrograma: row.objeto_programa,
          tipoAsistencia: row.tipo_asistencia,
          modalidadDesembolso: row.modalidad_desembolso,
          zonaODepartamento: row.zona_o_departamento,
          montoArs: row.monto_ars,
          cotizacionUsd: row.cotizacion_usd,
          montoUsd: row.monto_usd,
          organismoEjecutor: row.organismo_ejecutor,
          firmanteAutoridad: row.firmante_autoridad,
          cuentaBancariaDebito: row.cuenta_bancaria_debito,
          convenioMarco: row.convenio_marco,
          esAnexo: row.es_anexo,
        });
      }

      if (data.length < PAGE_SIZE) break;
      from += PAGE_SIZE;
    }

    return rows;
  }
);
