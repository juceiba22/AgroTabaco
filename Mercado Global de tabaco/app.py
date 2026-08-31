"""
app.py - Dashboard Analítico del Mercado Internacional de Tabaco
Basado en datos de FAOstat y Our World in Data.
"""

import os
from pathlib import Path
import streamlit as st
import pandas as pd
import numpy as np

from data_loader import (
    discover_faostat_datasets,
    load_dataset,
    read_csv_safe,
    get_top_producers,
    get_market_share,
    DEFAULT_PRESET_COUNTRIES,
    COUNTRY_METADATA,
    REGIONAL_AGGREGATES_KNOWN,
)
from styles import (
    apply_corporate_dark_theme,
    render_metric_card,
    render_header,
    render_citation_footer,
    render_topbar,
)
from charts import (
    create_timeseries_chart,
    create_ranking_bar_chart,
    create_world_choropleth_map,
    create_market_share_pie_chart,
    create_comparative_growth_chart,
)

# Configuración inicial de Streamlit
st.set_page_config(
    page_title="Mercado Internacional de Tabaco | AgroTabaco",
    page_icon="🍃",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Inyectar estilos Dark Mode corporativos
st.markdown(apply_corporate_dark_theme(), unsafe_allow_html=True)

# URL del portal de noticias AgroTabaco (Next.js). Configurable por variable
# de entorno (local) o por "Secrets" en Streamlit Community Cloud.
try:
    _secret_site_url = st.secrets.get("AGROTABACO_SITE_URL")
except Exception:
    _secret_site_url = None
AGROTABACO_SITE_URL = (
    _secret_site_url or os.environ.get("AGROTABACO_SITE_URL", "http://localhost:3000")
)

st.markdown(render_topbar(AGROTABACO_SITE_URL), unsafe_allow_html=True)

# Directorio de trabajo de datos
CURRENT_DIR = Path(__file__).parent.resolve()
FAOSTAT_DIR = CURRENT_DIR / "FAOstat"


@st.cache_data(show_spinner=False)
def get_cached_datasets(directory: str):
    return discover_faostat_datasets(directory)


@st.cache_data(show_spinner=False)
def get_cached_data(file_path: str, meta_path: str = None):
    return load_dataset(file_path, meta_path)


# Descubrimiento dinámico de datasets en la carpeta FAOstat
available_datasets = get_cached_datasets(str(FAOSTAT_DIR))

if not available_datasets:
    st.error(f"⚠️ No se encontraron archivos CSV en la carpeta: `{FAOSTAT_DIR}`")
    st.stop()

# ==========================================
# SIDEBAR: CONTROLES Y FILTROS GLOBALES
# ==========================================
with st.sidebar:
    st.markdown("""
    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.8rem;">
        <span style="font-size: 1.6rem;">🍃</span>
        <div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #ffffff; line-height: 1.1;">TABACO STATS</div>
            <div style="font-size: 0.72rem; color: #a9b87a; font-weight: 600; letter-spacing: 0.05em;">GLOBAL INTELLIGENCE</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown('<div class="sidebar-header">📂 Fuente de Datos</div>', unsafe_allow_html=True)
    
    # Selector de Dataset (por defecto 'tobacco-production.csv')
    dataset_options = {d["name"]: d for d in available_datasets}
    
    # Priorizar tobacco-production.csv
    default_ds_index = 0
    for idx, d in enumerate(available_datasets):
        if "production" in d["filename"].lower():
            default_ds_index = idx
            break

    selected_dataset_name = st.selectbox(
        "Dataset Activo",
        options=list(dataset_options.keys()),
        index=default_ds_index,
        help="El sistema detecta automáticamente cualquier CSV adicional que se incorpore en la carpeta FAOstat.",
    )

    selected_dataset = dataset_options[selected_dataset_name]
    
    # Cargar datos seleccionados
    data_bundle = get_cached_data(
        str(selected_dataset["path"]),
        str(selected_dataset["metadata_path"]) if selected_dataset["metadata_path"] else None,
    )

    df_raw = data_bundle["df"]
    entity_col = data_bundle["entity_col"]
    code_col = data_bundle["code_col"]
    year_col = data_bundle["year_col"]
    value_col = data_bundle["value_col"]
    unit = data_bundle["unit"]
    citation_text = data_bundle["citation"]
    min_dataset_year = data_bundle["min_year"]
    max_dataset_year = data_bundle["max_year"]

    st.markdown('<div class="sidebar-header">⚙️ Filtros de Análisis</div>', unsafe_allow_html=True)

    # Filtro de tipo de entidad
    entity_filter_mode = st.radio(
        "Tipo de Entidad",
        options=["Solo Países Soberanos", "Países y Agregados Continentales", "Todos"],
        index=0,
        horizontal=True,
    )

    # Filtrar entidades disponibles según selección
    if entity_filter_mode == "Solo Países Soberanos":
        available_entities = sorted(df_raw[df_raw["Entity_Type"] == "Country"][entity_col].unique())
    elif entity_filter_mode == "Países y Agregados Continentales":
        available_entities = sorted(df_raw[df_raw[entity_col] != "World"][entity_col].unique())
    else:
        available_entities = sorted(df_raw[entity_col].unique())

    # Presets rápidos de países
    st.markdown('<div style="font-size: 0.8rem; color: #a3ae9d; margin-top: 0.5rem; margin-bottom: 0.3rem;">⚡ Presets de Países:</div>', unsafe_allow_html=True)
    p_col1, p_col2 = st.columns(2)
    with p_col1:
        if st.button("🔥 Top 5 Global", use_container_width=True):
            st.session_state["selected_countries"] = ["China", "India", "Brazil", "Indonesia", "United States"]
            st.rerun()
    with p_col2:
        if st.button("🌎 Sudamérica", use_container_width=True):
            st.session_state["selected_countries"] = ["Argentina", "Brazil", "Paraguay", "Colombia", "Bolivia"]
            st.rerun()

    # Preselección solicitada: Argentina, Brasil, China, India, Estados Unidos
    if "selected_countries" not in st.session_state:
        # Asegurar que existan en el dataset
        initial_selection = [c for c in DEFAULT_PRESET_COUNTRIES if c in available_entities]
        if not initial_selection:
            initial_selection = available_entities[:5]
        st.session_state["selected_countries"] = initial_selection

    selected_countries = st.multiselect(
        "Seleccionar Países / Entidades",
        options=available_entities,
        default=st.session_state["selected_countries"],
        help="Preconfigurado con Argentina, Brasil, China, India y Estados Unidos.",
    )

    # Control deslizante de rango de años (Timeline Slider)
    st.markdown('<div class="sidebar-header">⏳ Rango Temporal</div>', unsafe_allow_html=True)
    selected_year_range = st.slider(
        "Período de Análisis",
        min_value=min_dataset_year,
        max_value=max_dataset_year,
        value=(min_dataset_year, max_dataset_year),
        step=1,
    )

    start_year, end_year = selected_year_range

    # Año de corte para ranking y mapas
    selected_eval_year = st.slider(
        "Año Focal (Ranking & Mapa)",
        min_value=min_dataset_year,
        max_value=max_dataset_year,
        value=max_dataset_year,
        step=1,
        help="Año utilizado para los gráficos de ranking, cuota de mercado y distribución geográfica.",
    )

    # Opciones de visualización
    st.markdown('<div class="sidebar-header">📊 Opciones de Gráfico</div>', unsafe_allow_html=True)
    use_log_scale = st.checkbox("Escala Logarítmica (Líneas)", value=False)
    show_data_points = st.checkbox("Mostrar Puntos de Datos", value=True)

# Filtrar DataFrame principal por rango de años
df_filtered = df_raw[(df_raw[year_col] >= start_year) & (df_raw[year_col] <= end_year)].copy()

# ==========================================
# ENCABEZADO PRINCIPAL
# ==========================================
st.markdown(
    render_header(
        title="Mercado Internacional de Tabaco",
        subtitle=f"Visualización analítica interactiva de producción y dinámicas globales ({start_year} – {end_year})",
        badge_text="FAOstat / OWID 2025",
    ),
    unsafe_allow_html=True,
)

# ==========================================
# CÁLCULO DE KPIS EJECUTIVOS (AÑO FOCAL)
# ==========================================
year_eval_data = df_raw[df_raw[year_col] == selected_eval_year]
prev_year_data = df_raw[df_raw[year_col] == (selected_eval_year - 1)]

# 1. Producción Mundial
world_curr_row = year_eval_data[year_eval_data[entity_col] == "World"]
if not world_curr_row.empty:
    world_prod = world_curr_row[value_col].values[0]
else:
    world_prod = year_eval_data[year_eval_data["Entity_Type"] == "Country"][value_col].sum()

world_prev_row = prev_year_data[prev_year_data[entity_col] == "World"]
if not world_prev_row.empty:
    world_prod_prev = world_prev_row[value_col].values[0]
else:
    world_prod_prev = prev_year_data[prev_year_data["Entity_Type"] == "Country"][value_col].sum()

world_yoy_pct = ((world_prod - world_prod_prev) / world_prod_prev * 100) if world_prod_prev > 0 else 0.0

# 2. País Líder Global
countries_eval = year_eval_data[year_eval_data["Entity_Type"] == "Country"].sort_values(by=value_col, ascending=False)
if not countries_eval.empty:
    top_country_row = countries_eval.iloc[0]
    top_country_name = top_country_row[entity_col]
    top_country_disp = top_country_row["Entity_Display"]
    top_country_val = top_country_row[value_col]
    top_country_share = (top_country_val / world_prod * 100) if world_prod > 0 else 0.0
else:
    top_country_name, top_country_disp, top_country_val, top_country_share = "N/A", "N/A", 0, 0

# 3. Foco Argentina
arg_row = year_eval_data[year_eval_data[entity_col] == "Argentina"]
if not arg_row.empty:
    arg_val = arg_row[value_col].values[0]
    # Ranking mundial de Argentina
    arg_rank = (countries_eval[entity_col] == "Argentina").argmax() + 1
    arg_share = (arg_val / world_prod * 100) if world_prod > 0 else 0.0
    
    # Delta Argentina vs año anterior
    arg_prev_row = prev_year_data[prev_year_data[entity_col] == "Argentina"]
    arg_prev_val = arg_prev_row[value_col].values[0] if not arg_prev_row.empty else 0.0
    arg_yoy_pct = ((arg_val - arg_prev_val) / arg_prev_val * 100) if arg_prev_val > 0 else 0.0
else:
    arg_val, arg_rank, arg_share, arg_yoy_pct = 0, 0, 0, 0

# 4. Total de Países Productores Activos
active_countries_count = len(countries_eval[countries_eval[value_col] > 0])

# ==========================================
# FILA DE TARJETAS MÉTRICAS (KPIS)
# ==========================================
kpi1, kpi2, kpi3, kpi4 = st.columns(4)

with kpi1:
    st.markdown(
        render_metric_card(
            title=f"Producción Global ({selected_eval_year})",
            value=f"{world_prod / 1e6:.2f} M t" if world_prod >= 1e6 else f"{world_prod:,.0f} t",
            subtitle=f"{world_yoy_pct:+.1f}% vs año anterior ({selected_eval_year-1})",
            delta=f"{abs(world_yoy_pct):.1f}% YoY",
            delta_is_positive=world_yoy_pct >= 0,
            color="emerald",
            icon="🌍",
        ),
        unsafe_allow_html=True,
    )

with kpi2:
    st.markdown(
        render_metric_card(
            title=f"Líder Mundial ({selected_eval_year})",
            value=f"{top_country_disp}",
            subtitle=f"Volumen: {top_country_val / 1e6:.2f} M t ({top_country_share:.1f}% global)",
            delta=f"{top_country_share:.1f}% cuota",
            delta_is_positive=True,
            color="cyan",
            icon="🏆",
        ),
        unsafe_allow_html=True,
    )

with kpi3:
    st.markdown(
        render_metric_card(
            title=f"Argentina ({selected_eval_year})",
            value=f"{arg_val:,.0f} t",
            subtitle=f"Puesto #{arg_rank} global • {arg_share:.2f}% cuota",
            delta=f"{arg_yoy_pct:+.1f}% YoY",
            delta_is_positive=arg_yoy_pct >= 0,
            color="amber",
            icon="🇦🇷",
        ),
        unsafe_allow_html=True,
    )

with kpi4:
    st.markdown(
        render_metric_card(
            title=f"Países Productores Activos",
            value=f"{active_countries_count}",
            subtitle=f"Registros reportados en FAO ({selected_eval_year})",
            delta="Cobertura FAO",
            delta_is_positive=True,
            color="indigo",
            icon="🌐",
        ),
        unsafe_allow_html=True,
    )

# ==========================================
# PESTAÑAS PRINCIPALES DEL DASHBOARD
# ==========================================
tab_time, tab_ranking, tab_map, tab_argentina, tab_data, tab_multi_csv = st.tabs([
    "📈 Evolución Histórica",
    "🏆 Ranking & Cuota de Mercado",
    "🗺️ Mapa Global Interactivo",
    "🇦🇷 Foco Estratégico: Argentina",
    "📊 Matriz de Datos & Descarga",
    "📂 Explorador Multi-Dataset",
])

# ----------------------------------------------------
# TAB 1: EVOLUCIÓN HISTÓRICA
# ----------------------------------------------------
with tab_time:
    if not selected_countries:
        st.warning("⚠️ Selecciona al menos un país en la barra lateral para generar la gráfica temporal.")
    else:
        st.markdown("""
        <div class="content-card">
            <div class="card-title"><span>📈</span> Evolución de Producción en Toneladas</div>
            <div class="card-subtitle">Comparación de series temporales de producción para los países seleccionados.</div>
        </div>
        """, unsafe_allow_html=True)

        fig_ts = create_timeseries_chart(
            df=df_filtered,
            selected_entities=selected_countries,
            value_col=value_col,
            year_col=year_col,
            entity_col=entity_col,
            unit=unit,
            log_scale=use_log_scale,
            show_markers=show_data_points,
        )
        st.plotly_chart(fig_ts, use_container_width=True)

        # Gráfico complementario de Crecimiento Relativo Indexado
        with st.expander("🔍 Ver Análisis de Crecimiento Indexado (Base 100 = Año Inicial)", expanded=False):
            st.markdown(
                f"Este gráfico normaliza la producción de cada país a **100 en el año {start_year}** para contrastar qué países expandieron o contrajeron su capacidad productiva relativa."
            )
            fig_idx = create_comparative_growth_chart(
                df=df_filtered,
                selected_entities=selected_countries,
                value_col=value_col,
                base_year=start_year,
                year_col=year_col,
                entity_col=entity_col,
            )
            st.plotly_chart(fig_idx, use_container_width=True)

        # Tabla resumen de máximos históricos
        st.markdown("#### 📌 Hitos y Máximos Históricos en el Período")
        summary_records = []
        for c in selected_countries:
            c_df = df_filtered[df_filtered[entity_col] == c]
            if not c_df.empty:
                max_idx = c_df[value_col].idxmax()
                peak_row = c_df.loc[max_idx]
                curr_row = c_df[c_df[year_col] == end_year]
                curr_val = curr_row[value_col].values[0] if not curr_row.empty else 0.0
                peak_val = peak_row[value_col]
                pct_of_peak = (curr_val / peak_val * 100) if peak_val > 0 else 0.0

                summary_records.append({
                    "País / Entidad": c_df["Entity_Display"].iloc[0],
                    f"Producción {end_year} ({unit})": f"{curr_val:,.0f}",
                    "Pico Histórico": f"{peak_val:,.0f} {unit}",
                    "Año del Pico": int(peak_row[year_col]),
                    f"% Nivel vs Pico ({end_year})": f"{pct_of_peak:.1f}%",
                })

        st.dataframe(pd.DataFrame(summary_records), use_container_width=True, hide_index=True)

# ----------------------------------------------------
# TAB 2: RANKING & CUOTA DE MERCADO
# ----------------------------------------------------
with tab_ranking:
    col_rank_ctrl1, col_rank_ctrl2 = st.columns([3, 1])
    with col_rank_ctrl1:
        st.markdown(f"### 🏆 Estructura Competitiva Global – Año {selected_eval_year}")
    with col_rank_ctrl2:
        top_n_select = st.selectbox("Cantidad de Países en Ranking", options=[10, 15, 20, 25, 30], index=1)

    ranked_countries = get_top_producers(
        df=df_raw,
        value_col=value_col,
        year=selected_eval_year,
        top_n=top_n_select,
        only_countries=True,
        year_col=year_col,
        entity_col=entity_col,
    )

    share_df, total_world_calc = get_market_share(
        df=df_raw,
        value_col=value_col,
        year=selected_eval_year,
        top_n=5,
        year_col=year_col,
        entity_col=entity_col,
    )

    col_rank_chart, col_share_chart = st.columns([3, 2])

    with col_rank_chart:
        fig_ranking = create_ranking_bar_chart(
            ranked_df=ranked_countries,
            value_col=value_col,
            year=selected_eval_year,
            unit=unit,
            entity_col=entity_col,
            highlight_entity="Argentina",
        )
        st.plotly_chart(fig_ranking, use_container_width=True)

    with col_share_chart:
        fig_share = create_market_share_pie_chart(
            share_df=share_df,
            year=selected_eval_year,
            unit=unit,
        )
        st.plotly_chart(fig_share, use_container_width=True)

        st.markdown(f"""
        <div style="background: #1f291b; border-radius: 10px; padding: 1rem; border: 1px solid rgba(242,244,239,0.08); font-size: 0.85rem;">
            <strong>📌 Concentración de la Producción ({selected_eval_year}):</strong><br>
            Los <strong>5 principales países</strong> representan el <strong>{share_df[share_df['Category'] == 'Top Productores']['Percentage'].sum():.1f}%</strong> del volumen global producido en el planeta.
        </div>
        """, unsafe_allow_html=True)

# ----------------------------------------------------
# TAB 3: MAPA MUNDIAL INTERACTIVO
# ----------------------------------------------------
with tab_map:
    st.markdown(f"### 🗺️ Geografía Mundial de la Producción de Tabaco – Año {selected_eval_year}")
    st.markdown(
        "Visualización coroplética interactiva basada en códigos ISO-3 oficiales. La escala cromática resalta la intensidad de producción en toneladas."
    )

    fig_map = create_world_choropleth_map(
        df=df_raw,
        value_col=value_col,
        year=selected_eval_year,
        unit=unit,
        year_col=year_col,
        code_col=code_col,
        entity_col=entity_col,
    )
    st.plotly_chart(fig_map, use_container_width=True)

    # Ranking regional o continental
    st.markdown("#### 🌐 Producción por Continentes y Bloques Regionales (FAO)")
    regional_data = df_raw[(df_raw[year_col] == selected_eval_year) & (df_raw["Entity_Type"] == "Aggregate")].copy()
    regional_data = regional_data[~regional_data[entity_col].isin(["World", "High-income countries", "Low-income countries", "Lower-middle-income countries", "Upper-middle-income countries"])]
    regional_data = regional_data.sort_values(by=value_col, ascending=False).head(10)

    if not regional_data.empty:
        reg_display = []
        for _, r in regional_data.iterrows():
            pct = (r[value_col] / world_prod * 100) if world_prod > 0 else 0.0
            reg_display.append({
                "Región / Bloque": r["Entity_Display"],
                f"Producción ({unit})": f"{r[value_col]:,.0f}",
                "% del Total Mundial": f"{pct:.2f}%",
            })
        st.dataframe(pd.DataFrame(reg_display), use_container_width=True, hide_index=True)

# ----------------------------------------------------
# TAB 4: FICHA ESTRATÉGICA: ARGENTINA
# ----------------------------------------------------
with tab_argentina:
    st.markdown("### 🇦🇷 Análisis Estratégico: Argentina en el Tabaco Mundial")
    
    arg_history = df_raw[df_raw[entity_col] == "Argentina"].sort_values(by=year_col)
    
    if arg_history.empty:
        st.info("No se encontraron registros específicos para Argentina en el dataset.")
    else:
        arg_col_left, arg_col_right = st.columns([2, 3])
        
        with arg_col_left:
            st.markdown("""
            <div class="content-card">
                <div class="card-title"><span>📋</span> Perfil Productivo Nacional</div>
                <p style="font-size: 0.88rem; color: #c3cabb; line-height: 1.5;">
                    Argentina es uno de los productores tradicionales más destacados de Sudamérica y un exportador clave de tabaco Virginia y Burley.
                </p>
                <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-top: 1rem;">
                    <div style="background: rgba(79, 145, 105, 0.12); border-left: 3px solid #4f9169; padding: 0.6rem 0.8rem; border-radius: 6px;">
                        <span style="font-size: 0.75rem; color: #a3ae9d; text-transform: uppercase;">Volumen Reciente (2024)</span><br>
                        <strong style="font-size: 1.2rem; color: #ffffff;">80.786 toneladas</strong>
                    </div>
                    <div style="background: rgba(138, 156, 82, 0.12); border-left: 3px solid #8a9c52; padding: 0.6rem 0.8rem; border-radius: 6px;">
                        <span style="font-size: 0.75rem; color: #a3ae9d; text-transform: uppercase;">Récord Histórico de Cosecha</span><br>
                        <strong style="font-size: 1.2rem; color: #ffffff;">167.936 t (Año 2005)</strong>
                    </div>
                    <div style="background: rgba(198, 138, 78, 0.12); border-left: 3px solid #c68a4e; padding: 0.6rem 0.8rem; border-radius: 6px;">
                        <span style="font-size: 0.75rem; color: #a3ae9d; text-transform: uppercase;">Posición Global</span><br>
                        <strong style="font-size: 1.2rem; color: #ffffff;">Top 15 Mundial (#14 en 2024)</strong>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)

        with arg_col_right:
            # Gráfico comparativo de Argentina vs Brasil vs Resto de Sudamérica
            sudam_countries = ["Argentina", "Brazil", "Paraguay", "Colombia"]
            fig_arg_comp = create_timeseries_chart(
                df=df_filtered,
                selected_entities=sudam_countries,
                value_col=value_col,
                year_col=year_col,
                entity_col=entity_col,
                unit=unit,
                log_scale=False,
                show_markers=True,
            )
            fig_arg_comp.update_layout(
                title=dict(text="Competitividad Regional: Argentina vs Países Sudamericanos", font=dict(size=14, color="#ffffff")),
                height=380,
            )
            st.plotly_chart(fig_arg_comp, use_container_width=True)

# ----------------------------------------------------
# TAB 5: MATRIZ DE DATOS & DESCARGA
# ----------------------------------------------------
with tab_data:
    st.markdown("### 📊 Matriz de Datos Oficiales y Exportación")
    st.markdown("Explora los datos en formato tabular con filtros dinámicos y descarga la selección directamente en formato CSV.")

    col_tbl_search, col_tbl_sort = st.columns([3, 1])
    with col_tbl_search:
        search_query = st.text_input("🔍 Buscar por País / Entidad / Código ISO:", "")
    with col_tbl_sort:
        sort_order = st.selectbox("Ordenar por:", [f"Mayor a Menor {value_col}", f"Menor a Mayor {value_col}", "Año Más Reciente", "Alfabético"])

    table_df = df_filtered.copy()
    if search_query:
        table_df = table_df[
            table_df[entity_col].str.contains(search_query, case=False, na=False)
            | table_df[code_col].str.contains(search_query, case=False, na=False)
            | table_df["Entity_Display"].str.contains(search_query, case=False, na=False)
        ]

    if sort_order == f"Mayor a Menor {value_col}":
        table_df = table_df.sort_values(by=value_col, ascending=False)
    elif sort_order == f"Menor a Mayor {value_col}":
        table_df = table_df.sort_values(by=value_col, ascending=True)
    elif sort_order == "Año Más Reciente":
        table_df = table_df.sort_values(by=[year_col, value_col], ascending=[False, False])
    else:
        table_df = table_df.sort_values(by=[entity_col, year_col], ascending=[True, True])

    # Formatear columnas para visualización
    view_df = table_df[[entity_col, "Entity_Display", code_col, year_col, "Entity_Type", value_col]].copy()
    view_df.columns = ["Entidad (Inglés)", "País / Entidad", "Código ISO", "Año", "Tipo", f"Volumen ({unit})"]
    view_df[f"Volumen ({unit})"] = view_df[f"Volumen ({unit})"].apply(lambda v: f"{v:,.0f}")

    st.dataframe(view_df, use_container_width=True, height=450, hide_index=True)

    # Botón de Descarga CSV
    csv_bytes = table_df.to_csv(index=False).encode("utf-8-sig")
    st.download_button(
        label="📥 Descargar Datos Filtrados en CSV",
        data=csv_bytes,
        file_name=f"FAOstat_tabaco_{start_year}_{end_year}.csv",
        mime="text/csv",
        use_container_width=False,
    )

# ----------------------------------------------------
# TAB 6: EXPLORADOR MULTI-DATASET (EXTENSIBILIDAD)
# ----------------------------------------------------
with tab_multi_csv:
    st.markdown("### 📂 Gestor y Explorador de Datasets en la Carpeta FAOstat")
    st.markdown(
        "Esta sección permite auditar todos los archivos CSV cargados en la carpeta de trabajo `FAOstat`, facilitando la incorporación futura de datasets de comercio exterior (importaciones/exportaciones), precios o rendimiento agrícola."
    )

    for ds in available_datasets:
        with st.expander(f"📁 Archivo: {ds['filename']} – {ds['name']}", expanded=(ds["filename"] == selected_dataset["filename"])):
            st.write(f"**Ruta en disco:** `{ds['path']}`")
            if ds["metadata"]:
                st.write(f"**Título:** {ds['metadata'].get('chart', {}).get('title', 'N/A')}")
                st.write(f"**Subtítulo:** {ds['metadata'].get('chart', {}).get('subtitle', 'N/A')}")
                st.write(f"**Citación:** {ds['metadata'].get('chart', {}).get('citation', 'N/A')}")
                if "dateDownloaded" in ds["metadata"]:
                    st.write(f"**Fecha de descarga:** {ds['metadata']['dateDownloaded']}")
            else:
                st.info("Archivo CSV sin archivo .metadata.json asociado (procesado con autodescubrimiento).")

            # Muestra rápida
            sample_df = read_csv_safe(ds["path"])
            st.dataframe(sample_df.head(5), use_container_width=True)

# ==========================================
# CITACIÓN OFICIAL Y FOOTER
# ==========================================
st.markdown(render_citation_footer(citation_text, site_url=AGROTABACO_SITE_URL), unsafe_allow_html=True)
