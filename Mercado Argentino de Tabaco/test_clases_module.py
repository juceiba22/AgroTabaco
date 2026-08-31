import pandas as pd
import numpy as np

def load_acopio_clases_data(filepath="acopio_historico_unificado.csv"):
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
        if 'MISIONER' in t_up or 'C. MISIONERO' in t_up or 'CR. MISIONERO' in t_up: return 'Criollo Misionero'
        if 'CORRENTIN' in t_up or 'C. CORRENTINO' in t_up or 'CR. CORRENTINO' in t_up: return 'Criollo Correntino'
        if 'CHAQUE' in t_up or 'C. CHAQUE' in t_up or 'CR. CHAQUE' in t_up: return 'Criollo Chaqueño'
        if 'ARGENTIN' in t_up or 'C. ARGENTINO' in t_up or 'CR. ARGENTINO' in t_up: return 'Criollo Argentino'
        if 'SALTE' in t_up or 'C. SALTE' in t_up or 'CR. SALTE' in t_up: return 'Criollo Salteño'
        if 'TOTAL' in t_up: return 'Total'
        return t.strip().title()

    df['provincia_clean'] = df['provincia'].apply(sanitize_province)
    df['tipo_tabaco_clean'] = df['tipo_tabaco'].apply(sanitize_tobacco)
    df['campana'] = df['campana'].astype(str).str.strip()
    df['clase_comercial'] = df['clase_comercial'].astype(str).str.strip().str.upper()
    df['es_total_clase'] = df['es_total_clase'].astype(str).str.strip().str.lower().isin(['true', '1', 't'])
    df['volumen_kg'] = pd.to_numeric(df['volumen_kg'], errors='coerce').fillna(0.0)
    df['volumen_tn'] = df['volumen_kg'] / 1000.0
    df['anio_inicio'] = df['campana'].apply(lambda x: int(x.split('/')[0]) if '/' in str(x) else int(x[:4]))
    
    return df

df_clases = load_acopio_clases_data()
print("Acopio Clases shape:", df_clases.shape)
print("Campañas:", sorted(df_clases['campana'].unique()))
print("Provincias:", sorted(df_clases['provincia_clean'].unique()))
print("Tipos de tabaco:", sorted(df_clases['tipo_tabaco_clean'].unique()))
print("Granular classes count (es_total_clase=False):", df_clases[df_clases['es_total_clase'] == False]['clase_comercial'].nunique())

# Test 2024/2025
c_latest = df_clases[(df_clases['campana'] == '2024/2025') & (df_clases['es_total_clase'] == False) & (df_clases['provincia_clean'] != 'Total Nacional')]
print("2024/2025 Granular volume:", c_latest['volumen_tn'].sum(), "tn")
print("Top 5 clases 2024/2025:")
top5 = c_latest.groupby(['clase_comercial', 'tipo_tabaco_clean'])['volumen_tn'].sum().sort_values(ascending=False).head(5)
print(top5)
