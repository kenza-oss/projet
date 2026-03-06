import os
import psycopg2
import re
from pathlib import Path

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

CLOUDINARY_PREFIX = "https://res.cloudinary.com/dptb2m02i/image/upload/"

def clean_str(s):
    if s is None: return ""
    return str(s).replace('\x00', '').strip()

def normalize(text):
    if not text: return ""
    text = clean_str(text)
    # Basic replacements for accent/encoding issues
    text = text.replace('â€™', "'").replace('Ã©', 'e').replace('Ã ', 'a').replace('Ãª', 'e').replace('Ã®', 'i')
    # Remove all non-alphanumeric
    return re.sub(r'[^a-zA-Z0-9]', '', text).lower()

def inject_v3_direct_db():
    print("--- Starting URL Injection v3 (Direct DB Name Matching) ---")
    BASE_DIR = Path(r"C:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini")
    
    # 1. Map Filenames to Full URLs from Logs
    url_map = {} # norm_fname -> full_url
    
    def process_log(filepath):
        if not os.path.exists(filepath): return
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                if '|' in line:
                    parts = [p.strip() for p in line.split('|')]
                    if len(parts) >= 2:
                        fname_full = parts[0]
                        public_id = parts[1].strip()
                        fname_base = os.path.basename(fname_full).split('.')[0]
                        url_map[normalize(fname_base)] = f"{CLOUDINARY_PREFIX}{public_id}"

    process_log(BASE_DIR / 'upload_results.log')
    process_log(BASE_DIR / 'product_upload_results.log')
    print(f"Loaded {len(url_map)} unique image URLs from logs.")

    # 2. DB Updates
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # --- PRODUCTS ---
        print("\nInjecting Product URLs (Direct Name Match)...")
        cur.execute("SELECT id, name FROM products_product")
        db_prods = cur.fetchall()
        
        # Clear existing images
        cur.execute("DELETE FROM products_productimage")
        
        prod_upd = 0
        for p_id, p_name in db_prods:
            norm_db_pname = normalize(p_name)
            # Try to find any fname that matches the product name (fuzzy)
            for f_norm, url in url_map.items():
                if f_norm == norm_db_pname or f_norm in norm_db_pname or norm_db_pname in f_norm:
                    cur.execute("INSERT INTO products_productimage (product_id, image) VALUES (%s, %s)", (p_id, url))
                    prod_upd += 1
                    print(f"  + Linked {p_name} -> {url.split('/')[-1]}")
        
        conn.commit()
        print(f"Inserted {prod_upd} product images with full URLs.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Database error: {e}")

if __name__ == "__main__":
    inject_v3_direct_db()
