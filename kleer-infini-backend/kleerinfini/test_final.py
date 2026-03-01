import psycopg2
import sys

# Configuration exacte depuis le dashboard Supabase
params = {
    "host": "aws-1-eu-west-1.pooler.supabase.com",
    "database": "postgres",
    "user": "postgres.cpuchjragjrkmbejsafy",
    "password": "7NLK2gr6SGBFf4s!",
    "port": 5432,
    "connect_timeout": 10
}

print("=" * 70)
print("TEST DE CONNEXION SUPABASE - CONFIGURATION OFFICIELLE")
print("=" * 70)
print(f"Host: {params['host']}")
print(f"Port: {params['port']}")
print(f"User: {params['user']}")
print(f"Database: {params['database']}")
print("-" * 70)

try:
    print("Tentative de connexion...")
    conn = psycopg2.connect(**params)
    print(">>> SUCCESS! Connexion etablie avec Supabase <<<")
    print("-" * 70)
    
    cursor = conn.cursor()
    
    # Test 1: Informations de base
    cursor.execute("SELECT current_database(), current_user, version();")
    result = cursor.fetchone()
    print(f"Database: {result[0]}")
    print(f"User: {result[1]}")
    print(f"PostgreSQL Version: {result[2][:60]}...")
    print("-" * 70)
    
    # Test 2: Liste des tables
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)
    tables = cursor.fetchall()
    print(f"Tables disponibles dans la base ({len(tables)}):")
    for table in tables[:20]:
        print(f"   - {table[0]}")
    if len(tables) > 20:
        print(f"   ... et {len(tables) - 20} autres tables")
    
    print("-" * 70)
    
    # Test 3: Compter les enregistrements dans quelques tables
    if len(tables) > 0:
        print("Verification des donnees:")
        for table in tables[:5]:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table[0]};")
                count = cursor.fetchone()[0]
                print(f"   {table[0]}: {count} enregistrements")
            except Exception as e:
                print(f"   {table[0]}: Erreur - {str(e)[:50]}")
    
    cursor.close()
    conn.close()
    print("-" * 70)
    print("Connexion fermee avec succes.")
    print("=" * 70)
    print("\nPROCHAINE ETAPE:")
    print("1. Verifier les migrations Django")
    print("2. Lancer le serveur Django")
    print("3. Acceder a Django Admin")
    print("=" * 70)
    
except Exception as e:
    print("ECHEC de la connexion")
    print("-" * 70)
    print(f"Type d'erreur: {type(e).__name__}")
    print(f"Message: {e}")
    print("=" * 70)
    sys.exit(1)
