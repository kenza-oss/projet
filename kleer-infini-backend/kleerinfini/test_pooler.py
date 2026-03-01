import psycopg2
import sys

# Configuration pour le Session Mode Pooler Supabase
params = {
    "host": "aws-0-eu-central-1.pooler.supabase.com",
    "database": "postgres",
    "user": "postgres.cpuchjragjrkmbejsafy",
    "password": "7NLK2gr6SGBFf4s!",
    "port": 5432,
    "connect_timeout": 10
}

print("=" * 60)
print("Test de connexion au Supabase Connection Pooler")
print("=" * 60)
print(f"Host: {params['host']}")
print(f"Port: {params['port']}")
print(f"User: {params['user']}")
print(f"Database: {params['database']}")
print("-" * 60)

try:
    print("Tentative de connexion...")
    conn = psycopg2.connect(**params)
    print("SUCCESS! Connexion etablie avec le pooler.")
    print("-" * 60)
    
    cursor = conn.cursor()
    
    # Test 1: Informations de base
    cursor.execute("SELECT current_database(), current_user, version();")
    result = cursor.fetchone()
    print(f"Database: {result[0]}")
    print(f"User: {result[1]}")
    print(f"PostgreSQL Version: {result[2][:50]}...")
    print("-" * 60)
    
    # Test 2: Liste des tables
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)
    tables = cursor.fetchall()
    print(f"Tables disponibles ({len(tables)}):")
    for table in tables[:10]:  # Afficher les 10 premieres
        print(f"   - {table[0]}")
    if len(tables) > 10:
        print(f"   ... et {len(tables) - 10} autres tables")
    
    cursor.close()
    conn.close()
    print("-" * 60)
    print("Connexion fermee avec succes.")
    print("=" * 60)
    
except Exception as e:
    print("ECHEC de la connexion")
    print("-" * 60)
    print(f"Type d'erreur: {type(e).__name__}")
    print(f"Message: {e}")
    print("=" * 60)
    sys.exit(1)

    print("-" * 60)
    
    cursor = conn.cursor()
    
    # Test 1: Informations de base
    cursor.execute("SELECT current_database(), current_user, version();")
    result = cursor.fetchone()
    print(f"📊 Database: {result[0]}")
    print(f"👤 User: {result[1]}")
    print(f"🔧 PostgreSQL Version: {result[2][:50]}...")
    print("-" * 60)
    
    # Test 2: Liste des tables
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)
    tables = cursor.fetchall()
    print(f"📋 Tables disponibles ({len(tables)}):")
    for table in tables[:10]:  # Afficher les 10 premières
        print(f"   - {table[0]}")
    if len(tables) > 10:
        print(f"   ... et {len(tables) - 10} autres tables")
    
    cursor.close()
    conn.close()
    print("-" * 60)
    print("✅ Connexion fermée avec succès.")
    print("=" * 60)
    
except Exception as e:
    print("❌ ÉCHEC de la connexion")
    print("-" * 60)
    print(f"Type d'erreur: {type(e).__name__}")
    print(f"Message: {e}")
    print("=" * 60)
    sys.exit(1)
