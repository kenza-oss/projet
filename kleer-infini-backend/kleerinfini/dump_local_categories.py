import sqlite3
import json

def get_category_data():
    try:
        conn = sqlite3.connect('db.sqlite3')
        cur = conn.cursor()
        
        # Get Categories
        cur.execute("SELECT id, name, image FROM products_category")
        categories = cur.fetchall()
        
        results = []
        for cid, name, image in categories:
            results.append({
                "id": cid,
                "name": name,
                "image": image
            })
            
        with open('local_category_mapping.json', 'w') as f:
            json.dump(results, f, indent=2)
            
        conn.close()
    except Exception as e:
        with open('local_category_error.txt', 'w') as f:
            f.write(str(e))

if __name__ == "__main__":
    get_category_data()
