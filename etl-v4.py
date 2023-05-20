import os
import time
import math
import psycopg2
import pandas as pd

from io import StringIO
from dotenv import load_dotenv

load_dotenv()
db_password = os.environ.get('POSTGRES_PASSWORD')

print("loaded env")

def create_conn():
    return psycopg2.connect(
        host="localhost",
        port=5432,
        dbname="mydb",
        user="danny",
        password = db_password,
    )

def test_connection(retries=3, timeout=5):
    for attempt in range(retries):
        conn = None
        try:
            conn = psycopg2.connect(
                host="localhost",
                port=5432,
                dbname="mydb",
                user="danny",
                password=db_password,
                connect_timeout=timeout,
            )
            print("Database connection successful.")
            return True
        except psycopg2.OperationalError as e:
            print(f"Connection attempt {attempt + 1} failed: {e}")
            time.sleep(1)
        finally:
            if conn is not None:
                conn.close()
    print(f"Failed to connect to the database after {retries} retries.")
    return False

if test_connection():
    print("Connection to the database was successful.")
else:
    print("Unable to connect to the database. Exiting.")
    exit(1)

def create_table_and_schema(df, table_name):
    with create_conn() as conn:
        cur = conn.cursor()

        drop_table_sql = f"DROP TABLE IF EXISTS {table_name} CASCADE;"  # Drop table and all its dependencies
        cur.execute(drop_table_sql)

        headers = df.columns.tolist()
        first_row = df.iloc[0]
        columns = []
        primary_key = ""
        foreign_key = ""

        headers = ["product_id" if header in ["productId", "current_product_id"] else header for header in headers]
        headers = ["style_id" if header in ["styleId", "styleid"] else header for header in headers]


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

        print("inserting data")
        insert_data(df, table_name)
        conn.commit()

        cur.execute(f"SELECT * FROM {table_name} LIMIT 5")

        results = cur.fetchall()

        for row in results:
            print(row)

        conn.commit()
        cur.close()

def insert_data(chunk, table_name):
    # Prepare the data as a CSV string
    csv_buffer = StringIO()
    chunk.to_csv(csv_buffer, index=False, header=False)
    csv_data = csv_buffer.getvalue()

    # Import data
    with create_conn() as conn:
        cur = conn.cursor()
        columns = ", ".join(chunk.columns)
        cur.copy_expert(f"COPY {table_name} ({columns}) FROM STDIN WITH CSV", StringIO(csv_data))
        conn.commit()
        cur.close()

skus_file = "./db/data/skus.csv"
chunksize = 5000
column_data_types = {
    'size': str
}

total_rows = sum(1 for _ in open(skus_file, 'r', encoding='us-ascii')) - 1  # Subtract 1 to exclude header
total_chunks = (total_rows // chunksize) + 1

first_chunk = pd.read_csv(skus_file, nrows=1, encoding='us-ascii', dtype=column_data_types)

# Only create the table and schema once
create_table_and_schema(first_chunk, "skus")

for idx, chunk in enumerate(pd.read_csv(skus_file, encoding='us-ascii', chunksize=chunksize, dtype=column_data_types)):
    chunk.rename(columns={
        "productId": "product_id",
        "current_product_id": "product_id",
        "styleId": "style_id",
        "styleid": "style_id"
    }, inplace=True)

    # ... Rename headers in the loop
    chunk.drop_duplicates(subset='id', inplace=True)  # Add this line to drop duplicates based on the 'id' column

    insert_data(chunk, "skus")


    progress_percentage = ((idx + 1) / total_chunks) * 100
    print(f"Progress: {progress_percentage:.2f}% (Chunk {idx + 1}/{total_chunks})")

print("loaded csv")
