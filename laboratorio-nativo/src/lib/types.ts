export type VolumenPrecio = {
  fecha: string; // ISO date, día 1 del mes
  precioInferior: number | null;
  precioPromedioPonderado: number | null;
  precioSuperior: number | null;
  primerQuartil: number | null;
  segundoQuartil: number | null;
  tercerQuartil: number | null;
  cuartoQuartil: number | null;
  totalPaquetes: number | null;
};

export type ParticipacionMes = {
  fecha: string;
  empresasGrandes: number | null;
  porcentajeParticipacionGrandes: number | null;
  empresasPymes: number | null;
  porcentajeParticipacionPymes: number | null;
  totalMercado: number | null;
};

export type ConsumoAnio = {
  anio: number;
  totalPaquetes: number | null;
  poblacion: number | null;
  consumoAparente: number | null;
};
