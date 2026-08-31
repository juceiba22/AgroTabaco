"""
charts.py - Polished Plotly chart generator functions with consistent corporate palette.
"""

import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np

# Corporate Palette Definitions
PALETTE = {
    'primary': '#1e3a8a',      # Deep Navy
    'secondary': '#0284c7',    # Sky Blue
    'emerald': '#059669',      # Emerald Green
    'amber': '#d97706',        # Amber/Gold
    'rose': '#e11d48',         # Coral/Rose
    'indigo': '#4f46e5',       # Indigo
    'teal': '#0d9488',         # Teal
    'slate': '#64748b',        # Slate
    'purple': '#7c3aed',       # Purple
}

TOBACCO_COLORS = {
    'VIRGINIA': '#f59e0b',           # Gold / Virginia cured
    'BURLEY': '#8b5cf6',             # Purple / Burley
    'CRIOLLO MISIONERO': '#10b981',   # Green
    'CRIOLLO CORRENTINO': '#06b6d4',  # Cyan
    'CRIOLLO CHAQUEÑO': '#ec4899',    # Pink
    'CRIOLLO ARGENTINO': '#f97316',   # Orange
    'CRIOLLO SALTEÑO': '#84cc16',     # Lime
    'KENTUCKY': '#6366f1',           # Indigo
    'KENTUCKY AHUMADO': '#4338ca',   # Dark Indigo
    'TOTAL': '#1e293b',              # Slate Dark
    'TOTAL NACIONAL': '#1e293b',
}

PROVINCE_COLORS = {
    'JUJUY': '#2563eb',
    'SALTA': '#7c3aed',
    'MISIONES': '#059669',
    'TUCUMÁN': '#d97706',
    'CORRIENTES': '#0891b2',
    'CHACO': '#db2777',
    'CATAMARCA': '#ea580c',
    'TOTAL NACIONAL': '#1e293b',
    'NACIONAL': '#1e293b'
}

def get_base_layout(title="", height=400):
    """Standard layout settings for clean corporate styling."""
    return dict(
        title=dict(
            text=f"<b>{title}</b>" if title else "",
            font=dict(size=14, color='#1e293b', family='Inter'),
            x=0.01,
            y=0.96
        ),
        template='plotly_white',
        height=height,
        margin=dict(l=40, r=30, t=50 if title else 25, b=40),
        font=dict(family="Inter, -apple-system, sans-serif", size=11, color="#475569"),
        hoverlabel=dict(bgcolor="#ffffff", font_size=12, font_family="Inter"),
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1,
            bgcolor="rgba(255, 255, 255, 0.7)",
            bordercolor="rgba(0,0,0,0.05)",
            borderwidth=1
        )
    )

def chart_historico_produccion(df_prod, view_type="tn", breakdown="tipo_tabaco"):
    """Line/Bar chart of production & surface across historical campaigns (1991-2023)."""
    fig = go.Figure()
    df_sorted = df_prod.sort_values(by='anio_inicio')
    
    if breakdown == "total":
        grp = df_sorted.groupby('campana', as_index=False).agg({
            'produccion_tn': 'sum',
            'sup_cosechada_ha': 'sum',
            'sup_sembrada_ha': 'sum',
            'anio_inicio': 'first'
        }).sort_values(by='anio_inicio')
        
        fig.add_trace(go.Bar(
            x=grp['campana'],
            y=grp['produccion_tn'],
            name="Producción (tn)",
            marker_color='#1e3a8a',
            opacity=0.85,
            hovertemplate="<b>Campaña %{x}</b><br>Producción: %{y:,.1f} tn<extra></extra>"
        ))
        
        fig.add_trace(go.Scatter(
            x=grp['campana'],
            y=grp['sup_cosechada_ha'],
            name="Sup. Cosechada (ha)",
            yaxis="y2",
            mode="lines+markers",
            line=dict(color='#10b981', width=3),
            marker=dict(size=6),
            hovertemplate="<b>Campaña %{x}</b><br>Sup. Cosechada: %{y:,.0f} ha<extra></extra>"
        ))
        
        fig.update_layout(
            get_base_layout("Evolución Histórica: Producción Agrícola y Superficie Cosechada", height=420),
            yaxis=dict(title="Producción (Toneladas)", showgrid=True, gridcolor="#f1f5f9"),
            yaxis2=dict(
                title="Superficie (Hectáreas)",
                overlaying="y",
                side="right",
                showgrid=False
            )
        )
    else:
        col_group = 'tipo_tabaco' if breakdown == 'tipo_tabaco' else 'provincia'
        palette_map = TOBACCO_COLORS if breakdown == 'tipo_tabaco' else PROVINCE_COLORS
        
        for item in df_sorted[col_group].unique():
            if item in ['TOTAL', 'TOTAL NACIONAL', 'NACIONAL', 'SUBTOTAL PROVINCIAL', 'SUBTOTAL_PROVINCIAL']:
                continue
            sub = df_sorted[df_sorted[col_group] == item].groupby('campana', as_index=False).agg({
                'produccion_tn': 'sum',
                'anio_inicio': 'first'
            }).sort_values(by='anio_inicio')
            
            color = palette_map.get(item, '#64748b')
            fig.add_trace(go.Bar(
                x=sub['campana'],
                y=sub['produccion_tn'],
                name=item,
                marker_color=color,
                hovertemplate=f"<b>{item}</b> (Campaña %{{x}})<br>Producción: %{{y:,.1f}} tn<extra></extra>"
            ))
            
        title_sfx = "por Tipo de Tabaco" if breakdown == 'tipo_tabaco' else "por Provincia"
        fig.update_layout(
            get_base_layout(f"Producción Histórica en Toneladas {title_sfx}", height=420),
            barmode='stack',
            yaxis=dict(title="Producción (Toneladas)", showgrid=True, gridcolor="#f1f5f9")
        )
        
    fig.update_xaxes(tickangle=-45, showgrid=False)
    return fig

def chart_rendimiento_comparativo(df_prod):
    """Bar chart for agricultural yield (kg/ha)."""
    df_clean = df_prod[~df_prod['tipo_tabaco'].isin(['TOTAL', 'TOTAL NACIONAL']) & 
                       ~df_prod['provincia'].isin(['NACIONAL', 'TOTAL NACIONAL'])].copy()
    
    if df_clean.empty:
        df_clean = df_prod.copy()
        
    grp = df_clean.groupby(['provincia', 'tipo_tabaco'], as_index=False).agg({
        'rendimiento_kg_ha': 'mean',
        'produccion_kg': 'sum',
        'sup_cosechada_ha': 'sum'
    })
    grp['rendimiento_prom'] = np.where(
        grp['sup_cosechada_ha'] > 0,
        grp['produccion_kg'] / grp['sup_cosechada_ha'],
        grp['rendimiento_kg_ha']
    ).round(0)
    grp = grp.sort_values(by='rendimiento_prom', ascending=False)
    
    fig = px.bar(
        grp,
        x='provincia',
        y='rendimiento_prom',
        color='tipo_tabaco',
        color_discrete_map=TOBACCO_COLORS,
        barmode='group',
        labels={'rendimiento_prom': 'Rendimiento Promedio (kg/ha)', 'provincia': 'Provincia', 'tipo_tabaco': 'Tipo de Tabaco'},
        title="Rendimiento Agrícola Promedio por Provincia y Variedad (kg/ha)"
    )
    
    fig.update_layout(
        get_base_layout("", height=380),
        yaxis=dict(title="Rendimiento (kg/ha)", showgrid=True, gridcolor="#f1f5f9")
    )
    return fig

def chart_distribucion_provincial(df_prod_campana):
    """Donut chart of provincial share in volume."""
    df_p = df_prod_campana[~df_prod_campana['provincia'].isin(['NACIONAL', 'TOTAL NACIONAL'])].copy()
    grp = df_p.groupby('provincia', as_index=False)['produccion_tn'].sum()
    grp = grp[grp['produccion_tn'] > 0].sort_values(by='produccion_tn', ascending=False)
    
    fig = go.Figure(data=[go.Pie(
        labels=grp['provincia'],
        values=grp['produccion_tn'],
        hole=0.55,
        marker=dict(colors=[PROVINCE_COLORS.get(p, '#64748b') for p in grp['provincia']]),
        textinfo='label+percent',
        insidetextorientation='radial',
        hovertemplate="<b>%{label}</b><br>Producción: %{value:,.1f} tn<br>Participación: %{percent}<extra></extra>"
    )])
    
    fig.update_layout(
        get_base_layout("Participación de Producción por Provincia", height=380),
        showlegend=True
    )
    return fig

def chart_precios_composicion_campana(df_prec):
    """Stacked bar chart of Price structure (Acopio vs FET) by campaign."""
    df_tot = df_prec[df_prec['provincia'].isin(['TOTAL NACIONAL', 'NACIONAL']) | (df_prec['tipo_tabaco'] == 'TOTAL')].copy()
    
    if df_tot.empty:
        df_tot = df_prec.groupby('campana', as_index=False).agg({
            'volumen_kg': 'sum',
            'valor_acopio_pesos': 'sum',
            'valor_fet_pesos': 'sum',
            'valor_total_pesos': 'sum',
            'anio_inicio': 'first'
        }).sort_values(by='anio_inicio')
        df_tot['precio_acopio_promedio'] = df_tot['valor_acopio_pesos'] / df_tot['volumen_kg']
        df_tot['precio_fet_promedio'] = df_tot['valor_fet_pesos'] / df_tot['volumen_kg']
        df_tot['precio_total_promedio'] = df_tot['valor_total_pesos'] / df_tot['volumen_kg']
        df_tot['pct_fet'] = (df_tot['valor_fet_pesos'] / df_tot['valor_total_pesos']) * 100.0
    else:
        df_tot = df_tot.sort_values(by='anio_inicio')

    fig = go.Figure()
    
    fig.add_trace(go.Bar(
        x=df_tot['campana'],
        y=df_tot['precio_acopio_promedio'],
        name="Precio Acopio Base ($/kg)",
        marker_color='#1e40af',
        hovertemplate="<b>Campaña %{x}</b><br>Acopio: $%{y:,.2f}/kg<extra></extra>"
    ))
    
    fig.add_trace(go.Bar(
        x=df_tot['campana'],
        y=df_tot['precio_fet_promedio'],
        name="Aporte FET ($/kg)",
        marker_color='#10b981',
        hovertemplate="<b>Campaña %{x}</b><br>FET: $%{y:,.2f}/kg<extra></extra>"
    ))
    
    fig.add_trace(go.Scatter(
        x=df_tot['campana'],
        y=df_tot['pct_fet'],
        name="% Aporte FET s/ Total",
        yaxis="y2",
        mode="lines+markers",
        line=dict(color='#f59e0b', width=3, dash='dot'),
        marker=dict(size=7),
        hovertemplate="<b>Campaña %{x}</b><br>Impacto FET: %{y:.1f}%<extra></extra>"
    ))
    
    fig.update_layout(
        get_base_layout("Evolución de la Estructura de Precios e Impacto del FET", height=420),
        barmode='stack',
        yaxis=dict(title="Precio Promedio ($/kg)", showgrid=True, gridcolor="#f1f5f9"),
        yaxis2=dict(
            title="% FET en Ingreso Total",
            overlaying="y",
            side="right",
            range=[0, 100],
            showgrid=False
        )
    )
    return fig

def chart_comparativa_precios_variedad(df_prec_campana):
    """Bar chart comparing Acopio and FET prices across tobacco varieties."""
    df_var = df_prec_campana[~df_prec_campana['tipo_tabaco'].isin(['TOTAL', 'TOTAL NACIONAL', 'SUBTOTAL PROVINCIAL', 'SUBTOTAL_PROVINCIAL']) & 
                             ~df_prec_campana['provincia'].isin(['TOTAL NACIONAL', 'NACIONAL'])].copy()
    
    grp = df_var.groupby('tipo_tabaco', as_index=False).agg({
        'volumen_kg': 'sum',
        'valor_acopio_pesos': 'sum',
        'valor_fet_pesos': 'sum',
        'valor_total_pesos': 'sum'
    })
    
    grp['precio_acopio'] = (grp['valor_acopio_pesos'] / grp['volumen_kg']).round(2)
    grp['precio_fet'] = (grp['valor_fet_pesos'] / grp['volumen_kg']).round(2)
    grp['precio_total'] = (grp['valor_total_pesos'] / grp['volumen_kg']).round(2)
    grp['pct_fet'] = ((grp['valor_fet_pesos'] / grp['valor_total_pesos']) * 100.0).round(1)
    grp = grp.sort_values(by='precio_total', ascending=False)
    
    fig = go.Figure()
    
    fig.add_trace(go.Bar(
        x=grp['tipo_tabaco'],
        y=grp['precio_acopio'],
        name="Precio Acopio ($/kg)",
        marker_color='#3b82f6',
        hovertemplate="<b>%{x}</b><br>Acopio: $%{y:,.2f}/kg<extra></extra>"
    ))
    
    fig.add_trace(go.Bar(
        x=grp['tipo_tabaco'],
        y=grp['precio_fet'],
        name="Precio FET ($/kg)",
        marker_color='#10b981',
        hovertemplate="<b>%{x}</b><br>FET: $%{y:,.2f}/kg<extra></extra>"
    ))
    
    fig.update_layout(
        get_base_layout("Precio de Acopio y FET por Tipo de Tabaco ($/kg)", height=380),
        barmode='stack',
        yaxis=dict(title="Precio ($/kg)", showgrid=True, gridcolor="#f1f5f9")
    )
    return fig

def chart_precios_por_provincia(df_prec_campana):
    """Bar chart comparing total prices and FET share per province."""
    df_p = df_prec_campana[df_prec_campana['es_subtotal_provincial'] == True].copy()
    if df_p.empty:
        df_p = df_prec_campana[~df_prec_campana['provincia'].isin(['TOTAL NACIONAL', 'NACIONAL'])].groupby('provincia', as_index=False).agg({
            'valor_acopio_pesos': 'sum',
            'valor_fet_pesos': 'sum',
            'valor_total_pesos': 'sum',
            'volumen_kg': 'sum'
        })
        df_p['precio_acopio_promedio'] = df_p['valor_acopio_pesos'] / df_p['volumen_kg']
        df_p['precio_fet_promedio'] = df_p['valor_fet_pesos'] / df_p['volumen_kg']
        df_p['precio_total_promedio'] = df_p['valor_total_pesos'] / df_p['volumen_kg']
        df_p['pct_fet'] = (df_p['valor_fet_pesos'] / df_p['valor_total_pesos']) * 100.0

    df_p = df_p.sort_values(by='precio_total_promedio', ascending=True)
    
    fig = go.Figure()
    fig.add_trace(go.Bar(
        y=df_p['provincia'],
        x=df_p['precio_acopio_promedio'],
        name="Acopio ($/kg)",
        orientation='h',
        marker_color='#1d4ed8',
        hovertemplate="<b>%{y}</b><br>Acopio: $%{x:,.2f}/kg<extra></extra>"
    ))
    fig.add_trace(go.Bar(
        y=df_p['provincia'],
        x=df_p['precio_fet_promedio'],
        name="FET ($/kg)",
        orientation='h',
        marker_color='#059669',
        hovertemplate="<b>%{y}</b><br>FET: $%{x:,.2f}/kg<extra></extra>"
    ))
    
    fig.update_layout(
        get_base_layout("Comparativa de Precios Totales por Provincia ($/kg)", height=380),
        barmode='stack',
        xaxis=dict(title="Precio Total Recibido ($/kg)", showgrid=True, gridcolor="#f1f5f9"),
        yaxis=dict(title="")
    )
    return fig

def chart_top_empresas_volumen(df_emp_campana, top_n=10):
    """Horizontal bar chart for Top N Companies by Volume."""
    df_clean = df_emp_campana[df_emp_campana['es_subtotal_empresa'] == False].copy()
    grp = df_clean.groupby('razon_social', as_index=False).agg({
        'volumen_acopio_kg': 'sum',
        'valor_acopio_pesos': 'sum',
        'volumen_tn': 'sum'
    })
    grp['precio_promedio'] = np.where(grp['volumen_acopio_kg'] > 0, grp['valor_acopio_pesos'] / grp['volumen_acopio_kg'], 0).round(2)
    top = grp.sort_values(by='volumen_tn', ascending=True).tail(top_n)
    
    fig = go.Figure()
    fig.add_trace(go.Bar(
        y=top['razon_social'],
        x=top['volumen_tn'],
        orientation='h',
        marker=dict(
            color=top['volumen_tn'],
            colorscale='Blues',
            showscale=False
        ),
        hovertemplate="<b>%{y}</b><br>Volumen: %{x:,.1f} tn<br>Precio Promedio: $%{customdata:,.2f}/kg<extra></extra>",
        customdata=top['precio_promedio']
    ))
    
    fig.update_layout(
        get_base_layout(f"Top {top_n} Empresas por Volumen Acopiado (Toneladas)", height=400),
        xaxis=dict(title="Volumen Acopiado (Toneladas)", showgrid=True, gridcolor="#f1f5f9"),
        yaxis=dict(title="")
    )
    return fig

def chart_treemap_empresas(df_emp_campana):
    """Treemap showing market share hierarchy (Province > Tobacco > Company)."""
    df_clean = df_emp_campana[df_emp_campana['es_subtotal_empresa'] == False].copy()
    df_clean = df_clean[df_clean['volumen_tn'] > 0]
    
    fig = px.treemap(
        df_clean,
        path=['provincia', 'tipo_tabaco', 'razon_social'],
        values='volumen_tn',
        color='precio_promedio_empresa',
        color_continuous_scale='Viridis',
        labels={'volumen_tn': 'Volumen (tn)', 'precio_promedio_empresa': 'Precio Promedio ($/kg)'},
        title="Estructura de Mercado: Provincia > Variedad > Empresa (Color = $/kg)"
    )
    
    fig.update_layout(
        get_base_layout("", height=480),
        margin=dict(l=10, r=10, t=30, b=10)
    )
    return fig

def chart_pareto_empresas(df_emp_campana):
    """Pareto chart showing cumulative volume concentration."""
    df_clean = df_emp_campana[df_emp_campana['es_subtotal_empresa'] == False].copy()
    grp = df_clean.groupby('razon_social', as_index=False)['volumen_tn'].sum()
    grp = grp[grp['volumen_tn'] > 0].sort_values(by='volumen_tn', ascending=False).reset_index(drop=True)
    
    total_vol = grp['volumen_tn'].sum()
    if total_vol == 0:
        return go.Figure()
        
    grp['share_pct'] = (grp['volumen_tn'] / total_vol) * 100.0
    grp['cum_share_pct'] = grp['share_pct'].cumsum()
    top_pareto = grp.head(15)
    
    fig = go.Figure()
    fig.add_trace(go.Bar(
        x=top_pareto['razon_social'],
        y=top_pareto['volumen_tn'],
        name="Volumen (tn)",
        marker_color='#2563eb',
        hovertemplate="<b>%{x}</b><br>Volumen: %{y:,.1f} tn<extra></extra>"
    ))
    fig.add_trace(go.Scatter(
        x=top_pareto['razon_social'],
        y=top_pareto['cum_share_pct'],
        name="% Acumulado",
        yaxis="y2",
        mode="lines+markers",
        line=dict(color='#ef4444', width=3),
        marker=dict(size=7),
        hovertemplate="<b>%{x}</b><br>Acumulado: %{y:.1f}%<extra></extra>"
    ))
    
    fig.add_shape(
        type="line",
        x0=-0.5,
        x1=len(top_pareto)-0.5,
        y0=80,
        y1=80,
        yref="y2",
        line=dict(color="#94a3b8", width=1.5, dash="dash")
    )
    
    fig.update_layout(
        get_base_layout("Curva de Pareto: Concentración del Acopio Tabacalero", height=400),
        yaxis=dict(title="Volumen (Toneladas)", showgrid=True, gridcolor="#f1f5f9"),
        yaxis2=dict(
            title="% Acumulado",
            overlaying="y",
            side="right",
            range=[0, 105],
            showgrid=False
        )
    )
    fig.update_xaxes(tickangle=-45)
    return fig

def chart_top_clases_comerciales(df_acop_campana, top_n=15):
    """Bar chart of Top commercial classes in volume."""
    df_clean = df_acop_campana[df_acop_campana['es_total_clase'] == False].copy()
    grp = df_clean.groupby(['clase_comercial', 'tipo_tabaco'], as_index=False)['volumen_tn'].sum()
    top = grp.sort_values(by='volumen_tn', ascending=False).head(top_n)
    
    fig = px.bar(
        top,
        x='clase_comercial',
        y='volumen_tn',
        color='tipo_tabaco',
        color_discrete_map=TOBACCO_COLORS,
        labels={'volumen_tn': 'Volumen (Toneladas)', 'clase_comercial': 'Clase Comercial', 'tipo_tabaco': 'Tipo'},
        title=f"Top {top_n} Clases Comerciales de Tabaco por Volumen Acopiado"
    )
    
    fig.update_layout(
        get_base_layout("", height=380),
        yaxis=dict(title="Volumen (Toneladas)", showgrid=True, gridcolor="#f1f5f9")
    )
    fig.update_xaxes(tickangle=-45)
    return fig
