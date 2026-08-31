import pandas as pd

df = pd.read_csv("csv_anuario_produccion_primaria.csv", encoding='latin-1')
print("Columns:", list(df.columns))
print(df.head(2))
