import pandas as pd

df = pd.read_csv("FET_Consolidado_Ejecuciones_Dashboard.csv", encoding='utf-8-sig')
print("Columns:", df.columns.tolist())
print("Shape:", df.shape)
print("Años:", sorted(df['anio'].dropna().unique()))
print("Meses:", df['mes'].unique())
print("Conceptos únicos count:", df['concepto'].nunique())
print("\nConceptos sample:")
for c in df['concepto'].value_counts().head(20).items():
    print(f" - {c[0]}: {c[1]} rows")

print("\nRecaudación sample rows:")
rec = df[df['concepto'].str.contains('Recaudaci', case=False, na=False)]
print(rec.groupby('anio')['monto_ars'].sum())
