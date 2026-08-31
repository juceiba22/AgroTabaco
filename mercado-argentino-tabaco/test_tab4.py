import pandas as pd
from app import load_acopio_precios, load_acopio_empresas, load_acopio_clases, load_produccion_primaria, build_kpi_card

def test_tab4_suite():
    print("Testing Tab 4 (Precios & Impacto FET) module...")
    df_prec = load_acopio_precios()
    assert not df_prec.empty, "df_prec is empty"
    assert 'precio_acopio_promedio' in df_prec.columns
    assert 'precio_fet_promedio' in df_prec.columns
    assert 'precio_total_promedio' in df_prec.columns
    assert 'pct_fet' in df_prec.columns
    assert 'es_subtotal_provincial' in df_prec.columns
    assert 'es_total_nacional' in df_prec.columns
    
    # Check no corrupted characters in provinces
    for p in df_prec['provincia_clean'].unique():
        assert 'ÑCÑAÑ' not in p
        assert '\ufffd' not in p
        
    print(f"Campañas en precios ({df_prec['campana'].nunique()}): {sorted(df_prec['campana'].unique())}")
    print(f"Provincias en precios ({df_prec['provincia_clean'].nunique()}): {sorted(df_prec['provincia_clean'].unique())}")
    
    # Test 2024/2025 calculations
    c24 = df_prec[df_prec['campana'] == '2024/2025']
    nat24 = c24[c24['es_total_nacional'] == True]
    assert not nat24.empty, "National 2024/2025 row missing"
    
    p_acop = nat24['precio_acopio_promedio'].iloc[0]
    p_fet = nat24['precio_fet_promedio'].iloc[0]
    p_tot = nat24['precio_total_promedio'].iloc[0]
    pct_fet = nat24['pct_fet'].iloc[0]
    
    assert p_acop > 0, "Precio acopio should be > 0"
    assert p_fet > 0, "Precio FET should be > 0"
    assert p_tot > 0, "Precio total should be > 0"
    assert 0 < pct_fet < 100, f"FET % should be between 0 and 100, got {pct_fet}"
    
    print(f"2024/2025 Nacional - Acopio: ${p_acop:,.2f}/kg, FET: ${p_fet:,.2f}/kg, Total: ${p_tot:,.2f}/kg, Impacto FET: {pct_fet:.2f}%")
    print("[ALL TAB 4 TESTS PASSED SUCCESSFULLY]")

if __name__ == "__main__":
    test_tab4_suite()
