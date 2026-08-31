import pandas as pd

df = pd.read_csv("csv_anuario_produccion_primaria.csv", encoding='utf-8-sig')
print("Columns with utf-8-sig:", list(df.columns))
print("Ambito values:", df['ambito'].unique())
print("Provincia values:", df['provincia'].unique())
print("Tipo tabaco values:", df['tipo_tabaco'].unique())
print("es_total values:", df['es_total'].unique())
print("Campana values:", sorted(df['campana'].unique()))

# Check granular rows vs total rows
gran = df[df['es_total'] == False]
tot = df[df['es_total'] == True]
print(f"Total rows: {len(df)}, Granular (es_total=False): {len(gran)}, Summary (es_total=True): {len(tot)}")
