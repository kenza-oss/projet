import os
import psycopg2
import json

# DB Credentials
DB_CONFIG = {
    'dbname': 'postgres',
    'user': 'postgres.cpuchjragjrkmbejsafy',
    'password': '9KGM7rj9bMDEl7b@',
    'host': 'aws-1-eu-west-1.pooler.supabase.com',
    'port': '5432'
}

def full_check():
    results = {
        "categories_with_images": [],
        "product_images": [],
        "events": []
    }
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # 1. Categories
        cur.execute("SELECT id, name, image FROM products_category WHERE image != ''")
        for row in cur.fetchall():
            results["categories_with_images"].append({"id": row[0], "name": row[1], "image": row[2]})

        # 2. Product Images
        cur.execute("""
            SELECT pi.id, p.id, p.name, pi.image 
            FROM products_productimage pi
            JOIN products_product p ON pi.product_id = p.id
        """)
        for row in cur.fetchall():
            results["product_images"].append({"id": row[0], "product_id": row[1], "product_name": row[2], "image": row[3]})

        # 3. Events details (Check fields like is_verified, end_date)
        cur.execute("SELECT id, name, is_verified, start_date, end_date FROM events_event")
        for row in cur.fetchall():
            results["events"].append({
                "id": row[0], 
                "name": row[1], 
                "is_verified": row[2], 
                "start_date": str(row[3]), 
                "end_date": str(row[4])
            })

        with open('final_verification_data.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        print(f"Data saved. Cats: {len(results['categories_with_images'])}, ProdImages: {len(results['product_images'])}, Events: {len(results['events'])}")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    full_check()
