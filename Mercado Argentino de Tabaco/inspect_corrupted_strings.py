import pandas as pd
import re

for fname, sep in [
    ("csv_anuario_produccion_primaria.csv", ","),
    ("acopio_historico_unificado.csv", ";"),
    ("acopio_empresas_historico_unificado.csv", ";"),
    ("acopio_resumen_precios_historico_unificado.csv", ";")
]:
    df = pd.read_csv(fname, sep=sep, encoding='latin-1')
    for col in df.select_dtypes(include='object').columns:
        for val in df[col].dropna().unique():
            if any(ord(c) > 127 for c in str(val)) or '?' in str(val) or '' in str(val):
                print(f"File: {fname} | Col: {col} | Val: {repr(val)}")
