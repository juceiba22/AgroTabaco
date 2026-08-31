"""
test_app.py - Verification script for app logic, data loader, card rendering, and chart generation.
"""

import sys
import pandas as pd
from data_loader import (
    load_produccion_primaria,
    load_acopio_historico,
    load_acopio_empresas,
    load_acopio_resumen_precios
)
from styles import render_metric_card
import charts

def test_pipeline():
    print("1. Testing data loading and encoding sanitization...")
    df_prod = load_produccion_primaria()
    df_acop = load_acopio_historico()
    df_emp = load_acopio_empresas()
    df_prec = load_acopio_resumen_precios()
    
    assert not df_prod.empty, "df_prod is empty"
    assert not df_acop.empty, "df_acop is empty"
    assert not df_emp.empty, "df_emp is empty"
    assert not df_prec.empty, "df_prec is empty"
    
    # Verify no corrupted characters or duplicate Ns in provinces
    for p in df_prod['provincia'].unique():
        assert 'ÑCÑAÑ' not in p, f"Corrupted province found: {p}"
        assert '\ufffd' not in p, f"Corrupted character found in province: {p}"
        
    print(f"   [OK] Provincias en produccion: {sorted(df_prod['provincia'].unique())}")
    print(f"   [OK] Tipos de tabaco en produccion: {sorted(df_prod['tipo_tabaco'].unique())}")
    print("[PASS] Datasets loaded and sanitized successfully.")
    
    print("2. Testing HTML card rendering (no raw tags, no codeblocks)...")
    card1 = render_metric_card("Perdida de Superficie", "0.0%", "0 ha no cosechadas", color_theme="amber")
    assert "<div class=\"metric-card" in card1, "Card wrapper missing"
    assert not card1.startswith("    "), "Card must not have 4-space markdown indentation"
    assert "\n" not in card1, "Single-line card HTML prevents markdown codeblock splitting"
    print("   [OK] Metric card output sample:", card1[:80] + "...")
    print("[PASS] Metric cards render safe single-line HTML.")

    print("3. Testing chart generators...")
    f1 = charts.chart_historico_produccion(df_prod, breakdown="tipo_tabaco")
    assert f1 is not None
    
    f1_tot = charts.chart_historico_produccion(df_prod, breakdown="total")
    assert f1_tot is not None
    
    f1_prov = charts.chart_historico_produccion(df_prod, breakdown="provincia")
    assert f1_prov is not None
    
    f2 = charts.chart_rendimiento_comparativo(df_prod[df_prod['campana'] == '2022/2023'])
    assert f2 is not None
    
    f3 = charts.chart_distribucion_provincial(df_prod[df_prod['campana'] == '2022/2023'])
    assert f3 is not None
    
    f4 = charts.chart_precios_composicion_campana(df_prec)
    assert f4 is not None
    
    f5 = charts.chart_comparativa_precios_variedad(df_prec[df_prec['campana'] == '2022/2023'])
    assert f5 is not None
    
    f6 = charts.chart_precios_por_provincia(df_prec[df_prec['campana'] == '2022/2023'])
    assert f6 is not None
    
    f7 = charts.chart_top_empresas_volumen(df_emp[df_emp['campana'] == '2022/2023'])
    assert f7 is not None
    
    f8 = charts.chart_treemap_empresas(df_emp[df_emp['campana'] == '2022/2023'])
    assert f8 is not None
    
    f9 = charts.chart_pareto_empresas(df_emp[df_emp['campana'] == '2022/2023'])
    assert f9 is not None
    
    f10 = charts.chart_top_clases_comerciales(df_acop[df_acop['campana'] == '2022/2023'])
    assert f10 is not None
    print("[PASS] All 10 Plotly chart figures generated cleanly.")

if __name__ == "__main__":
    test_pipeline()
    print("\n[ALL TESTS PASSED WITH 100% SUCCESS]")
