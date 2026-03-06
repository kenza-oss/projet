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

def normalize_lenient(text):
    if not text: return ""
    text = str(text).replace('\x00', '').strip().lower()
    # Remove common mangled patterns
    text = text.replace('â€™', "").replace('ã©', 'e').replace('ã ', 'a').replace('ãª', 'e')
    text = text.replace('â', "").replace('ã', 'a').replace('©', 'e').replace('ª', 'e').replace('®', 'i').replace('ã®', 'i')
    # Remove all non-alphanumeric for maximal matching
    return re.sub(r'[^a-z0-9]', '', text)

def final_id_sync_v7():
    print("--- Starting Final URL Injection v7 (ID-based mapping) ---")
    BASE_DIR = Path(r"C:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini")
    
    # 1. Load Real DB IDs
    try:
        with open('db_product_ids.json', 'r', encoding='utf-8') as f:
            db_prods = json.load(f)
    except Exception as e:
        print(f"Error loading db_product_ids.json: {e}")
        return

    # 2. Map Filenames to Full URLs from Logs
    url_map = {} # norm_fname -> full_url
    def process_log(filepath):
        if not os.path.exists(filepath): return
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                if '|' in line:
                    parts = [p.strip() for p in line.split('|')]
                    if len(parts) >= 2:
                        fname_base = os.path.basename(parts[0]).split('.')[0]
                        url_map[normalize_lenient(fname_base)] = f"{CLOUDINARY_PREFIX}{parts[1].strip()}"
    process_log(BASE_DIR / 'upload_results.log')
    process_log(BASE_DIR / 'product_upload_results.log')
    print(f"Loaded {len(url_map)} unique URLs from logs.")

    # 3. Extract Mapping from Local JSON
    # Local Name -> Filenames
    local_name_to_fnames = {}
    try:
        with open(BASE_DIR / 'products_api_ps.json', 'rb') as f:
            content = f.read()
            try: data = json.loads(content.decode('utf-16'))
            except: data = json.loads(content.decode('utf-8', errors='ignore'))
            for item in data.get('value', []):
                lname_norm = normalize_lenient(item['name'])
                imgs = item.get('images', [])
                if not imgs and 'image' in item: imgs = [item['image']]
                fnames = []
                for img in imgs:
                    local_url = img if isinstance(img, str) else img.get('image')
                    if local_url:
                        fnames.append(normalize_lenient(os.path.basename(local_url).split('.')[0]))
                local_name_to_fnames[lname_norm] = fnames
    except Exception as e:
        print(f"Error loading JSON: {e}")

    # 4. DB Updates
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Clear existing images
        cur.execute("DELETE FROM products_productimage")
        
        updates = 0
        for dbp in db_prods:
            db_id = dbp['id']
            db_name = dbp['name']
            norm_db_name = normalize_lenient(db_name)
            
            # Find matching local filenames
            matched_fnames = local_name_to_fnames.get(norm_db_name, [])
            
            # Handle slight mismatches in normalization for the specific products
            if not matched_fnames:
                for lname_norm, fnames in local_name_to_fnames.items():
                    if lname_norm == norm_db_name or (len(lname_norm) > 10 and lname_norm in norm_db_name) or (len(norm_db_name) > 10 and norm_db_name in lname_norm):
                        matched_fnames = fnames
                        break
            
            if matched_fnames:
                for fn in matched_fnames:
                    url = url_map.get(fn)
                    if url:
                        cur.execute("INSERT INTO products_productimage (product_id, image) VALUES (%s, %s)", (db_id, url))
                        updates += 1
                        print(f"  + SUCCESS: ID {db_id} ({db_name[:30]}...) -> {url.split('/')[-1]}")
            else:
                print(f"  - NO MATCH for ID {db_id}: {db_name}")

        conn.commit()
        print(f"\nFinished: {updates} product images linked.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Database error: {e}")

if __name__ == "__main__":
    final_id_sync_v7()
