import pandas as pd
import re

def clean_string(text):
    if not isinstance(text, str):
        return text
    t = text.strip()
    # Normalize common mojibake patterns
    t = re.sub(r'CHAQUE[\ufffd\x81\x91\?]+O|CHAQUE[^\w\s]+O|CHAQUEÑO|CHAQUEO', 'CHAQUEÑO', t, flags=re.IGNORECASE)
    t = re.sub(r'SALTE[\ufffd\x81\x91\?]+O|SALTE[^\w\s]+O|SALTEÑO|SALTEO', 'SALTEÑO', t, flags=re.IGNORECASE)
    t = re.sub(r'TUCUM[\ufffd\x81\x91\?]+N|TUCUM[^\w\s]+N|TUCUMÁN|TUCUMAN', 'TUCUMÁN', t, flags=re.IGNORECASE)
    t = re.sub(r'Agr[\ufffd\x81\x91\xad\?]+cola', 'Agrícola', t, flags=re.IGNORECASE)
    t = re.sub(r'Garc[\ufffd\x81\x91\xad\?]+a', 'García', t, flags=re.IGNORECASE)
    t = re.sub(r'Panamb[\ufffd\x81\x91\xad\?]+', 'Panambí', t, flags=re.IGNORECASE)
    t = re.sub(r'VIRIGINIA', 'VIRGINIA', t, flags=re.IGNORECASE)
    
    # Remove excessive whitespace
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def clean_province(p):
    if not isinstance(p, str):
        return p
    p_up = p.upper().strip()
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
    return clean_string(p)

def clean_tobacco_type(t):
    if not isinstance(t, str):
        return t
    t_up = t.upper().strip()
    if 'VIRGIN' in t_up or 'VIRIGIN' in t_up:
        return 'VIRGINIA'
    if 'BURLEY' in t_up:
        return 'BURLEY'
    if 'KENTUCK' in t_up:
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
    return clean_string(t)

# Test on all files
for fname, sep in [
    ("csv_anuario_produccion_primaria.csv", ","),
    ("acopio_historico_unificado.csv", ";"),
    ("acopio_empresas_historico_unificado.csv", ";"),
    ("acopio_resumen_precios_historico_unificado.csv", ";")
]:
    # Read with latin-1 as requested
    df = pd.read_csv(fname, sep=sep, encoding='latin-1')
    if 'provincia' in df.columns:
        df['provincia_clean'] = df['provincia'].apply(clean_province)
        print(f"{fname} Provincias: {sorted(df['provincia_clean'].unique())}")
    if 'tipo_tabaco' in df.columns:
        df['tipo_clean'] = df['tipo_tabaco'].apply(clean_tobacco_type)
        print(f"{fname} Tipos: {sorted(df['tipo_clean'].unique())}")
    if 'razon_social' in df.columns:
        df['razon_clean'] = df['razon_social'].apply(clean_string)
        sample = [x for x in df['razon_clean'].unique() if any(ord(c) > 127 for c in x)]
        print(f"{fname} Sample Razon Social with accents: {sample[:5]}")
