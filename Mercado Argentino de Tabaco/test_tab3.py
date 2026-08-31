import pandas as pd
from app import load_acopio_empresas, load_acopio_clases, load_produccion_primaria, build_kpi_card

def test_tab3_suite():
    print("Testing Tab 3 (Participación de Mercado & Empresas) module...")
    df_emp = load_acopio_empresas()
    assert not df_emp.empty, "df_emp is empty"
    assert 'razon_social_clean' in df_emp.columns
    assert 'es_subtotal_empresa' in df_emp.columns
    assert 'volumen_acopio_kg' in df_emp.columns
    assert 'valor_acopio_pesos' in df_emp.columns
    
    # Check no corrupted characters in provinces or company names
    for p in df_emp['provincia_clean'].unique():
        assert 'ÑCÑAÑ' not in p
        assert '\ufffd' not in p
        
    print(f"Campañas en empresas ({df_emp['campana'].nunique()}): {sorted(df_emp['campana'].unique())}")
    print(f"Provincias en empresas ({df_emp['provincia_clean'].nunique()}): {sorted(df_emp['provincia_clean'].unique())}")
    print(f"Total empresas activas únicas: {df_emp[df_emp['es_subtotal_empresa'] == False]['razon_social_clean'].nunique()}")
    
    # Test 2024/2025 calculations
    c24 = df_emp[(df_emp['campana'] == '2024/2025') & (df_emp['es_subtotal_empresa'] == False) & (df_emp['provincia_clean'] != 'Total Nacional')]
    vol_tot = c24['volumen_tn'].sum()
    val_tot = c24['valor_acopio_pesos'].sum()
    n_comp = c24['razon_social_clean'].nunique()
    
    assert vol_tot > 0, "Volumen total should be > 0"
    assert val_tot > 0, "Valor total should be > 0"
    assert n_comp > 0, "Empresas count should be > 0"
    
    print(f"2024/2025 - Empresas Activas: {n_comp}, Volumen Total: {vol_tot:,.1f} tn, Valor Total: ${val_tot:,.2f}")
    
    # Top buyer
    top1 = c24.groupby('razon_social_clean')['volumen_tn'].sum().sort_values(ascending=False).head(1)
    print(f"Líder 2024/2025: {top1.index[0]} con {top1.values[0]:,.1f} tn ({top1.values[0]/vol_tot*100:.1f}% cuota)")
    
    print("[ALL TAB 3 TESTS PASSED SUCCESSFULLY]")

if __name__ == "__main__":
    test_tab3_suite()
