"""
build_seed_sql.py

Lee los CSV fuente de mercado-argentino-tabaco/ (mismos que usa el
dashboard Streamlit "TabacoStats Argentina"), aplica la misma
limpieza/ETL ya validada en mercado-argentino-tabaco/app.py
(sanitize_province, sanitize_tobacco, clean_company_name, la corrección de
escala de unidades de acopio por empresas, el parseo ragged de
"Standard Query_40990.csv" con HS_CODE_VARIETY), y genera
supabase/seed_tabacostats.sql con TRUNCATE + INSERT para las 6 tablas
creadas en supabase/migrations/0007_fact_tabacostats.sql.

No toca la base de datos — sólo lee CSVs locales y escribe un .sql. El
usuario corre ese .sql en el SQL Editor de Supabase, igual que las
migraciones. Es re-ejecutable: cada tabla se trunca antes de insertar (no
hay una clave natural única simple en la mayoría de estas tablas, a
diferencia de "fecha" en el piloto de Laboratorio Estadístico).

Uso: python scripts/build_seed_sql.py
"""

import csv as csv_module
import io
import os
import re

import numpy as np
import pandas as pd

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
SOURCE_DIR = os.path.join(REPO_ROOT, "mercado-argentino-tabaco")
OUTPUT_PATH = os.path.join(REPO_ROOT, "supabase", "seed_tabacostats.sql")

CHUNK_SIZE = 200


def data_path(filename):
    return os.path.join(SOURCE_DIR, filename)


def read_csv_robust(filename, sep=","):
    for enc in ["utf-8-sig", "latin-1", "cp1252"]:
        try:
            return pd.read_csv(data_path(filename), sep=sep, encoding=enc)
        except Exception:
            continue
    return pd.read_csv(data_path(filename), sep=sep, encoding="latin-1")


# --- ETL port literal de mercado-argentino-tabaco/app.py (líneas 276-346) ---

def sanitize_province(p):
    if not isinstance(p, str):
        return "Total Nacional"
    p_up = p.upper().strip()
    if "TUCUM" in p_up:
        return "Tucumán"
    if "CORRIENT" in p_up:
        return "Corrientes"
    if "MISION" in p_up:
        return "Misiones"
    if "CATAMARC" in p_up:
        return "Catamarca"
    if "JUJUY" in p_up:
        return "Jujuy"
    if "SALTA" in p_up:
        return "Salta"
    if "CHACO" in p_up:
        return "Chaco"
    if "TOTAL" in p_up or "NACIONAL" in p_up:
        return "Total Nacional"
    return p.strip().title()


def sanitize_tobacco(t):
    if not isinstance(t, str):
        return "Total"
    t_up = t.upper().strip()
    if "VIRGIN" in t_up or "VIRIGIN" in t_up:
        return "Virginia"
    if "BURLEY" in t_up:
        return "Burley"
    if "KENTUCK" in t_up:
        if "AHUMAD" in t_up:
            return "Kentucky Ahumado"
        return "Kentucky"
    if "MISIONER" in t_up or "CR. MISIONERO" in t_up or "C. MISIONERO" in t_up:
        return "Criollo Misionero"
    if "CORRENTIN" in t_up or "CR. CORRENTINO" in t_up or "C. CORRENTINO" in t_up:
        return "Criollo Correntino"
    if "CHAQUE" in t_up or "CR. CHAQUE" in t_up or "C. CHAQUE" in t_up:
        return "Criollo Chaqueño"
    if "ARGENTIN" in t_up or "CR. ARGENTINO" in t_up or "C. ARGENTINO" in t_up:
        return "Criollo Argentino"
    if "SALTE" in t_up or "CR. SALTE" in t_up or "C. SALTE" in t_up:
        return "Criollo Salteño"
    if "SUBTOTAL" in t_up:
        return "Subtotal Provincial"
    if "TOTAL" in t_up:
        return "Total Nacional"
    return t.strip().title()


def clean_company_name(c):
    if not isinstance(c, str):
        return ""
    c = c.strip()
    c = re.sub(r"[\x81\x91\xad�]", "", c)
    c = re.sub(r"\s+", " ", c).strip()
    c_up = c.upper()
    if "COPROTAB" in c_up or ("COOP" in c_up and "SALTA" in c_up):
        return "Cooperativa de Salta (COPROTAB)"
    if "CTJ" in c_up or ("COOP" in c_up and "JUJUY" in c_up):
        return "Cooperativa de Jujuy (CTJ)"
    if "CTM" in c_up or ("COOP" in c_up and "MISIONES" in c_up and "AGROINDUSTRIAL" in c_up):
        return "Cooperativa Agroindustrial de Misiones (CTM)"
    if "COTAVI" in c_up or ("COOP" in c_up and "SAN VICENTE" in c_up):
        return "Cooperativa San Vicente (COTAVI)"
    if "COPAT" in c_up or ("COOP" in c_up and "TUCUM" in c_up):
        return "Cooperativa de Tucumán (COPAT)"
    if "COOP" in c_up and "CHACO" in c_up:
        return "Cooperativa del Chaco"
    if "COOP" in c_up and "CORRIENTES" in c_up:
        return "Cooperativa de Corrientes"
    if "MASSALIN" in c_up:
        if "JUJUY" in c_up:
            return "Massalin Particulares (Jujuy)"
        if "SALTA" in c_up:
            return "Massalin Particulares (Salta)"
        if "MISIONES" in c_up:
            return "Massalin Particulares (Misiones)"
        return "Massalin Particulares"
    if "ALLIANCE" in c_up:
        if "JUJUY" in c_up:
            return "Alliance One (Jujuy)"
        if "SALTA" in c_up:
            return "Alliance One (Salta)"
        if "MISIONES" in c_up:
            return "Alliance One (Misiones)"
        if "TUCUM" in c_up:
            return "Alliance One (Tucumán)"
        if "GOYA" in c_up or "CORRIENTES" in c_up:
            return "Alliance One (Corrientes)"
        return "Alliance One"
    if "TABES" in c_up:
        return "Tabes S.A."
    if "BONPLAND" in c_up:
        return "Bonpland Leaf S.A."
    if "CIMA" in c_up or "MISIONERA ARGENTINA" in c_up:
        return "CIMA S.A."
    if "CRECER" in c_up:
        return "Crecer S.R.L."
    return c.title()


def anio_inicio_de_campana(campana):
    s = str(campana)
    if "/" in s:
        return int(s.split("/")[0])
    return int(s[:4])


# --- Loaders, port literal de las funciones load_* de app.py ---

def load_produccion_primaria():
    df = read_csv_robust("csv_anuario_produccion_primaria.csv")
    df.columns = [c.replace("﻿", "").strip() for c in df.columns]
    df["provincia"] = df["provincia"].apply(sanitize_province)
    df["tipo_tabaco"] = df["tipo_tabaco"].apply(sanitize_tobacco)
    df["campana"] = df["campana"].astype(str).str.strip()
    df["es_total"] = df["es_total"].astype(str).str.strip().str.lower().isin(["true", "1", "t"])
    for col in [
        "sup_sembrada_ha", "sup_cosechada_ha", "produccion_kg", "rendimiento_kg_ha",
        "precio_acopio_unitario", "precio_fet_unitario", "precio_total_unitario",
    ]:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df["produccion_tn"] = df["produccion_kg"] / 1000.0
    df["anio_inicio"] = df["campana"].apply(anio_inicio_de_campana)
    mask_y = df["rendimiento_kg_ha"].isna() & (df["sup_cosechada_ha"] > 0) & (df["produccion_kg"] > 0)
    df.loc[mask_y, "rendimiento_kg_ha"] = (
        df.loc[mask_y, "produccion_kg"] / df.loc[mask_y, "sup_cosechada_ha"]
    ).round(1)
    df["valor_total_estimado"] = df["produccion_kg"] * df["precio_total_unitario"]
    return df


def load_acopio_clases():
    df = read_csv_robust("acopio_historico_unificado.csv", sep=";")
    df.columns = [c.replace("﻿", "").strip() for c in df.columns]
    df["provincia"] = df["provincia"].apply(sanitize_province)
    df["tipo_tabaco"] = df["tipo_tabaco"].apply(sanitize_tobacco)
    df["campana"] = df["campana"].astype(str).str.strip()
    df["clase_comercial"] = df["clase_comercial"].astype(str).str.strip().str.upper()
    df["es_total_clase"] = df["es_total_clase"].astype(str).str.strip().str.lower().isin(["true", "1", "t"])
    df["volumen_kg"] = pd.to_numeric(df["volumen_kg"], errors="coerce").fillna(0.0)
    df["volumen_tn"] = df["volumen_kg"] / 1000.0
    df["anio_inicio"] = df["campana"].apply(anio_inicio_de_campana)
    return df


def load_acopio_empresas():
    df = read_csv_robust("acopio_empresas_historico_unificado.csv", sep=";")
    df.columns = [c.replace("﻿", "").strip() for c in df.columns]
    df["provincia"] = df["provincia"].apply(sanitize_province)
    df["tipo_tabaco"] = df["tipo_tabaco"].apply(sanitize_tobacco)
    df["campana"] = df["campana"].astype(str).str.strip()
    df["es_subtotal_empresa"] = df["es_subtotal_empresa"].astype(str).str.strip().str.lower().isin(["true", "1", "t"])

    df = df[~df["razon_social"].astype(str).str.match(r"^\d+[\.,]", na=False)].copy()
    df["razon_social"] = df["razon_social"].apply(clean_company_name)
    df["volumen_acopio_kg"] = pd.to_numeric(df["volumen_acopio_kg"], errors="coerce").fillna(0.0)
    df["valor_acopio_pesos"] = pd.to_numeric(df["valor_acopio_pesos"], errors="coerce").fillna(0.0)

    # Caso de negocio real: algunas campañas (2018/19-2022/23) tienen el
    # volumen cargado en una escala 1000x menor por error de origen —
    # se detecta por precio implícito absurdamente alto y se corrige.
    mask_scale = (
        (df["volumen_acopio_kg"] > 0)
        & (df["valor_acopio_pesos"] > 0)
        & ((df["valor_acopio_pesos"] / df["volumen_acopio_kg"]) > 5000)
        & (df["campana"].isin(["2018/2019", "2019/2020", "2020/2021", "2021/2022", "2022/2023"]))
    )
    df.loc[mask_scale, "volumen_acopio_kg"] = df.loc[mask_scale, "volumen_acopio_kg"] * 1000.0

    df["volumen_tn"] = df["volumen_acopio_kg"] / 1000.0
    df["precio_promedio_empresa"] = np.where(
        df["volumen_acopio_kg"] > 0, df["valor_acopio_pesos"] / df["volumen_acopio_kg"], 0.0
    ).round(2)
    df["anio_inicio"] = df["campana"].apply(anio_inicio_de_campana)
    return df


def load_acopio_precios():
    df = read_csv_robust("acopio_resumen_precios_historico_unificado.csv", sep=";")
    df.columns = [c.replace("﻿", "").strip() for c in df.columns]
    df["provincia"] = df["provincia"].apply(sanitize_province)
    df["tipo_tabaco"] = df["tipo_tabaco"].apply(sanitize_tobacco)
    df["campana"] = df["campana"].astype(str).str.strip()
    df["es_subtotal_provincial"] = df["es_subtotal_provincial"].astype(str).str.strip().str.lower().isin(["true", "1", "t"])
    df["es_total_nacional"] = df["es_total_nacional"].astype(str).str.strip().str.lower().isin(["true", "1", "t"])

    for col in [
        "volumen_kg", "valor_acopio_pesos", "precio_acopio_promedio",
        "valor_fet_pesos", "precio_fet_promedio", "valor_total_pesos", "precio_total_promedio",
    ]:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)

    df["volumen_tn"] = df["volumen_kg"] / 1000.0

    mask_vol = df["volumen_kg"] > 0
    mask_miss_acop = (df["precio_acopio_promedio"] == 0) & mask_vol & (df["valor_acopio_pesos"] > 0)
    df.loc[mask_miss_acop, "precio_acopio_promedio"] = (
        df.loc[mask_miss_acop, "valor_acopio_pesos"] / df.loc[mask_miss_acop, "volumen_kg"]
    ).round(2)

    mask_miss_fet = (df["precio_fet_promedio"] == 0) & mask_vol & (df["valor_fet_pesos"] > 0)
    df.loc[mask_miss_fet, "precio_fet_promedio"] = (
        df.loc[mask_miss_fet, "valor_fet_pesos"] / df.loc[mask_miss_fet, "volumen_kg"]
    ).round(2)

    mask_miss_tot = (df["precio_total_promedio"] == 0) & mask_vol & (df["valor_total_pesos"] > 0)
    df.loc[mask_miss_tot, "precio_total_promedio"] = (
        df.loc[mask_miss_tot, "valor_total_pesos"] / df.loc[mask_miss_tot, "volumen_kg"]
    ).round(2)

    df["pct_fet"] = np.where(
        df["valor_total_pesos"] > 0,
        (df["valor_fet_pesos"] / df["valor_total_pesos"]) * 100.0,
        np.where(df["precio_total_promedio"] > 0, (df["precio_fet_promedio"] / df["precio_total_promedio"]) * 100.0, 0.0),
    ).round(2)
    df["pct_acopio"] = (100.0 - df["pct_fet"]).round(2)
    df["anio_inicio"] = df["campana"].apply(anio_inicio_de_campana)
    return df


HS_CODE_VARIETY = {
    "2401208005": "Virginia",
    "2401208011": "Virginia",
    "2401208010": "Virginia",
    "2401208015": "Burley",
    "2401208021": "Burley",
    "2401208020": "Burley",
}


def load_mercado_internacional():
    with open(data_path("Standard Query_40990.csv"), encoding="utf-8-sig", newline="") as f:
        rows = list(csv_module.reader(f))

    year_row, label_row, data_rows = rows[3], rows[4], rows[5:]
    hs_col = next(i for i, v in enumerate(label_row) if v.strip() == "HS Code")

    def cell(row, idx):
        return row[idx] if idx < len(row) else ""

    year_cols, ytd_cols = {}, {}
    for i, v in enumerate(year_row):
        v = v.strip()
        if re.fullmatch(r"20\d\d", v):
            year_cols[i] = int(v)
        else:
            m = re.fullmatch(r"Jan - Jun (20\d\d)", v)
            if m:
                ytd_cols[i] = int(m.group(1))

    def clean_num(x):
        x = str(x).replace(",", "").strip()
        if x in ("", "0", "nan"):
            return 0.0
        try:
            return float(x)
        except ValueError:
            return 0.0

    records = []
    for row in data_rows:
        hs_code = cell(row, hs_col).strip()
        variety = HS_CODE_VARIETY.get(hs_code)
        if variety is None:
            continue
        for col, year in year_cols.items():
            records.append({"variety": variety, "year": year, "value_usd": clean_num(cell(row, col)) * 1000.0, "is_ytd": False})
        for col, year in ytd_cols.items():
            records.append({"variety": variety, "year": year, "value_usd": clean_num(cell(row, col)) * 1000.0, "is_ytd": True})

    df = pd.DataFrame.from_records(records)
    df_annual = df[~df["is_ytd"]].groupby(["variety", "year", "is_ytd"], as_index=False)["value_usd"].sum()
    df_annual = df_annual[df_annual["value_usd"] > 0]
    df_ytd = df[df["is_ytd"]].groupby(["variety", "year", "is_ytd"], as_index=False)["value_usd"].sum()
    return pd.concat([df_annual, df_ytd], ignore_index=True)


def load_precio_resoluciones():
    df = read_csv_robust("resumen_precios_tabaco_con_dolares.csv", sep=";")
    df.columns = [c.replace("﻿", "").strip() for c in df.columns]
    df["Campana"] = df["Campana"].astype(str).str.strip()
    df["Tabaco"] = df["Tabaco"].apply(sanitize_tobacco)
    df["Fecha"] = pd.to_datetime(df["Fecha"], errors="coerce")

    numeric_cols = [
        "Porcentaje", "Adelanto_1", "Adelanto_2", "Incremento", "Precio_Total_Acumulado",
        "Adelanto_1_USD", "Adelanto_2_USD", "Incremento_USD", "Precio_Total_Acumulado_USD",
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    return df


# --- Generación de SQL ---

def sql_num(value):
    if value is None or (isinstance(value, float) and (pd.isna(value) or np.isinf(value))):
        return "null"
    return repr(float(value))


def sql_int(value):
    if value is None or pd.isna(value):
        return "null"
    return str(int(value))


def sql_str(value):
    if value is None or (isinstance(value, float) and pd.isna(value)) or (isinstance(value, str) and value.strip() == ""):
        return "null"
    escaped = str(value).replace("'", "''")
    return f"'{escaped}'"


def sql_bool(value):
    return "true" if bool(value) else "false"


def sql_date(value):
    if value is None or pd.isna(value):
        return "null"
    return f"'{pd.Timestamp(value).strftime('%Y-%m-%d')}'"


def write_table(out, table, columns, row_builder, df):
    out.write(f"truncate table public.{table};\n")
    rows_sql = [row_builder(row) for _, row in df.iterrows()]
    cols_sql = ", ".join(columns)
    for i in range(0, len(rows_sql), CHUNK_SIZE):
        chunk = rows_sql[i : i + CHUNK_SIZE]
        values_sql = ",\n  ".join(chunk)
        out.write(f"insert into public.{table} ({cols_sql}) values\n  {values_sql};\n")
    out.write("\n")
    return len(rows_sql)


def main():
    out = io.StringIO()
    out.write(
        "-- Generado por tabacostats-nativo/scripts/build_seed_sql.py a partir de\n"
        "-- los CSV de mercado-argentino-tabaco/. Correr una sola vez en el SQL\n"
        "-- Editor de Supabase, después de 0007_fact_tabacostats.sql.\n"
        "-- Re-ejecutable: cada tabla se trunca antes de insertar.\n\n"
    )

    counts = {}

    df_prod = load_produccion_primaria()
    counts["fact_produccion_primaria"] = write_table(
        out, "fact_produccion_primaria",
        ["campana", "anio_inicio", "provincia", "tipo_tabaco", "ambito", "es_total",
         "sup_sembrada_ha", "sup_cosechada_ha", "produccion_kg", "produccion_tn",
         "rendimiento_kg_ha", "precio_acopio_unitario", "precio_fet_unitario",
         "precio_total_unitario", "valor_total_estimado"],
        lambda r: "({}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {})".format(
            sql_str(r["campana"]), sql_int(r["anio_inicio"]), sql_str(r["provincia"]),
            sql_str(r["tipo_tabaco"]), sql_str(str(r["ambito"]).strip().upper()), sql_bool(r["es_total"]),
            sql_num(r["sup_sembrada_ha"]), sql_num(r["sup_cosechada_ha"]), sql_num(r["produccion_kg"]),
            sql_num(r["produccion_tn"]), sql_num(r["rendimiento_kg_ha"]), sql_num(r["precio_acopio_unitario"]),
            sql_num(r["precio_fet_unitario"]), sql_num(r["precio_total_unitario"]), sql_num(r["valor_total_estimado"]),
        ),
        df_prod,
    )

    df_clases = load_acopio_clases()
    counts["fact_acopio_clases"] = write_table(
        out, "fact_acopio_clases",
        ["campana", "anio_inicio", "provincia", "tipo_tabaco", "clase_comercial",
         "es_total_clase", "volumen_kg", "volumen_tn"],
        lambda r: "({}, {}, {}, {}, {}, {}, {}, {})".format(
            sql_str(r["campana"]), sql_int(r["anio_inicio"]), sql_str(r["provincia"]),
            sql_str(r["tipo_tabaco"]), sql_str(r["clase_comercial"]), sql_bool(r["es_total_clase"]),
            sql_num(r["volumen_kg"]), sql_num(r["volumen_tn"]),
        ),
        df_clases,
    )

    df_emp = load_acopio_empresas()
    counts["fact_acopio_empresas"] = write_table(
        out, "fact_acopio_empresas",
        ["campana", "anio_inicio", "provincia", "tipo_tabaco", "razon_social",
         "es_subtotal_empresa", "volumen_acopio_kg", "volumen_tn", "valor_acopio_pesos",
         "precio_promedio_empresa"],
        lambda r: "({}, {}, {}, {}, {}, {}, {}, {}, {}, {})".format(
            sql_str(r["campana"]), sql_int(r["anio_inicio"]), sql_str(r["provincia"]),
            sql_str(r["tipo_tabaco"]), sql_str(r["razon_social"]), sql_bool(r["es_subtotal_empresa"]),
            sql_num(r["volumen_acopio_kg"]), sql_num(r["volumen_tn"]), sql_num(r["valor_acopio_pesos"]),
            sql_num(r["precio_promedio_empresa"]),
        ),
        df_emp,
    )

    df_prec = load_acopio_precios()
    counts["fact_acopio_precios"] = write_table(
        out, "fact_acopio_precios",
        ["campana", "anio_inicio", "provincia", "tipo_tabaco", "es_subtotal_provincial",
         "es_total_nacional", "volumen_kg", "volumen_tn", "valor_acopio_pesos",
         "precio_acopio_promedio", "valor_fet_pesos", "precio_fet_promedio",
         "valor_total_pesos", "precio_total_promedio", "pct_fet", "pct_acopio"],
        lambda r: "({}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {})".format(
            sql_str(r["campana"]), sql_int(r["anio_inicio"]), sql_str(r["provincia"]),
            sql_str(r["tipo_tabaco"]), sql_bool(r["es_subtotal_provincial"]), sql_bool(r["es_total_nacional"]),
            sql_num(r["volumen_kg"]), sql_num(r["volumen_tn"]), sql_num(r["valor_acopio_pesos"]),
            sql_num(r["precio_acopio_promedio"]), sql_num(r["valor_fet_pesos"]), sql_num(r["precio_fet_promedio"]),
            sql_num(r["valor_total_pesos"]), sql_num(r["precio_total_promedio"]), sql_num(r["pct_fet"]),
            sql_num(r["pct_acopio"]),
        ),
        df_prec,
    )

    df_intl = load_mercado_internacional()
    counts["fact_mercado_internacional"] = write_table(
        out, "fact_mercado_internacional",
        ["variety", "year", "value_usd", "is_ytd"],
        lambda r: "({}, {}, {}, {})".format(
            sql_str(r["variety"]), sql_int(r["year"]), sql_num(r["value_usd"]), sql_bool(r["is_ytd"]),
        ),
        df_intl,
    )

    df_dolar = load_precio_resoluciones()
    counts["fact_precio_resoluciones"] = write_table(
        out, "fact_precio_resoluciones",
        ["campana", "etapa_pago", "fecha", "archivo_origen", "tabaco", "clase", "porcentaje",
         "adelanto_1", "adelanto_2", "incremento", "precio_total_acumulado",
         "adelanto_1_usd", "adelanto_2_usd", "incremento_usd", "precio_total_acumulado_usd"],
        lambda r: "({}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {})".format(
            sql_str(r["Campana"]), sql_str(r.get("Etapa_Pago")), sql_date(r["Fecha"]),
            sql_str(r["Archivo_Origen"]), sql_str(r["Tabaco"]), sql_str(r.get("Clase")),
            sql_num(r["Porcentaje"]), sql_num(r["Adelanto_1"]), sql_num(r["Adelanto_2"]),
            sql_num(r["Incremento"]), sql_num(r["Precio_Total_Acumulado"]), sql_num(r["Adelanto_1_USD"]),
            sql_num(r["Adelanto_2_USD"]), sql_num(r["Incremento_USD"]), sql_num(r["Precio_Total_Acumulado_USD"]),
        ),
        df_dolar,
    )

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(out.getvalue())

    for table, n in counts.items():
        print(f"{table}: {n} filas")
    print(f"Escrito: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
