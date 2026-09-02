"""
build_seed_sql.py

Lee mercado-global-tabaco/FAOstat/tobacco-production.csv, aplica la misma
clasificación y mapeo bilingüe ya validados en
mercado-global-tabaco/data_loader.py (classify_entity, get_display_name,
COUNTRY_METADATA, REGIONAL_AGGREGATES_KNOWN), y genera
supabase/seed_tobacco_production.sql para la tabla creada en
supabase/migrations/0008_fact_tobacco_production.sql.

No toca la base de datos — sólo lee el CSV local y escribe un .sql. El
usuario lo corre en el SQL Editor de Supabase, igual que las migraciones.
Re-ejecutable: la tabla se trunca antes de insertar.

Uso: python scripts/build_seed_sql.py
"""

import os
import pandas as pd

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
SOURCE_PATH = os.path.join(REPO_ROOT, "mercado-global-tabaco", "FAOstat", "tobacco-production.csv")
OUTPUT_PATH = os.path.join(REPO_ROOT, "supabase", "seed_tobacco_production.sql")

CHUNK_SIZE = 200

# --- Port literal de data_loader.py (líneas 16-77) ---

COUNTRY_METADATA = {
    "Argentina": {"es": "Argentina", "flag": "🇦🇷"},
    "Brazil": {"es": "Brasil", "flag": "🇧🇷"},
    "China": {"es": "China", "flag": "🇨🇳"},
    "India": {"es": "India", "flag": "🇮🇳"},
    "United States": {"es": "Estados Unidos", "flag": "🇺🇸"},
    "Indonesia": {"es": "Indonesia", "flag": "🇮🇩"},
    "Zimbabwe": {"es": "Zimbabue", "flag": "🇿🇼"},
    "Pakistan": {"es": "Pakistán", "flag": "🇵🇰"},
    "Malawi": {"es": "Malaui", "flag": "🇲🇼"},
    "Tanzania": {"es": "Tanzania", "flag": "🇹🇿"},
    "Turkey": {"es": "Turquía", "flag": "🇹🇷"},
    "Italy": {"es": "Italia", "flag": "🇮🇹"},
    "Greece": {"es": "Grecia", "flag": "🇬🇷"},
    "Spain": {"es": "España", "flag": "🇪🇸"},
    "Cuba": {"es": "Cuba", "flag": "🇨🇺"},
    "Dominican Republic": {"es": "República Dominicana", "flag": "🇩🇴"},
    "Philippines": {"es": "Filipinas", "flag": "🇵🇭"},
    "Mexico": {"es": "México", "flag": "🇲🇽"},
    "Colombia": {"es": "Colombia", "flag": "🇨🇴"},
    "Paraguay": {"es": "Paraguay", "flag": "🇵🇾"},
    "Chile": {"es": "Chile", "flag": "🇨🇱"},
    "Uruguay": {"es": "Uruguay", "flag": "🇺🇾"},
    "Bolivia": {"es": "Bolivia", "flag": "🇧🇴"},
    "Japan": {"es": "Japón", "flag": "🇯🇵"},
    "South Korea": {"es": "Corea del Sur", "flag": "🇰🇷"},
    "Germany": {"es": "Alemania", "flag": "🇩🇪"},
    "France": {"es": "Francia", "flag": "🇫🇷"},
    "Poland": {"es": "Polonia", "flag": "🇵🇱"},
    "Vietnam": {"es": "Vietnam", "flag": "🇻🇳"},
    "Thailand": {"es": "Tailandia", "flag": "🇹🇭"},
    "Bangladesh": {"es": "Bangladés", "flag": "🇧🇩"},
    "Mozambique": {"es": "Mozambique", "flag": "🇲🇿"},
    "Zambia": {"es": "Zambia", "flag": "🇿🇲"},
    "South Africa": {"es": "Sudáfrica", "flag": "🇿🇦"},
    "Canada": {"es": "Canadá", "flag": "🇨🇦"},
    "Russia": {"es": "Rusia", "flag": "🇷🇺"},
    "Ukraine": {"es": "Ucrania", "flag": "🇺🇦"},
    "Egypt": {"es": "Egipto", "flag": "🇪🇬"},
    "Nigeria": {"es": "Nigeria", "flag": "🇳🇬"},
}

REGIONAL_AGGREGATES_KNOWN = {
    "World": "Mundo Total",
    "Africa": "África",
    "Asia": "Asia",
    "Europe": "Europa",
    "North America": "Norteamérica",
    "South America": "Sudamérica",
    "Oceania": "Oceanía",
    "European Union (27)": "Unión Europea (27)",
    "High-income countries": "Países de Altos Ingresos",
    "Upper-middle-income countries": "Países de Ingresos Medios-Altos",
    "Lower-middle-income countries": "Países de Ingresos Medios-Bajos",
    "Low-income countries": "Países de Bajos Ingresos",
    "Americas (FAO)": "Américas (FAO)",
    "Asia (FAO)": "Asia (FAO)",
    "Europe (FAO)": "Europa (FAO)",
    "Africa (FAO)": "África (FAO)",
}


def classify_entity(entity, code):
    code = code if isinstance(code, str) else ""
    if entity.endswith("(FAO)") or entity in REGIONAL_AGGREGATES_KNOWN or code.startswith("OWID") or not code:
        return "Aggregate"
    if len(code) == 3 and code.isalpha():
        return "Country"
    return "Aggregate"


def get_display_name(entity):
    if entity in COUNTRY_METADATA:
        meta = COUNTRY_METADATA[entity]
        return f"{meta['flag']} {meta['es']}"
    if entity in REGIONAL_AGGREGATES_KNOWN:
        return f"🌐 {REGIONAL_AGGREGATES_KNOWN[entity]}"
    return entity


def read_csv_robust(path):
    for enc in ["utf-8-sig", "utf-8", "latin-1", "cp1252"]:
        try:
            return pd.read_csv(path, encoding=enc)
        except Exception:
            continue
    return pd.read_csv(path, encoding="latin-1")


def sql_num(value):
    if value is None or pd.isna(value):
        return "0"
    return repr(float(value))


def sql_str(value):
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return "null"
    s = str(value).strip()
    if s == "" or s.lower() == "nan":
        return "null"
    return "'" + s.replace("'", "''") + "'"


def main():
    df = read_csv_robust(SOURCE_PATH)
    df.columns = [c.strip() for c in df.columns]

    entity_col = "Entity"
    code_col = "Code"
    year_col = "Year"
    value_col = [c for c in df.columns if c not in (entity_col, code_col, year_col)][0]

    df[entity_col] = df[entity_col].astype(str).str.strip()
    df[year_col] = pd.to_numeric(df[year_col], errors="coerce").fillna(0).astype(int)
    df[value_col] = pd.to_numeric(df[value_col], errors="coerce").fillna(0.0)

    df["entity_type"] = df.apply(lambda r: classify_entity(r[entity_col], r[code_col]), axis=1)
    df["entity_display"] = df[entity_col].apply(get_display_name)

    rows_sql = [
        "({}, {}, {}, {}, {}, {})".format(
            sql_str(row[entity_col]),
            sql_str(row[code_col]),
            int(row[year_col]),
            sql_num(row[value_col]),
            sql_str(row["entity_type"]),
            sql_str(row["entity_display"]),
        )
        for _, row in df.iterrows()
    ]

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(
            "-- Generado por mercado-global-nativo/scripts/build_seed_sql.py a partir de\n"
            "-- mercado-global-tabaco/FAOstat/tobacco-production.csv. Correr una sola vez\n"
            "-- en el SQL Editor de Supabase, después de 0008_fact_tobacco_production.sql.\n"
            f"-- Filas: {len(rows_sql)}.\n\n"
        )
        f.write("truncate table public.fact_tobacco_production;\n")
        cols = "entity, code, year, value_tonnes, entity_type, entity_display"
        for i in range(0, len(rows_sql), CHUNK_SIZE):
            chunk = rows_sql[i : i + CHUNK_SIZE]
            values_sql = ",\n  ".join(chunk)
            f.write(f"insert into public.fact_tobacco_production ({cols}) values\n  {values_sql};\n")

    print(f"fact_tobacco_production: {len(rows_sql)} filas")
    print(f"Escrito: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
