import pandas as pd
from app import load_acopio_clases, load_produccion_primaria, build_kpi_card

def test_tab2_suite():
    print("Testing Tab 2 (Calidad & Clases Comerciales) module...")
    df_clases = load_acopio_clases()
    assert not df_clases.empty, "df_clases is empty"
    assert 'clase_comercial' in df_clases.columns
    assert 'es_total_clase' in df_clases.columns
    assert 'provincia_clean' in df_clases.columns
    assert 'tipo_tabaco_clean' in df_clases.columns
    
    # Verify no corrupted characters or duplicate Ns in provinces
    for p in df_clases['provincia_clean'].unique():
        assert 'ÑCÑAÑ' not in p
        assert '\ufffd' not in p
        
    print(f"Campañas en acopio ({df_clases['campana'].nunique()}): {sorted(df_clases['campana'].unique())}")
    print(f"Provincias en acopio ({df_clases['provincia_clean'].nunique()}): {sorted(df_clases['provincia_clean'].unique())}")
    print(f"Variedades en acopio ({df_clases['tipo_tabaco_clean'].nunique()}): {sorted(df_clases['tipo_tabaco_clean'].unique())}")
    print(f"Clases comerciales únicas: {df_clases[df_clases['es_total_clase'] == False]['clase_comercial'].nunique()}")
    
    # Test filtering logic for 2024/2025
    c24 = df_clases[(df_clases['campana'] == '2024/2025') & (df_clases['es_total_clase'] == False) & (df_clases['provincia_clean'] != 'Total Nacional')]
    vol_tot = c24['volumen_tn'].sum()
    assert vol_tot > 0, "Volumen total should be > 0"
    print(f"Volumen acopiado clasificado 2024/2025: {vol_tot:,.1f} tn")
    
    # Test Top class
    top_c = c24.groupby('clase_comercial')['volumen_tn'].sum().sort_values(ascending=False).head(1)
    print(f"Clase Líder 2024/2025: {top_c.index[0]} con {top_c.values[0]:,.1f} tn ({top_c.values[0]/vol_tot*100:.1f}%)")
    
    print("[ALL TAB 2 TESTS PASSED SUCCESSFULLY]")

if __name__ == "__main__":
    test_tab2_suite()
