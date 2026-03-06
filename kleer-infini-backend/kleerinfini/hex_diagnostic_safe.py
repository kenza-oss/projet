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

def hex_diagnostic_safe():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        cur.execute("SELECT name FROM products_product WHERE id = 64")
        name = cur.fetchone()[0]
        
        diag = []
        for char in name:
            diag.append({
                "char": char if ord(char) < 128 else "?",
                "hex": hex(ord(char))
            })
            
        with open('hex_diag.json', 'w') as f:
            json.dump(diag, f, indent=2)
            
        cur.close()
        conn.close()
    except Exception as e:
        with open('hex_diag_error.txt', 'w') as f:
            f.write(str(e))

if __name__ == "__main__":
    hex_diagnostic_safe()
