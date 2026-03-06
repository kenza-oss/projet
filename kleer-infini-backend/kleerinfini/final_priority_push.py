import os
import psycopg2

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

# Verified authentic product images from JSON/Logs (Not screenshots)
FINAL_URLS = {
    64: "https://res.cloudinary.com/dptb2m02i/image/upload/products_images/ugxttkuwz2rgvi8gx4wm.png", # Zellige
    50: "https://res.cloudinary.com/dptb2m02i/image/upload/products_images/awmjttzdupnhpvup05ro.png"  # Huile d'Olive
}

def final_push():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        print("--- Final Priority Injection (IDs 50, 64) ---")
        
        for pid, url in FINAL_URLS.items():
            # 1. Verification of the name
            cur.execute("SELECT name FROM products_product WHERE id = %s", (pid,))
            name = cur.fetchone()
            if not name:
                print(f"Product {pid} not found in DB!")
                continue
            
            # 2. Update Image (SQL Double Injection)
            cur.execute("SELECT id FROM products_productimage WHERE product_id = %s", (pid,))
            img_row = cur.fetchone()
            if img_row:
                cur.execute("UPDATE products_productimage SET image = %s WHERE product_id = %s", (url, pid))
            else:
                cur.execute("INSERT INTO products_productimage (product_id, image) VALUES (%s, %s)", (pid, url))
            
            print(f"  + Product {pid} ('{name[0]}'): Image set to verified Cloudinary URL.")

        conn.commit()
        print("\nInjection complete.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    final_push()
