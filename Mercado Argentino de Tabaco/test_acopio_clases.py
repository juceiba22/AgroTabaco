import pandas as pd

df = pd.read_csv("acopio_historico_unificado.csv", sep=";", encoding='latin-1')
print("Total rows:", len(df))
print("es_total_clase counts:")
print(df['es_total_clase'].value_counts())

print("\nSample where es_total_clase == True:")
print(df[df['es_total_clase'] == True].head(15))

print("\nUnique classes where es_total_clase == False:", df[df['es_total_clase'] == False]['clase_comercial'].nunique())
print("Unique provinces:", df['provincia'].unique())
print("Unique tobacco types:", df['tipo_tabaco'].unique())
print("Unique campaigns:", df['campana'].unique())
