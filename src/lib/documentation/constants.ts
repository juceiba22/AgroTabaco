// Documentación requerida a personas jurídicas para calificar al financiamiento
// en el Mercado de Valores Argentino (espejo de
// Agrotabaco_Solicitud_Documentacion_Persona_Juridica.pdf).
//
// Las claves están espejadas en el CHECK de documentation_files.document_key
// (supabase/migrations/0012_documentation_submissions.sql); igual los MIME
// types y el tope de tamaño, que además se fuerzan en el bucket "documentacion".

export const DOCUMENTATION_BUCKET = "documentacion";

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_FILES_PER_DOCUMENT = 10;

export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ACCEPT_ATTR = ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp";

export type DocumentKey =
  | "estatuto_acta"
  | "ddjj_bienes"
  | "estados_contables"
  | "ventas_post_balance"
  | "deudas_post_balance"
  | "dni_socios"
  | "certificado_mipyme"
  | "libro_accionistas"
  | "lineas_solicitadas";

export interface RequiredDocument {
  key: DocumentKey;
  label: string;
  hint?: string;
  // Sólo aplica si la sociedad es S.A.
  onlyIfSA?: boolean;
}

export const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  {
    key: "estatuto_acta",
    label: "Estatuto de la sociedad + Última acta de Directorio con distribución de cargos.",
  },
  {
    key: "ddjj_bienes",
    label:
      "Última DDJJ de Bs. Personales de los socios, con presentación y apertura de Bs. o MMBB firmada por Contador.",
  },
  {
    key: "estados_contables",
    label:
      "Copia simple de los últimos 2 estados contables certificados por Consejo Profesional de Ciencias Económicas.",
  },
  { key: "ventas_post_balance", label: "Ventas Post-Balance." },
  { key: "deudas_post_balance", label: "Deudas Post-Balance." },
  { key: "dni_socios", label: "Copia DNI de los socios.", hint: "Frente y dorso de cada socio." },
  { key: "certificado_mipyme", label: "Certificado MiPyME." },
  {
    key: "libro_accionistas",
    label: "Última hoja de libro de accionistas (en caso de ser S.A.).",
    onlyIfSA: true,
  },
  {
    key: "lineas_solicitadas",
    label: "Líneas solicitadas (detalle de monto, plazo y destino del financiamiento).",
  },
];

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
