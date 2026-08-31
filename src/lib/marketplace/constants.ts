// Listas de referencia del marketplace "Mercado Argentino de Tabaco".
//
// VARIETIES y PROVINCES están espejadas en el CHECK de
// supabase/migrations/0003_marketplace.sql — si se agrega/quita un valor acá
// hay que actualizar también esa migración (y viceversa).
//
// TRADING_CLASSES NO tiene CHECK en la base (hay 70+ códigos reales y
// variantes válidas relevadas de acopio_historico_unificado.csv, y de tanto
// en tanto aparecen nuevos). Esta lista es sólo para poblar el <Select> del
// formulario de publicación; el campo queda como texto libre en el backend.

export const VARIETIES = [
  "VIRGINIA",
  "BURLEY",
  "CRIOLLO MISIONERO",
  "CRIOLLO CORRENTINO",
  "CRIOLLO CHAQUEÑO",
  "CRIOLLO ARGENTINO",
  "CRIOLLO SALTEÑO",
  "KENTUCKY",
  "KENTUCKY AHUMADO",
] as const;

export const PROVINCES = [
  "CATAMARCA",
  "CHACO",
  "CORRIENTES",
  "JUJUY",
  "MISIONES",
  "SALTA",
  "TUCUMAN",
] as const;

// Clases comerciales relevadas de acopio_historico_unificado.csv
// (columna clase_comercial, excluyendo filas es_total_clase=true).
export const TRADING_CLASSES = [
  "B1", "B1F", "B1FR", "B1L", "B2", "B2F", "B2FR", "B2KF", "B2KL", "B2L",
  "B3", "B3F", "B3FR", "B3K", "B3KF", "B3KL", "B3L", "B4F", "B4L",
  "C1", "C1F", "C1L", "C2", "C2F", "C2K", "C2L", "C3", "C3F", "C3K", "C3L",
  "C4F", "C4L",
  "CH1", "CH2", "CH3",
  "H1F", "H2F", "H3F",
  "N", "N4", "N5", "N5B", "N5C", "N5K", "N5X", "NB", "NG", "NVB", "NVC",
  "NVX", "NX",
  "T", "T1", "T1F", "T1FR", "T1L", "T2", "T2F", "T2FR", "T2KF", "T2KL",
  "T2L", "T3K", "T4",
  "X1", "X1F", "X1L", "X2", "X2F", "X2K", "X2L", "X3F", "X3K", "X3L", "X4",
  "X4F", "X4L",
] as const;

export type HsCodeEntry = {
  code: string;
  label: string;
  variety: "VIRGINIA" | "BURLEY";
  description: string;
};

// Posiciones arancelarias HS-10 de EE.UU. (Census Bureau / USDA GATS) para
// tabaco trillado Virginia y Burley. Mismos 10 códigos que el CHECK de
// hs_code en 0003_marketplace.sql y que HS_CODE_VARIETY en
// mercado-argentino-tabaco/app.py (pestaña Mercado Internacional).
export const HS_CODES: HsCodeEntry[] = [
  {
    code: "2401208005",
    label: "FLU,ST,THRS,CIG",
    variety: "VIRGINIA",
    description: "Virginia despalillado y trillado para cigarrillos",
  },
  {
    code: "2401208010",
    label: "FLU,ST,THRS",
    variety: "VIRGINIA",
    description: "Virginia despalillado y trillado (código histórico, previo a 2011)",
  },
  {
    code: "2401208011",
    label: "FLU,ST,THRS,NCIG",
    variety: "VIRGINIA",
    description: "Virginia despalillado y trillado, uso no cigarrillo",
  },
  {
    code: "2401202810",
    label: "FLU,ST,NTH",
    variety: "VIRGINIA",
    description: "Virginia despalillado sin trillar",
  },
  {
    code: "2401105130",
    label: "FLUE-CURED,UNST",
    variety: "VIRGINIA",
    description: "Virginia en rama, sin despalillar",
  },
  {
    code: "2401208015",
    label: "BLY,ST,THRS,CIG",
    variety: "BURLEY",
    description: "Burley despalillado y trillado para cigarrillos",
  },
  {
    code: "2401208020",
    label: "BLY,ST,THRS",
    variety: "BURLEY",
    description: "Burley despalillado y trillado (código histórico, previo a 2011)",
  },
  {
    code: "2401208021",
    label: "BLY,ST,THRS,NCIG",
    variety: "BURLEY",
    description: "Burley despalillado y trillado, uso no cigarrillo",
  },
  {
    code: "2401202820",
    label: "BLY,ST,NTH",
    variety: "BURLEY",
    description: "Burley despalillado sin trillar",
  },
  {
    code: "2401105160",
    label: "BURLEY,UNST",
    variety: "BURLEY",
    description: "Burley en rama, sin despalillar",
  },
];

export const CURRENCIES = ["USD", "ARS"] as const;

export const LISTING_TYPE_LABELS: Record<"venta" | "compra", string> = {
  venta: "Vendo",
  compra: "Busco comprar",
};

export const PRODUCT_TYPE_LABELS: Record<"verde" | "procesado", string> = {
  verde: "Tabaco verde (sin procesar)",
  procesado: "Tabaco procesado (exportación)",
};

export const LISTING_STATUS_LABELS: Record<"activa" | "pausada" | "cerrada", string> = {
  activa: "Activa",
  pausada: "Pausada",
  cerrada: "Cerrada",
};
