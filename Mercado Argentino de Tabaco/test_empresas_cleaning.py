import pandas as pd
import re

df = pd.read_csv("acopio_empresas_historico_unificado.csv", sep=";", encoding='latin-1')
print("Total rows:", len(df))
print("es_subtotal_empresa counts:")
print(df['es_subtotal_empresa'].value_counts())

# Check rows where volumen_acopio_kg is NaN or 0
print("\nRows where volumen_acopio_kg is null or <= 0:")
print(df[df['volumen_acopio_kg'].isna() | (df['volumen_acopio_kg'] <= 0)])

# Check rows where razon_social starts with digits or looks like a number
print("\nRows where razon_social looks like a number:")
print(df[df['razon_social'].str.match(r'^\d', na=False)])

# Clean filter test:
# 1. es_subtotal_empresa == False
# 2. volumen_acopio_kg > 0
# 3. razon_social does not match pure numbers/artifacts
# 4. fix scale for 1000x issue where valor / volumen > 5000 in early campaigns
valid_emp = df[(df['es_subtotal_empresa'] == False) & (df['volumen_acopio_kg'].notna()) & (df['volumen_acopio_kg'] > 0)].copy()
valid_emp = valid_emp[~valid_emp['razon_social'].str.match(r'^\d+[\.,]', na=False)]

print("\nValid rows count:", len(valid_emp))
print("Unique companies in valid rows:", valid_emp['razon_social'].nunique())
print("Top 10 companies sample across all campaigns:")
print(valid_emp.groupby('razon_social')['volumen_acopio_kg'].sum().sort_values(ascending=False).head(10))
