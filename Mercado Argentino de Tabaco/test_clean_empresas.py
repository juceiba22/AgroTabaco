import pandas as pd
import numpy as np
import re

def load_acopio_empresas_clean(filepath="acopio_empresas_historico_unificado.csv"):
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
        if 'TOTAL' in t_up: return 'Total'
        return t.strip().title()

    def clean_company_name(c):
        if not isinstance(c, str): return ""
        c = c.strip()
        # Remove extra punctuation artifacts
        c = re.sub(r'[\x81\x91\xad\ufffd]', '', c)
        c = re.sub(r'\s+', ' ', c).strip()
        
        # Standardize aliases
        c_up = c.upper()
        if 'COPROTAB' in c_up or ('COOP' in c_up and 'SALTA' in c_up):
            return 'Cooperativa de Salta (COPROTAB)'
        if 'CTJ' in c_up or ('COOP' in c_up and 'JUJUY' in c_up):
            return 'Cooperativa de Jujuy (CTJ)'
        if 'CTM' in c_up or ('COOP' in c_up and 'MISIONES' in c_up and 'AGROINDUSTRIAL' in c_up):
            return 'Cooperativa Agroindustrial de Misiones (CTM)'
        if 'COTAVI' in c_up or ('COOP' in c_up and 'SAN VICENTE' in c_up):
            return 'Cooperativa San Vicente (COTAVI)'
        if 'COPAT' in c_up or ('COOP' in c_up and 'TUCUM' in c_up):
            return 'Cooperativa de Tucumán (COPAT)'
        if 'COOP' in c_up and 'CHACO' in c_up:
            return 'Cooperativa del Chaco'
        if 'COOP' in c_up and 'CORRIENTES' in c_up:
            return 'Cooperativa de Corrientes'
        if 'MASSALIN' in c_up:
            if 'JUJUY' in c_up: return 'Massalin Particulares (Jujuy)'
            if 'SALTA' in c_up: return 'Massalin Particulares (Salta)'
            if 'MISIONES' in c_up: return 'Massalin Particulares (Misiones)'
            return 'Massalin Particulares'
        if 'ALLIANCE' in c_up:
            if 'JUJUY' in c_up: return 'Alliance One (Jujuy)'
            if 'SALTA' in c_up: return 'Alliance One (Salta)'
            if 'MISIONES' in c_up: return 'Alliance One (Misiones)'
            if 'TUCUM' in c_up: return 'Alliance One (Tucumán)'
            if 'GOYA' in c_up or 'CORRIENTES' in c_up: return 'Alliance One (Corrientes)'
            return 'Alliance One'
        if 'TABES' in c_up:
            return 'Tabes S.A.'
        if 'BONPLAND' in c_up:
            return 'Bonpland Leaf S.A.'
        if 'CIMA' in c_up or 'MISIONERA ARGENTINA' in c_up:
            return 'CIMA S.A.'
        if 'CRECER' in c_up:
            return 'Crecer S.R.L.'
            
        return c.title()

    df['provincia_clean'] = df['provincia'].apply(sanitize_province)
    df['tipo_tabaco_clean'] = df['tipo_tabaco'].apply(sanitize_tobacco)
    df['campana'] = df['campana'].astype(str).str.strip()
    df['es_subtotal_empresa'] = df['es_subtotal_empresa'].astype(str).str.strip().str.lower().isin(['true', '1', 't'])
    
    # Exclude artifact rows where razon_social is numeric
    df = df[~df['razon_social'].astype(str).str.match(r'^\d+[\.,]', na=False)].copy()
    df['razon_social_clean'] = df['razon_social'].apply(clean_company_name)
    
    df['volumen_acopio_kg'] = pd.to_numeric(df['volumen_acopio_kg'], errors='coerce').fillna(0.0)
    df['valor_acopio_pesos'] = pd.to_numeric(df['valor_acopio_pesos'], errors='coerce').fillna(0.0)
    
    # Scale fix for thousands parsed as decimal
    mask_scale = (df['volumen_acopio_kg'] > 0) & (df['valor_acopio_pesos'] > 0) & (
        (df['valor_acopio_pesos'] / df['volumen_acopio_kg']) > 5000
    ) & (df['campana'].isin(['2018/2019', '2019/2020', '2020/2021', '2021/2022', '2022/2023']))
    df.loc[mask_scale, 'volumen_acopio_kg'] = df.loc[mask_scale, 'volumen_acopio_kg'] * 1000.0
    
    # Accurate price per kg
    mask_valid = df['volumen_acopio_kg'] > 0
    df['precio_promedio_empresa'] = np.where(mask_valid, df['valor_acopio_pesos'] / df['volumen_acopio_kg'], 0.0).round(2)
    df['volumen_tn'] = df['volumen_acopio_kg'] / 1000.0
    df['anio_inicio'] = df['campana'].apply(lambda x: int(x.split('/')[0]) if '/' in str(x) else int(x[:4]))
    
    return df.sort_values(by=['anio_inicio', 'provincia_clean', 'razon_social_clean']).reset_index(drop=True)

df_emp = load_acopio_empresas_clean()
print("Clean Empresas dataframe shape:", df_emp.shape)
print("Campañas:", sorted(df_emp['campana'].unique()))
print("Granular rows (es_subtotal_empresa == False):", len(df_emp[df_emp['es_subtotal_empresa'] == False]))

# Test 2024/2025
c_latest = df_emp[(df_emp['campana'] == '2024/2025') & (df_emp['es_subtotal_empresa'] == False) & (df_emp['provincia_clean'] != 'Total Nacional')]
print("\n2024/2025 Summary:")
print("Total companies:", c_latest['razon_social_clean'].nunique())
print("Total volume:", c_latest['volumen_tn'].sum(), "tn")
print("Total value:", c_latest['valor_acopio_pesos'].sum(), "pesos")
print("Top 5 Acopiadores 2024/2025:")
top5 = c_latest.groupby('razon_social_clean').agg({'volumen_tn': 'sum', 'valor_acopio_pesos': 'sum'}).sort_values(by='volumen_tn', ascending=False).head(5)
print(top5)
