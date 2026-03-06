import os
import psycopg2
import re

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

# --- PRIORITY URLS (Directly from logs) ---
PRIORITY_URLS = {
    64: "https://res.cloudinary.com/dptb2m02i/image/upload/v1772465560/products/Capture_d%C3%A9cran_2026-01-01_230123.png",
    50: "https://res.cloudinary.com/dptb2m02i/image/upload/v1772465544/products/Capture_d%C3%A9cran_2026-01-03_172213.png",
    49: "https://res.cloudinary.com/dptb2m02i/image/upload/v1772531424/products/Capture_d%C3%A9cran_2026-01-03_172109.png"
}

# --- UNICODE CORRECTIONS ---
# Pattern mapping for common mangled sequences
CORRECTIONS = {
    "â€™": "'",
    "Ã©": "é",
    "Ã ": "à",
    "Ãª": "ê",
    "Ã®": "î",
    "Ã´": "ô",
    "Ã»": "û",
    "Ã": "à", # Fallback for single char mangling
    "â": "",   # Fallback for trash chars
}

def fix_text(text):
    if not text: return ""
    for mangled, fixed in CORRECTIONS.items():
        text = text.replace(mangled, fixed)
    return text

def execute_cleanup_and_injection():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        print("--- Step 1: Cleaning Unicode for Categories ---")
        cur.execute("SELECT id, name FROM products_category")
        cats = cur.fetchall()
        for cid, name in cats:
            new_name = fix_text(name)
            if new_name != name:
                cur.execute("UPDATE products_category SET name = %s WHERE id = %s", (new_name, cid))
                print(f"  Fixed Category {cid}: {name} -> {new_name}")

        print("\n--- Step 2: Cleaning Unicode for Products ---")
        cur.execute("SELECT id, name FROM products_product")
        prods = cur.fetchall()
        for pid, name in prods:
            new_name = fix_text(name)
            if new_name != name:
                cur.execute("UPDATE products_product SET name = %s WHERE id = %s", (new_name, pid))
                print(f"  Fixed Product {pid}: {name} -> {new_name}")

        print("\n--- Step 3: Direct SQL Injection for Priority Products ---")
        for pid, url in PRIORITY_URLS.items():
            # Check if entry exists in products_productimage
            cur.execute("SELECT id FROM products_productimage WHERE product_id = %s", (pid,))
            row = cur.fetchone()
            if row:
                cur.execute("UPDATE products_productimage SET image = %s WHERE product_id = %s", (url, pid))
                print(f"  Updated ID {pid} with URL {url}")
            else:
                cur.execute("INSERT INTO products_productimage (product_id, image) VALUES (%s, %s)", (pid, url))
                print(f"  Inserted ID {pid} with URL {url}")

        conn.commit()
        print("\n--- Success: Database Cleaned and Priority URLs Injected ---")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error during execution: {e}")

if __name__ == "__main__":
    execute_cleanup_and_injection()
