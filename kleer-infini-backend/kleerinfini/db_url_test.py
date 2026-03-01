import dns_patch
import psycopg2
import sys

# Using the URL format to see if it handles the '!' better
url = "postgresql://postgres.cpuchjragjrkmbejsafy:7NLK2gr6SGBFf4s%21@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require"

print(f"Testing connection with URL and DNS patch...")

try:
    conn = psycopg2.connect(url, connect_timeout=10)
    print("✅ SUCCESS with URL!")
    conn.close()
    sys.exit(0)
except Exception as e:
    print(f"❌ Failed with URL: {e}")

# Try without prefix in URL but with port 5432
url2 = "postgresql://postgres:7NLK2gr6SGBFf4s%21@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require"
try:
    print("Testing URL without prefix...")
    conn = psycopg2.connect(url2, connect_timeout=10)
    print("✅ SUCCESS with URL (no prefix)!")
    conn.close()
    sys.exit(0)
except Exception as e:
    print(f"❌ Failed with URL (no prefix): {e}")

# Try Transaction port 6543 with prefix
url3 = "postgresql://postgres.cpuchjragjrkmbejsafy:7NLK2gr6SGBFf4s%21@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require"
try:
    print("Testing URL with Transaction port 6543...")
    conn = psycopg2.connect(url3, connect_timeout=10)
    print("✅ SUCCESS for URL (6543)!")
    conn.close()
    sys.exit(0)
except Exception as e:
    print(f"❌ Failed with URL (6543): {e}")
