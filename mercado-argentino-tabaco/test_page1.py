import pandas as pd
from app import load_produccion_primaria_data, build_kpi_card

def test_app_logic():
    print("Testing primary production app module...")
    df = load_produccion_primaria_data()
    assert not df.empty, "Dataframe is empty"
    assert 'provincia_clean' in df.columns
    assert 'tipo_tabaco_clean' in df.columns
    
    # Check no duplicate Ns or corrupted chars
    for p in df['provincia_clean'].unique():
        assert 'ÑCÑAÑ' not in p
        assert '\ufffd' not in p
        
    print(f"Provincias ({df['provincia_clean'].nunique()}): {sorted(df['provincia_clean'].unique())}")
    print(f"Tipos de tabaco ({df['tipo_tabaco_clean'].nunique()}): {sorted(df['tipo_tabaco_clean'].unique())}")
    print(f"Campañas ({df['campana'].nunique()}): {sorted(df['campana'].unique())[0]} ... {sorted(df['campana'].unique())[-1]}")
    
    card = build_kpi_card("PRODUCCION", "87,409 tn", "Campaña 2022/2023", delta=-4.5, color="blue")
    assert "<div class=\"kpi-card" in card
    assert not card.startswith("    ")
    assert "\n" not in card
    print("Card HTML preview:", card[:80] + "...")
    print("[ALL TESTS PASSED SUCCESSFULLY]")

if __name__ == "__main__":
    test_app_logic()
