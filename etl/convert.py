import pandas as pd

df = pd.read_csv('./db/data/skus.csv', encoding='us-ascii')
df.to_parquet('./db/data/skus.parquet', index=False)