"use client";

import { breakdownByObjetoPrograma, coberturaStats, rankingByProvincia, totalArsNominal } from "@/lib/filters";
import type { PoaTabaco } from "@/lib/types";

const usdFmt = (v: number) => `USD ${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const arsFmt = (v: number) => `$ ${v.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

export function ModuloResumen({ dataFiltrado, rangoAnios }: { dataFiltrado: PoaTabaco[]; rangoAnios: [number, number] }) {
  const cobertura = coberturaStats(dataFiltrado);
  const ars = totalArsNominal(dataFiltrado);
  const provincias = rankingByProvincia(dataFiltrado).slice(0, 5);
  const programas = breakdownByObjetoPrograma(dataFiltrado).slice(0, 5);
  const esRangoAmplio = rangoAnios[1] - rangoAnios[0] > 1;

  return (
    <>
      <div>
        <h3 className="font-serif text-lg font-bold text-brand-green-dark">📋 Resumen Ejecutivo</h3>
        <p className="text-sm text-muted-foreground">
          Vista general de los Planes Operativos Anuales (POAs) del Fondo Especial del Tabaco (Ley Nº 19.800) dentro del filtro
          seleccionado.
        </p>
      </div>

      <div className="data-notice">
        <strong>Metodología:</strong> el monto en <strong>USD</strong> (cobertura {cobertura.pctMontoUsd.toFixed(1)}% de los registros
        filtrados) es la única métrica comparable entre décadas, porque los montos en <strong>ARS</strong> nominales van de 1994 a 2026
        y quedan distorsionados por la inflación acumulada. El total en ARS que se muestra abajo corresponde únicamente al rango de
        años seleccionado ({rangoAnios[0]}–{rangoAnios[1]}){esRangoAmplio ? " y no debe compararse directamente entre esos años" : ""}.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="coverage-badge">USD verificado: {cobertura.pctMontoUsd.toFixed(1)}%</span>
          <p className="mt-2 text-sm text-muted-foreground">
            {cobertura.conMontoUsd.toLocaleString("es-AR")} de {cobertura.total.toLocaleString("es-AR")} POAs filtrados tienen un monto
            en USD calculado a partir de la cotización del día de la Resolución.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="coverage-badge">ARS nominal del rango: {arsFmt(ars.total)}</span>
          <p className="mt-2 text-sm text-muted-foreground">
            Suma de {ars.count.toLocaleString("es-AR")} registros con monto en pesos dentro del rango {rangoAnios[0]}–{rangoAnios[1]}.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="mb-2 font-serif text-sm font-bold text-brand-green-dark">Top 5 Provincias (USD histórico)</h4>
          <table className="w-full text-left text-sm">
            <tbody>
              {provincias.map((p) => (
                <tr key={p.provincia} className="border-b border-border/50">
                  <td className="py-1.5">{p.provinciaDisplay}</td>
                  <td className="py-1.5 text-right font-medium">{usdFmt(p.totalUsd)}</td>
                  <td className="py-1.5 text-right text-muted-foreground">{p.share.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="mb-2 font-serif text-sm font-bold text-brand-green-dark">Top 5 Programas (objeto_programa)</h4>
          <table className="w-full text-left text-sm">
            <tbody>
              {programas.map((p) => (
                <tr key={p.objetoPrograma} className="border-b border-border/50">
                  <td className="py-1.5">{p.objetoPrograma}</td>
                  <td className="py-1.5 text-right font-medium">{usdFmt(p.totalUsd)}</td>
                  <td className="py-1.5 text-right text-muted-foreground">{p.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
