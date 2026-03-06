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
    text = text.replace('â€™', "'").replace('Ã©', 'e').replace('Ã ', 'a').replace('Ãª', 'e').replace('Ã®', 'i')
    return re.sub(r'[^a-zA-Z0-9]', '', text).lower()

def inject_v4_id_based():
    print("--- Starting URL Injection v4 (ID-based mapping from JSON) ---")
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

    # 2. Map JSON Product ID -> Cloudinary URLs
    jid_to_urls = {}
    try:
        with open(BASE_DIR / 'products_api_ps.json', 'rb') as f:
            content = f.read()
            try: data = json.loads(content.decode('utf-16'))
            except: data = json.loads(content.decode('utf-8', errors='ignore'))
            for item in data.get('value', []):
                jid = item.get('id')
                imgs = item.get('images', [])
                if not imgs and 'image' in item: imgs = [item['image']]
                urls = []
                for img in imgs:
                    local_url = img if isinstance(img, str) else img.get('image')
                    if local_url:
                        fname_base = os.path.basename(local_url).split('.')[0]
                        c_url = url_map.get(normalize(fname_base))
                        if c_url: urls.append(c_url)
                if urls: jid_to_urls[jid] = urls
    except Exception as e:
        print(f"Error loading JSON: {e}")

    # 3. DB Updates
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Clear existing images
        cur.execute("DELETE FROM products_productimage")
        
        # We need to map JSON ID to DB ID using the name
        cur.execute("SELECT id, name FROM products_product")
        db_prods = cur.fetchall()
        
        # Re-load JSON for name mapping
        name_to_jid = {}
        with open(BASE_DIR / 'products_api_ps.json', 'rb') as f:
            content = f.read()
            try: data = json.loads(content.decode('utf-16'))
            except: data = json.loads(content.decode('utf-8', errors='ignore'))
            for item in data.get('value', []):
                name_to_jid[normalize(item['name'])] = item['id']

        prod_upd = 0
        for p_id, p_name in db_prods:
            jid = name_to_jid.get(normalize(p_name))
            if jid and jid in jid_to_urls:
                for url in jid_to_urls[jid]:
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
    inject_v4_id_based()
