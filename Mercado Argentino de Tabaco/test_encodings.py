import pandas as pd

for fname, sep in [
    ("csv_anuario_produccion_primaria.csv", ","),
    ("acopio_historico_unificado.csv", ";"),
    ("acopio_empresas_historico_unificado.csv", ";"),
    ("acopio_resumen_precios_historico_unificado.csv", ";")
]:
    print(f"\n==================== {fname} ====================")
    for enc in ['latin-1', 'utf-8-sig', 'utf-8']:
        try:
            df = pd.read_csv(fname, sep=sep, encoding=enc)
            print(f"[{enc}] successfully read. Shape: {df.shape}")
            if 'provincia' in df.columns:
                print(f"  Provincias: {df['provincia'].unique().tolist()}")
            if 'tipo_tabaco' in df.columns:
                print(f"  Tipos: {df['tipo_tabaco'].unique().tolist()}")
            break
        except Exception as e:
            print(f"[{enc}] failed: {e}")
