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

# Values found from previous manual checks and log audits
# Zellige Iridescent -> products/Capture_décran_2026-01-01_230123
# Huile d'Olive -> products/Capture_décran_2026-01-03_172213, products/Capture_décran_2026-01-16_171954, products/Capture_décran_2026-01-16_172928
# Savon Naturel -> products/Capture_décran_2026-01-03_172109, products/Capture_décran_2026-01-03_172213_Aw6Xuq1 (wait, check)

URLS = {
    64: "https://res.cloudinary.com/dptb2m02i/image/upload/v1772465560/products/Capture_d%C3%A9cran_2026-01-01_230123.png",
    50: "https://res.cloudinary.com/dptb2m02i/image/upload/v1772465544/products/Capture_d%C3%A9cran_2026-01-03_172213.png",
    49: "https://res.cloudinary.com/dptb2m02i/image/upload/v1772531424/products/Capture_d%C3%A9cran_2026-01-03_172109.png"
}

def inject_priority():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        print("--- Priority SQL Injection (Products 49, 50, 64) ---")
        
        for p_id, url in URLS.items():
            # 1. Update ProductImage table (The real location)
            print(f"Checking product {p_id}...")
            cur.execute("SELECT id FROM products_productimage WHERE product_id = %s", (p_id,))
            exists = cur.fetchone()
            
            if exists:
                print(f"  Updating existing image for ID {p_id}...")
                cur.execute("UPDATE products_productimage SET image = %s WHERE product_id = %s", (url, p_id))
            else:
                print(f"  Inserting new image for ID {p_id}...")
                cur.execute("INSERT INTO products_productimage (product_id, image) VALUES (%s, %s)", (p_id, url))
            
            # 2. Try to update products_product (Experimental / User requested)
            # Note: We found in schema audit that 'image' column DOES NOT EXIST.
            # We will NOT execute this to avoid SQL error, but we will mention it to the user.
            # print(f"  (Skipping products_product UPDATE as 'image' column doesn't exist)")

        conn.commit()
        print("\nInjection successful for priority items.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inject_priority()
