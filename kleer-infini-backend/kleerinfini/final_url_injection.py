import os
import json
import psycopg2
import re
from pathlib import Path

# --- SANITIZE ENVIRONMENT ---
keys_to_del = [k for k in os.environ if any(ord(c) > 127 for c in k or os.environ[k])]
for k in keys_to_del: del os.environ[k]

# DB Credentials
DB_CONFIG = {
    'dbname': 'postgres',
    'user': 'postgres.cpuchjragjrkmbejsafy',
    'password': '9KGM7rj9bMDEl7b@',
    'host': 'aws-1-eu-west-1.pooler.supabase.com',
    'port': '5432'
}

# Cloudinary Base URL (Adjust prefix if needed, usually https://res.cloudinary.com/<cloud_name>/image/upload/)
CLOUDINARY_PREFIX = "https://res.cloudinary.com/dptb2m02i/image/upload/"

def clean_str(s):
    if s is None: return ""
    return str(s).replace('\x00', '').strip()

def normalize(text):
    if not text: return ""
    text = clean_str(text)
    text = text.replace('â€™', "'").replace('Ã©', 'e').replace('Ã ', 'a').replace('Ãª', 'e')
    return re.sub(r'[^a-zA-Z0-9]', '', text).lower()

def inject_full_urls():
    print("--- Starting Massive URL Injection (Full https://... URLs) ---")
    BASE_DIR = Path(r"C:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini")
    
    # 1. Map Filenames to Full URLs from Logs
    url_map = {}
    
    def process_log(filepath):
        if not os.path.exists(filepath): return
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                if '|' in line:
                    parts = [p.strip() for p in line.split('|')]
                    if len(parts) >= 2:
                        fname_base = parts[0].split('.')[0]
                        public_id = clean_str(parts[1])
                        # If the log already has a double 'categories/categories/...' we fix it
                        full_url = f"{CLOUDINARY_PREFIX}{public_id}"
                        url_map[normalize(fname_base)] = full_url

    process_log(BASE_DIR / 'upload_results.log')
    process_log(BASE_DIR / 'product_upload_results.log')
    print(f"Loaded {len(url_map)} unique image URLs from logs.")

    # 2. Load Metadata for Matching
    cat_local_to_name = {}
    try:
        with open(BASE_DIR / 'categories_dump.json', 'rb') as f:
            d = json.loads(f.read().decode('utf-16', errors='ignore'))
            for item in d:
                if item.get('image_url'):
                    fname_base = os.path.basename(item['image_url']).split('.')[0]
                    cat_local_to_name[normalize(fname_base)] = normalize(item['name'])
    except: pass

    prod_local_to_pnames = {}
    try:
        with open(BASE_DIR / 'products_api_ps.json', 'rb') as f:
            content = f.read()
            try: data = json.loads(content.decode('utf-16'))
            except: data = json.loads(content.decode('utf-8', errors='ignore'))
            for item in data.get('value', []):
                pname_norm = normalize(item['name'])
                imgs = item.get('images', [])
                if not imgs and 'image' in item: imgs = [item['image']]
                for img in imgs:
                    url = img if isinstance(img, str) else img.get('image')
                    if url:
                        fname_base = os.path.basename(url).split('.')[0]
                        fn_norm = normalize(fname_base)
                        if fn_norm not in prod_local_to_pnames: prod_local_to_pnames[fn_norm] = []
                        prod_local_to_pnames[fn_norm].append(pname_norm)
    except: pass

    # 3. DB Updates
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # --- CATEGORIES ---
        print("\nInjecting Category URLs...")
        cur.execute("SELECT id, name FROM products_category")
        db_cats = cur.fetchall()
        cat_upd = 0
        for db_id, db_name in db_cats:
            db_name_norm = normalize(db_name)
            match_url = None
            for f_norm, url in url_map.items():
                if f_norm == db_name_norm or f_norm in db_name_norm or db_name_norm in f_norm:
                    match_url = url
                    break
                if cat_local_to_name.get(f_norm) == db_name_norm:
                    match_url = url
                    break
            
            if match_url:
                cur.execute("UPDATE products_category SET image = %s WHERE id = %s", (match_url, db_id))
                cat_upd += 1
        print(f"Updated {cat_upd} categories with full URLs.")

        # --- PRODUCT IMAGES ---
        print("\nInjecting Product Image URLs...")
        cur.execute("SELECT id, name FROM products_product")
        db_prods = cur.fetchall()
        prod_upd = 0
        
        # Clear existing images to ensure fresh full URLs
        cur.execute("DELETE FROM products_productimage")
        
        for p_id, p_name in db_prods:
            db_pname_norm = normalize(p_name)
            for f_norm, url in url_map.items():
                targeted_pnames = prod_local_to_pnames.get(f_norm, [])
                if any(tp == db_pname_norm or tp in db_pname_norm or db_pname_norm in tp for tp in targeted_pnames):
                    cur.execute("INSERT INTO products_productimage (product_id, image) VALUES (%s, %s)", (p_id, url))
                    prod_upd += 1
        
        conn.commit()
        print(f"Inserted {prod_upd} product images with full URLs.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Database error: {e}")

if __name__ == "__main__":
    inject_full_urls()
