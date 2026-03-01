import psycopg2
import sys

params = {
    "host": "cpuchjragjrkmbejsafy.supabase.co",
    "database": "postgres",
    "user": "postgres",
    "password": "7NLK2gr6SGBFf4s!",
    "port": 5432,
    "connect_timeout": 10
}

print(f"Testing connection to {params['host']}:{params['port']}...")
try:
    conn = psycopg2.connect(**params)
    print("SUCCESS! Connection established.")
    cursor = conn.cursor()
    cursor.execute("SELECT current_database(), current_user;")
    result = cursor.fetchone()
    print(f"Database: {result[0]}, User: {result[1]}")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"FAILED: {type(e).__name__}: {e}")
    sys.exit(1)
