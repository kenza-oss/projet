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

def final_verify():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        cur.execute("""
            SELECT p.id, p.name, p.description, p.category_id, c.name, pi.image
            FROM products_product p
            JOIN products_category c ON p.category_id = c.id
            LEFT JOIN products_productimage pi ON p.id = pi.product_id
            WHERE p.id = 64
        """)
        row = cur.fetchone()
        
        if row:
            res = {
                "id": row[0],
                "name": row[1],
                "description": row[2][:100] + "...",
                "category_id": row[3],
                "category_name": row[4],
                "image_path": row[5]
            }
            with open('final_verification.json', 'w', encoding='utf-8') as f:
                json.dump(res, f, indent=2, ensure_ascii=False)
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    final_verify()
