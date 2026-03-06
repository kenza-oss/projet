import os
import psycopg2
import json

# --- SANITIZE ENVIRONMENT ---
keys_to_del = [k for k in os.environ if any(ord(c) > 127 for c in k or os.environ[k])]
for k in keys_to_del: del os.environ[k]

DB_CONFIG = {
    'dbname': 'postgres',
    'user': 'postgres.cpuchjragjrkmbejsafy',
    'password': '9KGM7rj9bMDEl7b@',
    'host': 'aws-1-eu-west-1.pooler.supabase.com',
    'port': '5432'
}

def hex_diagnostic():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        cur.execute("SELECT name FROM products_product WHERE id = 64")
        name = cur.fetchone()[0]
        
        print("--- Name Hex Diagnostic ---")
        print(f"Name: {name}")
        print("Hex codes:")
        for char in name:
            print(f"'{char}': {hex(ord(char))}")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    hex_diagnostic()
