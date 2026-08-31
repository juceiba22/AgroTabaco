import pandas as pd
import numpy as np

df = pd.read_csv("csv_anuario_produccion_primaria.csv", encoding='latin-1')

print("All unique 'es_total' values:", df['es_total'].unique())
print("All unique 'ambito' values:", df['ambito'].unique())
print("All unique 'provincia' values:", df['provincia'].unique())
print("All unique 'campana' values:", sorted(df['campana'].unique()))
print("All unique 'tipo_tabaco' values:", df['tipo_tabaco'].unique())

# Test latest campaign 2022/2023
c_2022 = df[df['campana'] == '2022/2023']
print("\n--- 2022/2023 Granular rows (es_total == False and ambito == 'PROVINCIAL') ---")
gran = c_2022[(c_2022['es_total'] == False) & (c_2022['ambito'] == 'PROVINCIAL')]
print("Sum produccion_kg:", gran['produccion_kg'].sum())
print("Sum sup_cosechada_ha:", gran['sup_cosechada_ha'].sum())
print("Weighted Yield kg/ha:", gran['produccion_kg'].sum() / gran['sup_cosechada_ha'].sum())

# National total row in 2022/2023
nat = c_2022[c_2022['es_total'] == True]
print("\n--- 2022/2023 National Total Row ---")
print(nat[['provincia', 'campana', 'tipo_tabaco', 'produccion_kg', 'sup_cosechada_ha', 'rendimiento_kg_ha']])
