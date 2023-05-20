# %%
import os
import time
import math
import psycopg2
import pandas as pd

from io import StringIO
from psycopg2.extras import execute_values
from dotenv import load_dotenv

load_dotenv()
db_password = os.environ.get('POSTGRES_PASSWORD')

print("loaded env")
# %%
def create_conn():
    return psycopg2.connect(
        host="localhost",
        port=5432,
        dbname="mydb",
        user="danny",
        password = db_password,
    )

print("loaded db")
# %%

product_file = "./db/data/product.csv"
df_products = pd.read_csv(product_file)

# styles_file = "./db/data/styles.csv"
# df_styles = pd.read_csv(styles_file)

# photos_file = "./db/data/photos.csv"
# columns_to_use = [0, 1, 2, 3] # Only use the first 4 columns
# df_photos = pd.read_csv(photos_file, usecols=columns_to_use)

# features_file = "./db/data/features.csv"
# df_features = pd.read_csv(features_file)

# skus_file = "./db/data/skus.csv"
# df_skus = pd.read_csv(skus_file)


# related_file = "./db/data/related.csv"
# df_related = pd.read_csv(related_file)


print("loaded csv")

# %%
def extract_from_csv(df, table_name):
    conn = create_conn()
    cur = conn.cursor()

    drop_table_sql = f"DROP TABLE IF EXISTS {table_name} CASCADE;"  # Drop table and all its dependencies
    cur.execute(drop_table_sql)

    headers = df.columns.tolist()
    first_row = df.iloc[0]
    columns = []
    primary_key = ""
    foreign_key = ""

    headers = ["product_id" if header in ["productId", "current_product_id"] else header for header in headers]
    headers = ["style_id" if header in ["styleId"] else header for header in headers]

    for header, value in zip(headers, first_row):
        data_type = "VARCHAR" if isinstance(value, str) else "INTEGER"

        # Check if the table_name is 'styles' and the header is 'id'
        if table_name == "styles" and header == "id":
            header = "style_id"

        columns.append(f"{header} {data_type}")

        # Define primary & foreign keys
        if header == "id" and table_name != "styles":
            primary_key = "PRIMARY KEY (id)"
        elif header == "style_id" and table_name == "styles":
            primary_key = "PRIMARY KEY (style_id)"

        if header == "product_id":
            foreign_key = f"FOREIGN KEY (product_id) REFERENCES products (id)"
        elif header == "style_id" and table_name != "styles":
            foreign_key = f"FOREIGN KEY (style_id) REFERENCES styles (style_id)"
        elif header == "related_product_id" and table_name == "related_items":
            foreign_key = f"FOREIGN KEY (related_product_id) REFERENCES products (id)"

    create_table_sql = f"CREATE TABLE {table_name} ({', '.join(columns)}" + (f", {primary_key}" if primary_key else "") + (f", {foreign_key}" if foreign_key else "") + ");"
    cur.execute(create_table_sql)

    # Create indexes for the keys
    index_columns = ["id", "style_id", "product_id", "related_product_id"]
    for col in index_columns:
        if col in headers:
            if col == "id" and table_name == "styles":
                continue  # Skip creating an index for the 'id' column in the 'styles' table
            cur.execute(f"CREATE INDEX {table_name}_{col}_idx ON {table_name} ({col});")

    conn.commit()
    df.columns = headers  # update headers

    if table_name == "styles":
        df.rename(columns={"id": "style_id"}, inplace=True)

    if table_name == "styles":
        df['sale_price'] = df['sale_price'].apply(lambda x: 0 if pd.isna(x) or x == 'null' else int(round(float(x), 2))).astype('Int64')

    insert_data(df, table_name, cur)
    conn.commit()

    cur.execute(f"SELECT * FROM {table_name} LIMIT 5")

    results = cur.fetchall()

    for row in results:
        print(row)

    cur.close()
    conn.close()


def insert_data(df, table_name, cur, chunksize=100000):
    # Filter out the rows with non-existent related_product_id's
    if table_name == "related_items":
        conn_subquery = create_conn()
        df = df.loc[df["related_product_id"].isin(pd.read_sql("SELECT id FROM products", conn_subquery).id.tolist())]
        conn_subquery.close()

    total_rows = df.shape[0]
    total_chunks = math.ceil(total_rows / chunksize)

    for chunk_idx in range(total_chunks):
        start_idx = chunk_idx * chunksize
        end_idx = (chunk_idx + 1) * chunksize

        df_chunk = df.iloc[start_idx:end_idx, :]

        # Prepare the data as a CSV string
        csv_buffer = StringIO()
        df_chunk.to_csv(csv_buffer, index=False, header=False)
        csv_data = csv_buffer.getvalue()

        # import data
        columns = ", ".join(df.columns)
        cur.copy_expert(f"COPY {table_name} ({columns}) FROM STDIN WITH CSV", StringIO(csv_data))

# %%
# Record the start and end time, then calculate duration
print("starting import")
start_time = time.time()
extract_from_csv(df_products, "products")
# extract_from_csv(df_styles, "styles")
# extract_from_csv(df_photos, "photos")
# extract_from_csv(df_related, "related_items")
# extract_from_csv(df_features, "features")
# extract_from_csv(df_skus, "skus")

end_time = time.time()

duration = end_time - start_time
print(f"Data import took {duration:.2f} seconds.")


