"""
styles.py - Sistema de diseño corporativo Dark Mode para el Dashboard del Mercado Internacional de Tabaco.
"""

def apply_corporate_dark_theme():
    """
    Retorna el bloque CSS corporativo Dark Mode para inyectar en Streamlit.
    """
    return """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600;700;800&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    :root {
        --bg-primary: #10150f;
        --bg-card: #182015;
        --bg-card-hover: #1f291b;
        --border-color: rgba(242, 244, 239, 0.10);
        --border-color-glow: rgba(79, 145, 105, 0.35);
        --text-primary: #f2f4ef;
        --text-secondary: #a3ae9d;
        --text-muted: #7a8578;
        --accent-emerald: #4f9169;
        --accent-cyan: #6fae87;
        --accent-amber: #c68a4e;
        --accent-indigo: #8a9c52;
        --accent-rose: #c2604a;
    }

    html, body, [class*="css"], .stApp {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        background-color: var(--bg-primary) !important;
        color: var(--text-primary) !important;
    }

    .main .block-container {
        padding-top: 1.5rem !important;
        padding-bottom: 3.5rem !important;
        padding-left: 2rem !important;
        padding-right: 2rem !important;
        max-width: 1440px !important;
    }

    /* Top Executive Header */
    .dashboard-header {
        background: linear-gradient(135deg, #0a1410 0%, #142218 50%, #1a4329 100%);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 1.6rem 2.2rem;
        margin-bottom: 1.8rem;
        box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        position: relative;
        overflow: hidden;
    }

    .dashboard-header::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #4f9169 0%, #8a9c52 50%, #c68a4e 100%);
    }

    .dashboard-header-title {
        font-family: 'Source Serif 4', Georgia, serif;
        font-size: 1.85rem;
        font-weight: 700;
        color: #ffffff !important;
        letter-spacing: -0.01em;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .dashboard-header-subtitle {
        font-size: 0.92rem;
        color: #a3ae9d;
        margin-top: 0.4rem;
        margin-bottom: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .header-badge {
        background: rgba(79, 145, 105, 0.18);
        color: #8fc7a3;
        border: 1px solid rgba(79, 145, 105, 0.35);
        font-size: 0.75rem;
        font-weight: 700;
        padding: 0.25rem 0.65rem;
        border-radius: 9999px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    /* Executive KPI Metric Cards */
    .kpi-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1rem;
        margin-bottom: 1.8rem;
    }

    .kpi-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 14px;
        padding: 1.25rem 1.4rem;
        box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.3);
        transition: all 0.25s ease;
        position: relative;
        overflow: hidden;
    }

    .kpi-card:hover {
        background: var(--bg-card-hover);
        border-color: rgba(255, 255, 255, 0.18);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px -4px rgba(0, 0, 0, 0.4);
    }

    .kpi-card.emerald { border-left: 4px solid var(--accent-emerald); }
    .kpi-card.cyan { border-left: 4px solid var(--accent-cyan); }
    .kpi-card.amber { border-left: 4px solid var(--accent-amber); }
    .kpi-card.indigo { border-left: 4px solid var(--accent-indigo); }
    .kpi-card.rose { border-left: 4px solid var(--accent-rose); }

    .kpi-icon {
        font-size: 1.3rem;
        margin-bottom: 0.4rem;
        opacity: 0.9;
    }

    .kpi-label {
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--text-muted);
        margin-bottom: 0.25rem;
    }

    .kpi-value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.7rem;
        font-weight: 700;
        color: #ffffff;
        line-height: 1.2;
        letter-spacing: -0.02em;
    }

    .kpi-subtext {
        font-size: 0.8rem;
        color: var(--text-secondary);
        margin-top: 0.35rem;
        display: flex;
        align-items: center;
        gap: 0.35rem;
    }

    .kpi-delta-pos {
        color: #8fc7a3;
        font-weight: 600;
    }

    .kpi-delta-neg {
        color: #e08a72;
        font-weight: 600;
    }

    /* Section Cards */
    .content-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 14px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .card-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 0.35rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .card-subtitle {
        font-size: 0.82rem;
        color: var(--text-muted);
        margin-bottom: 1rem;
    }

    /* Tabs Styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 0.5rem;
        background-color: #182015;
        padding: 0.4rem;
        border-radius: 12px;
        border: 1px solid var(--border-color);
        margin-bottom: 1.5rem;
    }

    .stTabs [data-baseweb="tab"] {
        height: 42px;
        border-radius: 8px;
        color: var(--text-secondary);
        font-weight: 600;
        font-size: 0.88rem;
        padding: 0 1.2rem;
        transition: all 0.2s ease;
        border: none !important;
    }

    .stTabs [aria-selected="true"] {
        background-color: #1f291b !important;
        color: #ffffff !important;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    /* Sidebar Dark Customization */
    section[data-testid="stSidebar"] {
        background-color: #0c1109 !important;
        border-right: 1px solid var(--border-color);
    }

    section[data-testid="stSidebar"] .block-container {
        padding-top: 1.8rem;
        padding-left: 1.2rem;
        padding-right: 1.2rem;
    }

    .sidebar-header {
        font-size: 0.95rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #a9b87a;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        padding-bottom: 0.3rem;
        border-bottom: 1px solid rgba(169, 184, 122, 0.25);
    }

    /* Citation Box */
    .citation-container {
        background: rgba(24, 32, 21, 0.7);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.1rem 1.4rem;
        margin-top: 2.5rem;
        font-size: 0.82rem;
        color: #a3ae9d;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    .citation-title {
        font-weight: 700;
        color: #f2f4ef;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .citation-link {
        color: #a9b87a;
        text-decoration: none;
        transition: color 0.2s ease;
    }

    .citation-link:hover {
        color: #c9d9a5;
        text-decoration: underline;
    }

    /* Custom scrollbars */
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    ::-webkit-scrollbar-track {
        background: #10150f;
    }
    ::-webkit-scrollbar-thumb {
        background: #2a3626;
        border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #3d4a35;
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
        border-bottom: 1px solid var(--border-color);
    }

    .agrotabaco-topbar-brand {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Source Serif 4', Georgia, serif;
        font-size: 1.3rem;
        font-weight: 700;
        color: #f2f4ef !important;
        text-decoration: none !important;
    }

    .agrotabaco-topbar-brand .accent { color: #a9b87a; }

    .agrotabaco-topbar-logo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 9999px;
        background: #4f9169;
        color: #0c1109;
        font-size: 1rem;
    }

    .agrotabaco-topbar-back {
        font-size: 0.85rem;
        font-weight: 600;
        color: #a3ae9d !important;
        text-decoration: none !important;
    }

    .agrotabaco-topbar-back:hover { color: #f2f4ef !important; }
    </style>
    """


def render_metric_card(title: str, value: str, subtitle: str = "", delta: str = "", delta_is_positive: bool = True, color: str = "emerald", icon: str = "📊") -> str:
    """
    Genera el HTML seguro para una tarjeta de métrica KPI corporativa.
    """
    delta_html = ""
    if delta:
        delta_class = "kpi-delta-pos" if delta_is_positive else "kpi-delta-neg"
        delta_symbol = "▲" if delta_is_positive else "▼"
        delta_html = f'<span class="{delta_class}">{delta_symbol} {delta}</span>'

    subtitle_content = f"{delta_html} <span>{subtitle}</span>" if delta_html else f"<span>{subtitle}</span>"

    return f"""
    <div class="kpi-card {color}">
        <div class="kpi-icon">{icon}</div>
        <div class="kpi-label">{title}</div>
        <div class="kpi-value">{value}</div>
        <div class="kpi-subtext">{subtitle_content}</div>
    </div>
    """


def render_topbar(site_url: str) -> str:
    """
    Genera la barra de marca AgroTabaco con link de retorno al portal.
    """
    return f"""
    <div class="agrotabaco-topbar">
        <a class="agrotabaco-topbar-brand" href="{site_url}" target="_top">
            <span class="agrotabaco-topbar-logo">🌱</span> Agro<span class="accent">Tabaco</span>
        </a>
        <a class="agrotabaco-topbar-back" href="{site_url}" target="_top">← Volver al portal de noticias</a>
    </div>
    """


def render_header(title: str, subtitle: str, badge_text: str = "FAOstat Intelligence") -> str:
    """
    Genera el banner superior corporativo.
    """
    return f"""
    <div class="dashboard-header">
        <div>
            <div class="dashboard-header-title">
                <span>🍃</span> {title}
            </div>
            <div class="dashboard-header-subtitle">
                <span>{subtitle}</span>
            </div>
        </div>
        <div>
            <span class="header-badge">{badge_text}</span>
        </div>
    </div>
    """


def render_citation_footer(citation_text: str, source_url: str = "http://www.fao.org/faostat/en/#data/QCL", owid_url: str = "https://ourworldindata.org/grapher/tobacco-production", site_url: str = "http://localhost:3000") -> str:
    """
    Genera el footer de citación oficial estipulado por FAO y Our World in Data.
    """
    return f"""
    <div class="citation-container">
        <div class="citation-title">
            <span>📚</span> Citación Oficial & Fuente de Datos
        </div>
        <div>
            <strong>Referencia recomendada:</strong> <em>{citation_text}</em>
        </div>
        <div style="font-size: 0.78rem; margin-top: 0.3rem;">
            🔗 Enlaces de consulta:
            <a href="{source_url}" target="_blank" class="citation-link">FAOstat - Crops & Livestock Products</a> |
            <a href="{owid_url}" target="_blank" class="citation-link">Our World in Data - Tobacco Production Dataset</a>
        </div>
        <div style="font-size: 0.78rem; margin-top: 0.3rem;">
            Un desarrollo de <a href="{site_url}" target="_top" class="citation-link">AgroTabaco</a>
        </div>
    </div>
    """
