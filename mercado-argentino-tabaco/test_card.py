import textwrap

def render_metric_card(title, value, subtitle="", delta=None, delta_text="", color_theme="blue"):
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
            
    sub_html = f'<div class="metric-subtitle">{subtitle}</div>' if subtitle else ''
    
    # Must NOT have 4-space indentation on lines so markdown doesn't treat it as a code block!
    card_html = f'''<div class="metric-card {color_theme}"><div class="metric-label">{title}</div><div class="metric-value">{value}</div>{delta_html}{sub_html}</div>'''
    return card_html

print(repr(render_metric_card("Pérdida", "0.0%", "0 ha no cosechadas", color_theme="amber")))
