import pandas as pd
import numpy as np
import re

def load_fet_consolidado_clean(filepath="FET_Consolidado_Ejecuciones_Dashboard.csv"):
    df = None
    for enc in ['utf-8-sig', 'latin-1', 'cp1252']:
        try:
            df = pd.read_csv(filepath, encoding=enc)
            break
        except Exception:
            continue
    if df is None:
        df = pd.read_csv(filepath, encoding='latin-1', errors='replace')
        
    df.columns = [c.replace('\ufeff', '').strip() for c in df.columns]
    
    def sanitize_concept(c):
        if not isinstance(c, str): return ""
        c = c.strip()
        c = re.sub(r'[\x81\x91\xad\ufffd]', '', c)
        c = re.sub(r'Recaudaci[\x81\x91\xad\ufffd\?]*n', 'Recaudación', c, flags=re.IGNORECASE)
        c = re.sub(r'Ejecuci[\x81\x91\xad\ufffd\?]*n', 'Ejecución', c, flags=re.IGNORECASE)
        c = re.sub(r'Retribuci[\x81\x91\xad\ufffd\?]*n|Retirbuci[\x81\x91\xad\ufffd\?]*n', 'Retribución', c, flags=re.IGNORECASE)
        c = re.sub(r'Autom[\x81\x91\xad\ufffd\?]*ticas', 'Automáticas', c, flags=re.IGNORECASE)
        c = re.sub(r'D[\x81\x91\xad\ufffd\?]*lares', 'Dólares', c, flags=re.IGNORECASE)
        c = re.sub(r'A[\x81\x91\xad\ufffd\?]*o', 'Año', c, flags=re.IGNORECASE)
        c = re.sub(r'\s+', ' ', c).strip()
        return c

    df['concepto_clean'] = df['concepto'].apply(sanitize_concept)
    df['anio'] = pd.to_numeric(df['anio'], errors='coerce').fillna(0).astype(int)
    df['mes'] = df['mes'].astype(str).str.strip().str.lower()
    df['monto_ars'] = pd.to_numeric(df['monto_ars'], errors='coerce').fillna(0.0)
    df['fecha'] = pd.to_datetime(df['fecha'], errors='coerce')
    
    # Categorize concepts for easier filtering & grouping
    def categorize_concept(c):
        c_up = c.upper()
        if 'RECAUDACI' in c_up: return 'Recaudación'
        if 'PRECIO' in c_up or 'RETRIBUCI' in c_up or 'IMPUTADO' in c_up: return 'Retribución / Precio'
        if 'PLAN' in c_up or 'POA' in c_up: return 'Planes y POAS'
        if 'OBRA SOCIAL' in c_up: return 'Obras Sociales'
        if 'TRANSFERENCIA' in c_up: return 'Transferencias Automáticas'
        if 'SUELDO' in c_up or 'CONVENIO' in c_up or 'IICA' in c_up or 'LEY 19.800' in c_up: return 'Convenios y Gastos Operativos'
        return 'Otros Conceptos'

    df['categoria_concepto'] = df['concepto_clean'].apply(categorize_concept)
    
    return df.sort_values(by=['fecha', 'concepto_clean']).reset_index(drop=True)

df_fet = load_fet_consolidado_clean()
print("FET Consolidado loaded shape:", df_fet.shape)
print("Años:", sorted(df_fet['anio'].unique()))
print("Categorías de conceptos:")
print(df_fet['categoria_concepto'].value_counts())
print("\nSample 2024 rows:")
print(df_fet[df_fet['anio'] == 2024].head(5)[['fecha', 'mes', 'concepto_clean', 'categoria_concepto', 'monto_ars']])
