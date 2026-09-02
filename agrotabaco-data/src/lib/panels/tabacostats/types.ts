export type ProduccionPrimaria = {
  campana: string;
  anioInicio: number;
  provincia: string;
  tipoTabaco: string;
  ambito: "PROVINCIAL" | "NACIONAL";
  esTotal: boolean;
  supSembradaHa: number | null;
  supCosechadaHa: number | null;
  produccionKg: number | null;
  produccionTn: number | null;
  rendimientoKgHa: number | null;
  precioAcopioUnitario: number | null;
  precioFetUnitario: number | null;
  precioTotalUnitario: number | null;
  valorTotalEstimado: number | null;
};

export type AcopioClase = {
  campana: string;
  anioInicio: number;
  provincia: string;
  tipoTabaco: string;
  claseComercial: string;
  esTotalClase: boolean;
  volumenKg: number;
  volumenTn: number;
};

export type AcopioEmpresa = {
  campana: string;
  anioInicio: number;
  provincia: string;
  tipoTabaco: string;
  razonSocial: string;
  esSubtotalEmpresa: boolean;
  volumenAcopioKg: number;
  volumenTn: number;
  valorAcopioPesos: number;
  precioPromedioEmpresa: number | null;
};

export type AcopioPrecio = {
  campana: string;
  anioInicio: number;
  provincia: string;
  tipoTabaco: string;
  esSubtotalProvincial: boolean;
  esTotalNacional: boolean;
  volumenKg: number;
  volumenTn: number;
  valorAcopioPesos: number;
  precioAcopioPromedio: number;
  valorFetPesos: number;
  precioFetPromedio: number;
  valorTotalPesos: number;
  precioTotalPromedio: number;
  pctFet: number;
  pctAcopio: number;
};

export type MercadoInternacional = {
  variety: "Virginia" | "Burley";
  year: number;
  valueUsd: number;
  isYtd: boolean;
};

export type PrecioResolucion = {
  campana: string;
  etapaPago: string | null;
  fecha: string | null;
  archivoOrigen: string;
  tabaco: string;
  clase: string | null;
  porcentaje: number | null;
  adelanto1: number | null;
  adelanto2: number | null;
  incremento: number | null;
  precioTotalAcumulado: number | null;
  adelanto1Usd: number | null;
  adelanto2Usd: number | null;
  incrementoUsd: number | null;
  precioTotalAcumuladoUsd: number | null;
};
