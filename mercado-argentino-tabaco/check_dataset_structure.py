import pandas as pd

df = pd.read_csv("csv_anuario_produccion_primaria.csv", encoding='utf-8-sig')
df.columns = [c.replace('\ufeff', '').strip() for c in df.columns]

print("Breakdown of dataset structure:")
print(df.groupby(['ambito', 'es_total']).size())
print("\nAmbito == NACIONAL sample:")
print(df[df['ambito'] == 'NACIONAL'].head(10)[['campana', 'provincia', 'tipo_tabaco', 'es_total', 'produccion_kg', 'sup_cosechada_ha']])
print("\nAmbito == PROVINCIAL sample:")
print(df[df['ambito'] == 'PROVINCIAL'].head(10)[['campana', 'provincia', 'tipo_tabaco', 'es_total', 'produccion_kg', 'sup_cosechada_ha']])
