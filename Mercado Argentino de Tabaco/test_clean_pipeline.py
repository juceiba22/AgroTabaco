import pandas as pd
import re

def clean_text(text):
    if not isinstance(text, str):
        return text
    # Remove hidden control / corrupted replacement chars
    t = text.strip()
    # Fix corrupted combinations from PDF extractions
    t = t.replace('\x81', '').replace('\x91', '').replace('\xad', '').replace('\ufffd', '')
    t = t.replace('?', '') if '?' in t and ('CHAQUE' in t or 'SALTE' in t or 'TUCUM' in t) else t
    
    # Specific dictionary replacements
    replacements = {
        'TUCUMN': 'TUCUMÁN',
        'TUCUMAN': 'TUCUMÁN',
        'TUCUMÁN': 'TUCUMÁN',
        'CHAQUEO': 'CHAQUEÑO',
        'CHAQUEÑO': 'CHAQUEÑO',
        'SALTEO': 'SALTEÑO',
        'SALTEÑO': 'SALTEÑO',
        'VIRIGINIA': 'VIRGINIA',
        'MONTAEZ': 'MONTAÑEZ',
        'MONTAÑEZ': 'MONTAÑEZ',
        'AGRCOLA': 'AGRÍCOLA',
        'AGRICOLA': 'AGRÍCOLA',
        'PANAMB': 'PANAMBÍ',
        'GARCIA': 'GARCÍA',
    }
    
    # Clean words
    t_up = t.upper()
    if 'TUCUM' in t_up:
        t = re.sub(r'TUCUM[^\s\.\,\(\)]*', 'TUCUMÁN', t, flags=re.IGNORECASE)
    if 'CHAQUE' in t_up:
        t = re.sub(r'CHAQUE[^\s\.\,\(\)]*', 'CHAQUEÑO', t, flags=re.IGNORECASE)
    if 'SALTE' in t_up:
        t = re.sub(r'SALTE[^\s\.\,\(\)]*', 'SALTEÑO', t, flags=re.IGNORECASE)
    if 'PANAMB' in t_up:
        t = re.sub(r'PANAMB[^\s\.\,\(\)]*', 'PANAMBÍ', t, flags=re.IGNORECASE)
    if 'AGR' in t_up and 'COLA' in t_up:
        t = re.sub(r'AGR[^\s]*COLA', 'AGRÍCOLA', t, flags=re.IGNORECASE)
        
    return re.sub(r'\s+', ' ', t).strip()

def clean_province_name(p):
    if not isinstance(p, str):
        return p
    p_clean = clean_text(p).upper()
    if 'TUCUM' in p_clean:
        return 'TUCUMÁN'
    if 'CORRIENT' in p_clean:
        return 'CORRIENTES'
    if 'MISION' in p_clean:
        return 'MISIONES'
    if 'CATAMARC' in p_clean:
        return 'CATAMARCA'
    if 'JUJUY' in p_clean:
        return 'JUJUY'
    if 'SALTA' in p_clean:
        return 'SALTA'
    if 'CHACO' in p_clean:
        return 'CHACO'
    if 'TOTAL' in p_clean or 'NACIONAL' in p_clean:
        return 'TOTAL NACIONAL'
    return p_clean

# Verify across all 4 files
for fname, sep in [
    ("csv_anuario_produccion_primaria.csv", ","),
    ("acopio_historico_unificado.csv", ";"),
    ("acopio_empresas_historico_unificado.csv", ";"),
    ("acopio_resumen_precios_historico_unificado.csv", ";")
]:
    df = pd.read_csv(fname, sep=sep, encoding='latin-1')
    provinces = df['provincia'].apply(clean_province_name).unique().tolist() if 'provincia' in df.columns else []
    tobaccos = df['tipo_tabaco'].apply(clean_text).unique().tolist() if 'tipo_tabaco' in df.columns else []
    print(f"File: {fname}")
    print(f"  Provinces: {provinces}")
    print(f"  Sample Tobaccos: {tobaccos[:4]}")
