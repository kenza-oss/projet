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

def clean_str(s):
    if s is None: return ""
    return str(s).replace('\x00', '').strip()

def normalize(text):
    if not text: return ""
    text = clean_str(text)
    text = text.replace('â€™', "'").replace('Ã©', 'e').replace('Ã ', 'a').replace('Ãª', 'e')
    return re.sub(r'[^a-zA-Z0-9]', '', text).lower()

def inject_v5_filename_pivot():
    print("--- Starting URL Injection v5 (Filename Pivot) ---")
    BASE_DIR = Path(r"C:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini")
    
    # 1. Map Filenames to Full URLs from Logs
    fname_to_url = {}
    def process_log(filepath):
        if not os.path.exists(filepath): return
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                if '|' in line:
                    parts = [p.strip() for p in line.split('|')]
                    if len(parts) >= 2:
                        raw_fname = os.path.basename(parts[0]).split('.')[0]
                        fname_to_url[normalize(raw_fname)] = f"{CLOUDINARY_PREFIX}{parts[1].strip()}"
    process_log(BASE_DIR / 'upload_results.log')
    process_log(BASE_DIR / 'product_upload_results.log')
    print(f"Loaded {len(fname_to_url)} URLs from logs.")

    # 2. Map Normalized Name -> DB ID
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute("SELECT id, name FROM products_product")
        name_to_id = {normalize(row[1]): row[0] for row in cur.fetchall()}
        
        # 3. Use JSON to link Filename -> Product Name -> DB ID
        updates = 0
        cur.execute("DELETE FROM products_productimage")
        
        with open(BASE_DIR / 'products_api_ps.json', 'rb') as f:
            content = f.read()
            try: data = json.loads(content.decode('utf-16'))
            except: data = json.loads(content.decode('utf-8', errors='ignore'))
            
            for item in data.get('value', []):
                pname = item.get('name')
                p_id = name_to_id.get(normalize(pname))
                if not p_id: continue
                
                imgs = item.get('images', [])
                if not imgs and 'image' in item: imgs = [item['image']]
                
                for img in imgs:
                    local_url = img if isinstance(img, str) else img.get('image')
                    if local_url:
                        fn_norm = normalize(os.path.basename(local_url).split('.')[0])
                        c_url = fname_to_url.get(fn_norm)
                        if c_url:
                            cur.execute("INSERT INTO products_productimage (product_id, image) VALUES (%s, %s)", (p_id, c_url))
                            updates += 1
                            print(f"  + Match: {pname} -> {c_url.split('/')[-1]}")
        
        conn.commit()
        print(f"Total: {updates} product images linked.")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Database error: {e}")

if __name__ == "__main__":
    inject_v5_filename_pivot()
