import psycopg2
import sys
import socket

host = "db.cpuchjragjrkmbejsafy.supabase.co"
try:
    ip = socket.gethostbyname(host)
    print(f"Hostname {host} resolved to {ip}")
except Exception as e:
    print(f"FAILED to resolve {host}: {e}")
    ip = None

params = {
    "host": host,
    "database": "postgres",
    "user": "postgres",
    "password": "7NLK2gr6SGBFf4s!",
    "port": 5432,
    "connect_timeout": 10
}

print(f"Testing direct connection to {host}...")
try:
    conn = psycopg2.connect(**params)
    print("SUCCESS!")
    conn.close()
except Exception as e:
    print(f"FAILED: {type(e).__name__}: {e}")

print("\nTrying pooler host with full user prefix...")
pooler_host = "aws-0-eu-central-1.pooler.supabase.com"
params["host"] = pooler_host
params["user"] = "postgres.cpuchjragjrkmbejsafy"
try:
    print(f"Testing connection to {pooler_host}...")
    conn = psycopg2.connect(**params)
    print("SUCCESS (via pooler)!")
    conn.close()
except Exception as e:
    print(f"FAILED (via pooler): {type(e).__name__}: {e}")
