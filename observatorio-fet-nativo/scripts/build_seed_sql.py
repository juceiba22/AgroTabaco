"""
build_seed_sql.py

Lee "observatorio-fet-data/base_datos_poas_tabaco_local.csv" (extracción masiva de
Resoluciones/Anexos de Planes Operativos Anuales financiados con el Fondo
Especial del Tabaco), aplica la limpieza "una sola vez" descripta en el plan
aprobado, y genera supabase/seed_poas_tabaco.sql para la tabla creada en
supabase/migrations/0009_fact_poas_tabaco.sql.

Limpieza aplicada (ver plan para el detalle completo de cada decisión):
- Excluye por completo la fila con provincia == 'ERROR' (el pipeline de
  origen no pudo abrir ese PDF; no aporta ningún dato real).
- provincia_display: nombre legible por provincia; S_PROVINCIA -> "Sin
  Identificar" (la extracción no pudo determinar la provincia real).
- anio_resolucion: año de `fecha` (ISO, confiable en 2737/2738 filas); si
  falta, se extrae del primer año de 4 dígitos en `archivo_origen`.
- campana_display: sólo se acepta campana_poa cuando matchea un patrón de
  año/rango de años válido; si no, se genera un fallback "Campaña {año}" a
  partir de anio_resolucion. campana_poa NUNCA se usa como filtro/eje.
- componente/subcomponente: trim + colapso de espacios (sin tocar casing).
- monto_ars / cotizacion_usd / monto_usd: quedan NULL si faltan (no se
  fuerza a 0 — son columnas de cobertura parcial, la distinción entre "sin
  dato" y "cero" importa para el Observatorio).
- es_anexo: "SI"/"NO" -> boolean.

No toca la base de datos — sólo lee el CSV local y escribe un .sql. El
usuario lo corre en el SQL Editor de Supabase, igual que las migraciones.
Re-ejecutable: la tabla se trunca antes de insertar (en la primera parte).

El resultado se parte en varios archivos seed_poas_tabaco_parteXdeN.sql
porque el texto libre de este dataset (componente, convenio_marco, etc.)
lo hace mucho más pesado por fila que los otros datasets del ecosistema
nativo, y el SQL Editor de Supabase rechaza pegar un archivo único
("Query is too large"). Correr los N archivos en orden.

Uso: python scripts/build_seed_sql.py
"""

import math
import os
import re

import pandas as pd

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
SOURCE_PATH = os.path.join(REPO_ROOT, "observatorio-fet-data", "base_datos_poas_tabaco_local.csv")
OUTPUT_PATH = os.path.join(REPO_ROOT, "supabase", "seed_poas_tabaco.sql")

CHUNK_SIZE = 200
ROWS_PER_FILE = 700

PROVINCIA_DISPLAY = {
    "CATAMARCA": "Catamarca",
    "CORRIENTES": "Corrientes",
    "CHACO": "Chaco",
    "JUJUY": "Jujuy",
    "MISIONES": "Misiones",
    "SALTA": "Salta",
    "TUCUMAN": "Tucumán",
    "S_PROVINCIA": "Sin Identificar",
}

CAMPANA_YEAR_RANGE = re.compile(r"^(19|20)\d{2}-(19|20)\d{2}$")
CAMPANA_SINGLE_YEAR = re.compile(r"^(19|20)\d{2}$")
CAMPANA_SHORT_RANGE = re.compile(r"^((19|20)\d{2})-(\d{2})$")
ARCHIVO_YEAR = re.compile(r"(19|20)\d{2}")


def read_csv_robust(path):
    for enc in ["utf-8-sig", "utf-8", "latin-1", "cp1252"]:
        try:
            return pd.read_csv(path, encoding=enc, dtype=str, keep_default_na=False)
        except Exception:
            continue
    return pd.read_csv(path, encoding="latin-1", dtype=str, keep_default_na=False)


def clean_text(value):
    if value is None:
        return None
    s = re.sub(r"\s+", " ", str(value)).strip()
    return s if s else None


def parse_anio_resolucion(fecha, archivo_origen):
    if fecha:
        m = re.match(r"^(\d{4})-\d{2}-\d{2}$", fecha.strip())
        if m:
            return int(m.group(1))
    m = ARCHIVO_YEAR.search(archivo_origen or "")
    return int(m.group(0)) if m else None


def parse_campana_display(campana_poa, anio_resolucion):
    raw = (campana_poa or "").strip()
    if CAMPANA_SINGLE_YEAR.match(raw):
        return raw
    if CAMPANA_YEAR_RANGE.match(raw):
        return raw.replace("-", "/")
    m = CAMPANA_SHORT_RANGE.match(raw)
    if m:
        year1 = int(m.group(1))
        last2 = year1 % 100
        nn = int(m.group(3))
        if nn == (last2 + 1) % 100:
            return f"{year1}/{year1 + 1}"
    if anio_resolucion:
        return f"Campaña {anio_resolucion}"
    return None


def parse_provincia(raw):
    p = (raw or "").strip().upper()
    return p if p else None


def parse_numeric(value):
    v = (value or "").strip()
    if not v:
        return None
    try:
        return float(v)
    except ValueError:
        return None


def parse_bool_si_no(value):
    v = (value or "").strip().upper()
    if v == "SI":
        return True
    if v == "NO":
        return False
    return False


def sql_str(value):
    if value is None:
        return "null"
    return "'" + str(value).replace("'", "''") + "'"


def sql_num(value):
    if value is None:
        return "null"
    return repr(float(value))


def sql_bool(value):
    return "true" if value else "false"


def sql_int(value):
    return "null" if value is None else str(int(value))


def main():
    df = read_csv_robust(SOURCE_PATH)
    df.columns = [c.strip() for c in df.columns]

    # Excluye la fila ERROR (el pipeline no pudo abrir ese PDF fuente).
    df = df[df["provincia"].str.strip().str.upper() != "ERROR"].reset_index(drop=True)

    rows_sql = []
    for _, row in df.iterrows():
        provincia = parse_provincia(row["provincia"])
        provincia_display = PROVINCIA_DISPLAY.get(provincia, provincia or "Sin Identificar")
        fecha = clean_text(row["fecha"])
        anio_resolucion = parse_anio_resolucion(fecha, row["archivo_origen"])
        campana_display = parse_campana_display(row["campana_poa"], anio_resolucion)

        values = "({}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {})".format(
            sql_str(clean_text(row["archivo_origen"])),
            sql_str(provincia),
            sql_str(provincia_display),
            sql_int(anio_resolucion),
            sql_str(fecha),
            sql_str(campana_display),
            sql_str(clean_text(row["norma"])),
            sql_str(clean_text(row["nro_expediente"])),
            sql_str(clean_text(row["componente"])),
            sql_str(clean_text(row["subcomponente"])),
            sql_str(clean_text(row["objeto_programa"])),
            sql_str(clean_text(row["tipo_asistencia"])),
            sql_str(clean_text(row["modalidad_desembolso"])),
            sql_str(clean_text(row["zona_o_departamento"])),
            sql_num(parse_numeric(row["monto_ars"])),
            sql_num(parse_numeric(row["cotizacion_usd"])),
            sql_num(parse_numeric(row["monto_usd"])),
            sql_str(clean_text(row["organismo_ejecutor"])),
            sql_str(clean_text(row["firmante_autoridad"])),
            sql_str(clean_text(row["cuenta_bancaria_debito"])),
            sql_str(clean_text(row["convenio_marco"])),
            sql_bool(parse_bool_si_no(row["es_anexo"])),
        )
        rows_sql.append(values)

    cols = (
        "archivo_origen, provincia, provincia_display, anio_resolucion, fecha, "
        "campana_display, norma, nro_expediente, componente, subcomponente, "
        "objeto_programa, tipo_asistencia, modalidad_desembolso, zona_o_departamento, "
        "monto_ars, cotizacion_usd, monto_usd, organismo_ejecutor, firmante_autoridad, "
        "cuenta_bancaria_debito, convenio_marco, es_anexo"
    )

    # El SQL Editor de Supabase rechaza pegar todo el archivo de una vez
    # ("Query is too large") si supera ~800 KB por el texto largo de
    # componente/subcomponente/convenio_marco (a diferencia de los otros
    # datasets nativos, más numéricos y livianos por fila). Se parte en
    # varios archivos secuenciales, bien por debajo de ese límite.
    base, ext = os.path.splitext(OUTPUT_PATH)
    n_parts = math.ceil(len(rows_sql) / ROWS_PER_FILE)
    output_paths = []

    for part in range(n_parts):
        part_rows = rows_sql[part * ROWS_PER_FILE : (part + 1) * ROWS_PER_FILE]
        part_path = f"{base}_parte{part + 1}de{n_parts}{ext}"
        output_paths.append(part_path)

        with open(part_path, "w", encoding="utf-8") as f:
            f.write(
                "-- Generado por observatorio-fet-nativo/scripts/build_seed_sql.py a partir de\n"
                '-- "observatorio-fet-data/base_datos_poas_tabaco_local.csv".\n'
                f"-- Parte {part + 1} de {n_parts} — correr los {n_parts} archivos EN ORDEN en el\n"
                "-- SQL Editor de Supabase, después de 0009_fact_poas_tabaco.sql.\n"
                f"-- Filas en esta parte: {len(part_rows)} (total: {len(rows_sql)}, excluye 1 fila ERROR del CSV original).\n\n"
            )
            if part == 0:
                f.write("truncate table public.fact_poas_tabaco;\n")
            for i in range(0, len(part_rows), CHUNK_SIZE):
                chunk = part_rows[i : i + CHUNK_SIZE]
                values_sql = ",\n  ".join(chunk)
                f.write(f"insert into public.fact_poas_tabaco ({cols}) values\n  {values_sql};\n")

    print(f"fact_poas_tabaco: {len(rows_sql)} filas")
    for p in output_paths:
        print(f"Escrito: {p} ({os.path.getsize(p):,} bytes)")


if __name__ == "__main__":
    main()
