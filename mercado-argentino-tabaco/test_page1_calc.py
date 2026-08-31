import pandas as pd
import numpy as np

def load_and_clean_produccion(filepath="csv_anuario_produccion_primaria.csv"):
    # Read with utf-8-sig and latin-1 fallback
    for enc in ['utf-8-sig', 'latin-1', 'cp1252']:
        try:
            df = pd.read_csv(filepath, encoding=enc)
            break
        except Exception:
            continue
            
    # Clean column names
    df.columns = [c.replace('\ufeff', '').strip() for c in df.columns]
    
    # Text sanitization
    def clean_prov(p):
        if not isinstance(p, str):
            return p
        p_up = p.upper().strip()
        if 'TUCUM' in p_up: return 'Tucumán'
        if 'CORRIENT' in p_up: return 'Corrientes'
        if 'MISION' in p_up: return 'Misiones'
        if 'CATAMARC' in p_up: return 'Catamarca'
        if 'JUJUY' in p_up: return 'Jujuy'
        if 'SALTA' in p_up: return 'Salta'
        if 'CHACO' in p_up: return 'Chaco'
        if 'TOTAL' in p_up or 'NACIONAL' in p_up: return 'Total Nacional'
        return p.strip()
        
    def clean_tob(t):
        if not isinstance(t, str):
            return t
        t_up = t.upper().strip()
        if 'VIRGIN' in t_up: return 'Virginia'
        if 'BURLEY' in t_up: return 'Burley'
        if 'KENTUCK' in t_up:
            if 'AHUMAD' in t_up: return 'Kentucky Ahumado'
            return 'Kentucky'
        if 'MISIONER' in t_up: return 'Criollo Misionero'
        if 'CORRENTIN' in t_up: return 'Criollo Correntino'
        if 'CHAQUE' in t_up: return 'Criollo Chaqueño'
        if 'ARGENTIN' in t_up: return 'Criollo Argentino'
        if 'SALTE' in t_up: return 'Criollo Salteño'
        if 'TOTAL' in t_up: return 'Total'
        return t.strip()

    df['provincia_clean'] = df['provincia'].apply(clean_prov)
    df['tipo_tabaco_clean'] = df['tipo_tabaco'].apply(clean_tob)
    df['campana'] = df['campana'].astype(str).str.strip()
    
    # Boolean column conversion
    df['es_total'] = df['es_total'].astype(bool)
    
    # Numeric conversion
    num_cols = [
        'sup_sembrada_ha', 'sup_cosechada_ha', 'produccion_kg', 
        'rendimiento_kg_ha', 'precio_acopio_unitario', 
        'precio_fet_unitario', 'precio_total_unitario'
    ]
    for col in num_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')
        
    # Derived columns
    df['produccion_tn'] = df['produccion_kg'] / 1000.0
    df['produccion_m_kg'] = df['produccion_kg'] / 1_000_000.0
    df['anio_inicio'] = df['campana'].apply(lambda x: int(x.split('/')[0]) if '/' in str(x) else int(x[:4]))
    
    # Value in pesos (produccion * precio)
    df['valor_total_estimado'] = df['produccion_kg'] * df['precio_total_unitario']
    
    return df.sort_values(by=['anio_inicio', 'provincia_clean', 'tipo_tabaco_clean']).reset_index(drop=True)

df = load_and_clean_produccion()
print("Clean dataset ready!")
print("Provincias:", sorted([p for p in df['provincia_clean'].unique() if p != 'Total Nacional']))
print("Tipos:", sorted([t for t in df['tipo_tabaco_clean'].unique() if t != 'Total']))
print("Campañas (total:", df['campana'].nunique(), "):", sorted(df['campana'].unique())[-5:])

# Test calculation on 2022/2023 with es_total == False
c_df = df[(df['campana'] == '2022/2023') & (df['es_total'] == False)]
print("\nKPIs 2022/2023 (Granular):")
print("Producción:", c_df['produccion_tn'].sum(), "tn")
print("Sup Cosechada:", c_df['sup_cosechada_ha'].sum(), "ha")
print("Rendimiento Ponderado:", c_df['produccion_kg'].sum() / c_df['sup_cosechada_ha'].sum(), "kg/ha")
print("Precio Promedio Ponderado:", c_df['valor_total_estimado'].sum() / c_df['produccion_kg'].sum(), "$/kg")
