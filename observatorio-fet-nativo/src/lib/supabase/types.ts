/**
 * Tipos de la base de datos de Supabase (mismo proyecto que el resto del
 * ecosistema, sólo con la tabla que usa esta app). Escrito a mano, mismo
 * patrón que los demás proyectos nativos.
 */
export type Database = {
  public: {
    Tables: {
      fact_poas_tabaco: {
        Row: {
          id: string;
          archivo_origen: string;
          provincia: string;
          provincia_display: string;
          anio_resolucion: number | null;
          fecha: string | null;
          campana_display: string | null;
          norma: string | null;
          nro_expediente: string | null;
          componente: string | null;
          subcomponente: string | null;
          objeto_programa: string | null;
          tipo_asistencia: string | null;
          modalidad_desembolso: string | null;
          zona_o_departamento: string | null;
          monto_ars: number | null;
          cotizacion_usd: number | null;
          monto_usd: number | null;
          organismo_ejecutor: string | null;
          firmante_autoridad: string | null;
          cuenta_bancaria_debito: string | null;
          convenio_marco: string | null;
          es_anexo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["fact_poas_tabaco"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["fact_poas_tabaco"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
