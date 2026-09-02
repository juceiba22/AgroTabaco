"""
build_seed_sql.py

Lee los 3 CSV fuente de laboratorio-estadistico/ (mismos que usa el
dashboard Streamlit), aplica la misma limpieza/deduplicación ya validada en
laboratorio-estadistico/app.py (parse_mes_es + "quedarse con la fila más
completa por mes"), y genera supabase/seed_laboratorio_estadistico.sql con
los INSERT para las 3 tablas creadas en
supabase/migrations/0006_fact_laboratorio_estadistico.sql.

No toca la base de datos — sólo lee CSVs locales y escribe un .sql. El
usuario corre ese .sql en el SQL Editor de Supabase, igual que las
migraciones.

Uso: python scripts/build_seed_sql.py
"""

import os
import re
import pandas as pd

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
SOURCE_DIR = os.path.join(REPO_ROOT, "laboratorio-estadistico")
OUTPUT_PATH = os.path.join(REPO_ROOT, "supabase", "seed_laboratorio_estadistico.sql")

CHUNK_SIZE = 200  # filas por sentencia INSERT, para no armar un VALUES gigante

# --- Mismo parser de fechas en español que app.py (ver ese archivo para el
# comentario completo sobre por qué hace falta: el CSV mezcla 'ene-05',
# 'mar.-10', 'Jul-26', 'Oct - 22', 'abril 26', 'mzo-13'). ---
MESES_ABR = {
    'ene': 1, 'feb': 2, 'mar': 3, 'mzo': 3, 'abr': 4, 'may': 5, 'jun': 6,
    'jul': 7, 'ago': 8, 'sep': 9, 'set': 9, 'oct': 10, 'nov': 11, 'dic': 12,
}
MESES_FULL = {
    'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
    'julio': 7, 'agosto': 8, 'septiembre': 9, 'setiembre': 9, 'octubre': 10,
    'noviembre': 11, 'diciembre': 12,
}


def parse_mes_es(raw):
    s = str(raw).strip().lower().replace('.', '')
    m = re.match(r'([a-záéíóúñ]+)\s*-?\s*(\d{2,4})', s)
    if not m:
        return pd.NaT
    mes_txt, yr_txt = m.group(1), m.group(2)
    month = MESES_FULL.get(mes_txt) or MESES_ABR.get(mes_txt[:3])
    if month is None:
        return pd.NaT
    year = int(yr_txt)
    if year < 100:
        year += 2000
    try:
        return pd.Timestamp(year=year, month=month, day=1)
    except ValueError:
        return pd.NaT


def read_csv_robust(path):
    for enc in ['utf-8-sig', 'latin-1', 'cp1252']:
        try:
            return pd.read_csv(path, encoding=enc)
        except Exception:
            continue
    return pd.read_csv(path, encoding='latin-1', errors='replace')


def sql_num(value):
    if pd.isna(value):
        return "null"
    return repr(float(value))


def load_volumen_precios():
    df = read_csv_robust(os.path.join(SOURCE_DIR, "fact_volumen_precios_bi.csv"))
    df.columns = [c.replace('﻿', '').strip() for c in df.columns]
    df['fecha'] = df['mes'].apply(parse_mes_es)

    value_cols = [
        'precio_inferior', 'precio_promedio_ponderado', 'precio_superior',
        'primer_quartil', 'segundo_quartil', 'tercer_quartil', 'cuarto_quartil',
        'total_paquetes',
    ]
    for col in value_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    df = df.dropna(subset=['fecha'])
    df['_completitud'] = df[value_cols].notna().sum(axis=1)
    df = df.sort_values(['fecha', '_completitud', 'total_paquetes'], na_position='first')
    df = df.drop_duplicates(subset='fecha', keep='last').drop(columns='_completitud')
    return df.sort_values('fecha').reset_index(drop=True)


def load_participacion():
    df = read_csv_robust(os.path.join(SOURCE_DIR, "fact_participacion_bi.csv"))
    df.columns = [c.replace('﻿', '').strip() for c in df.columns]
    df['fecha'] = df['fecha'].apply(parse_mes_es)

    value_cols = [
        'empresas_grandes', 'porcentaje_participacion_grandes',
        'empresas_pymes', 'porcentaje_participacion_pymes', 'total_mercado',
    ]
    for col in value_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    df = df.dropna(subset=['fecha'])
    df = df.drop_duplicates(subset='fecha', keep='last')
    return df.sort_values('fecha').reset_index(drop=True)


def load_consumo_aparente():
    df = read_csv_robust(os.path.join(SOURCE_DIR, "fact_consumo_aparente_bi.csv"))
    df.columns = [c.replace('﻿', '').strip() for c in df.columns]
    df['anio'] = pd.to_numeric(df['anio'], errors='coerce').astype('Int64')
    for col in ['total_paquetes', 'poblacion', 'consumo_aparente']:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    df = df.dropna(subset=['anio']).drop_duplicates(subset='anio', keep='last')
    return df.sort_values('anio').reset_index(drop=True)


def build_insert_statements(table, key_col, columns, rows_sql, conflict_update_cols):
    statements = []
    for i in range(0, len(rows_sql), CHUNK_SIZE):
        chunk = rows_sql[i:i + CHUNK_SIZE]
        cols_sql = ", ".join(columns)
        values_sql = ",\n  ".join(chunk)
        update_sql = ", ".join(f"{c} = excluded.{c}" for c in conflict_update_cols)
        statements.append(
            f"insert into public.{table} ({cols_sql}) values\n  {values_sql}\n"
            f"on conflict ({key_col}) do update set {update_sql};"
        )
    return statements


def main():
    df_vol = load_volumen_precios()
    df_part = load_participacion()
    df_cons = load_consumo_aparente()

    vol_cols = [
        'fecha', 'precio_inferior', 'precio_promedio_ponderado', 'precio_superior',
        'primer_quartil', 'segundo_quartil', 'tercer_quartil', 'cuarto_quartil', 'total_paquetes',
    ]
    vol_rows = [
        "('{}', {}, {}, {}, {}, {}, {}, {}, {})".format(
            row['fecha'].strftime('%Y-%m-%d'),
            sql_num(row['precio_inferior']), sql_num(row['precio_promedio_ponderado']),
            sql_num(row['precio_superior']), sql_num(row['primer_quartil']),
            sql_num(row['segundo_quartil']), sql_num(row['tercer_quartil']),
            sql_num(row['cuarto_quartil']), sql_num(row['total_paquetes']),
        )
        for _, row in df_vol.iterrows()
    ]

    part_cols = [
        'fecha', 'empresas_grandes', 'porcentaje_participacion_grandes',
        'empresas_pymes', 'porcentaje_participacion_pymes', 'total_mercado',
    ]
    part_rows = [
        "('{}', {}, {}, {}, {}, {})".format(
            row['fecha'].strftime('%Y-%m-%d'),
            sql_num(row['empresas_grandes']), sql_num(row['porcentaje_participacion_grandes']),
            sql_num(row['empresas_pymes']), sql_num(row['porcentaje_participacion_pymes']),
            sql_num(row['total_mercado']),
        )
        for _, row in df_part.iterrows()
    ]

    cons_cols = ['anio', 'total_paquetes', 'poblacion', 'consumo_aparente']
    cons_rows = [
        "({}, {}, {}, {})".format(
            int(row['anio']), sql_num(row['total_paquetes']),
            sql_num(row['poblacion']), sql_num(row['consumo_aparente']),
        )
        for _, row in df_cons.iterrows()
    ]

    statements = []
    statements.append(
        "-- Generado por laboratorio-nativo/scripts/build_seed_sql.py a partir de\n"
        "-- laboratorio-estadistico/fact_*.csv. Correr una sola vez en el SQL Editor\n"
        "-- de Supabase, después de 0006_fact_laboratorio_estadistico.sql.\n"
        f"-- Filas: {len(df_vol)} volumen/precios, {len(df_part)} participación, {len(df_cons)} consumo aparente."
    )
    statements += build_insert_statements(
        "fact_volumen_precios", "fecha", vol_cols, vol_rows,
        [c for c in vol_cols if c != 'fecha'],
    )
    statements += build_insert_statements(
        "fact_participacion_mercado", "fecha", part_cols, part_rows,
        [c for c in part_cols if c != 'fecha'],
    )
    statements += build_insert_statements(
        "fact_consumo_aparente", "anio", cons_cols, cons_rows,
        [c for c in cons_cols if c != 'anio'],
    )

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write("\n\n".join(statements) + "\n")

    print(f"OK: {len(df_vol)} filas volumen, {len(df_part)} participación, {len(df_cons)} consumo aparente")
    print(f"Escrito: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
