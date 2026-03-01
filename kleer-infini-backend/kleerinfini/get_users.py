import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "db.sqlite3")
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Get tables that look like user tables
cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r[0] for r in cur.fetchall()]

print("ALL TABLES:")
for t in tables:
    if "user" in t.lower() or "auth" in t.lower() or "account" in t.lower() or "client" in t.lower() or "producer" in t.lower():
        print(t)
        
        try:
            cur.execute(f"PRAGMA table_info({t})")
            columns = [r[1] for r in cur.fetchall()]
            if 'email' in columns:
                print(f"  -> Found email in {t}")
                if 'role' in columns:
                    cur.execute(f"SELECT email, role FROM {t} WHERE role IN ('client', 'producer')")
                    rows = cur.fetchall()
                    for r in rows:
                         print(f"      {r[1]}: {r[0]}")
                else:
                    cur.execute(f"SELECT email FROM {t} LIMIT 5")
                    for r in cur.fetchall():
                         print(f"      {r[0]}")
        except:
             pass
