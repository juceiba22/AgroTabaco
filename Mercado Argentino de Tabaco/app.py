"""
app.py - TabacoStats Argentina
Plataforma Integral de Inteligencia y Analítica del Sector Tabacalero Nacional

Vistas integradas:
1. 📊 Producción Primaria y Rendimientos Agrícolas (csv_anuario_produccion_primaria.csv)
2. 🏷️ Calidad y Desglose por Clases Comerciales (acopio_historico_unificado.csv)
3. 🏢 Participación de Mercado y Empresas Acopiadoras (acopio_empresas_historico_unificado.csv)
4. 💰 Dinámica de Precios y Fondo Especial del Tabaco - FET (acopio_resumen_precios_historico_unificado.csv)
5. 🏛️ Ejecución Presupuestaria y Recaudación Histórica FET (FET_Consolidado_Ejecuciones_Dashboard.csv)
"""

import os
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import re

# URL del portal de noticias AgroTabaco (Next.js). Configurable por variable
# de entorno para apuntar al dominio real una vez desplegado.
AGROTABACO_SITE_URL = os.environ.get("AGROTABACO_SITE_URL", "http://localhost:3000")

# -----------------------------------------------------------------------------
# 1. Configuración de Página y Estética Visual Corporativa
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="TabacoStats Argentina | AgroTabaco",
    page_icon="🌿",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Inyección de estilos CSS corporativos — misma identidad visual que agrotabaco.com
CUSTOM_CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');

html, body, [class*="css"] {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.block-container {
    padding-top: 1.5rem;
    padding-bottom: 3rem;
    padding-left: 2rem;
    padding-right: 2rem;
    max-width: 1440px;
}

/* Header ejecutivo con el gradiente verde AgroTabaco */
.executive-header {
    background: linear-gradient(135deg, #102b19 0%, #1a4329 55%, #2f6844 100%);
    color: #ffffff;
    padding: 1.8rem 2.2rem;
    border-radius: 14px;
    margin-bottom: 1.4rem;
    box-shadow: 0 10px 25px -5px rgba(16, 43, 25, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.executive-header h1 {
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.02em;
    color: #ffffff !important;
}

.executive-header p {
    font-size: 0.95rem;
    color: #d7e0d2;
    margin-top: 0.4rem;
    margin-bottom: 0;
    line-height: 1.4;
}

/* Tarjetas métricas ejecutivas (Single-line HTML seguro para evitar codeblocks) */
.kpi-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 1.25rem 1.4rem;
    border: 1px solid #e3e6dc;
    box-shadow: 0 4px 12px rgba(26, 67, 41, 0.05);
    margin-bottom: 0.5rem;
    position: relative;
    overflow: hidden;
}

.kpi-card.blue { border-left: 4px solid #1a4329; }
.kpi-card.emerald { border-left: 4px solid #6b7a3a; }
.kpi-card.purple { border-left: 4px solid #8a5a2e; }
.kpi-card.amber { border-left: 4px solid #b8860b; }

.kpi-label {
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #5c6b5e;
    margin-bottom: 0.3rem;
}

.kpi-value {
    font-size: 1.7rem;
    font-weight: 800;
    color: #1b241d;
    line-height: 1.15;
    letter-spacing: -0.02em;
}

.kpi-delta-pos {
    color: #2f6844;
    font-weight: 700;
    font-size: 0.82rem;
    margin-top: 0.35rem;
}

.kpi-delta-neg {
    color: #a13f2e;
    font-weight: 700;
    font-size: 0.82rem;
    margin-top: 0.35rem;
}

.kpi-subtitle {
    font-size: 0.78rem;
    color: #5c6b5e;
    margin-top: 0.3rem;
}

/* Secciones y títulos */
.section-header {
    margin-top: 1.5rem;
    margin-bottom: 0.9rem;
}

.section-header h3 {
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #1a4329;
    margin: 0;
    letter-spacing: -0.01em;
}

.section-header p {
    font-size: 0.85rem;
    color: #5c6b5e;
    margin-top: 0.2rem;
    margin-bottom: 0;
}

/* Tabs personalizadas */
.stTabs [data-baseweb="tab-list"] {
    gap: 6px;
    background-color: #f1f2ed;
    padding: 6px;
    border-radius: 10px;
    border: 1px solid #e3e6dc;
    margin-bottom: 1.2rem;
}

.stTabs [data-baseweb="tab"] {
    height: 44px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.90rem;
    color: #5c6b5e;
    padding: 0 1.1rem;
    transition: all 0.2s ease;
    border: none !important;
}

.stTabs [aria-selected="true"] {
    background-color: #ffffff !important;
    color: #1a4329 !important;
    box-shadow: 0 2px 6px rgba(26, 67, 41, 0.12) !important;
}

.footer-text {
    text-align: center;
    padding: 2.5rem 0 1rem 0;
    color: #5c6b5e;
    font-size: 0.82rem;
    border-top: 1px solid #e3e6dc;
    margin-top: 2.5rem;
}

/* Barra de marca AgroTabaco */
.agrotabaco-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-bottom: 1rem;
    margin-bottom: 1.2rem;
    border-bottom: 1px solid #e3e6dc;
}

.agrotabaco-topbar-brand {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #1a4329 !important;
    text-decoration: none !important;
}

.agrotabaco-topbar-brand .accent { color: #6b7a3a; }

.agrotabaco-topbar-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    background: #1a4329;
    color: #ffffff;
    font-size: 1rem;
}

.agrotabaco-topbar-back {
    font-size: 0.85rem;
    font-weight: 600;
    color: #5c6b5e !important;
    text-decoration: none !important;
}

.agrotabaco-topbar-back:hover { color: #1a4329 !important; }
</style>
"""
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

st.markdown(f"""
<div class="agrotabaco-topbar">
    <a class="agrotabaco-topbar-brand" href="{AGROTABACO_SITE_URL}" target="_top">
        <span class="agrotabaco-topbar-logo">🌱</span> Agro<span class="accent">Tabaco</span>
    </a>
    <a class="agrotabaco-topbar-back" href="{AGROTABACO_SITE_URL}" target="_top">← Volver al portal de noticias</a>
</div>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 2. Carga y Normalización Robusta de Datos (ETL)
# -----------------------------------------------------------------------------
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
    if 'KENTUCK' in t_up:
        if 'AHUMAD' in t_up: return 'Kentucky Ahumado'
        return 'Kentucky'
    if 'MISIONER' in t_up or 'CR. MISIONERO' in t_up or 'C. MISIONERO' in t_up: return 'Criollo Misionero'
    if 'CORRENTIN' in t_up or 'CR. CORRENTINO' in t_up or 'C. CORRENTINO' in t_up: return 'Criollo Correntino'
    if 'CHAQUE' in t_up or 'CR. CHAQUE' in t_up or 'C. CHAQUE' in t_up: return 'Criollo Chaqueño'
    if 'ARGENTIN' in t_up or 'CR. ARGENTINO' in t_up or 'C. ARGENTINO' in t_up: return 'Criollo Argentino'
    if 'SALTE' in t_up or 'CR. SALTE' in t_up or 'C. SALTE' in t_up: return 'Criollo Salteño'
    if 'SUBTOTAL' in t_up: return 'Subtotal Provincial'
    if 'TOTAL' in t_up: return 'Total Nacional'
    return t.strip().title()

def clean_company_name(c):
    if not isinstance(c, str): return ""
    c = c.strip()
    c = re.sub(r'[\x81\x91\xad\ufffd]', '', c)
    c = re.sub(r'\s+', ' ', c).strip()
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

@st.cache_data(show_spinner=False)
def load_produccion_primaria():
    """Carga csv_anuario_produccion_primaria.csv."""
    df = None
    for enc in ['utf-8-sig', 'latin-1', 'cp1252']:
        try:
            df = pd.read_csv("csv_anuario_produccion_primaria.csv", encoding=enc)
            break
        except Exception: continue
    if df is None: df = pd.read_csv("csv_anuario_produccion_primaria.csv", encoding='latin-1', errors='replace')
    df.columns = [c.replace('\ufeff', '').strip() for c in df.columns]
    df['provincia_clean'] = df['provincia'].apply(sanitize_province)
    df['tipo_tabaco_clean'] = df['tipo_tabaco'].apply(sanitize_tobacco)
    df['campana'] = df['campana'].astype(str).str.strip()
    df['es_total'] = df['es_total'].astype(str).str.strip().str.lower().isin(['true', '1', 't'])
    for col in ['sup_sembrada_ha', 'sup_cosechada_ha', 'produccion_kg', 'rendimiento_kg_ha', 'precio_acopio_unitario', 'precio_fet_unitario', 'precio_total_unitario']:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    df['produccion_tn'] = df['produccion_kg'] / 1000.0
    df['anio_inicio'] = df['campana'].apply(lambda x: int(x.split('/')[0]) if '/' in str(x) else int(x[:4]))
    mask_y = df['rendimiento_kg_ha'].isna() & (df['sup_cosechada_ha'] > 0) & (df['produccion_kg'] > 0)
    df.loc[mask_y, 'rendimiento_kg_ha'] = (df.loc[mask_y, 'produccion_kg'] / df.loc[mask_y, 'sup_cosechada_ha']).round(1)
    df['valor_total_estimado'] = df['produccion_kg'] * df['precio_total_unitario']
    return df.sort_values(by=['anio_inicio', 'provincia_clean', 'tipo_tabaco_clean']).reset_index(drop=True)

@st.cache_data(show_spinner=False)
def load_acopio_clases():
    """Carga acopio_historico_unificado.csv."""
    df = None
    for enc in ['utf-8-sig', 'latin-1', 'cp1252']:
        try:
            df = pd.read_csv("acopio_historico_unificado.csv", sep=';', encoding=enc)
            break
        except Exception: continue
    if df is None: df = pd.read_csv("acopio_historico_unificado.csv", sep=';', encoding='latin-1', errors='replace')
    df.columns = [c.replace('\ufeff', '').strip() for c in df.columns]
    df['provincia_clean'] = df['provincia'].apply(sanitize_province)
    df['tipo_tabaco_clean'] = df['tipo_tabaco'].apply(sanitize_tobacco)
    df['campana'] = df['campana'].astype(str).str.strip()
    df['clase_comercial'] = df['clase_comercial'].astype(str).str.strip().str.upper()
    df['es_total_clase'] = df['es_total_clase'].astype(str).str.strip().str.lower().isin(['true', '1', 't'])
    df['volumen_kg'] = pd.to_numeric(df['volumen_kg'], errors='coerce').fillna(0.0)
    df['volumen_tn'] = df['volumen_kg'] / 1000.0
    df['anio_inicio'] = df['campana'].apply(lambda x: int(x.split('/')[0]) if '/' in str(x) else int(x[:4]))
    return df.sort_values(by=['anio_inicio', 'provincia_clean', 'tipo_tabaco_clean', 'clase_comercial']).reset_index(drop=True)

@st.cache_data(show_spinner=False)
def load_acopio_empresas():
    """Carga acopio_empresas_historico_unificado.csv."""
    df = None
    for enc in ['utf-8-sig', 'latin-1', 'cp1252']:
        try:
            df = pd.read_csv("acopio_empresas_historico_unificado.csv", sep=';', encoding=enc)
            break
        except Exception: continue
    if df is None: df = pd.read_csv("acopio_empresas_historico_unificado.csv", sep=';', encoding='latin-1', errors='replace')
    df.columns = [c.replace('\ufeff', '').strip() for c in df.columns]
    df['provincia_clean'] = df['provincia'].apply(sanitize_province)
    df['tipo_tabaco_clean'] = df['tipo_tabaco'].apply(sanitize_tobacco)
    df['campana'] = df['campana'].astype(str).str.strip()
    df['es_subtotal_empresa'] = df['es_subtotal_empresa'].astype(str).str.strip().str.lower().isin(['true', '1', 't'])
    
    df = df[~df['razon_social'].astype(str).str.match(r'^\d+[\.,]', na=False)].copy()
    df['razon_social_clean'] = df['razon_social'].apply(clean_company_name)
    df['volumen_acopio_kg'] = pd.to_numeric(df['volumen_acopio_kg'], errors='coerce').fillna(0.0)
    df['valor_acopio_pesos'] = pd.to_numeric(df['valor_acopio_pesos'], errors='coerce').fillna(0.0)
    
    mask_scale = (df['volumen_acopio_kg'] > 0) & (df['valor_acopio_pesos'] > 0) & (
        (df['valor_acopio_pesos'] / df['volumen_acopio_kg']) > 5000
    ) & (df['campana'].isin(['2018/2019', '2019/2020', '2020/2021', '2021/2022', '2022/2023']))
    df.loc[mask_scale, 'volumen_acopio_kg'] = df.loc[mask_scale, 'volumen_acopio_kg'] * 1000.0
    
    df['volumen_tn'] = df['volumen_acopio_kg'] / 1000.0
    df['precio_promedio_empresa'] = np.where(df['volumen_acopio_kg'] > 0, df['valor_acopio_pesos'] / df['volumen_acopio_kg'], 0.0).round(2)
    df['anio_inicio'] = df['campana'].apply(lambda x: int(x.split('/')[0]) if '/' in str(x) else int(x[:4]))
    return df.sort_values(by=['anio_inicio', 'provincia_clean', 'razon_social_clean']).reset_index(drop=True)

@st.cache_data(show_spinner=False)
def load_acopio_precios():
    """Carga acopio_resumen_precios_historico_unificado.csv."""
    df = None
    for enc in ['utf-8-sig', 'latin-1', 'cp1252']:
        try:
            df = pd.read_csv("acopio_resumen_precios_historico_unificado.csv", sep=';', encoding=enc)
            break
        except Exception: continue
    if df is None: df = pd.read_csv("acopio_resumen_precios_historico_unificado.csv", sep=';', encoding='latin-1', errors='replace')
    df.columns = [c.replace('\ufeff', '').strip() for c in df.columns]
    df['provincia_clean'] = df['provincia'].apply(sanitize_province)
    df['tipo_tabaco_clean'] = df['tipo_tabaco'].apply(sanitize_tobacco)
    df['campana'] = df['campana'].astype(str).str.strip()
    df['es_subtotal_provincial'] = df['es_subtotal_provincial'].astype(str).str.strip().str.lower().isin(['true', '1', 't'])
    df['es_total_nacional'] = df['es_total_nacional'].astype(str).str.strip().str.lower().isin(['true', '1', 't'])
    
    for col in ['volumen_kg', 'valor_acopio_pesos', 'precio_acopio_promedio', 'valor_fet_pesos', 'precio_fet_promedio', 'valor_total_pesos', 'precio_total_promedio']:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0.0)
        
    df['volumen_tn'] = df['volumen_kg'] / 1000.0
    
    mask_vol = df['volumen_kg'] > 0
    mask_miss_acop = (df['precio_acopio_promedio'] == 0) & mask_vol & (df['valor_acopio_pesos'] > 0)
    df.loc[mask_miss_acop, 'precio_acopio_promedio'] = (df.loc[mask_miss_acop, 'valor_acopio_pesos'] / df.loc[mask_miss_acop, 'volumen_kg']).round(2)
    
    mask_miss_fet = (df['precio_fet_promedio'] == 0) & mask_vol & (df['valor_fet_pesos'] > 0)
    df.loc[mask_miss_fet, 'precio_fet_promedio'] = (df.loc[mask_miss_fet, 'valor_fet_pesos'] / df.loc[mask_miss_fet, 'volumen_kg']).round(2)
    
    mask_miss_tot = (df['precio_total_promedio'] == 0) & mask_vol & (df['valor_total_pesos'] > 0)
    df.loc[mask_miss_tot, 'precio_total_promedio'] = (df.loc[mask_miss_tot, 'valor_total_pesos'] / df.loc[mask_miss_tot, 'volumen_kg']).round(2)
    
    df['pct_fet'] = np.where(
        df['valor_total_pesos'] > 0,
        (df['valor_fet_pesos'] / df['valor_total_pesos']) * 100.0,
        np.where(df['precio_total_promedio'] > 0, (df['precio_fet_promedio'] / df['precio_total_promedio']) * 100.0, 0.0)
    ).round(2)
    
    df['pct_acopio'] = (100.0 - df['pct_fet']).round(2)
    df['anio_inicio'] = df['campana'].apply(lambda x: int(x.split('/')[0]) if '/' in str(x) else int(x[:4]))
    return df.sort_values(by=['anio_inicio', 'provincia_clean', 'tipo_tabaco_clean']).reset_index(drop=True)

@st.cache_data(show_spinner=False)
def load_fet_consolidado():
    """Carga y procesa FET_Consolidado_Ejecuciones_Dashboard.csv."""
    df = None
    for enc in ['utf-8-sig', 'latin-1', 'cp1252']:
        try:
            df = pd.read_csv("FET_Consolidado_Ejecuciones_Dashboard.csv", encoding=enc)
            break
        except Exception: continue
    if df is None: df = pd.read_csv("FET_Consolidado_Ejecuciones_Dashboard.csv", encoding='latin-1', errors='replace')
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

df_prod = load_produccion_primaria()
df_clases = load_acopio_clases()
df_emp = load_acopio_empresas()
df_prec = load_acopio_precios()
df_fet = load_fet_consolidado()

# -----------------------------------------------------------------------------
# 3. Paletas de Colores y Helpers
# -----------------------------------------------------------------------------
TOBACCO_PALETTE = {
    'Virginia': '#c9a227',
    'Burley': '#8a5a2e',
    'Criollo Misionero': '#1a4329',
    'Criollo Correntino': '#3d5a4c',
    'Criollo Chaqueño': '#a0522d',
    'Criollo Argentino': '#6b7a3a',
    'Criollo Salteño': '#a9b87a',
    'Kentucky': '#5c4a3a',
    'Kentucky Ahumado': '#3d2b1f',
    'Total': '#1b241d'
}

def get_corporate_layout(title="", height=400):
    return dict(
        title=dict(
            text=f"<b>{title}</b>" if title else "",
            font=dict(size=14, color='#1b241d', family='Inter, sans-serif'),
            x=0.01,
            y=0.96
        ),
        template='plotly_white',
        height=height,
        margin=dict(l=45, r=30, t=45 if title else 25, b=40),
        font=dict(family="Inter, -apple-system, sans-serif", size=11, color="#5c6b5e"),
        hoverlabel=dict(bgcolor="#ffffff", font_size=12, font_family="Inter"),
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1,
            bgcolor="rgba(255, 255, 255, 0.8)",
            bordercolor="rgba(0,0,0,0.06)",
            borderwidth=1
        )
    )

def build_kpi_card(title, value, subtitle="", delta=None, delta_text="vs período anterior", color="blue"):
    delta_html = ""
    if delta is not None:
        is_pos = delta >= 0
        sign = "+" if is_pos else ""
        css = "kpi-delta-pos" if is_pos else "kpi-delta-neg"
        arrow = "▲" if is_pos else "▼"
        delta_html = f'<div class="{css}">{arrow} {sign}{delta:.1f}% {delta_text}</div>'
    sub_html = f'<div class="kpi-subtitle">{subtitle}</div>' if subtitle else ""
    return f'<div class="kpi-card {color}"><div class="kpi-label">{title}</div><div class="kpi-value">{value}</div>{delta_html}{sub_html}</div>'

# -----------------------------------------------------------------------------
# 4. Navegación Principal por Pestañas (Tabs)
# -----------------------------------------------------------------------------
tab_prod, tab_calidad, tab_empresas, tab_precios, tab_fet_ejec = st.tabs([
    "📊 1. Producción Primaria & Rendimientos",
    "🏷️ 2. Calidad & Clases Comerciales",
    "🏢 3. Participación de Mercado & Empresas",
    "💰 4. Precios & Fondo del Tabaco (FET)",
    "🏛️ 5. Ejecución Presupuestaria FET"
])

# =============================================================================
# PESTAÑA 1: PRODUCCIÓN PRIMARIA (csv_anuario_produccion_primaria.csv)
# =============================================================================
with tab_prod:
    st.markdown("""
    <div class="executive-header">
        <h1>Producción Primaria y Rendimiento Agrícola</h1>
        <p>Visualización oficial y análisis agronómico de siembra, cosecha y productividad (Serie histórica 1991/1992 - 2022/2023).</p>
    </div>
    """, unsafe_allow_html=True)
    
    col_f1, col_f2, col_f3 = st.columns(3)
    with col_f1:
        campañas_prod = sorted(df_prod['campana'].unique(), reverse=True)
        camp_p1 = st.selectbox("📅 Campaña Agrícola:", options=campañas_prod, index=0, key="p1_camp")
    with col_f2:
        provs_p1 = sorted([p for p in df_prod['provincia_clean'].unique() if p != 'Total Nacional'])
        prov_p1 = st.selectbox("📍 Provincia:", options=["Todas las Provincias"] + provs_p1, index=0, key="p1_prov")
    with col_f3:
        variedades_p1 = sorted([t for t in df_prod['tipo_tabaco_clean'].unique() if t != 'Total'])
        tipo_p1 = st.selectbox("🍂 Variedad de Tabaco:", options=["Todas las Variedades"] + variedades_p1, index=0, key="p1_tipo")

    idx_p1 = campañas_prod.index(camp_p1)
    prev_camp_p1 = campañas_prod[idx_p1 + 1] if idx_p1 + 1 < len(campañas_prod) else None

    def filter_prod_df(camp):
        dff = df_prod[df_prod['campana'] == camp].copy()
        if prov_p1 == "Todas las Provincias" and tipo_p1 == "Todas las Variedades":
            res = dff[(dff['es_total'] == False) & (dff['ambito'] == 'PROVINCIAL')]
            if res.empty: res = dff[dff['provincia_clean'] == 'Total Nacional']
        elif prov_p1 == "Todas las Provincias" and tipo_p1 != "Todas las Variedades":
            res = dff[(dff['es_total'] == False) & (dff['tipo_tabaco_clean'] == tipo_p1) & (dff['ambito'] == 'PROVINCIAL')]
            if res.empty: res = dff[(dff['tipo_tabaco_clean'] == tipo_p1) & (dff['ambito'] == 'NACIONAL')]
        elif prov_p1 != "Todas las Provincias" and tipo_p1 == "Todas las Variedades":
            res = dff[(dff['es_total'] == False) & (dff['provincia_clean'] == prov_p1)]
        else:
            res = dff[(dff['es_total'] == False) & (dff['provincia_clean'] == prov_p1) & (dff['tipo_tabaco_clean'] == tipo_p1)]
        return res

    curr_p1 = filter_prod_df(camp_p1)
    prev_p1 = filter_prod_df(prev_camp_p1) if prev_camp_p1 else pd.DataFrame()

    prod_tn_p1 = curr_p1['produccion_tn'].sum()
    sup_cos_p1 = curr_p1['sup_cosechada_ha'].sum()
    sup_sem_p1 = curr_p1['sup_sembrada_ha'].sum()
    rend_p1 = (curr_p1['produccion_kg'].sum() / sup_cos_p1) if sup_cos_p1 > 0 else 0.0

    valid_prices = curr_p1[curr_p1['precio_total_unitario'].notna() & (curr_p1['produccion_kg'] > 0)]
    precio_p1_str = f"${(valid_prices['valor_total_estimado'].sum() / valid_prices['produccion_kg'].sum()):,.2f}/kg" if not valid_prices.empty else "S/D"

    d_prod_p1, d_sup_p1, d_rend_p1 = None, None, None
    if not prev_p1.empty:
        prev_prod = prev_p1['produccion_tn'].sum()
        prev_sup = prev_p1['sup_cosechada_ha'].sum()
        prev_rend = (prev_p1['produccion_kg'].sum() / prev_sup) if prev_sup > 0 else 0.0
        if prev_prod > 0: d_prod_p1 = ((prod_tn_p1 - prev_prod) / prev_prod) * 100.0
        if prev_sup > 0: d_sup_p1 = ((sup_cos_p1 - prev_sup) / prev_sup) * 100.0
        if prev_rend > 0: d_rend_p1 = ((rend_p1 - prev_rend) / prev_rend) * 100.0

    tasa_perdida_p1 = (((sup_sem_p1 - sup_cos_p1) / sup_sem_p1) * 100.0) if sup_sem_p1 > 0 else 0.0

    c1, c2, c3, c4 = st.columns(4)
    with c1: st.markdown(build_kpi_card("PRODUCCIÓN TOTAL", f"{prod_tn_p1:,.0f} tn", f"Campaña {camp_p1}", delta=d_prod_p1, color="blue"), unsafe_allow_html=True)
    with c2: st.markdown(build_kpi_card("SUPERFICIE COSECHADA", f"{sup_cos_p1:,.0f} ha", f"Sembrada: {sup_sem_p1:,.0f} ha ({tasa_perdida_p1:.1f}% pérdida)", delta=d_sup_p1, color="emerald"), unsafe_allow_html=True)
    with c3: st.markdown(build_kpi_card("RENDIMIENTO PONDERADO", f"{rend_p1:,.0f} kg/ha", "Productividad media", delta=d_rend_p1, color="purple"), unsafe_allow_html=True)
    with c4: st.markdown(build_kpi_card("PRECIO PROMEDIO TOTAL", precio_p1_str, "Acopio + Retorno FET", color="amber"), unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    df_h_p1 = df_prod[df_prod['es_total'] == False].copy()
    if prov_p1 != "Todas las Provincias": df_h_p1 = df_h_p1[df_h_p1['provincia_clean'] == prov_p1]
    else: df_h_p1 = df_h_p1[df_h_p1['ambito'] == 'PROVINCIAL']
    if tipo_p1 != "Todas las Variedades": df_h_p1 = df_h_p1[df_h_p1['tipo_tabaco_clean'] == tipo_p1]

    ts_p1 = df_h_p1.groupby(['campana', 'anio_inicio'], as_index=False).agg({'produccion_tn': 'sum', 'sup_cosechada_ha': 'sum'}).sort_values(by='anio_inicio')
    fig_ts = go.Figure()
    fig_ts.add_trace(go.Bar(x=ts_p1['campana'], y=ts_p1['produccion_tn'], name="Producción (tn)", marker_color='#1a4329', opacity=0.85))
    fig_ts.add_trace(go.Scatter(x=ts_p1['campana'], y=ts_p1['sup_cosechada_ha'], name="Sup. Cosechada (ha)", yaxis="y2", mode="lines+markers", line=dict(color='#b8860b', width=3)))
    fig_ts.update_layout(get_corporate_layout("Evolución Histórica: Producción y Superficie Cosechada", height=400), yaxis=dict(title="Producción (tn)", showgrid=True, gridcolor="#f1f2ed"), yaxis2=dict(title="Superficie (ha)", overlaying="y", side="right", showgrid=False), xaxis=dict(tickangle=-45))
    st.plotly_chart(fig_ts, use_container_width=True)

# =============================================================================
# PESTAÑA 2: CALIDAD Y CLASES COMERCIALES (acopio_historico_unificado.csv)
# =============================================================================
with tab_calidad:
    st.markdown("""
    <div class="executive-header">
        <h1>Calidad y Desglose por Clases Comerciales</h1>
        <p>Estructura de acopio clasificado por grados comerciales de calidad (B1F, C1F, X1F, T1L, etc.), provincia y variedad.</p>
    </div>
    """, unsafe_allow_html=True)
    
    col_c1, col_c2, col_c3, col_c4 = st.columns(4)
    with col_c1:
        campañas_clases = sorted(df_clases['campana'].unique(), reverse=True)
        camp_c2 = st.selectbox("📅 Campaña de Acopio:", options=campañas_clases, index=0, key="c2_camp")
    with col_c2:
        provs_c2 = sorted([p for p in df_clases['provincia_clean'].unique() if p != 'Total Nacional'])
        prov_c2 = st.selectbox("📍 Provincia:", options=["Todas las Provincias"] + provs_c2, index=0, key="c2_prov")
    with col_c3:
        variedades_c2 = sorted([t for t in df_clases['tipo_tabaco_clean'].unique() if t != 'Total'])
        tipo_c2 = st.selectbox("🍂 Variedad de Tabaco:", options=["Todas las Variedades"] + variedades_c2, index=0, key="c2_tipo")
    with col_c4:
        sub_clases = df_clases[(df_clases['campana'] == camp_c2) & (df_clases['es_total_clase'] == False)]
        if prov_c2 != "Todas las Provincias": sub_clases = sub_clases[sub_clases['provincia_clean'] == prov_c2]
        if tipo_c2 != "Todas las Variedades": sub_clases = sub_clases[sub_clases['tipo_tabaco_clean'] == tipo_c2]
        available_classes = sorted(sub_clases['clase_comercial'].unique())
        selected_classes = st.multiselect("🔍 Filtrar Clases Específicas:", options=available_classes, default=[], placeholder="Todas las Clases", key="c2_classes")

    def filter_acopio_clases_df(camp):
        dff = df_clases[(df_clases['campana'] == camp) & (df_clases['es_total_clase'] == False) & (df_clases['provincia_clean'] != 'Total Nacional')].copy()
        if prov_c2 != "Todas las Provincias": dff = dff[dff['provincia_clean'] == prov_c2]
        if tipo_c2 != "Todas las Variedades": dff = dff[dff['tipo_tabaco_clean'] == tipo_c2]
        if selected_classes: dff = dff[dff['clase_comercial'].isin(selected_classes)]
        return dff

    curr_c2 = filter_acopio_clases_df(camp_c2)
    idx_c2 = campañas_clases.index(camp_c2)
    prev_camp_c2 = campañas_clases[idx_c2 + 1] if idx_c2 + 1 < len(campañas_clases) else None
    prev_c2 = filter_acopio_clases_df(prev_camp_c2) if prev_camp_c2 else pd.DataFrame()

    vol_tot_tn = curr_c2['volumen_tn'].sum()
    num_clases = curr_c2['clase_comercial'].nunique()

    top_clase_grp = curr_c2.groupby('clase_comercial', as_index=False)['volumen_tn'].sum().sort_values(by='volumen_tn', ascending=False)
    top1_clase_name = top_clase_grp['clase_comercial'].iloc[0] if not top_clase_grp.empty else "N/D"
    top1_clase_vol = top_clase_grp['volumen_tn'].iloc[0] if not top_clase_grp.empty else 0.0
    top1_clase_share = (top1_clase_vol / vol_tot_tn * 100.0) if vol_tot_tn > 0 else 0.0

    top_var_grp = curr_c2.groupby('tipo_tabaco_clean', as_index=False)['volumen_tn'].sum().sort_values(by='volumen_tn', ascending=False)
    top_var_name = top_var_grp['tipo_tabaco_clean'].iloc[0] if not top_var_grp.empty else "N/D"
    top_var_vol = top_var_grp['volumen_tn'].iloc[0] if not top_var_grp.empty else 0.0
    top_var_share = (top_var_vol / vol_tot_tn * 100.0) if vol_tot_tn > 0 else 0.0

    delta_vol_c2 = None
    if not prev_c2.empty and prev_c2['volumen_tn'].sum() > 0:
        delta_vol_c2 = ((vol_tot_tn - prev_c2['volumen_tn'].sum()) / prev_c2['volumen_tn'].sum()) * 100.0

    k1, k2, k3, k4 = st.columns(4)
    with k1: st.markdown(build_kpi_card("VOLUMEN CLASIFICADO", f"{vol_tot_tn:,.0f} tn", f"Campaña {camp_c2}", delta=delta_vol_c2, color="blue"), unsafe_allow_html=True)
    with k2: st.markdown(build_kpi_card("CLASES COMERCIALES", f"{num_clases}", "Grados de calidad registrados", color="emerald"), unsafe_allow_html=True)
    with k3: st.markdown(build_kpi_card("CLASE LÍDER", f"{top1_clase_name}", f"{top1_clase_vol:,.1f} tn ({top1_clase_share:.1f}%)", color="purple"), unsafe_allow_html=True)
    with k4: st.markdown(build_kpi_card("VARIEDAD DOMINANTE", f"{top_var_name}", f"{top_var_vol:,.1f} tn ({top_var_share:.1f}%)", color="amber"), unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown('<div class="section-header"><h3>📊 Distribución de Volumen por Clase Comercial (Mayor a Menor)</h3></div>', unsafe_allow_html=True)
    
    clases_agg = curr_c2.groupby(['clase_comercial', 'tipo_tabaco_clean'], as_index=False).agg({'volumen_tn': 'sum', 'volumen_kg': 'sum'})
    clases_totals = clases_agg.groupby('clase_comercial')['volumen_tn'].sum().sort_values(ascending=False)
    
    col_c_a, col_c_b = st.columns([8, 4])
    with col_c_b:
        top_n_c2 = st.selectbox("Mostrar Top N Clases:", options=[10, 15, 25, "Todas"], index=1, key="c2_top_n")
        
    top_order = clases_totals.head(int(top_n_c2)).index.tolist() if top_n_c2 != "Todas" else clases_totals.index.tolist()
    clases_agg = clases_agg[clases_agg['clase_comercial'].isin(top_order)]

    if not clases_agg.empty:
        clases_agg['share_pct'] = (clases_agg['volumen_tn'] / vol_tot_tn * 100.0).round(2)
        fig_c_bar = px.bar(clases_agg, x='clase_comercial', y='volumen_tn', color='tipo_tabaco_clean', color_discrete_map=TOBACCO_PALETTE, category_orders={'clase_comercial': top_order}, labels={'volumen_tn': 'Volumen (tn)', 'clase_comercial': 'Clase', 'tipo_tabaco_clean': 'Variedad'}, custom_data=['volumen_kg', 'share_pct'])
        fig_c_bar.update_traces(hovertemplate="<b>Clase %{x}</b> (%{legendgroup})<br>Volumen: %{y:,.1f} tn (%{customdata[0]:,.0f} kg)<br>Participación: %{customdata[1]:.2f}%<extra></extra>")
        fig_c_bar.update_layout(get_corporate_layout("", height=420), yaxis=dict(title="Volumen (tn)", showgrid=True, gridcolor="#f1f2ed"), xaxis=dict(title="Clase Comercial", tickangle=-45))
        st.plotly_chart(fig_c_bar, use_container_width=True)

# =============================================================================
# PESTAÑA 3: PARTICIPACIÓN DE MERCADO Y EMPRESAS (acopio_empresas_historico_unificado.csv)
# =============================================================================
with tab_empresas:
    st.markdown("""
    <div class="executive-header">
        <h1>Participación de Mercado y Empresas Acopiadoras</h1>
        <p>Estructura competitiva, volúmenes de acopio, cuotas de mercado (Market Share) y valor monetario por razón social y cooperativa.</p>
    </div>
    """, unsafe_allow_html=True)
    
    col_e1, col_e2, col_e3 = st.columns(3)
    with col_e1:
        campañas_emp = sorted(df_emp['campana'].unique(), reverse=True)
        camp_e3 = st.selectbox("📅 Campaña de Análisis:", options=campañas_emp, index=0, key="e3_camp")
    with col_e2:
        provs_e3 = sorted([p for p in df_emp['provincia_clean'].unique() if p != 'Total Nacional'])
        prov_e3 = st.selectbox("📍 Provincia:", options=["Todas las Provincias"] + provs_e3, index=0, key="e3_prov")
    with col_e3:
        sub_emp = df_emp[(df_emp['campana'] == camp_e3) & (df_emp['es_subtotal_empresa'] == False)]
        if prov_e3 != "Todas las Provincias": sub_emp = sub_emp[sub_emp['provincia_clean'] == prov_e3]
        available_companies = sorted(sub_emp['razon_social_clean'].unique())
        selected_company = st.selectbox("🏢 Filtrar Empresa / Razón Social:", options=["Todas las Empresas"] + available_companies, index=0, key="e3_emp")

    def filter_empresas_df(camp):
        dff = df_emp[(df_emp['campana'] == camp) & (df_emp['es_subtotal_empresa'] == False) & (df_emp['provincia_clean'] != 'Total Nacional')].copy()
        if prov_e3 != "Todas las Provincias": dff = dff[dff['provincia_clean'] == prov_e3]
        if selected_company != "Todas las Empresas": dff = dff[dff['razon_social_clean'] == selected_company]
        return dff

    curr_e3 = filter_empresas_df(camp_e3)
    idx_e3 = campañas_emp.index(camp_e3)
    prev_camp_e3 = campañas_emp[idx_e3 + 1] if idx_e3 + 1 < len(campañas_emp) else None
    prev_e3 = filter_empresas_df(prev_camp_e3) if prev_camp_e3 else pd.DataFrame()

    total_vol_e3_tn = curr_e3['volumen_tn'].sum()
    total_val_e3 = curr_e3['valor_acopio_pesos'].sum()
    n_active_companies = curr_e3['razon_social_clean'].nunique()

    company_ranking = curr_e3.groupby('razon_social_clean', as_index=False).agg({
        'volumen_tn': 'sum',
        'volumen_acopio_kg': 'sum',
        'valor_acopio_pesos': 'sum'
    }).sort_values(by='volumen_tn', ascending=False).reset_index(drop=True)

    if total_vol_e3_tn > 0 and not company_ranking.empty:
        company_ranking['market_share_pct'] = (company_ranking['volumen_tn'] / total_vol_e3_tn * 100.0).round(2)
        top1_emp_name = company_ranking['razon_social_clean'].iloc[0]
        top1_emp_vol = company_ranking['volumen_tn'].iloc[0]
        top1_emp_share = company_ranking['market_share_pct'].iloc[0]
        top3_share = company_ranking['market_share_pct'].head(3).sum()
    else:
        top1_emp_name, top1_emp_vol, top1_emp_share, top3_share = "N/D", 0.0, 0.0, 0.0

    delta_vol_e3 = None
    if not prev_e3.empty and prev_e3['volumen_tn'].sum() > 0:
        delta_vol_e3 = ((total_vol_e3_tn - prev_e3['volumen_tn'].sum()) / prev_e3['volumen_tn'].sum()) * 100.0

    m1, m2, m3, m4 = st.columns(4)
    with m1: st.markdown(build_kpi_card("EMPRESAS ACTIVAS", f"{n_active_companies}", f"Campaña {camp_e3}", color="blue"), unsafe_allow_html=True)
    with m2:
        top1_disp = (top1_emp_name[:20] + '...') if len(top1_emp_name) > 20 else top1_emp_name
        st.markdown(build_kpi_card("LÍDER DE ACOPIO", f"{top1_disp}", f"{top1_emp_vol:,.1f} tn ({top1_emp_share:.1f}% cuota)", color="emerald"), unsafe_allow_html=True)
    with m3: st.markdown(build_kpi_card("CONCENTRACIÓN TOP 3", f"{top3_share:.1f}%", "Cuota conjunta del Top 3", color="purple"), unsafe_allow_html=True)
    with m4:
        val_str = f"${(total_val_e3 / 1e9):,.1f} B" if total_val_e3 >= 1e9 else f"${(total_val_e3 / 1e6):,.1f} M"
        st.markdown(build_kpi_card("VALOR TOTAL GENERADO", val_str, f"Volumen: {total_vol_e3_tn:,.0f} tn", delta=delta_vol_e3, color="amber"), unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown('<div class="section-header"><h3>📊 Participación de Mercado por Empresa (Market Share)</h3></div>', unsafe_allow_html=True)
    
    if not company_ranking.empty:
        top_emp_data_sorted = company_ranking.head(10).sort_values(by='volumen_tn', ascending=True)
        fig_m_bar = go.Figure()
        fig_m_bar.add_trace(go.Bar(
            y=top_emp_data_sorted['razon_social_clean'],
            x=top_emp_data_sorted['volumen_tn'],
            orientation='h',
            marker=dict(color=top_emp_data_sorted['volumen_tn'], colorscale='Greens', showscale=False),
            customdata=top_emp_data_sorted['market_share_pct'],
            hovertemplate="<b>%{y}</b><br>Volumen: %{x:,.1f} tn<br>Cuota de Mercado: %{customdata:.2f}%<extra></extra>"
        ))
        fig_m_bar.update_layout(get_corporate_layout("", height=380), xaxis=dict(title="Volumen Acopiado (tn)", showgrid=True, gridcolor="#f1f2ed"), yaxis=dict(title=""))
        st.plotly_chart(fig_m_bar, use_container_width=True)

# =============================================================================
# PESTAÑA 4: DINÁMICA DE PRECIOS Y FET (acopio_resumen_precios_historico_unificado.csv)
# =============================================================================
with tab_precios:
    st.markdown("""
    <div class="executive-header">
        <h1>Dinámica de Precios y Fondo Especial del Tabaco (FET)</h1>
        <p>Análisis de la estructura del ingreso del productor: componente de Precio de Acopio base y complemento del Fondo Especial del Tabaco (Ley 19.800).</p>
    </div>
    """, unsafe_allow_html=True)
    
    col_p4_1, col_p4_2, col_p4_3 = st.columns(3)
    with col_p4_1:
        campañas_prec = sorted(df_prec['campana'].unique(), reverse=True)
        camp_p4 = st.selectbox("📅 Campaña de Precios:", options=campañas_prec, index=0, key="p4_camp")
    with col_p4_2:
        provs_p4 = sorted([p for p in df_prec['provincia_clean'].unique() if p != 'Total Nacional'])
        prov_p4 = st.selectbox("📍 Provincia:", options=["Todas las Provincias"] + provs_p4, index=0, key="p4_prov")
    with col_p4_3:
        variedades_p4 = sorted([t for t in df_prec['tipo_tabaco_clean'].unique() if t not in ['Total Nacional', 'Subtotal Provincial']])
        tipo_p4 = st.selectbox("🍂 Variedad de Tabaco:", options=["Todas las Variedades"] + variedades_p4, index=0, key="p4_tipo")

    def filter_precios_df(camp):
        dff = df_prec[df_prec['campana'] == camp].copy()
        if prov_p4 == "Todas las Provincias" and tipo_p4 == "Todas las Variedades":
            res = dff[dff['es_total_nacional'] == True]
            if res.empty: res = dff[(dff['es_subtotal_provincial'] == False) & (dff['es_total_nacional'] == False)]
        elif prov_p4 != "Todas las Provincias" and tipo_p4 == "Todas las Variedades":
            res = dff[(dff['provincia_clean'] == prov_p4) & (dff['es_subtotal_provincial'] == True)]
            if res.empty: res = dff[(dff['provincia_clean'] == prov_p4) & (dff['es_subtotal_provincial'] == False)]
        elif prov_p4 == "Todas las Provincias" and tipo_p4 != "Todas las Variedades":
            res = dff[(dff['es_subtotal_provincial'] == False) & (dff['es_total_nacional'] == False) & (dff['tipo_tabaco_clean'] == tipo_p4)]
        else:
            res = dff[(dff['es_subtotal_provincial'] == False) & (dff['es_total_nacional'] == False) & (dff['provincia_clean'] == prov_p4) & (dff['tipo_tabaco_clean'] == tipo_p4)]
        return res

    curr_p4 = filter_precios_df(camp_p4)
    idx_p4 = campañas_prec.index(camp_p4)
    prev_camp_p4 = campañas_prec[idx_p4 + 1] if idx_p4 + 1 < len(campañas_prec) else None
    prev_p4 = filter_precios_df(prev_camp_p4) if prev_camp_p4 else pd.DataFrame()

    vol_tot_p4_kg = curr_p4['volumen_kg'].sum()
    val_acop_p4 = curr_p4['valor_acopio_pesos'].sum()
    val_fet_p4 = curr_p4['valor_fet_pesos'].sum()
    val_tot_p4 = curr_p4['valor_total_pesos'].sum()

    if vol_tot_p4_kg > 0:
        precio_acopio_pond = val_acop_p4 / vol_tot_p4_kg
        precio_fet_pond = val_fet_p4 / vol_tot_p4_kg
        precio_total_pond = val_tot_p4 / vol_tot_p4_kg
        pct_fet_pond = (val_fet_p4 / val_tot_p4 * 100.0) if val_tot_p4 > 0 else 0.0
        pct_acop_pond = (val_acop_p4 / val_tot_p4 * 100.0) if val_tot_p4 > 0 else 0.0
    else:
        precio_acopio_pond, precio_fet_pond, precio_total_pond, pct_fet_pond, pct_acop_pond = 0.0, 0.0, 0.0, 0.0, 0.0

    delta_precio_tot = None
    if not prev_p4.empty and prev_p4['volumen_kg'].sum() > 0:
        prev_p_tot = prev_p4['valor_total_pesos'].sum() / prev_p4['volumen_kg'].sum()
        if prev_p_tot > 0: delta_precio_tot = ((precio_total_pond - prev_p_tot) / prev_p_tot) * 100.0

    pr1, pr2, pr3, pr4 = st.columns(4)
    with pr1: st.markdown(build_kpi_card("PRECIO ACOPIO BASE", f"${precio_acopio_pond:,.2f}/kg", f"{pct_acop_pond:.1f}% del ingreso total", color="blue"), unsafe_allow_html=True)
    with pr2: st.markdown(build_kpi_card("COMPLEMENTO FET", f"${precio_fet_pond:,.2f}/kg", f"{pct_fet_pond:.1f}% del ingreso total", color="emerald"), unsafe_allow_html=True)
    with pr3: st.markdown(build_kpi_card("PRECIO TOTAL PRODUCTOR", f"${precio_total_pond:,.2f}/kg", "Acopio + Retorno FET", delta=delta_precio_tot, color="purple"), unsafe_allow_html=True)
    with pr4: st.markdown(build_kpi_card("PARTICIPACIÓN DEL FET", f"{pct_fet_pond:.1f}%", "Peso sobre el total", color="amber"), unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown('<div class="section-header"><h3>📊 Composición del Precio por Unidad: Acopio Base vs Complemento FET</h3></div>', unsafe_allow_html=True)
    
    df_prec_nat = df_prec[df_prec['es_total_nacional'] == True].sort_values(by='anio_inicio')
    fig_prec_stacked = go.Figure()
    fig_prec_stacked.add_trace(go.Bar(x=df_prec_nat['campana'], y=df_prec_nat['precio_acopio_promedio'], name="Precio Acopio Base ($/kg)", marker_color='#1a4329', hovertemplate="<b>%{x}</b><br>Acopio: $%{y:,.2f}/kg<extra></extra>"))
    fig_prec_stacked.add_trace(go.Bar(x=df_prec_nat['campana'], y=df_prec_nat['precio_fet_promedio'], name="Complemento FET ($/kg)", marker_color='#6b7a3a', hovertemplate="<b>%{x}</b><br>FET: $%{y:,.2f}/kg<extra></extra>"))
    fig_prec_stacked.add_trace(go.Scatter(x=df_prec_nat['campana'], y=df_prec_nat['pct_fet'], name="% Aporte FET", yaxis="y2", mode="lines+markers", line=dict(color='#b8860b', width=3, dash='dot'), hovertemplate="<b>%{x}</b><br>FET: %{y:.1f}%<extra></extra>"))
    fig_prec_stacked.update_layout(get_corporate_layout("", height=400), barmode='stack', yaxis=dict(title="Precio Promedio ($/kg)", showgrid=True, gridcolor="#f1f2ed"), yaxis2=dict(title="% FET s/ Total", overlaying="y", side="right", range=[0, 100], showgrid=False))
    st.plotly_chart(fig_prec_stacked, use_container_width=True)

# =============================================================================
# PESTAÑA 5: EJECUCIÓN PRESUPUESTARIA FET (FET_Consolidado_Ejecuciones_Dashboard.csv)
# =============================================================================
with tab_fet_ejec:
    st.markdown("""
    <div class="executive-header">
        <h1>Ejecución Presupuestaria y Recaudación Histórica del FET</h1>
        <p>Análisis financiero de recaudación mensual, transferencias automáticas del 80%, complementos de precio y programas POAS (Ley 19.800).</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Filtros de Pestaña 5
    col_fet_1, col_fet_2, col_fet_3 = st.columns([3, 4, 5])
    
    with col_fet_1:
        anios_fet = sorted(df_fet['anio'].unique(), reverse=True)
        selected_anio_fet = st.selectbox(
            "📅 Año Presupuestario:",
            options=["Todos los Años (2005 - 2026)"] + anios_fet,
            index=0,
            key="fet_anio"
        )
        
    with col_fet_2:
        categorias_fet = sorted(df_fet['categoria_concepto'].unique())
        selected_cat_fet = st.selectbox(
            "🏷️ Categoría Presupuestaria:",
            options=["Todas las Categorías"] + categorias_fet,
            index=0,
            key="fet_cat"
        )
        
    with col_fet_3:
        # Conceptos filtrados dinámicamente según categoría y año
        sub_fet_concepts = df_fet.copy()
        if selected_anio_fet != "Todos los Años (2005 - 2026)":
            sub_fet_concepts = sub_fet_concepts[sub_fet_concepts['anio'] == int(selected_anio_fet)]
        if selected_cat_fet != "Todas las Categorías":
            sub_fet_concepts = sub_fet_concepts[sub_fet_concepts['categoria_concepto'] == selected_cat_fet]
            
        conceptos_disponibles = sorted(sub_fet_concepts['concepto_clean'].unique())
        selected_concept = st.selectbox(
            "🔍 Concepto Específico (Opcional):",
            options=["Todos los Conceptos"] + conceptos_disponibles,
            index=0,
            key="fet_concept"
        )

    # Filtrado del Dataset FET
    def filter_fet_data(anio_filter):
        dff = df_fet.copy()
        if anio_filter != "Todos los Años (2005 - 2026)":
            dff = dff[dff['anio'] == int(anio_filter)]
        if selected_cat_fet != "Todas las Categorías":
            dff = dff[dff['categoria_concepto'] == selected_cat_fet]
        if selected_concept != "Todos los Conceptos":
            dff = dff[dff['concepto_clean'] == selected_concept]
        return dff

    curr_fet = filter_fet_data(selected_anio_fet)
    
    # Período previo para Delta
    prev_fet = pd.DataFrame()
    if selected_anio_fet != "Todos los Años (2005 - 2026)":
        prev_anio = int(selected_anio_fet) - 1
        if prev_anio in anios_fet:
            prev_fet = filter_fet_data(prev_anio)

    # Cálculo de Métricas FET
    total_monto_ars = curr_fet['monto_ars'].sum()
    total_registros = len(curr_fet)
    
    # Calcular promedio mensual
    if not curr_fet.empty:
        n_meses = curr_fet[['anio', 'mes']].drop_duplicates().shape[0]
        promedio_mensual = (total_monto_ars / n_meses) if n_meses > 0 else 0.0
    else:
        promedio_mensual = 0.0

    # Concepto Líder
    concepto_ranking = curr_fet.groupby('concepto_clean', as_index=False)['monto_ars'].sum().sort_values(by='monto_ars', ascending=False).reset_index(drop=True)
    if not concepto_ranking.empty and total_monto_ars > 0:
        top_concepto_name = concepto_ranking['concepto_clean'].iloc[0]
        top_concepto_monto = concepto_ranking['monto_ars'].iloc[0]
        top_concepto_share = (top_concepto_monto / total_monto_ars * 100.0)
    else:
        top_concepto_name, top_concepto_monto, top_concepto_share = "N/D", 0.0, 0.0

    # Delta vs Año Previo
    delta_fet_monto = None
    if not prev_fet.empty:
        prev_total = prev_fet['monto_ars'].sum()
        if prev_total > 0:
            delta_fet_monto = ((total_monto_ars - prev_total) / prev_total) * 100.0

    # Formateo de Montos para las Tarjetas
    def format_money_short(val):
        if abs(val) >= 1e12: return f"${(val / 1e12):,.2f} T"
        if abs(val) >= 1e9: return f"${(val / 1e9):,.2f} B"
        if abs(val) >= 1e6: return f"${(val / 1e6):,.2f} M"
        return f"${val:,.0f}"

    # Tarjetas Métricas FET
    f1, f2, f3, f4 = st.columns(4)
    with f1:
        st.markdown(build_kpi_card(
            title="MONTO TOTAL EJECUTADO",
            value=format_money_short(total_monto_ars),
            subtitle=f"{selected_anio_fet}",
            delta=delta_fet_monto,
            color="blue"
        ), unsafe_allow_html=True)
    with f2:
        st.markdown(build_kpi_card(
            title="PROMEDIO MENSUAL",
            value=format_money_short(promedio_mensual),
            subtitle="Media mensual ejecutada",
            color="emerald"
        ), unsafe_allow_html=True)
    with f3:
        top_c_disp = (top_concepto_name[:20] + '...') if len(top_concepto_name) > 20 else top_concepto_name
        st.markdown(build_kpi_card(
            title="CONCEPTO PRINCIPAL",
            value=f"{top_c_disp}",
            subtitle=f"{format_money_short(top_concepto_monto)} ({top_concepto_share:.1f}%)",
            color="purple"
        ), unsafe_allow_html=True)
    with f4:
        st.markdown(build_kpi_card(
            title="PARTIDAS ANALIZADAS",
            value=f"{total_registros:,}",
            subtitle="Registros financieros mensuales",
            color="amber"
        ), unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # -------------------------------------------------------------------------
    # Visualización 1: Gráfico de Líneas Temporales (Serie Histórica 2005 - 2026)
    # -------------------------------------------------------------------------
    st.markdown('<div class="section-header"><h3>📈 Evolución Temporal de la Recaudación y Ejecución Presupuestaria FET</h3><p>Trayectoria multianual y mensual de los montos ejecutados en pesos corrientes.</p></div>', unsafe_allow_html=True)
    
    col_opt_t1, col_opt_t2 = st.columns([8, 4])
    with col_opt_t2:
        granularity = st.radio("Frecuencia Temporal:", ["Anual Agregada", "Mensual Detallada"], horizontal=True, key="fet_freq")

    if "Anual" in granularity:
        # Agrupar por año
        ts_fet_annual = curr_fet.groupby('anio', as_index=False)['monto_ars'].sum().sort_values(by='anio')
        fig_fet_ts = px.line(
            ts_fet_annual,
            x='anio',
            y='monto_ars',
            markers=True,
            labels={'monto_ars': 'Monto Ejecutado (ARS)', 'anio': 'Año'},
            line_shape='linear'
        )
        fig_fet_ts.update_traces(
            line=dict(color='#1a4329', width=3),
            marker=dict(size=7, color='#102b19'),
            hovertemplate="<b>Año %{x}</b><br>Monto Total: $%{y:,.2f}<extra></extra>"
        )
    else:
        # Agrupar por fecha mensual
        ts_fet_monthly = curr_fet.groupby('fecha', as_index=False)['monto_ars'].sum().sort_values(by='fecha')
        fig_fet_ts = px.line(
            ts_fet_monthly,
            x='fecha',
            y='monto_ars',
            labels={'monto_ars': 'Monto Ejecutado (ARS)', 'fecha': 'Fecha'},
            line_shape='spline'
        )
        fig_fet_ts.update_traces(
            line=dict(color='#2f6844', width=2.5),
            hovertemplate="<b>%{x|%b %Y}</b><br>Monto: $%{y:,.2f}<extra></extra>"
        )

    fig_fet_ts.update_layout(
        get_corporate_layout("", height=400),
        yaxis=dict(title="Monto Ejecutado (ARS)", showgrid=True, gridcolor="#f1f2ed", tickformat=",$"),
        xaxis=dict(showgrid=False)
    )
    st.plotly_chart(fig_fet_ts, use_container_width=True)

    # -------------------------------------------------------------------------
    # Visualización 2 & 3: Ranking de Conceptos y Composición por Categoría
    # -------------------------------------------------------------------------
    st.markdown("<br>", unsafe_allow_html=True)
    col_fet_g1, col_fet_g2 = st.columns([7, 5])
    
    with col_fet_g1:
        st.markdown('<div class="section-header"><h3>📊 Principales Conceptos Presupuestarios en ARS</h3><p>Ranking de las partidas de mayor impacto en el período seleccionado.</p></div>', unsafe_allow_html=True)
        
        if not concepto_ranking.empty:
            top_conceptos = concepto_ranking.head(10).sort_values(by='monto_ars', ascending=True)
            top_conceptos['share_pct'] = (top_conceptos['monto_ars'] / total_monto_ars * 100.0).round(2)
            
            fig_fet_bar = go.Figure()
            fig_fet_bar.add_trace(go.Bar(
                y=top_conceptos['concepto_clean'],
                x=top_conceptos['monto_ars'],
                orientation='h',
                marker=dict(color=top_conceptos['monto_ars'], colorscale='Greens', showscale=False),
                customdata=top_conceptos['share_pct'],
                hovertemplate="<b>%{y}</b><br>Monto: $%{x:,.2f}<br>Participación: %{customdata:.2f}%<extra></extra>"
            ))
            fig_fet_bar.update_layout(
                get_corporate_layout("", height=max(380, len(top_conceptos) * 35)),
                xaxis=dict(title="Monto en Pesos (ARS)", showgrid=True, gridcolor="#f1f2ed", tickformat=",$"),
                yaxis=dict(title="")
            )
            st.plotly_chart(fig_fet_bar, use_container_width=True)
        else:
            st.info("Sin registros presupuestarios para mostrar.")

    with col_fet_g2:
        st.markdown('<div class="section-header"><h3>🍩 Distribución por Categoría de Gasto / Recaudación</h3><p>Participación relativa de cada rubro en el presupuesto FET.</p></div>', unsafe_allow_html=True)
        
        if not curr_fet.empty:
            cat_agg = curr_fet.groupby('categoria_concepto', as_index=False)['monto_ars'].sum()
            cat_agg = cat_agg[cat_agg['monto_ars'] > 0].sort_values(by='monto_ars', ascending=False)
            
            fig_cat_pie = px.pie(
                cat_agg,
                names='categoria_concepto',
                values='monto_ars',
                hole=0.5,
                color_discrete_sequence=['#1a4329', '#6b7a3a', '#8a5a2e', '#b8860b', '#3d5a4c', '#a0522d', '#5c6b5e']
            )
            fig_cat_pie.update_traces(
                textposition='inside',
                textinfo='percent+label',
                hovertemplate="<b>%{label}</b><br>Total: $%{value:,.2f}<br>Participación: %{percent}<extra></extra>"
            )
            fig_cat_pie.update_layout(get_corporate_layout("", height=380))
            st.plotly_chart(fig_cat_pie, use_container_width=True)
        else:
            st.info("Sin datos para el gráfico de torta.")

    # -------------------------------------------------------------------------
    # Tabla Interactiva Detallada de Ejecuciones FET
    # -------------------------------------------------------------------------
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown('<div class="section-header"><h3>📋 Registro Detallado de Ejecución Presupuestaria FET</h3><p>Detalle mensualizado por fecha, categoría presupuestaria, concepto y monto ejecutado en ARS.</p></div>', unsafe_allow_html=True)

    # Preparación de tabla de display
    df_table_fet = curr_fet[['fecha', 'anio', 'mes', 'categoria_concepto', 'concepto_clean', 'monto_ars']].copy()
    df_table_fet = df_table_fet.sort_values(by=['fecha', 'monto_ars'], ascending=[False, False]).reset_index(drop=True)

    df_disp_fet = pd.DataFrame()
    df_disp_fet['Fecha'] = df_table_fet['fecha'].dt.strftime('%d/%m/%Y')
    df_disp_fet['Año'] = df_table_fet['anio']
    df_disp_fet['Mes'] = df_table_fet['mes'].str.upper()
    df_disp_fet['Categoría'] = df_table_fet['categoria_concepto']
    df_disp_fet['Concepto Presupuestario'] = df_table_fet['concepto_clean']
    df_disp_fet['Monto Ejecutado (ARS)'] = df_table_fet['monto_ars'].map('${:,.2f}'.format)

    st.dataframe(df_disp_fet, use_container_width=True, hide_index=True)

    # Botón de Descarga CSV
    csv_fet_export = df_table_fet.rename(columns={
        'concepto_clean': 'concepto'
    }).to_csv(index=False, sep=';').encode('utf-8-sig')

    st.download_button(
        label="📥 Descargar Registro de Ejecución Presupuestaria FET (CSV)",
        data=csv_fet_export,
        file_name=f"fet_ejecucion_presupuestaria_{selected_anio_fet}.csv",
        mime="text/csv"
    )

# -----------------------------------------------------------------------------
# 5. Pie de Página Corporativo
# -----------------------------------------------------------------------------
st.markdown(f"""
<div class="footer-text">
    TabacoStats Argentina &copy; 2026 | Un desarrollo de <a href="{AGROTABACO_SITE_URL}" target="_top" style="color:#1a4329;font-weight:600;text-decoration:none;">AgroTabaco</a> | Plataforma de Inteligencia del Sector Tabacalero Nacional | SAGyP & FET
</div>
""", unsafe_allow_html=True)
