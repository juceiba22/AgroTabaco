import pandas as pd

df = pd.read_csv("FET_Consolidado_Ejecuciones_Dashboard.csv", encoding='utf-8-sig')

def clean_concept(c):
    if not isinstance(c, str): return ""
    return c.strip()

df['concepto_clean'] = df['concepto'].apply(clean_concept)
print("All 72 concepts with row counts and total ARS:")
agg = df.groupby('concepto_clean').agg({'monto_ars': ['count', 'sum']})
agg.columns = ['count', 'total_ars']
agg = agg.sort_values(by='total_ars', ascending=False)
for idx, (concept, row) in enumerate(agg.iterrows()):
    print(f"{idx+1:2d}. {concept} | Rows: {row['count']:3.0f} | Total: ${row['total_ars']:,.2f}")
