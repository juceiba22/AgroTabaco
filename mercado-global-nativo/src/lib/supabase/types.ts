/**
 * Tipos de la base de datos de Supabase (mismo proyecto que el resto del
 * ecosistema, sólo con la tabla que usa esta app). Escrito a mano, mismo
 * patrón que los demás proyectos nativos.
 */
export type Database = {
  public: {
    Tables: {
      fact_tobacco_production: {
        Row: {
          id: string;
          entity: string;
          code: string | null;
          year: number;
          value_tonnes: number;
          entity_type: "Country" | "Aggregate";
          entity_display: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["fact_tobacco_production"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["fact_tobacco_production"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
