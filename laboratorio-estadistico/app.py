"""
app.py - Laboratorio Estadístico: Mercado Interno de Tabaco (Cigarrillos)
Volumen, precios, participación de mercado y consumo aparente histórico.

Fuentes (todas en esta misma carpeta):
1. fact_volumen_precios_bi.csv   - Evolución mensual de precios y cuartiles de volumen.
2. fact_participacion_bi.csv     - Participación mensual Empresas Grandes vs. PyMES.
3. fact_consumo_aparente_bi.csv  - Serie histórica anual de consumo aparente (1910-2026).

Nota: diccionario.py (diccionario de variables) está presente pero vacío al
momento de escribir este dashboard — las etiquetas usadas acá se basan en
los nombres de columna y en la descripción funcional provista al pedir este
tablero, no en ese diccionario.
"""

import os
import re
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

try:
    _secret_site_url = st.secrets.get("AGROTABACO_SITE_URL")
except Exception:
    _secret_site_url = None
AGROTABACO_SITE_URL = (
    _secret_site_url or os.environ.get("AGROTABACO_SITE_URL", "http://localhost:3000")
)

DATA_DIR = os.path.dirname(os.path.abspath(__file__))


def data_path(filename):
    return os.path.join(DATA_DIR, filename)


# -----------------------------------------------------------------------------
# 1. Configuración de Página y Estética Visual Corporativa
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="Laboratorio Estadístico | AgroTabaco",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="expanded",
)

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

.kpi-delta-pos { color: #2f6844; font-weight: 700; font-size: 0.82rem; margin-top: 0.35rem; }
.kpi-delta-neg { color: #a13f2e; font-weight: 700; font-size: 0.82rem; margin-top: 0.35rem; }
.kpi-subtitle { font-size: 0.78rem; color: #5c6b5e; margin-top: 0.3rem; }

.section-header { margin-top: 1.5rem; margin-bottom: 0.9rem; }
.section-header h3 {
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #1a4329;
    margin: 0;
    letter-spacing: -0.01em;
}
.section-header p { font-size: 0.85rem; color: #5c6b5e; margin-top: 0.2rem; margin-bottom: 0; }

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

.agrotabaco-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 3rem;
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
.agrotabaco-topbar-back { font-size: 0.85rem; font-weight: 600; color: #5c6b5e !important; text-decoration: none !important; }
.agrotabaco-topbar-back:hover { color: #1a4329 !important; }
</style>
"""
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

st.markdown(f"""
<div class="agrotabaco-topbar">
    <a class="agrotabaco-topbar-brand" href="{AGROTABACO_SITE_URL}" target="_top">
        <span class="agrotabaco-topbar-logo">🔬</span> Laboratorio <span class="accent">Estadístico</span>
    </a>
    <a class="agrotabaco-topbar-back" href="{AGROTABACO_SITE_URL}" target="_top">← Volver al portal de noticias</a>
</div>
""", unsafe_allow_html=True)


def get_corporate_layout(title="", height=400):
    return dict(
        title=dict(
            text=f"<b>{title}</b>" if title else "",
            font=dict(size=14, color='#1b241d', family='Inter, sans-serif'),
            x=0.01, y=0.96,
        ),
        template='plotly_white',
        height=height,
        margin=dict(l=45, r=30, t=45 if title else 25, b=40),
        font=dict(family="Inter, -apple-system, sans-serif", size=11, color="#5c6b5e"),
        hoverlabel=dict(bgcolor="#ffffff", font_size=12, font_family="Inter"),
        legend=dict(
            orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1,
            bgcolor="rgba(255, 255, 255, 0.8)", bordercolor="rgba(0,0,0,0.06)", borderwidth=1,
        ),
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
# 2. Carga y Normalización Robusta de Datos (ETL)
# -----------------------------------------------------------------------------
MESES_ABR = {
    'ene': 1, 'feb': 2, 'mar': 3, 'mzo': 3, 'abr': 4, 'may': 5, 'jun': 6,
    'jul': 7, 'ago': 8, 'sep': 9, 'set': 9, 'oct': 10, 'nov': 11, 'dic': 12,
}
MESES_FULL = {
    'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
    'julio': 7, 'agosto': 8, 'septiembre': 9, 'setiembre': 9, 'octubre': 10,
    'noviembre': 11, 'diciembre': 12,
}


def parse_mes_es(raw):
    """Convierte encabezados de mes en español a Timestamp (día 1 del mes).

    La columna 'mes' de fact_volumen_precios_bi.csv mezcla varios formatos
    reales encontrados en el archivo: 'ene-05' (minúscula, sin punto),
    'mar.-10' (con punto), 'Jul-26' (mayúscula) e incluso 'Oct - 22' /
    'abril 26' (nombre completo, con o sin espacios). Este parser cubre
    todas esas variantes en vez de asumir un único formato limpio.
    """
    s = str(raw).strip().lower().replace('.', '')
    m = re.match(r'([a-záéíóúñ]+)\s*-?\s*(\d{2,4})', s)
    if not m:
        return pd.NaT
    mes_txt, yr_txt = m.group(1), m.group(2)
    month = MESES_FULL.get(mes_txt) or MESES_ABR.get(mes_txt[:3])
    if month is None:
        return pd.NaT
    year = int(yr_txt)
    if year < 100:
        year += 2000
    try:
        return pd.Timestamp(year=year, month=month, day=1)
    except ValueError:
        return pd.NaT


def read_csv_robust(filename):
    for enc in ['utf-8-sig', 'latin-1', 'cp1252']:
        try:
            return pd.read_csv(data_path(filename), encoding=enc)
        except Exception:
            continue
    return pd.read_csv(data_path(filename), encoding='latin-1', errors='replace')


@st.cache_data(show_spinner=False)
def load_volumen_precios():
    df = read_csv_robust("fact_volumen_precios_bi.csv")
    df.columns = [c.replace('﻿', '').strip() for c in df.columns]

    df['fecha'] = df['mes'].apply(parse_mes_es)

    value_cols = [
        'precio_inferior', 'precio_promedio_ponderado', 'precio_superior',
        'primer_quartil', 'segundo_quartil', 'tercer_quartil', 'cuarto_quartil',
        'total_paquetes',
    ]
    for col in value_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    df = df.dropna(subset=['fecha'])

    # El archivo trae el mismo mes calendario repetido varias veces (distintas
    # tandas de exportación concatenadas, con formatos de fecha distintos:
    # 'may-19' aparece 3 veces con datos incompatibles entre sí — una fila
    # completa, una parcial y una en cero). Para cada mes, nos quedamos con
    # la fila más completa (más columnas con dato) y, en empate, la de mayor
    # total_paquetes — así se descartan los duplicados vacíos/placeholder.
    df['_completitud'] = df[value_cols].notna().sum(axis=1)
    df = df.sort_values(['fecha', '_completitud', 'total_paquetes'], na_position='first')
    df = df.drop_duplicates(subset='fecha', keep='last').drop(columns='_completitud')

    return df.sort_values('fecha').reset_index(drop=True)


@st.cache_data(show_spinner=False)
def load_participacion():
    df = read_csv_robust("fact_participacion_bi.csv")
    df.columns = [c.replace('﻿', '').strip() for c in df.columns]

    df['fecha'] = df['fecha'].apply(parse_mes_es)

    value_cols = [
        'empresas_grandes', 'porcentaje_participacion_grandes',
        'empresas_pymes', 'porcentaje_participacion_pymes', 'total_mercado',
    ]
    for col in value_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    df = df.dropna(subset=['fecha'])
    df = df.drop_duplicates(subset='fecha', keep='last')
    return df.sort_values('fecha').reset_index(drop=True)


@st.cache_data(show_spinner=False)
def load_consumo_aparente():
    df = read_csv_robust("fact_consumo_aparente_bi.csv")
    df.columns = [c.replace('﻿', '').strip() for c in df.columns]

    df['anio'] = pd.to_numeric(df['anio'], errors='coerce').astype('Int64')
    for col in ['total_paquetes', 'poblacion', 'consumo_aparente']:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    df = df.dropna(subset=['anio']).drop_duplicates(subset='anio', keep='last')
    return df.sort_values('anio').reset_index(drop=True)


df_vol = load_volumen_precios()
df_part = load_participacion()
df_cons = load_consumo_aparente()

# -----------------------------------------------------------------------------
# 3. Barra Lateral: Filtros Globales
# -----------------------------------------------------------------------------
with st.sidebar:
    st.markdown("### 🔬 Laboratorio Estadístico")
    st.caption("Mercado interno de tabaco — cigarrillos (paquetes eq. 20 un.)")
    st.markdown("---")

    st.markdown("**Período mensual**")
    st.caption("Aplica a Precios/Cuartiles y Participación de Mercado")
    fecha_min_m = min(df_vol['fecha'].min(), df_part['fecha'].min())
    fecha_max_m = max(df_vol['fecha'].max(), df_part['fecha'].max())
    rango_mensual = st.slider(
        "Rango de meses:", min_value=fecha_min_m.to_pydatetime(), max_value=fecha_max_m.to_pydatetime(),
        value=(fecha_min_m.to_pydatetime(), fecha_max_m.to_pydatetime()), format="MM/YYYY",
    )

    st.markdown("---")
    st.markdown("**Rango histórico**")
    st.caption("Aplica a Consumo Aparente (1910-2026)")
    anio_min, anio_max = int(df_cons['anio'].min()), int(df_cons['anio'].max())
    rango_anual = st.slider(
        "Rango de años:", min_value=anio_min, max_value=anio_max, value=(anio_min, anio_max),
    )

df_vol_f = df_vol[(df_vol['fecha'] >= pd.Timestamp(rango_mensual[0])) & (df_vol['fecha'] <= pd.Timestamp(rango_mensual[1]))]
df_part_f = df_part[(df_part['fecha'] >= pd.Timestamp(rango_mensual[0])) & (df_part['fecha'] <= pd.Timestamp(rango_mensual[1]))]
df_cons_f = df_cons[(df_cons['anio'] >= rango_anual[0]) & (df_cons['anio'] <= rango_anual[1])]

# -----------------------------------------------------------------------------
# 4. Navegación Principal por Pestañas
# -----------------------------------------------------------------------------
tab_precios, tab_participacion, tab_consumo = st.tabs([
    "💰 Evolución de Precios y Cuartiles",
    "🏢 Participación de Mercado",
    "📈 Consumo Aparente Histórico",
])

# =============================================================================
# MÓDULO 1: EVOLUCIÓN DE PRECIOS Y CUARTILES
# =============================================================================
with tab_precios:
    st.markdown("""
    <div class="executive-header">
        <h1>Evolución de Precios y Cuartiles</h1>
        <p>Precio inferior, promedio ponderado y superior de paquetes vendidos, y su distribución por cuartiles de volumen.</p>
    </div>
    """, unsafe_allow_html=True)

    if df_vol_f.empty:
        st.info("No hay datos para el rango de meses seleccionado.")
    else:
        ultimo = df_vol_f.iloc[-1]
        anterior = df_vol_f.iloc[-2] if len(df_vol_f) > 1 else None

        delta_precio = None
        if anterior is not None and pd.notna(anterior['precio_promedio_ponderado']) and anterior['precio_promedio_ponderado'] != 0:
            delta_precio = ((ultimo['precio_promedio_ponderado'] - anterior['precio_promedio_ponderado']) / anterior['precio_promedio_ponderado']) * 100.0

        cuartiles_cols = ['primer_quartil', 'segundo_quartil', 'tercer_quartil', 'cuarto_quartil']
        devoluciones_total = df_vol_f[cuartiles_cols].clip(upper=0).sum().sum()

        p1, p2, p3 = st.columns(3)
        with p1:
            st.markdown(build_kpi_card(
                "PRECIO PROMEDIO PONDERADO", f"${ultimo['precio_promedio_ponderado']:,.2f}",
                f"Último mes: {ultimo['fecha'].strftime('%m/%Y')}", delta=delta_precio, color="blue",
            ), unsafe_allow_html=True)
        with p2:
            st.markdown(build_kpi_card(
                "TOTAL PAQUETES", f"{ultimo['total_paquetes']:,.0f}" if pd.notna(ultimo['total_paquetes']) else "S/D",
                f"Vendidos en {ultimo['fecha'].strftime('%m/%Y')}", color="emerald",
            ), unsafe_allow_html=True)
        with p3:
            st.markdown(build_kpi_card(
                "DEVOLUCIONES / REINGRESOS", f"{devoluciones_total:,.0f}",
                "Suma de valores negativos en cuartiles, período filtrado", color="amber",
            ), unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)

        st.markdown('<div class="section-header"><h3>📉 Precios: Inferior, Promedio Ponderado y Superior</h3></div>', unsafe_allow_html=True)
        fig_precios = go.Figure()
        for col, label, color in [
            ('precio_superior', 'Precio Superior', '#c9a227'),
            ('precio_promedio_ponderado', 'Precio Promedio Ponderado', '#1a4329'),
            ('precio_inferior', 'Precio Inferior', '#6b7a3a'),
        ]:
            fig_precios.add_trace(go.Scatter(
                x=df_vol_f['fecha'], y=df_vol_f[col], name=label, mode='lines',
                line=dict(color=color, width=2.5 if col == 'precio_promedio_ponderado' else 1.5),
            ))
        fig_precios.update_layout(get_corporate_layout("Precio por paquete (equivalente 20 unidades)", height=380))
        fig_precios.update_yaxes(title="Precio ($)")
        fig_precios.update_xaxes(title="Mes")
        st.plotly_chart(fig_precios, use_container_width=True)

        st.markdown('<div class="section-header"><h3>📊 Distribución de Volumen por Cuartiles</h3></div>', unsafe_allow_html=True)
        st.caption(
            "⚠️ Los valores negativos (mayormente en el segundo cuartil) representan "
            "devoluciones o reingresos a fábrica, no ventas — el área se hunde por debajo "
            "de la línea de cero en esos meses en vez de desaparecer."
        )
        fig_cuartiles = go.Figure()
        cuartil_labels = {
            'primer_quartil': 'Primer Cuartil', 'segundo_quartil': 'Segundo Cuartil',
            'tercer_quartil': 'Tercer Cuartil', 'cuarto_quartil': 'Cuarto Cuartil',
        }
        cuartil_colors = {
            'primer_quartil': '#a9b87a', 'segundo_quartil': '#6b7a3a',
            'tercer_quartil': '#3d5a4c', 'cuarto_quartil': '#1a4329',
        }
        for col in cuartiles_cols:
            fig_cuartiles.add_trace(go.Scatter(
                x=df_vol_f['fecha'], y=df_vol_f[col], name=cuartil_labels[col],
                mode='lines', stackgroup='cuartiles', line=dict(width=0.5, color=cuartil_colors[col]),
                fillcolor=cuartil_colors[col],
            ))
        fig_cuartiles.add_hline(y=0, line_width=1, line_color="#5c6b5e")
        fig_cuartiles.update_layout(get_corporate_layout("Volumen de paquetes por cuartil (positivo = venta, negativo = devolución)", height=420))
        fig_cuartiles.update_yaxes(title="Paquetes")
        fig_cuartiles.update_xaxes(title="Mes")
        st.plotly_chart(fig_cuartiles, use_container_width=True)

# =============================================================================
# MÓDULO 2: PARTICIPACIÓN DE MERCADO (GRANDES VS. PYMES)
# =============================================================================
with tab_participacion:
    st.markdown("""
    <div class="executive-header">
        <h1>Participación de Mercado: Empresas Grandes vs. PyMES</h1>
        <p>Evolución mensual del volumen y el share of market entre ambos tipos de empresa.</p>
    </div>
    """, unsafe_allow_html=True)

    if df_part_f.empty:
        st.info("No hay datos para el rango de meses seleccionado.")
    else:
        ultimo_p = df_part_f.iloc[-1]
        primero_p = df_part_f.iloc[0]

        delta_share = ultimo_p['porcentaje_participacion_grandes'] - primero_p['porcentaje_participacion_grandes']

        m1, m2, m3 = st.columns(3)
        with m1:
            st.markdown(build_kpi_card(
                "SHARE EMPRESAS GRANDES", f"{ultimo_p['porcentaje_participacion_grandes']:.1f}%",
                f"Al {ultimo_p['fecha'].strftime('%m/%Y')}", delta=delta_share, delta_text="pp vs inicio del rango", color="blue",
            ), unsafe_allow_html=True)
        with m2:
            st.markdown(build_kpi_card(
                "SHARE PYMES", f"{ultimo_p['porcentaje_participacion_pymes']:.1f}%",
                f"Al {ultimo_p['fecha'].strftime('%m/%Y')}", delta=-delta_share, delta_text="pp vs inicio del rango", color="emerald",
            ), unsafe_allow_html=True)
        with m3:
            st.markdown(build_kpi_card(
                "TOTAL MERCADO", f"{ultimo_p['total_mercado']:,.0f}",
                f"Paquetes en {ultimo_p['fecha'].strftime('%m/%Y')}", color="amber",
            ), unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)

        st.markdown('<div class="section-header"><h3>📦 Volumen por Tipo de Empresa</h3></div>', unsafe_allow_html=True)
        melt_vol = df_part_f.melt(
            id_vars='fecha', value_vars=['empresas_grandes', 'empresas_pymes'],
            var_name='Tipo', value_name='Paquetes',
        )
        melt_vol['Tipo'] = melt_vol['Tipo'].map({'empresas_grandes': 'Empresas Grandes', 'empresas_pymes': 'PyMES'})
        fig_vol_part = px.bar(
            melt_vol, x='fecha', y='Paquetes', color='Tipo', barmode='stack',
            color_discrete_map={'Empresas Grandes': '#1a4329', 'PyMES': '#c9a227'},
        )
        fig_vol_part.update_layout(get_corporate_layout("Volumen mensual (paquetes eq. 20 un.)", height=400))
        fig_vol_part.update_xaxes(title="Mes")
        fig_vol_part.update_yaxes(title="Paquetes")
        st.plotly_chart(fig_vol_part, use_container_width=True)

        st.markdown('<div class="section-header"><h3>📈 Share of Market (%)</h3></div>', unsafe_allow_html=True)
        melt_share = df_part_f.melt(
            id_vars='fecha', value_vars=['porcentaje_participacion_grandes', 'porcentaje_participacion_pymes'],
            var_name='Tipo', value_name='Participación (%)',
        )
        melt_share['Tipo'] = melt_share['Tipo'].map({
            'porcentaje_participacion_grandes': 'Empresas Grandes', 'porcentaje_participacion_pymes': 'PyMES',
        })
        fig_share = px.area(
            melt_share, x='fecha', y='Participación (%)', color='Tipo',
            color_discrete_map={'Empresas Grandes': '#1a4329', 'PyMES': '#c9a227'},
        )
        fig_share.update_layout(get_corporate_layout("Participación porcentual sobre el total del mercado", height=400))
        fig_share.update_xaxes(title="Mes")
        fig_share.update_yaxes(title="Participación (%)", range=[0, 100])
        st.plotly_chart(fig_share, use_container_width=True)

# =============================================================================
# MÓDULO 3: CONSUMO APARENTE HISTÓRICO (1910-2026)
# =============================================================================
with tab_consumo:
    st.markdown("""
    <div class="executive-header">
        <h1>Consumo Aparente Histórico (1910-2026)</h1>
        <p>Serie secular de consumo nacional, población estimada (INDEC) y consumo aparente per cápita.</p>
    </div>
    """, unsafe_allow_html=True)

    if df_cons_f.empty:
        st.info("No hay datos para el rango de años seleccionado.")
    else:
        ultimo_c = df_cons_f.iloc[-1]
        primero_c = df_cons_f.iloc[0]
        delta_consumo = None
        if primero_c['consumo_aparente'] and primero_c['consumo_aparente'] != 0:
            delta_consumo = ((ultimo_c['consumo_aparente'] - primero_c['consumo_aparente']) / primero_c['consumo_aparente']) * 100.0

        c1, c2, c3 = st.columns(3)
        with c1:
            st.markdown(build_kpi_card(
                "CONSUMO APARENTE", f"{ultimo_c['consumo_aparente']:,.0f} paq./hab./año",
                f"Año {int(ultimo_c['anio'])}", delta=delta_consumo, delta_text=f"vs {int(primero_c['anio'])}", color="blue",
            ), unsafe_allow_html=True)
        with c2:
            st.markdown(build_kpi_card(
                "POBLACIÓN ESTIMADA", f"{ultimo_c['poblacion']:,.0f}",
                f"Año {int(ultimo_c['anio'])} (INDEC)", color="emerald",
            ), unsafe_allow_html=True)
        with c3:
            st.markdown(build_kpi_card(
                "TOTAL PAQUETES", f"{ultimo_c['total_paquetes']:,.0f}",
                f"Consumo nacional, año {int(ultimo_c['anio'])}", color="amber",
            ), unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)

        st.markdown('<div class="section-header"><h3>📈 Consumo Aparente per Cápita vs. Población</h3></div>', unsafe_allow_html=True)
        fig_consumo = go.Figure()
        fig_consumo.add_trace(go.Scatter(
            x=df_cons_f['anio'], y=df_cons_f['consumo_aparente'], name='Consumo Aparente (paq./hab./año)',
            mode='lines', line=dict(color='#1a4329', width=2.5), fill='tozeroy', fillcolor='rgba(26,67,41,0.08)',
        ))
        fig_consumo.add_trace(go.Scatter(
            x=df_cons_f['anio'], y=df_cons_f['poblacion'], name='Población (INDEC)',
            mode='lines', line=dict(color='#b8860b', width=1.5, dash='dot'), yaxis='y2',
        ))
        layout_consumo = get_corporate_layout("Serie secular 1910-2026", height=440)
        layout_consumo['yaxis'] = dict(title="Consumo aparente (paquetes/habitante/año)")
        layout_consumo['yaxis2'] = dict(title="Población", overlaying='y', side='right', showgrid=False)
        layout_consumo['xaxis'] = dict(title="Año")
        fig_consumo.update_layout(layout_consumo)
        st.plotly_chart(fig_consumo, use_container_width=True)

        with st.expander("📋 Ver datos anuales"):
            st.dataframe(
                df_cons_f.rename(columns={
                    'anio': 'Año', 'total_paquetes': 'Total Paquetes',
                    'poblacion': 'Población', 'consumo_aparente': 'Consumo Aparente (paq./hab./año)',
                }),
                use_container_width=True, hide_index=True,
            )

st.markdown(f"""
<div class="footer-text">
    Laboratorio Estadístico &copy; 2026 | Un desarrollo de <a href="{AGROTABACO_SITE_URL}" target="_top" style="color:#1a4329;font-weight:600;text-decoration:none;">AgroTabaco</a> | Mercado interno de tabaco (cigarrillos) — SAGyP
</div>
""", unsafe_allow_html=True)
