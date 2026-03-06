import os
import json
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

def normalize(text):
    if not text: return ""
    # Remove nulls, strip, lower, keep only alpha-numeric
    text = str(text).replace('\x00', '').strip().lower()
    # Handle common encoding artifacts in your data
    text = text.replace('â€™', "'").replace('ã©', 'e').replace('ã ', 'a').replace('ãª', 'e')
    text = text.replace('â', '').replace('ã', 'a').replace('©', 'e').replace('ª', 'e').replace('®', 'i')
    return re.sub(r'[^a-z0-9]', '', text)

def inject_v6_ultra_robust():
    print("--- Starting URL Injection v6 (Ultra Robust) ---")
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
                        fname_base = os.path.basename(parts[0]).split('.')[0]
                        url_map[normalize(fname_base)] = f"{CLOUDINARY_PREFIX}{parts[1].strip()}"
    process_log(BASE_DIR / 'upload_results.log')
    process_log(BASE_DIR / 'product_upload_results.log')
    print(f"Loaded {len(url_map)} unique URLs from logs.")

    # 2. Extract Mapping Data from JSON
    # We want Filename -> Product Name (Normalized)
    fname_to_pnames = {}
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
                    local_url = img if isinstance(img, str) else img.get('image')
                    if local_url:
                        fn_norm = normalize(os.path.basename(local_url).split('.')[0])
                        if fn_norm not in fname_to_pnames: fname_to_pnames[fn_norm] = []
                        fname_to_pnames[fn_norm].append(pname_norm)
    except Exception as e:
        print(f"Error loading JSON: {e}")

    # 3. DB Updates
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        cur.execute("SELECT id, name FROM products_product")
        db_prods = cur.fetchall()
        
        # Clear existing product images
        cur.execute("DELETE FROM products_productimage")
        
        prod_upd = 0
        linked_urls = set()

        for p_id, p_name in db_prods:
            db_pname_norm = normalize(p_name)
            
            # METHOD 1: Filename matches Product Name directly (e.g., Zellige.jpg -> Zellige)
            for f_norm, url in url_map.items():
                if f_norm == db_pname_norm or (len(f_norm) > 5 and f_norm in db_pname_norm) or (len(db_pname_norm) > 5 and db_pname_norm in f_norm):
                    # Check if already added for this product
                    cur.execute("SELECT COUNT(*) FROM products_productimage WHERE product_id = %s AND image = %s", (p_id, url))
                    if cur.fetchone()[0] == 0:
                        cur.execute("INSERT INTO products_productimage (product_id, image) VALUES (%s, %s)", (p_id, url))
                        prod_upd += 1
                        linked_urls.add(url)
                        print(f"  + Method 1 Link: {p_name} -> {url.split('/')[-1]}")

            # METHOD 2: Using JSON metadata as bridge
            for f_norm, url in url_map.items():
                if url in linked_urls: continue # Avoid duplicates if Method 1 caught it
                target_pnames = fname_to_pnames.get(f_norm, [])
                if any(tp == db_pname_norm or (len(tp) > 5 and tp in db_pname_norm) for tp in target_pnames):
                    cur.execute("INSERT INTO products_productimage (product_id, image) VALUES (%s, %s)", (p_id, url))
                    prod_upd += 1
                    linked_urls.add(url)
                    print(f"  + Method 2 Link: {p_name} -> {url.split('/')[-1]}")
        
        conn.commit()
        print(f"Inserted {prod_upd} product images with full URLs.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Database error: {e}")

if __name__ == "__main__":
    inject_v6_ultra_robust()
