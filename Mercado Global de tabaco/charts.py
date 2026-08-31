"""
charts.py - Módulo de visualizaciones analíticas con Plotly en tema Dark Corporativo.
"""

import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np

# Paleta de colores corporativos brillantes sobre fondo oscuro
COLOR_PALETTE = [
    "#10b981",  # Esmeralda
    "#06b6d4",  # Cian
    "#f59e0b",  # Ámbar
    "#6366f1",  # Índigo
    "#ec4899",  # Rosa
    "#8b5cf6",  # Violeta
    "#3b82f6",  # Azul eléctrico
    "#14b8a6",  # Turquesa
    "#f97316",  # Naranja
    "#84cc16",  # Lima
    "#e11d48",  # Carmín
    "#a855f7",  # Púrpura
    "#0ea5e9",  # Celeste
    "#eab308",  # Amarillo dorado
]

def apply_base_dark_layout(fig: go.Figure, **kwargs):
    """
    Aplica el tema visual Dark Mode de forma segura a cualquier figura Plotly.
    """
    base_dict = dict(
        paper_bgcolor="rgba(17, 24, 39, 0)",
        plot_bgcolor="rgba(17, 24, 39, 0.4)",
        font=dict(family="Plus Jakarta Sans, sans-serif", color="#e2e8f0", size=12),
        xaxis=dict(
            gridcolor="rgba(255, 255, 255, 0.07)",
            zerolinecolor="rgba(255, 255, 255, 0.1)",
            tickfont=dict(color="#94a3b8"),
            title_font=dict(color="#cbd5e1", size=13),
        ),
        yaxis=dict(
            gridcolor="rgba(255, 255, 255, 0.07)",
            zerolinecolor="rgba(255, 255, 255, 0.1)",
            tickfont=dict(color="#94a3b8"),
            title_font=dict(color="#cbd5e1", size=13),
        ),
        hoverlabel=dict(
            bgcolor="#0f172a",
            bordercolor="#38bdf8",
            font=dict(family="Plus Jakarta Sans, sans-serif", color="#ffffff", size=12),
        ),
        margin=dict(l=40, r=40, t=50, b=40),
    )
    # Actualizar con kwargs pasados
    base_dict.update(kwargs)
    fig.update_layout(**base_dict)
    return fig


def create_timeseries_chart(
    df: pd.DataFrame,
    selected_entities: list[str],
    value_col: str,
    year_col: str = "Year",
    entity_col: str = "Entity",
    unit: str = "toneladas",
    log_scale: bool = False,
    show_markers: bool = True,
) -> go.Figure:
    """
    Crea el gráfico de líneas temporales de producción para los países seleccionados.
    """
    filtered_df = df[df[entity_col].isin(selected_entities)].sort_values(by=year_col)

    fig = go.Figure()

    for idx, entity in enumerate(selected_entities):
        ent_data = filtered_df[filtered_df[entity_col] == entity]
        if ent_data.empty:
            continue

        display_name = ent_data["Entity_Display"].iloc[0] if "Entity_Display" in ent_data.columns else entity
        color = COLOR_PALETTE[idx % len(COLOR_PALETTE)]

        fig.add_trace(
            go.Scatter(
                x=ent_data[year_col],
                y=ent_data[value_col],
                mode="lines+markers" if show_markers else "lines",
                name=display_name,
                line=dict(width=2.8, color=color, shape="spline"),
                marker=dict(size=5, color=color),
                hovertemplate=f"<b>{display_name}</b><br>Año: %{{x}}<br>Producción: %{{y:,.0f}} {unit}<extra></extra>",
            )
        )

    apply_base_dark_layout(
        fig,
        title=dict(
            text=f"Evolución Histórica de Producción de Tabaco ({unit})",
            font=dict(size=16, color="#ffffff", family="Plus Jakarta Sans"),
            x=0.01,
        ),
        xaxis_title="Año",
        yaxis_title=f"Volumen ({unit}) {'[Escala Logarítmica]' if log_scale else ''}",
        yaxis_type="log" if log_scale else "linear",
        hovermode="x unified",
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=-0.28,
            xanchor="center",
            x=0.5,
            bgcolor="rgba(15, 23, 42, 0.6)",
            bordercolor="rgba(255, 255, 255, 0.08)",
            borderwidth=1,
            font=dict(color="#e2e8f0", size=11),
        ),
        height=500,
    )

    return fig


def create_ranking_bar_chart(
    ranked_df: pd.DataFrame,
    value_col: str,
    year: int,
    unit: str = "toneladas",
    entity_col: str = "Entity",
    highlight_entity: str = "Argentina",
) -> go.Figure:
    """
    Crea el gráfico de barras horizontales para el ranking de productores en un año dado.
    """
    plot_df = ranked_df.iloc[::-1].copy()

    colors = []
    for ent in plot_df[entity_col]:
        if ent == highlight_entity:
            colors.append("#38bdf8")  # Celeste brillante para Argentina
        else:
            colors.append("#10b981")  # Verde esmeralda corporativo

    display_labels = plot_df["Entity_Display"] if "Entity_Display" in plot_df.columns else plot_df[entity_col]

    fig = go.Figure(
        go.Bar(
            x=plot_df[value_col],
            y=display_labels,
            orientation="h",
            marker=dict(
                color=colors,
                line=dict(color="rgba(255, 255, 255, 0.2)", width=1),
            ),
            text=[f"{val:,.0f} {unit}" for val in plot_df[value_col]],
            textposition="auto",
            textfont=dict(color="#ffffff", size=11, family="JetBrains Mono"),
            hovertemplate=f"<b>%{{y}}</b><br>Año {year}: %{{x:,.0f}} {unit}<extra></extra>",
        )
    )

    apply_base_dark_layout(
        fig,
        title=dict(
            text=f"Ranking de Principales Productores Globales – Año {year}",
            font=dict(size=16, color="#ffffff", family="Plus Jakarta Sans"),
            x=0.01,
        ),
        xaxis_title=f"Producción ({unit})",
        yaxis_title="",
        height=max(420, len(plot_df) * 32),
        margin=dict(l=150, r=40, t=50, b=40),
    )

    return fig


def create_world_choropleth_map(
    df: pd.DataFrame,
    value_col: str,
    year: int,
    unit: str = "toneladas",
    year_col: str = "Year",
    code_col: str = "Code",
    entity_col: str = "Entity",
) -> go.Figure:
    """
    Crea un mapa coroplético mundial interactivo de producción de tabaco para el año seleccionado.
    """
    year_df = df[(df[year_col] == year) & (df["Entity_Type"] == "Country")].copy()
    year_df = year_df[year_df[code_col].notna() & (year_df[value_col] > 0)]

    year_df["Log_Value"] = np.log10(year_df[value_col] + 1)

    fig = px.choropleth(
        year_df,
        locations=code_col,
        color="Log_Value",
        hover_name="Entity_Display" if "Entity_Display" in year_df.columns else entity_col,
        hover_data={
            "Log_Value": False,
            code_col: False,
            value_col: ":,.0f",
        },
        labels={value_col: f"Producción ({unit})"},
        color_continuous_scale="Viridis",
    )

    fig.update_traces(
        hovertemplate="<b>%{hovertext}</b><br>Producción: %{customdata[0]} " + unit + "<extra></extra>",
        marker_line_color="rgba(255, 255, 255, 0.15)",
        marker_line_width=0.5,
    )

    apply_base_dark_layout(
        fig,
        title=dict(
            text=f"Distribución Geográfica Mundial de Producción de Tabaco – Año {year}",
            font=dict(size=16, color="#ffffff", family="Plus Jakarta Sans"),
            x=0.01,
        ),
        geo=dict(
            showframe=False,
            showcoastlines=True,
            coastlinecolor="rgba(255, 255, 255, 0.2)",
            projection_type="equirectangular",
            bgcolor="rgba(17, 24, 39, 0)",
            showland=True,
            landcolor="#1e293b",
            showocean=True,
            oceancolor="#0b0f19",
            showlakes=True,
            lakecolor="#0b0f19",
            showcountries=True,
            countrycolor="rgba(255, 255, 255, 0.1)",
        ),
        coloraxis_colorbar=dict(
            title=dict(text="Escala (Log)", font=dict(color="#cbd5e1", size=11)),
            tickfont=dict(color="#94a3b8"),
            len=0.7,
            thickness=14,
        ),
        height=520,
        margin=dict(l=0, r=0, t=50, b=0),
    )

    return fig


def create_market_share_pie_chart(
    share_df: pd.DataFrame,
    year: int,
    unit: str = "toneladas",
) -> go.Figure:
    """
    Crea un gráfico de dona / participación de mercado de los principales productores vs Resto del Mundo.
    """
    colors = [
        "#10b981",  # 1er productor
        "#06b6d4",  # 2do
        "#f59e0b",  # 3ro
        "#6366f1",  # 4to
        "#ec4899",  # 5to
        "#475569",  # Resto del mundo
    ]

    fig = go.Figure(
        data=[
            go.Pie(
                labels=share_df["Entity_Display"],
                values=share_df["Value"],
                hole=0.55,
                marker=dict(colors=colors[: len(share_df)], line=dict(color="#0f172a", width=2)),
                textinfo="label+percent",
                textposition="outside",
                hoverinfo="label+value+percent",
                hovertemplate="<b>%{label}</b><br>Volumen: %{value:,.0f} " + unit + "<br>Cuota Mundial: %{percent}<extra></extra>",
            )
        ]
    )

    apply_base_dark_layout(
        fig,
        title=dict(
            text=f"Cuota de Producción Mundial (% Share) – Año {year}",
            font=dict(size=16, color="#ffffff", family="Plus Jakarta Sans"),
            x=0.01,
        ),
        showlegend=False,
        height=420,
        annotations=[
            dict(
                text=f"<b>{year}</b><br><span style='font-size:10px; color:#94a3b8;'>GLOBAL</span>",
                x=0.5,
                y=0.5,
                font_size=16,
                font_color="#ffffff",
                showarrow=False,
            )
        ],
    )

    return fig


def create_comparative_growth_chart(
    df: pd.DataFrame,
    selected_entities: list[str],
    value_col: str,
    base_year: int,
    year_col: str = "Year",
    entity_col: str = "Entity",
) -> go.Figure:
    """
    Crea un gráfico de crecimiento indexado (Base 100 = Año Inicial seleccionado) para comparar dinámicas de crecimiento relativo.
    """
    filtered_df = df[(df[entity_col].isin(selected_entities)) & (df[year_col] >= base_year)].sort_values(by=year_col)

    fig = go.Figure()

    for idx, entity in enumerate(selected_entities):
        ent_data = filtered_df[filtered_df[entity_col] == entity].copy()
        if ent_data.empty:
            continue

        base_val = ent_data[ent_data[year_col] == base_year][value_col].values
        if len(base_val) == 0 or base_val[0] == 0:
            first_val = ent_data[value_col].iloc[0]
            if first_val == 0:
                continue
            base_number = first_val
        else:
            base_number = base_val[0]

        ent_data["Index_Base_100"] = (ent_data[value_col] / base_number) * 100
        display_name = ent_data["Entity_Display"].iloc[0] if "Entity_Display" in ent_data.columns else entity
        color = COLOR_PALETTE[idx % len(COLOR_PALETTE)]

        fig.add_trace(
            go.Scatter(
                x=ent_data[year_col],
                y=ent_data["Index_Base_100"],
                mode="lines",
                name=display_name,
                line=dict(width=2.5, color=color),
                hovertemplate=f"<b>{display_name}</b><br>Año: %{{x}}<br>Índice: %{{y:.1f}} (Base {base_year}=100)<extra></extra>",
            )
        )

    fig.add_hline(y=100, line_dash="dot", line_color="rgba(255, 255, 255, 0.4)", annotation_text=f"Nivel Base {base_year} = 100")

    apply_base_dark_layout(
        fig,
        title=dict(
            text=f"Evolución Relativa Indexada (Base 100 = {base_year})",
            font=dict(size=16, color="#ffffff", family="Plus Jakarta Sans"),
            x=0.01,
        ),
        xaxis_title="Año",
        yaxis_title="Índice Base 100",
        hovermode="x unified",
        height=450,
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=-0.25,
            xanchor="center",
            x=0.5,
            bgcolor="rgba(15, 23, 42, 0.6)",
            bordercolor="rgba(255, 255, 255, 0.08)",
            borderwidth=1,
            font=dict(color="#e2e8f0", size=11),
        ),
    )

    return fig
