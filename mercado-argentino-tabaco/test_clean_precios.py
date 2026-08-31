import pandas as pd
import numpy as np

def load_acopio_precios_clean(filepath="acopio_resumen_precios_historico_unificado.csv"):
    df = None
    for enc in ['utf-8-sig', 'latin-1', 'cp1252']:
        try:
            df = pd.read_csv(filepath, sep=';', encoding=enc)
            break
        except Exception:
            continue
    if df is None:
        df = pd.read_csv(filepath, sep=';', encoding='latin-1', errors='replace')
        
    df.columns = [c.replace('\ufeff', '').strip() for c in df.columns]
    
    # Sanitization
    def sanitize_province(p):
        if not isinstance(p, str): return "Total Nacional"
        p_up = p.upper().strip()
        if 'TUCUM' in p_up: return 'Tucumán'
        if 'CORRIENT' in p_up: return 'Corrientes'
        if 'MISION' in p_up: return 'Misiones'
        if 'CATAMARC' in p_up: return 'Catamarca'
        if 'JUJUY' in p_up: return 'Jujuy'
        if 'SALTA' in p_up: return 'Salta'
        if 'CHACO' in p_up: return 'Chaco'
        if 'TOTAL' in p_up or 'NACIONAL' in p_up: return 'Total Nacional'
        return p.strip().title()

    def sanitize_tobacco(t):
        if not isinstance(t, str): return "Total"
        t_up = t.upper().strip()
        if 'VIRGIN' in t_up or 'VIRIGIN' in t_up: return 'Virginia'
        if 'BURLEY' in t_up: return 'Burley'
        if 'MISIONER' in t_up or 'CR. MISIONERO' in t_up or 'C. MISIONERO' in t_up: return 'Criollo Misionero'
        if 'CORRENTIN' in t_up or 'CR. CORRENTINO' in t_up or 'C. CORRENTINO' in t_up: return 'Criollo Correntino'
        if 'CHAQUE' in t_up or 'CR. CHAQUE' in t_up or 'C. CHAQUE' in t_up: return 'Criollo Chaqueño'
        if 'ARGENTIN' in t_up or 'CR. ARGENTINO' in t_up or 'C. ARGENTINO' in t_up: return 'Criollo Argentino'
        if 'SALTE' in t_up or 'CR. SALTE' in t_up or 'C. SALTE' in t_up: return 'Criollo Salteño'
        if 'SUBTOTAL' in t_up: return 'Subtotal Provincial'
        if 'TOTAL' in t_up: return 'Total Nacional'
        return t.strip().title()

    df['provincia_clean'] = df['provincia'].apply(sanitize_province)
    df['tipo_tabaco_clean'] = df['tipo_tabaco'].apply(sanitize_tobacco)
    df['campana'] = df['campana'].astype(str).str.strip()
    df['es_subtotal_provincial'] = df['es_subtotal_provincial'].astype(str).str.strip().str.lower().isin(['true', '1', 't'])
    df['es_total_nacional'] = df['es_total_nacional'].astype(str).str.strip().str.lower().isin(['true', '1', 't'])
    
    # Numeric conversions
    numeric_cols = [
        'volumen_kg', 'valor_acopio_pesos', 'precio_acopio_promedio',
        'valor_fet_pesos', 'precio_fet_promedio', 
        'valor_total_pesos', 'precio_total_promedio'
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0.0)
        
    df['volumen_tn'] = df['volumen_kg'] / 1000.0
    
    # Fill in missing unit prices from totals
    mask_vol = df['volumen_kg'] > 0
    
    mask_miss_acopio = (df['precio_acopio_promedio'] == 0) & mask_vol & (df['valor_acopio_pesos'] > 0)
    df.loc[mask_miss_acopio, 'precio_acopio_promedio'] = (df.loc[mask_miss_acopio, 'valor_acopio_pesos'] / df.loc[mask_miss_acopio, 'volumen_kg']).round(2)
    
    mask_miss_fet = (df['precio_fet_promedio'] == 0) & mask_vol & (df['valor_fet_pesos'] > 0)
    df.loc[mask_miss_fet, 'precio_fet_promedio'] = (df.loc[mask_miss_fet, 'valor_fet_pesos'] / df.loc[mask_miss_fet, 'volumen_kg']).round(2)
    
    mask_miss_total = (df['precio_total_promedio'] == 0) & mask_vol & (df['valor_total_pesos'] > 0)
    df.loc[mask_miss_total, 'precio_total_promedio'] = (df.loc[mask_miss_total, 'valor_total_pesos'] / df.loc[mask_miss_total, 'volumen_kg']).round(2)
    
    # Percentage of FET in total income
    df['pct_fet'] = np.where(
        df['valor_total_pesos'] > 0,
        (df['valor_fet_pesos'] / df['valor_total_pesos']) * 100.0,
        np.where(
            df['precio_total_promedio'] > 0,
            (df['precio_fet_promedio'] / df['precio_total_promedio']) * 100.0,
            0.0
        )
    ).round(2)
    
    df['pct_acopio'] = (100.0 - df['pct_fet']).round(2)
    df['anio_inicio'] = df['campana'].apply(lambda x: int(x.split('/')[0]) if '/' in str(x) else int(x[:4]))
    
    return df.sort_values(by=['anio_inicio', 'provincia_clean', 'tipo_tabaco_clean']).reset_index(drop=True)

df_prec = load_acopio_precios_clean()
print("Precios dataframe shape:", df_prec.shape)
print("Campañas:", sorted(df_prec['campana'].unique()))
print("Provincias:", sorted(df_prec['provincia_clean'].unique()))
print("Tipos de tabaco:", sorted(df_prec['tipo_tabaco_clean'].unique()))
print("Total Nacional rows:", len(df_prec[df_prec['es_total_nacional'] == True]))
print("Subtotal Provincial rows:", len(df_prec[df_prec['es_subtotal_provincial'] == True]))
print("Granular rows:", len(df_prec[(df_prec['es_total_nacional'] == False) & (df_prec['es_subtotal_provincial'] == False)]))

# Check 2024/2025
c_latest = df_prec[df_prec['campana'] == '2024/2025']
nat_2024 = c_latest[c_latest['es_total_nacional'] == True]
print("\n2024/2025 National Row:")
print(nat_2024[['campana', 'volumen_tn', 'precio_acopio_promedio', 'precio_fet_promedio', 'precio_total_promedio', 'pct_fet']])
