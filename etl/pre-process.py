import pandas as pd

# Load product IDs into a set
df_products = pd.read_csv("./db/data/product.csv")
product_ids = set(df_products['id'])

# Load related items
df_related = pd.read_csv("./db/data/related.csv")

# Filter out rows where the related_product_id doesn't exist in product.csv
df_related_filtered = df_related[df_related['related_product_id'].isin(product_ids)]

# Write the filtered data to a new CSV file
df_related_filtered.to_csv("./db/data/related_filtered.csv", index=False)
