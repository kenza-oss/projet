import sqlite3
import json

def get_local_data():
    try:
        conn = sqlite3.connect('db.sqlite3')
        cur = conn.cursor()
        
        # Product IDs
        ids = [49, 50, 64]
        
        # Get Images
        cur.execute("SELECT product_id, image FROM products_productimage WHERE product_id IN (49, 50, 64)")
        images = cur.fetchall()
        
        # Get Names for verification
        cur.execute("SELECT id, name FROM products_product WHERE id IN (49, 50, 64)")
        names = cur.fetchall()
        
        # Get Categories
        cur.execute("SELECT id, name, image FROM products_category")
        categories = cur.fetchall()
        
        result = {
            "product_images": [{"product_id": r[0], "image": r[1]} for r in images],
            "product_names": [{"id": r[0], "name": r[1]} for r in names],
            "categories": [{"id": r[0], "name": r[1], "image": r[2]} for r in categories]
        }
        
        with open('local_db_dump.json', 'w') as f:
            json.dump(result, f, indent=2)
            
        conn.close()
    except Exception as e:
        with open('local_db_error.txt', 'w') as f:
            f.write(str(e))

if __name__ == "__main__":
    get_local_data()
