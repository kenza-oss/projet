import os
import psycopg2
import json

# --- SANITIZE ENVIRONMENT ---
os.environ["PYTHONIOENCODING"] = "utf-8"

DB_CONFIG = {
    'dbname': 'postgres',
    'user': 'postgres.cpuchjragjrkmbejsafy',
    'password': '9KGM7rj9bMDEl7b@',
    'host': 'aws-1-eu-west-1.pooler.supabase.com',
    'port': '5432'
}

def sync_category_images():
    try:
        with open('category_name_to_file.json', 'r') as f:
            mapping = json.load(f)
            
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        print("--- Syncing Category Images (Local-Style) ---")
        
        # Get all categories from production
        cur.execute("SELECT id, name FROM products_category")
        prod_categories = cur.fetchall()
        
        count = 0
        for cid, name in prod_categories:
            # Match by name (exact match from mapping)
            filename = mapping.get(name)
            if filename:
                # Construct Cloudinary URL
                # If it's a screenshot, it likely needs .png, otherwise it might be .jpg or other.
                # However, our previous list showed categories/vya-naturals... .jpg
                # Let's try to detect if it's a screenshot (Capture_d)
                if "Capture_d" in filename:
                    url = f"https://res.cloudinary.com/dptb2m02i/image/upload/categories/{filename}.png"
                else:
                    url = f"https://res.cloudinary.com/dptb2m02i/image/upload/categories/{filename}.jpg"
                
                cur.execute("UPDATE products_category SET image = %s WHERE id = %s", (url, cid))
                count += 1
        
        conn.commit()
        cur.close()
        conn.close()
        print(f"Successfully updated image URLs for {count} categories.")
        
    except Exception as e:
        print(f"Error syncing category images: {e}")

if __name__ == "__main__":
    sync_category_images()
