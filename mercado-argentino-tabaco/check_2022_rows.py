import pandas as pd

df = pd.read_csv("csv_anuario_produccion_primaria.csv", encoding='utf-8-sig')
df.columns = [c.replace('\ufeff', '').strip() for c in df.columns]
c_2022 = df[df['campana'] == '2022/2023']
print("All 2022/2023 rows:")
print(c_2022[['ambito', 'provincia', 'tipo_tabaco', 'es_total', 'sup_cosechada_ha', 'produccion_kg', 'rendimiento_kg_ha']])
