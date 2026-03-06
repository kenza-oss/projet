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

def full_audit():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        results = {
            "categories": [],
            "products_sample": [],
            "events_count": 0,
            "verified_events": 0
        }

        # Categories
        cur.execute("SELECT id, name, image FROM products_category")
        for row in cur.fetchall():
            results["categories"].append({"id": row[0], "name": row[1], "image": row[2]})

        # Events
        cur.execute("SELECT count(*) FROM events_event")
        results["events_count"] = cur.fetchone()[0]
        cur.execute("SELECT count(*) FROM events_event WHERE is_verified = True")
        results["verified_events"] = cur.fetchone()[0]

        # Samples of products
        cur.execute("SELECT id, name FROM products_product LIMIT 100")
        for row in cur.fetchall():
            results["products_sample"].append({"id": row[0], "name": row[1]})

        with open('live_db_audit.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        print("Audit saved to live_db_audit.json")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    full_audit()
