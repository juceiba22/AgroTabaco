// Datos del informe "Destino de los fondos POA · Salta 2026".
// Fuente: resoluciones de POA publicadas por la SAGyP (magyp.gob.ar).
// Montos tomados del Artículo 1 de cada resolución.

const PDF_BASE = "https://storage.googleapis.com/tabaco-poas-pdfs-sagyp";

export type Resolucion = {
  id: string;
  fecha: string;
  subcomponente: string;
  monto: number;
  pdf: string;
  anexo?: string;
};

function res(
  id: string,
  fecha: string,
  subcomponente: string,
  monto: number,
  pdfCode: string,
  anexoCode?: string
): Resolucion {
  const prefix = `${PDF_BASE}/POA_SALTA_2026_RES_${id}`;
  return {
    id,
    fecha,
    subcomponente,
    monto,
    pdf: `${prefix}_${pdfCode}_Resoluci%C3%B3n_N_${id}.pdf`,
    anexo: anexoCode
      ? `${prefix}_${anexoCode}_Anexo_de_la_Resoluci%C3%B3n_N_${id}.pdf`
      : undefined,
  };
}

// Orden cronológico.
export const RESOLUCIONES: Resolucion[] = [
  res("42-2026", "21/04/2026", "Asistencia al mejoramiento de la calidad de tabaco en los centros comunitarios de estufados durante la campaña 2024-2025", 537_209_265.42, "159"),
  res("60-2026", "12/05/2026", "Vigilancia Fitosanitaria en Almácigos y en la etapa de plantación de tabaco, en Moho Azul y en plagas de importancia económica", 198_111.0, "157"),
  res("85-2026", "18/06/2026", "Cobertura Médico Asistencial para todos los Productores Tabacaleros", 5_486_341_356.91, "153"),
  res("97-2026", "29/06/2026", "Asistencia Financiera en el Área Social a través de los Programas: Capacitación en oficios, Jardines de cosecha, Porvenir y Forestación (Árboles nativos), para todos los Productores y Trabajadores rurales del sector Tabacalero, sus familias y vecinos de la zona", 708_274.1, "151"),
  res("111-2026", "15/07/2026", "Funcionamiento del Organismo de Aplicación Provincial del FET", 63_509_661.48, "149"),
  res("137-2026", "10/08/2026", "Resarcimiento al sistema productivo ante factores climáticos adversos", 7_913_630_359.76, "145"),
  res("156-2026", "27/08/2026", "Ampliación Resolución N°193/2025. Beneficios a la seguridad social del sector tabacalero salteño - Artículo 14 bis C.N.", 5_113_882_743.19, "000201", "000202"),
  res("165-2026", "08/09/2026", "Reconocimiento del Gasto de Energía Eléctrica incurrido por el Centro Comunitario de Estufado durante la Campaña 2024/2025", 1_120_828_810.59, "000200"),
  res("172-2026", "11/09/2026", "Compensación General de Producción", 58_505_635_844.0, "000198", "000199"),
  res("178-2026", "18/09/2026", "Información sobre la superficie plantada con tabaco en la provincia y su ubicación geográfica", 212_879_534.57, "000196", "000197"),
  res("182-2026", "23/09/2026", "Funcionamiento del Organismo de Aplicación Provincial del FET", 1_418_610_555.84, "000194", "000195"),
  res("198-2026", "14/10/2026", "Beneficios a la Seguridad Social del Sector Tabacalero Salteño – Artículo 14 bis C.N.", 11_722_486_288.13, "000192", "000193"),
  res("202-2026", "21/10/2026", "Ampliación Compensación de Carburante", 2_004_238_598.8, "000190", "000191"),
  res("210-2026", "29/10/2026", "Cobertura Médico Asistencial para todos los Productores Tabacaleros", 12_767_503_996.96, "000188", "000189"),
  res("218-2026", "03/11/2026", "Beneficios a la seguridad social del sector tabacalero salteño – Artículo 14 bis C.N.", 19_520_344_287.0, "000186", "000187"),
];

export const RESOLUCION_POR_ID = Object.fromEntries(
  RESOLUCIONES.map((r) => [r.id, r])
) as Record<string, Resolucion>;

export const TOTAL = 126_388_007_687.75;

export type Concepto = {
  concepto: string;
  resoluciones: string[];
  monto: number;
  pct: number;
};

export type Destinatario = {
  sigla: string;
  nombre?: string;
  rol: string;
  monto: number;
  pct: number;
  color: string;
  conceptos: Concepto[];
};

export const DESTINATARIOS: Destinatario[] = [
  {
    sigla: "COPROTAB",
    nombre: "Cooperativa de Productores Tabacaleros de Salta",
    rol: "Compensación general (excl. prep. de suelos), resarcimiento climático, carburante y funcionamiento FET",
    monto: 60_140_305_623.4,
    pct: 47.58,
    color: "#132a1e",
    conceptos: [
      { concepto: "Compensación general de producción (excl. preparación y acondicionamiento de suelos)", resoluciones: ["172-2026"], monto: 48_803_826_109.0, pct: 38.61 },
      { concepto: "Resarcimiento por factores climáticos adversos", resoluciones: ["137-2026"], monto: 7_913_630_359.76, pct: 6.26 },
      { concepto: "Compensación de carburante (gas natural y leña para curado)", resoluciones: ["202-2026"], monto: 2_004_238_598.8, pct: 1.59 },
      { concepto: "Funcionamiento del organismo de aplicación provincial del FET", resoluciones: ["182-2026"], monto: 1_418_610_555.84, pct: 1.12 },
    ],
  },
  {
    sigla: "SUMICLI",
    rol: "Entidad que recibe los fondos de seguridad social (Res. 156, 198 y 218)",
    monto: 36_356_713_318.32,
    pct: 28.77,
    color: "#2f6844",
    conceptos: [
      { concepto: "Seguridad social, Art. 14 bis (convenio de corresponsabilidad gremial)", resoluciones: ["218-2026", "198-2026", "156-2026"], monto: 36_356_713_318.32, pct: 28.77 },
    ],
  },
  {
    sigla: "AMPTS",
    nombre: "Asociación Mutual de Productores Tabacaleros de Salta",
    rol: "Organismo administrador (210 y 85) o ejecutor (178)",
    monto: 18_466_724_888.44,
    pct: 14.61,
    color: "#c59b27",
    conceptos: [
      { concepto: "Cobertura médico asistencial para productores", resoluciones: ["210-2026", "85-2026"], monto: 18_253_845_353.87, pct: 14.44 },
      { concepto: "Relevamiento de superficie plantada", resoluciones: ["178-2026"], monto: 212_879_534.57, pct: 0.17 },
    ],
  },
  {
    sigla: "Fertinorte",
    rol: "Entidad receptora de la partida de preparación y acondicionamiento de suelos (Res. 172-2026, Art. 3)",
    monto: 9_701_809_735.0,
    pct: 7.68,
    color: "#85a994",
    conceptos: [
      { concepto: "Preparación y acondicionamiento de suelos (Virginia)", resoluciones: ["172-2026"], monto: 9_701_809_735.0, pct: 7.68 },
    ],
  },
  {
    sigla: "CCE",
    nombre: "Fideicomiso Centro Comunitario de Estufado",
    rol: "Organismo administrador; la Cámara es ejecutor",
    monto: 1_658_038_076.01,
    pct: 1.31,
    color: "#446553",
    conceptos: [
      { concepto: "Energía eléctrica del centro de estufado", resoluciones: ["165-2026"], monto: 1_120_828_810.59, pct: 0.89 },
      { concepto: "Mejoramiento de la calidad en centros comunitarios de estufado", resoluciones: ["42-2026"], monto: 537_209_265.42, pct: 0.43 },
    ],
  },
  {
    sigla: "Gobierno de la Provincia de Salta",
    rol: "Directo: reasignaciones y rendiciones",
    monto: 64_416_046.58,
    pct: 0.05,
    color: "#a3ae9d",
    conceptos: [
      { concepto: "Reasignaciones y rendiciones menores", resoluciones: ["111-2026", "97-2026", "60-2026"], monto: 64_416_046.58, pct: 0.05 },
    ],
  },
];

// Resolución 172-2026, Artículo 3: reparto por etapa del cultivo.
export const RES_172_ACTIVIDADES = [
  { actividad: "Fase almácigos de plantines", monto: 3_221_746_115.0, pct: 5.5 },
  { actividad: "Preparación y acondicionamiento de suelos (Virginia)", monto: 9_701_809_735.0, pct: 16.6 },
  { actividad: "Participación de la mano de obra en el costo de producción", monto: 28_882_163_910.0, pct: 49.4 },
  { actividad: "Fase de cosecha", monto: 7_379_726_084.0, pct: 12.6 },
  { actividad: "Selección o tipificación de las hojas", monto: 9_320_190_000.0, pct: 15.9 },
];

// --- Formato es-AR ---

const pesos = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const millones = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const fmtPesos = (n: number) => `$ ${pesos.format(n)}`;
export const fmtMillones = (n: number) => `$ ${millones.format(n / 1_000_000)} M`;
export const fmtPct = (n: number, digits = 2) =>
  `${n.toLocaleString("es-AR", { minimumFractionDigits: digits, maximumFractionDigits: digits })} %`;
