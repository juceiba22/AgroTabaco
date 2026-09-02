/** Las 7 provincias tabacaleras reales presentes en el dataset. */
export const PROVINCIAS_CONOCIDAS = ["CATAMARCA", "CORRIENTES", "CHACO", "JUJUY", "MISIONES", "SALTA", "TUCUMAN"] as const;

/** Categoría de fila cuya provincia no pudo identificarse en la extracción. */
export const PROVINCIA_SIN_IDENTIFICAR = "S_PROVINCIA";

/** Los 9 valores limpios de objeto_programa, en el orden en que se listan en los filtros. */
export const OBJETOS_PROGRAMA = [
  "ASISTENCIA FINANCIERA / CRÉDITOS",
  "ADMINISTRACION / GENERAL",
  "EMERGENCIA SEQUÍA / CLIMÁTICA",
  "FERTILIZANTES E INSUMOS",
  "COBERTURA GRANIZO / CLIMA",
  "INFRAESTRUCTURA Y OBRAS",
  "CAPACITACIÓN / TECNIFICACIÓN",
  "SANIDAD VEGETAL",
] as const;
