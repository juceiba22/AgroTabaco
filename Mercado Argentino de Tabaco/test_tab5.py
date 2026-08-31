import pandas as pd
from app import load_fet_consolidado, load_acopio_precios, load_acopio_empresas, load_acopio_clases, load_produccion_primaria

def test_tab5_suite():
    print("Testing Tab 5 (Ejecución Presupuestaria FET) module...")
    df_fet = load_fet_consolidado()
    assert not df_fet.empty, "df_fet is empty"
    assert 'anio' in df_fet.columns
    assert 'mes' in df_fet.columns
    assert 'concepto_clean' in df_fet.columns
    assert 'monto_ars' in df_fet.columns
    assert 'categoria_concepto' in df_fet.columns
    
    # Check years range
    anios = sorted(df_fet['anio'].unique())
    print(f"Años en FET ({len(anios)}): {anios[0]} a {anios[-1]}")
    assert 2005 in anios and 2026 in anios, "Años 2005 a 2026 deben estar presentes"
    
    # Check no corrupted characters in categories
    for c in df_fet['categoria_concepto'].unique():
        assert '\ufffd' not in c
        
    print(f"Total registros financieros: {len(df_fet)}")
    total_ars = df_fet['monto_ars'].sum()
    print(f"Monto total histórico registrado: ${total_ars:,.2f}")
    assert total_ars > 0, "Monto total debe ser > 0"
    
    # Test 2024 filtering and aggregation
    fet_2024 = df_fet[df_fet['anio'] == 2024]
    tot_2024 = fet_2024['monto_ars'].sum()
    print(f"Año 2024 - Registros: {len(fet_2024)}, Monto Total: ${tot_2024:,.2f}")
    assert tot_2024 > 0, "2024 monto debe ser > 0"
    
    # Test top concept in 2024
    top_c_2024 = fet_2024.groupby('concepto_clean')['monto_ars'].sum().sort_values(ascending=False).head(1)
    print(f"Concepto Líder 2024: {top_c_2024.index[0]} con ${top_c_2024.values[0]:,.2f}")
    
    print("[ALL TAB 5 TESTS PASSED SUCCESSFULLY]")

if __name__ == "__main__":
    test_tab5_suite()
