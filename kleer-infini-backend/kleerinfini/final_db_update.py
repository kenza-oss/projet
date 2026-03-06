import os
import sys
import json
import psycopg2
from pathlib import Path

# --- CRITICAL: SANITIZE ENVIRONMENT TO AVOID UNICODE ERROR ---
def sanitize_env():
    for key in list(os.environ.keys()):
        try:
            os.environ[key].encode('utf-8')
        except UnicodeEncodeError:
            print(f"Sanitizing env var: {key}")
            del os.environ[key]

sanitize_env()

# DB Credentials (from .env)
DB_CONFIG = {
    'dbname': 'postgres',
    'user': 'postgres.cpuchjragjrkmbejsafy',
    'password': '9KGM7rj9bMDEl7b@',
    'host': 'aws-1-eu-west-1.pooler.supabase.com',
    'port': '5432'
}

BASE_DIR = Path(r"C:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini")

def parse_log(filepath):
    mapping = {}
    if not os.path.exists(filepath):
        print(f"Log not found: {filepath}")
        return mapping
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            if '|' in line:
                parts = [p.strip() for p in line.split('|')]
                if len(parts) >= 2:
                    filename = parts[0]
                    public_id = parts[1]
                    mapping[filename] = public_id
    return mapping

def update_db():
    print("--- Starting Final DB Update ---")
    
    # 1. Load mappings from JSON to match Filename -> Model Instance
    print("Loading JSON data dumps for mapping...")
    cat_map = {} # filename -> cat name
    try:
        with open(BASE_DIR / 'categories_dump.json', 'rb') as f:
            content = f.read()
            try:
                data = json.loads(content.decode('utf-16'))
            except:
                data = json.loads(content.decode('utf-8', errors='ignore'))
            for item in data:
                if item.get('image_url'):
                    fname = os.path.basename(item['image_url'])
                    cat_map[fname] = item['name']
    except Exception as e:
        print(f"Error loading categories_dump: {e}")

    prod_map = {} # filename -> list of product names
    try:
        with open(BASE_DIR / 'products_api_ps.json', 'rb') as f:
            content = f.read()
            try:
                data = json.loads(content.decode('utf-16'))
            except:
                data = json.loads(content.decode('utf-8', errors='ignore'))
            
            items = data.get('value', [])
            for item in items:
                pname = item.get('name')
                imgs = item.get('images', [])
                if not imgs and 'image' in item:
                    imgs = [item['image']] if isinstance(item['image'], str) else item['image']
                
                for img_data in imgs:
                    url = img_data if isinstance(img_data, str) else img_data.get('image')
                    if url:
                        fname = os.path.basename(url)
                        if fname not in prod_map: prod_map[fname] = []
                        prod_map[fname].append(pname)
    except Exception as e:
        print(f"Error loading products_api_ps: {e}")

    # 2. Load Cloudinary Public IDs from logs
    cat_cloudinary = parse_log(BASE_DIR / 'upload_results.log')
    prod_cloudinary = parse_log(BASE_DIR / 'product_upload_results.log')

    # 3. Connect to Postgres
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        print("Connected to PostgreSQL successfully.")

        # Sync Categories
        print("\nUpdating Categories...")
        cat_updated = 0
        for filename, public_id in cat_cloudinary.items():
            cat_name = cat_map.get(filename)
            if cat_name:
                cur.execute("UPDATE products_category SET image = %s WHERE name = %s", (public_id, cat_name))
                if cur.rowcount > 0:
                    cat_updated += 1
                    # print(f"  Updated Category: {cat_name}")
        print(f"Finished: {cat_updated} categories updated.")

        # Sync Products
        print("\nUpdating Products (ProductImage records)...")
        prod_img_updated = 0
        for filename, public_id in prod_cloudinary.items():
            product_names = prod_map.get(filename, [])
            for pname in product_names:
                # Find product id
                cur.execute("SELECT id FROM products_product WHERE name = %s", (pname,))
                p_row = cur.fetchone()
                if p_row:
                    pid = p_row[0]
                    # Check if this image already exists in products_productimage
                    cur.execute("SELECT id FROM products_productimage WHERE product_id = %s AND image = %s", (pid, public_id))
                    if not cur.fetchone():
                        cur.execute("INSERT INTO products_productimage (product_id, image) VALUES (%s, %s)", (pid, public_id))
                        prod_img_updated += 1
                        # print(f"  Added image for Product: {pname}")
        
        conn.commit()
        print(f"Finished: {prod_img_updated} product images linked.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Database error: {e}")

if __name__ == "__main__":
    update_db()
