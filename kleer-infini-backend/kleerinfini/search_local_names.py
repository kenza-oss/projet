import sqlite3
import json

def get_local_names():
    try:
        conn = sqlite3.connect('db.sqlite3')
        cur = conn.cursor()
        
        # Search for names
        cur.execute("SELECT id, name FROM products_product WHERE name LIKE '%Zellige%' OR name LIKE '%Olive%' OR name LIKE '%Savon%'")
        prods = cur.fetchall()
        
        results = []
        for pid, name in prods:
            cur.execute("SELECT image FROM products_productimage WHERE product_id = ?", (pid,))
            imgs = cur.fetchall()
            results.append({
                "id": pid,
                "name": name,
                "images": [img[0] for img in imgs]
            })
            
        with open('local_name_search.json', 'w') as f:
            json.dump(results, f, indent=2)
            
        conn.close()
    except Exception as e:
        with open('local_name_error.txt', 'w') as f:
            f.write(str(e))

if __name__ == "__main__":
    get_local_names()
