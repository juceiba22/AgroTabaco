import pandas as pd
import re

def clean_text_field(text):
    if not isinstance(text, str):
        return text
    t = str(text).strip()
    
    # Remove replacement artifacts and unwanted non-ascii control bytes
    t = t.replace('\x81', '').replace('\x91', '').replace('\xad', '').replace('\ufffd', '')
    
    # Common Spanish replacements for tobacco data
    t = re.sub(r'TUCUM[^\w\s]*N|TUCUMAN|TUCUMÁN', 'TUCUMÁN', t, flags=re.IGNORECASE)
    t = re.sub(r'CHAQUE[^\w\s]*O|CHAQUEÑO|CHAQUEO', 'CHAQUEÑO', t, flags=re.IGNORECASE)
    t = re.sub(r'SALTE[^\w\s]*O|SALTEÑO|SALTEO', 'SALTEÑO', t, flags=re.IGNORECASE)
    t = re.sub(r'PANAMB[^\w\s]*|PANAMBI|PANAMBÍ', 'PANAMBÍ', t, flags=re.IGNORECASE)
    t = re.sub(r'AGR[^\w\s]*COLA|AGRICOLA|AGRÍCOLA', 'AGRÍCOLA', t, flags=re.IGNORECASE)
    t = re.sub(r'GARC[^\w\s]*A|GARCIA|GARCÍA', 'GARCÍA', t, flags=re.IGNORECASE)
    t = re.sub(r'VIRIGINIA', 'VIRGINIA', t, flags=re.IGNORECASE)
    
    return re.sub(r'\s+', ' ', t).strip()

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
        return 'NACIONAL'
    return clean_text_field(p)

def clean_tobacco(t):
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
        return 'TOTAL NACIONAL'
    return clean_text_field(t)

# Run full checks on all CSVs
files = [
    ("csv_anuario_produccion_primaria.csv", ","),
    ("acopio_historico_unificado.csv", ";"),
    ("acopio_empresas_historico_unificado.csv", ";"),
    ("acopio_resumen_precios_historico_unificado.csv", ";")
]

for fname, sep in files:
    df = pd.read_csv(fname, sep=sep, encoding='latin-1')
    print(f"\n================= {fname} =================")
    if 'provincia' in df.columns:
        p_vals = sorted(df['provincia'].apply(clean_province).unique())
        print(f"Clean Provincias ({len(p_vals)}): {p_vals}")
    if 'tipo_tabaco' in df.columns:
        t_vals = sorted(df['tipo_tabaco'].apply(clean_tobacco).unique())
        print(f"Clean Tipos Tabaco ({len(t_vals)}): {t_vals}")
    if 'campana' in df.columns:
        c_vals = sorted(df['campana'].astype(str).str.strip().unique())
        print(f"Campañas ({len(c_vals)}): {c_vals[0]} ... {c_vals[-1]}")
