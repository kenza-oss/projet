import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "db.sqlite3")
conn = sqlite3.connect(db_path)
cur = conn.cursor()

cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'products_%'")
tables = [r[0] for r in cur.fetchall()]
print('Tables:', tables)

if 'products_productimage' in tables:
    cur.execute('PRAGMA table_info(products_productimage)')
    print('Image Schema:', [r[1] for r in cur.fetchall()])
    
    cur.execute('SELECT image FROM products_productimage LIMIT 5')
    print('Sample Images:', [r[0] for r in cur.fetchall()])
