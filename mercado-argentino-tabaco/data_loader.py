"""
data_loader.py - Data ingestion and ETL module for TabacoStats Argentina.
Explicitly reads CSVs with latin-1 / utf-8-sig encoding and repairs mojibake.
"""

import os
import re
import pandas as pd
import numpy as np

def clean_text_field(text):
    """Normalize text and remove hidden control / corrupted replacement characters."""
    if not isinstance(text, str):
        return text
    t = str(text).strip()
    
    # Strip common corrupt control/replacement bytes
    t = t.replace('\x81', '').replace('\x91', '').replace('\xad', '').replace('\ufffd', '')
    
    # Replace broken or unaccented variants with proper Spanish terms
    t = re.sub(r'TUCUM[^\w\s]*N|TUCUMAN', 'TUCUMÁN', t, flags=re.IGNORECASE)
    t = re.sub(r'CHAQUE[^\w\s]*O|CHAQUEO', 'CHAQUEÑO', t, flags=re.IGNORECASE)
    t = re.sub(r'SALTE[^\w\s]*O|SALTEO', 'SALTEÑO', t, flags=re.IGNORECASE)
    t = re.sub(r'PANAMB[^\w\s]*|PANAMBI', 'PANAMBÍ', t, flags=re.IGNORECASE)
    t = re.sub(r'AGR[^\w\s]*COLA|AGRICOLA', 'AGRÍCOLA', t, flags=re.IGNORECASE)
    t = re.sub(r'GARC[^\w\s]*A|GARCIA', 'GARCÍA', t, flags=re.IGNORECASE)
    t = re.sub(r'VIRIGINIA', 'VIRGINIA', t, flags=re.IGNORECASE)
    
    return re.sub(r'\s+', ' ', t).strip()

def clean_province(p):
    """Map province names to a consistent standard."""
    if not isinstance(p, str):
        return p
    p_up = str(p).upper().strip()
    if 'TUCUM' in p_up:
        return 'TUCUMÁN'
    if 'CORRIENT' in p_up:
        return 'CORRIENTES'
    if 'MISION' in p_up:
        return 'MISIONES'
    if 'CATAMARC' in p_up:
        return 'CATAMARCA'
    if 'JUJUY' in p_up:
        return 'JUJUY'
    if 'SALTA' in p_up:
        return 'SALTA'
    if 'CHACO' in p_up:
        return 'CHACO'
    if 'TOTAL' in p_up or 'NACIONAL' in p_up:
        return 'TOTAL NACIONAL'
    return clean_text_field(p).upper()

def clean_tobacco_type(t):
    """Standardize tobacco types across all data sources."""
    if not isinstance(t, str):
        return t
    t_up = str(t).upper().strip()
    if 'VIRGIN' in t_up or 'VIRIGIN' in t_up:
        return 'VIRGINIA'
    if 'BURLEY' in t_up:
        return 'BURLEY'
    if 'KENTUCK' in t_up:
        if 'AHUMAD' in t_up:
            return 'KENTUCKY AHUMADO'
        return 'KENTUCKY'
    if 'MISIONER' in t_up:
        return 'CRIOLLO MISIONERO'
    if 'CORRENTIN' in t_up:
        return 'CRIOLLO CORRENTINO'
    if 'CHAQUE' in t_up:
        return 'CRIOLLO CHAQUEÑO'
    if 'ARGENTIN' in t_up:
        return 'CRIOLLO ARGENTINO'
    if 'SALTE' in t_up:
        return 'CRIOLLO SALTEÑO'
    if 'SUBTOTAL' in t_up:
        return 'SUBTOTAL PROVINCIAL'
    if 'TOTAL' in t_up:
        return 'TOTAL'
    return clean_text_field(t).upper()

def read_csv_explicit(filepath, sep=','):
    """Explicitly read CSV using latin-1 with utf-8-sig fallback."""
    for enc in ['latin-1', 'utf-8-sig', 'utf-8']:
        try:
            return pd.read_csv(filepath, sep=sep, encoding=enc)
        except Exception:
            continue
    return pd.read_csv(filepath, sep=sep, encoding='latin-1', errors='replace')

def load_produccion_primaria(filepath="csv_anuario_produccion_primaria.csv"):
    """Load and process primary agricultural production data (1991-2023)."""
    df = read_csv_explicit(filepath, sep=',')
    df['provincia'] = df['provincia'].apply(clean_province)
    df['tipo_tabaco'] = df['tipo_tabaco'].apply(clean_tobacco_type)
    df['campana'] = df['campana'].astype(str).str.strip()
    
    numeric_cols = [
        'sup_sembrada_ha', 'sup_cosechada_ha', 'produccion_kg', 
        'rendimiento_kg_ha', 'precio_acopio_unitario', 
        'precio_fet_unitario', 'precio_total_unitario'
    ]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            
    # Calculate yield where missing
    mask_missing_yield = df['rendimiento_kg_ha'].isna() & (df['sup_cosechada_ha'] > 0) & (df['produccion_kg'] > 0)
    df.loc[mask_missing_yield, 'rendimiento_kg_ha'] = (
        df.loc[mask_missing_yield, 'produccion_kg'] / df.loc[mask_missing_yield, 'sup_cosechada_ha']
    ).round(1)
    
    df['produccion_tn'] = df['produccion_kg'] / 1000.0
    df['anio_inicio'] = df['campana'].apply(lambda x: int(x.split('/')[0]) if '/' in str(x) else int(x[:4]))
    return df.sort_values(by=['anio_inicio', 'provincia', 'tipo_tabaco']).reset_index(drop=True)

def load_acopio_historico(filepath="acopio_historico_unificado.csv"):
    """Load and process commercial class acopio data (2018-2025)."""
    df = read_csv_explicit(filepath, sep=';')
    df['provincia'] = df['provincia'].apply(clean_province)
    df['tipo_tabaco'] = df['tipo_tabaco'].apply(clean_tobacco_type)
    df['campana'] = df['campana'].astype(str).str.strip()
    df['clase_comercial'] = df['clase_comercial'].astype(str).str.strip().str.upper()
    df['volumen_kg'] = pd.to_numeric(df['volumen_kg'], errors='coerce').fillna(0)
    df['volumen_tn'] = df['volumen_kg'] / 1000.0
    df['anio_inicio'] = df['campana'].apply(lambda x: int(x.split('/')[0]) if '/' in str(x) else int(x[:4]))
    return df

def load_acopio_empresas(filepath="acopio_empresas_historico_unificado.csv"):
    """Load and process buyer companies acopio data (2018-2025)."""
    df = read_csv_explicit(filepath, sep=';')
    df['provincia'] = df['provincia'].apply(clean_province)
    df['tipo_tabaco'] = df['tipo_tabaco'].apply(clean_tobacco_type)
    df['campana'] = df['campana'].astype(str).str.strip()
    df['razon_social'] = df['razon_social'].apply(clean_text_field).str.upper()
    
    # Harmonize common company aliases
    df['razon_social'] = df['razon_social'].replace({
        'ALLIANCE ONE TUC.': 'ALLIANCE ONE TUCUMÁN',
        'ALLIANCE ONE TUC': 'ALLIANCE ONE TUCUMÁN',
        'ALLIANCE ONE TUCUMAN': 'ALLIANCE ONE TUCUMÁN',
        'COOPERATIVA TUCUMAN': 'COOPERATIVA DE TUCUMÁN',
        'COOPERATIVA TUCUMÁN': 'COOPERATIVA DE TUCUMÁN',
        'COOP. JUJUY': 'COOPERATIVA DE JUJUY',
        'COOP. SALTA': 'COOPERATIVA DE SALTA',
        'COOP. DEL VALLE': 'COOPERATIVA DEL VALLE',
        'COOPERATIVA CHACO': 'COOPERATIVA DEL CHACO',
        'COOPERATIVA DE CORRIENTES': 'COOPERATIVA CORRIENTES'
    })
    
    df['volumen_acopio_kg'] = pd.to_numeric(df['volumen_acopio_kg'], errors='coerce').fillna(0)
    df['valor_acopio_pesos'] = pd.to_numeric(df['valor_acopio_pesos'], errors='coerce').fillna(0)
    df['precio_promedio_empresa'] = pd.to_numeric(df['precio_promedio_empresa'], errors='coerce')
    
    # Scale reconciliation for thousand-dot parsing in certain historical tables
    mask_scale_fix = (df['volumen_acopio_kg'] > 0) & (df['valor_acopio_pesos'] > 0) & (
        (df['valor_acopio_pesos'] / df['volumen_acopio_kg']) > 5000
    ) & (df['campana'].isin(['2018/2019', '2019/2020', '2020/2021', '2021/2022', '2022/2023']))
    
    df.loc[mask_scale_fix, 'volumen_acopio_kg'] = df.loc[mask_scale_fix, 'volumen_acopio_kg'] * 1000.0
    
    # Recalculate true unit price
    mask_valid = df['volumen_acopio_kg'] > 0
    df.loc[mask_valid, 'precio_promedio_empresa'] = (
        df.loc[mask_valid, 'valor_acopio_pesos'] / df.loc[mask_valid, 'volumen_acopio_kg']
    ).round(2)
    
    df['volumen_tn'] = df['volumen_acopio_kg'] / 1000.0
    df['anio_inicio'] = df['campana'].apply(lambda x: int(x.split('/')[0]) if '/' in str(x) else int(x[:4]))
    return df

def load_acopio_resumen_precios(filepath="acopio_resumen_precios_historico_unificado.csv"):
    """Load and process price structure and FET data (2018-2025)."""
    df = read_csv_explicit(filepath, sep=';')
    df['provincia'] = df['provincia'].apply(clean_province)
    df['tipo_tabaco'] = df['tipo_tabaco'].apply(clean_tobacco_type)
    df['campana'] = df['campana'].astype(str).str.strip()
    
    for col in ['volumen_kg', 'valor_acopio_pesos', 'precio_acopio_promedio',
                'valor_fet_pesos', 'precio_fet_promedio', 
                'valor_total_pesos', 'precio_total_promedio']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            
    # Derive missing unit prices from totals where available
    mask_vol = df['volumen_kg'] > 0
    
    mask_missing_acopio = df['precio_acopio_promedio'].isna() & mask_vol & (df['valor_acopio_pesos'] > 0)
    df.loc[mask_missing_acopio, 'precio_acopio_promedio'] = (
        df.loc[mask_missing_acopio, 'valor_acopio_pesos'] / df.loc[mask_missing_acopio, 'volumen_kg']
    ).round(2)
    
    mask_missing_fet = df['precio_fet_promedio'].isna() & mask_vol & (df['valor_fet_pesos'] > 0)
    df.loc[mask_missing_fet, 'precio_fet_promedio'] = (
        df.loc[mask_missing_fet, 'valor_fet_pesos'] / df.loc[mask_missing_fet, 'volumen_kg']
    ).round(2)
    
    mask_missing_total = df['precio_total_promedio'].isna() & mask_vol & (df['valor_total_pesos'] > 0)
    df.loc[mask_missing_total, 'precio_total_promedio'] = (
        df.loc[mask_missing_total, 'valor_total_pesos'] / df.loc[mask_missing_total, 'volumen_kg']
    ).round(2)
    
    # Calculate % FET impact
    df['pct_fet'] = np.where(
        df['valor_total_pesos'] > 0,
        (df['valor_fet_pesos'] / df['valor_total_pesos']) * 100.0,
        np.where(
            df['precio_total_promedio'] > 0,
            (df['precio_fet_promedio'] / df['precio_total_promedio']) * 100.0,
            0.0
        )
    ).round(2)
    
    df['pct_acopio'] = 100.0 - df['pct_fet']
    df['volumen_tn'] = df['volumen_kg'] / 1000.0
    df['anio_inicio'] = df['campana'].apply(lambda x: int(x.split('/')[0]) if '/' in str(x) else int(x[:4]))
    return df.sort_values(by=['anio_inicio', 'provincia', 'tipo_tabaco']).reset_index(drop=True)
