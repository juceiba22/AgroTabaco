"""
styles.py - Custom corporate CSS styling and layout helpers for TabacoStats Argentina.
"""

def apply_custom_css():
    return """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    html, body, [class*="css"] {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .block-container {
        padding-top: 1.5rem;
        padding-bottom: 3rem;
        padding-left: 2rem;
        padding-right: 2rem;
        max-width: 1400px;
    }

    .dashboard-header {
        background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
        color: #ffffff;
        padding: 1.6rem 2rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
        box-shadow: 0 4px 20px rgba(15, 32, 39, 0.15);
    }
    
    .dashboard-header h1 {
        font-size: 1.95rem;
        font-weight: 800;
        margin: 0;
        letter-spacing: -0.5px;
        color: #ffffff !important;
    }
    
    .dashboard-header p {
        font-size: 0.92rem;
        color: #cfd8dc;
        margin-top: 0.35rem;
        margin-bottom: 0;
    }

    /* Metric Cards - Single Line Safe HTML */
    .metric-card {
        background: #ffffff;
        border-radius: 10px;
        padding: 1.1rem 1.3rem;
        border: 1px solid #e2e8f0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        position: relative;
        overflow: hidden;
        margin-bottom: 0.8rem;
    }

    .metric-card.blue { border-left: 4px solid #2563eb; }
    .metric-card.emerald { border-left: 4px solid #059669; }
    .metric-card.purple { border-left: 4px solid #7c3aed; }
    .metric-card.amber { border-left: 4px solid #d97706; }

    .metric-label {
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #64748b;
        margin-bottom: 0.25rem;
    }

    .metric-value {
        font-size: 1.6rem;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.2;
    }

    .metric-subtitle {
        font-size: 0.76rem;
        color: #94a3b8;
        margin-top: 0.3rem;
    }
    
    .metric-delta-pos {
        color: #059669;
        font-weight: 600;
        font-size: 0.8rem;
        margin-top: 0.2rem;
    }

    .metric-delta-neg {
        color: #dc2626;
        font-weight: 600;
        font-size: 0.8rem;
        margin-top: 0.2rem;
    }

    .section-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 0.2rem;
    }

    .section-desc {
        font-size: 0.85rem;
        color: #64748b;
        margin-bottom: 1rem;
    }

    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
        background-color: #f1f5f9;
        padding: 5px;
        border-radius: 8px;
    }

    .stTabs [data-baseweb="tab"] {
        height: 42px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.88rem;
        color: #475569;
        padding: 0 1rem;
    }

    .stTabs [aria-selected="true"] {
        background-color: #ffffff !important;
        color: #0f172a !important;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08) !important;
    }

    [data-testid="stSidebar"] {
        background-color: #f8fafc;
        border-right: 1px solid #e2e8f0;
    }

    .sidebar-brand {
        padding: 0.5rem 0.2rem 1rem 0.2rem;
        border-bottom: 1px solid #e2e8f0;
        margin-bottom: 1rem;
    }

    .sidebar-brand h2 {
        font-size: 1.25rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0;
    }

    .sidebar-brand p {
        font-size: 0.78rem;
        color: #64748b;
        margin-top: 0.2rem;
        margin-bottom: 0;
    }

    .info-pill {
        display: inline-flex;
        align-items: center;
        background-color: #e0f2fe;
        color: #0369a1;
        padding: 0.25rem 0.65rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-right: 0.4rem;
        margin-top: 0.3rem;
        border: 1px solid #bae6fd;
    }
    
    .dashboard-footer {
        text-align: center;
        padding: 2rem 0 1rem 0;
        color: #94a3b8;
        font-size: 0.8rem;
        border-top: 1px solid #f1f5f9;
        margin-top: 2rem;
    }
    </style>
    """

def render_metric_card(title, value, subtitle="", delta=None, delta_text="", color_theme="blue"):
    """
    Render a clean corporate styled KPI card.
    Uses continuous HTML without 4-space markdown indentation to prevent raw code rendering.
    """
    delta_html = ""
    if delta is not None and delta != "":
        if isinstance(delta, (int, float)):
            is_pos = delta >= 0
            sign = "+" if is_pos else ""
            css_cls = "metric-delta-pos" if is_pos else "metric-delta-neg"
            arrow = "▲" if is_pos else "▼"
            delta_html = f'<div class="{css_cls}">{arrow} {sign}{delta:.1f}% {delta_text}</div>'
        else:
            delta_html = f'<div class="metric-subtitle">{delta}</div>'
            
    sub_html = f'<div class="metric-subtitle">{subtitle}</div>' if subtitle else ""
    
    # Strictly single-line HTML representation to eliminate markdown codeblock interpretation
    return f'<div class="metric-card {color_theme}"><div class="metric-label">{title}</div><div class="metric-value">{value}</div>{delta_html}{sub_html}</div>'
