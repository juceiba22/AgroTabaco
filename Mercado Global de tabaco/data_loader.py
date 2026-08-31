"""
data_loader.py - Módulo de carga y procesamiento robusto de datos de FAOstat / Our World in Data.
Soporta codificaciones seguras (utf-8-sig, utf-8, latin-1, cp1252), detección dinámica de CSVs,
clasificación de entidades (países soberanos vs agregados continentales/regionales) y mapeo bilingüe.
"""

from pathlib import Path
import json
import pandas as pd
import numpy as np

# Codificaciones seguras a probar secuencialmente
ENCODINGS_TO_TRY = ["utf-8-sig", "utf-8", "latin-1", "cp1252", "iso-8859-1"]

# Diccionario de traducción y normalización de nombres de países (Inglés -> Español) y emojis
COUNTRY_METADATA = {
    "Argentina": {"es": "Argentina", "flag": "🇦🇷", "iso": "ARG", "region": "Sudamérica"},
    "Brazil": {"es": "Brasil", "flag": "🇧🇷", "iso": "BRA", "region": "Sudamérica"},
    "China": {"es": "China", "flag": "🇨🇳", "iso": "CHN", "region": "Asia"},
    "India": {"es": "India", "flag": "🇮🇳", "iso": "IND", "region": "Asia"},
    "United States": {"es": "Estados Unidos", "flag": "🇺🇸", "iso": "USA", "region": "Norteamérica"},
    "Indonesia": {"es": "Indonesia", "flag": "🇮🇩", "iso": "IDN", "region": "Asia"},
    "Zimbabwe": {"es": "Zimbabue", "flag": "🇿🇼", "iso": "ZWE", "region": "África"},
    "Pakistan": {"es": "Pakistán", "flag": "🇵🇰", "iso": "PAK", "region": "Asia"},
    "Malawi": {"es": "Malaui", "flag": "🇲🇼", "iso": "MWI", "region": "África"},
    "Tanzania": {"es": "Tanzania", "flag": "🇹🇿", "iso": "TZA", "region": "África"},
    "Turkey": {"es": "Turquía", "flag": "🇹🇷", "iso": "TUR", "region": "Europa/Asia"},
    "Italy": {"es": "Italia", "flag": "🇮🇹", "iso": "ITA", "region": "Europa"},
    "Greece": {"es": "Grecia", "flag": "🇬🇷", "iso": "GRC", "region": "Europa"},
    "Spain": {"es": "España", "flag": "🇪🇸", "iso": "ESP", "region": "Europa"},
    "Cuba": {"es": "Cuba", "flag": "🇨🇺", "iso": "CUB", "region": "Caribe"},
    "Dominican Republic": {"es": "República Dominicana", "flag": "🇩🇴", "iso": "DOM", "region": "Caribe"},
    "Philippines": {"es": "Filipinas", "flag": "🇵🇭", "iso": "PHL", "region": "Asia"},
    "Mexico": {"es": "México", "flag": "🇲🇽", "iso": "MEX", "region": "Norteamérica"},
    "Colombia": {"es": "Colombia", "flag": "🇨🇴", "iso": "COL", "region": "Sudamérica"},
    "Paraguay": {"es": "Paraguay", "flag": "🇵🇾", "iso": "PRY", "region": "Sudamérica"},
    "Chile": {"es": "Chile", "flag": "🇨🇱", "iso": "CHL", "region": "Sudamérica"},
    "Uruguay": {"es": "Uruguay", "flag": "🇺🇾", "iso": "URY", "region": "Sudamérica"},
    "Bolivia": {"es": "Bolivia", "flag": "🇧🇴", "iso": "BOL", "region": "Sudamérica"},
    "Japan": {"es": "Japón", "flag": "🇯🇵", "iso": "JPN", "region": "Asia"},
    "South Korea": {"es": "Corea del Sur", "flag": "🇰🇷", "iso": "KOR", "region": "Asia"},
    "Germany": {"es": "Alemania", "flag": "🇩🇪", "iso": "DEU", "region": "Europa"},
    "France": {"es": "Francia", "flag": "🇫🇷", "iso": "FRA", "region": "Europa"},
    "Poland": {"es": "Polonia", "flag": "🇵🇱", "iso": "POL", "region": "Europa"},
    "Vietnam": {"es": "Vietnam", "flag": "🇻🇳", "iso": "VNM", "region": "Asia"},
    "Thailand": {"es": "Tailandia", "flag": "🇹🇭", "iso": "THA", "region": "Asia"},
    "Bangladesh": {"es": "Bangladés", "flag": "🇧🇩", "iso": "BGD", "region": "Asia"},
    "Mozambique": {"es": "Mozambique", "flag": "🇲🇿", "iso": "MOZ", "region": "África"},
    "Zambia": {"es": "Zambia", "flag": "🇿🇲", "iso": "ZMB", "region": "África"},
    "South Africa": {"es": "Sudáfrica", "flag": "🇿🇦", "iso": "ZAF", "region": "África"},
    "Canada": {"es": "Canadá", "flag": "🇨🇦", "iso": "CAN", "region": "Norteamérica"},
    "Russia": {"es": "Rusia", "flag": "🇷🇺", "iso": "RUS", "region": "Europa/Asia"},
    "Ukraine": {"es": "Ucrania", "flag": "🇺🇦", "iso": "UKR", "region": "Europa"},
    "Egypt": {"es": "Egipto", "flag": "🇪🇬", "iso": "EGY", "region": "África"},
    "Nigeria": {"es": "Nigeria", "flag": "🇳🇬", "iso": "NGA", "region": "África"},
}

DEFAULT_PRESET_COUNTRIES = ["Argentina", "Brazil", "China", "India", "United States"]

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


def read_csv_safe(file_path: Path | str) -> pd.DataFrame:
    """
    Lee un archivo CSV probando diferentes codificaciones de forma resiliente.
    """
    file_path = Path(file_path)
    if not file_path.exists():
        raise FileNotFoundError(f"No se encontró el archivo: {file_path}")

    last_error = None
    for enc in ENCODINGS_TO_TRY:
        try:
            df = pd.read_csv(file_path, encoding=enc)
            return df
        except Exception as e:
            last_error = e
            continue

    # Fallback con lectura binaria y reemplazo de caracteres corruptos
    try:
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            return pd.read_csv(f)
    except Exception as e:
        raise RuntimeError(f"Error crítico al leer {file_path}: {last_error or e}")


def discover_faostat_datasets(directory_path: Path | str) -> list[dict]:
    """
    Escanea la carpeta de datos y descubre todos los archivos CSV y sus metadatos asociados.
    """
    directory = Path(directory_path)
    if not directory.exists() or not directory.is_dir():
        return []

    datasets = []
    csv_files = sorted(directory.glob("*.csv"))

    for csv_file in csv_files:
        meta_file = csv_file.with_name(f"{csv_file.stem}.metadata.json")
        metadata = {}
        if meta_file.exists():
            try:
                with open(meta_file, "r", encoding="utf-8") as mf:
                    metadata = json.load(mf)
            except Exception:
                metadata = {}

        # Identificar título amigable
        title = metadata.get("chart", {}).get("title")
        if not title:
            # Derivar del nombre del archivo
            clean_name = csv_file.stem.replace("-", " ").replace("_", " ").title()
            title = clean_name

        datasets.append({
            "id": csv_file.name,
            "path": csv_file,
            "name": title,
            "filename": csv_file.name,
            "metadata_path": meta_file if meta_file.exists() else None,
            "metadata": metadata,
        })

    return datasets


def load_dataset(file_path: Path | str, metadata_path: Path | str = None) -> dict:
    """
    Carga y normaliza un dataset de FAOstat / Our World in Data.
    Devuelve un diccionario con el DataFrame limpio, columnas clave y metadatos.
    """
    df = read_csv_safe(file_path)

    # Identificación de columnas estándar
    cols = df.columns.tolist()

    entity_col = None
    code_col = None
    year_col = None
    value_cols = []

    for col in cols:
        col_lower = col.lower().strip()
        if col_lower in ["entity", "entidad", "country", "pais", "país"]:
            entity_col = col
        elif col_lower in ["code", "código", "codigo", "iso", "iso3"]:
            code_col = col
        elif col_lower in ["year", "año", "ano", "period", "fecha", "day"]:
            year_col = col
        else:
            value_cols.append(col)

    if not entity_col:
        entity_col = cols[0]

    if not year_col:
        for col in cols:
            if col != entity_col and pd.api.types.is_numeric_dtype(df[col]):
                sample_vals = df[col].dropna().head(10)
                if (sample_vals >= 1900).all() and (sample_vals <= 2100).all():
                    year_col = col
                    if col in value_cols:
                        value_cols.remove(col)
                    break

    primary_value_col = value_cols[0] if value_cols else None

    # Normalizar tipos
    df[entity_col] = df[entity_col].astype(str).str.strip()

    if code_col and code_col in df.columns:
        df[code_col] = df[code_col].astype(str).str.strip().replace("nan", np.nan)
    else:
        df["Code"] = np.nan
        code_col = "Code"

    if year_col:
        df[year_col] = pd.to_numeric(df[year_col], errors="coerce").fillna(0).astype(int)

    if primary_value_col:
        df[primary_value_col] = pd.to_numeric(df[primary_value_col], errors="coerce").fillna(0.0)

    # Clasificar Tipo de Entidad
    def classify_entity(row):
        ent = str(row[entity_col])
        code = str(row[code_col]) if pd.notna(row[code_col]) else ""
        if ent.endswith("(FAO)") or ent in REGIONAL_AGGREGATES_KNOWN or code.startswith("OWID") or not code:
            return "Aggregate"
        if len(code) == 3 and code.isalpha():
            return "Country"
        return "Aggregate"

    df["Entity_Type"] = df.apply(classify_entity, axis=1)

    # Nombre amigable en Español y bandera
    def get_display_name(entity_name):
        if entity_name in COUNTRY_METADATA:
            meta = COUNTRY_METADATA[entity_name]
            return f"{meta['flag']} {meta['es']}"
        if entity_name in REGIONAL_AGGREGATES_KNOWN:
            return f"🌐 {REGIONAL_AGGREGATES_KNOWN[entity_name]}"
        return entity_name

    df["Entity_Display"] = df[entity_col].apply(get_display_name)

    # Cargar metadatos JSON si existen
    meta_info = {}
    if metadata_path and Path(metadata_path).exists():
        try:
            with open(metadata_path, "r", encoding="utf-8") as f:
                meta_info = json.load(f)
        except Exception:
            pass

    # Extraer unidad y citación
    unit = "toneladas"
    citation = "Food and Agriculture Organization of the United Nations (2025) – with major processing by Our World in Data"
    if meta_info:
        cols_meta = meta_info.get("columns", {})
        for _, cdata in cols_meta.items():
            if "unit" in cdata:
                unit = cdata["unit"]
            if "citationShort" in cdata:
                citation = cdata["citationShort"]

    min_year = int(df[year_col].min()) if year_col and len(df) > 0 else 1961
    max_year = int(df[year_col].max()) if year_col and len(df) > 0 else 2024

    return {
        "df": df,
        "entity_col": entity_col,
        "code_col": code_col,
        "year_col": year_col,
        "value_col": primary_value_col,
        "value_cols": value_cols,
        "min_year": min_year,
        "max_year": max_year,
        "unit": unit,
        "citation": citation,
        "metadata": meta_info,
    }


def get_top_producers(df: pd.DataFrame, value_col: str, year: int, top_n: int = 10, only_countries: bool = True, year_col: str = "Year", entity_col: str = "Entity") -> pd.DataFrame:
    """
    Obtiene el ranking de los N principales productores para un año específico.
    """
    filtered = df[df[year_col] == year].copy()
    if only_countries:
        filtered = filtered[filtered["Entity_Type"] == "Country"]
    else:
        filtered = filtered[filtered[entity_col] != "World"]

    ranked = filtered.sort_values(by=value_col, ascending=False).head(top_n).reset_index(drop=True)
    return ranked


def get_market_share(df: pd.DataFrame, value_col: str, year: int, top_n: int = 5, year_col: str = "Year", entity_col: str = "Entity") -> tuple[pd.DataFrame, float]:
    """
    Calcula la participación porcentual (% Share) de los principales productores respecto al total mundial.
    """
    year_df = df[df[year_col] == year].copy()

    world_row = year_df[year_df[entity_col] == "World"]
    if not world_row.empty:
        total_world = float(world_row[value_col].values[0])
    else:
        total_world = float(year_df[year_df["Entity_Type"] == "Country"][value_col].sum())

    countries_df = year_df[year_df["Entity_Type"] == "Country"].sort_values(by=value_col, ascending=False)
    top_countries = countries_df.head(top_n).copy()

    top_sum = top_countries[value_col].sum()
    rest_val = max(0.0, total_world - top_sum)

    records = []
    for _, row in top_countries.iterrows():
        pct = (row[value_col] / total_world * 100) if total_world > 0 else 0.0
        records.append({
            "Entity": row[entity_col],
            "Entity_Display": row["Entity_Display"],
            "Code": row.get("Code", ""),
            "Value": row[value_col],
            "Percentage": pct,
            "Category": "Top Productores"
        })

    if rest_val > 0:
        rest_pct = (rest_val / total_world * 100) if total_world > 0 else 0.0
        records.append({
            "Entity": "Rest of the World",
            "Entity_Display": "🌍 Resto del Mundo",
            "Code": "ROW",
            "Value": rest_val,
            "Percentage": rest_pct,
            "Category": "Resto del Mundo"
        })

    return pd.DataFrame(records), total_world
