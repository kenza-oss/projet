import psycopg2
import sys

# Configuration pour connexion directe IPv6 avec encodage correct
params = {
    "host": "db.cpuchjragjrkmbejsafy.supabase.co",
    "database": "postgres",
    "user": "postgres",
    "password": "7NLK2gr6SGBFf4s!",
    "port": 5432,
    "connect_timeout": 10,
    "client_encoding": "UTF8"
}

print("=" * 60)
print("Test de connexion directe IPv6 Supabase")
print("=" * 60)
print(f"Host: {params['host']}")
print(f"Port: {params['port']}")
print(f"User: {params['user']}")
print(f"Database: {params['database']}")
print(f"Encoding: {params['client_encoding']}")
print("-" * 60)

try:
    print("Tentative de connexion...")
    conn = psycopg2.connect(**params)
    print("SUCCESS! Connexion etablie.")
    print("-" * 60)
    
    cursor = conn.cursor()
    
    # Test 1: Informations de base
    cursor.execute("SELECT current_database(), current_user, version();")
    result = cursor.fetchone()
    print(f"Database: {result[0]}")
    print(f"User: {result[1]}")
    print(f"PostgreSQL Version: {result[2][:60]}...")
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
    for table in tables[:15]:
        print(f"   - {table[0]}")
    if len(tables) > 15:
        print(f"   ... et {len(tables) - 15} autres tables")
    
    print("-" * 60)
    
    # Test 3: Compter les enregistrements dans quelques tables
    if len(tables) > 0:
        print("Verification des donnees:")
        for table in tables[:3]:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table[0]};")
                count = cursor.fetchone()[0]
                print(f"   {table[0]}: {count} enregistrements")
            except Exception as e:
                print(f"   {table[0]}: Erreur - {str(e)[:50]}")
    
    cursor.close()
    conn.close()
    print("-" * 60)
    print("Connexion fermee avec succes.")
    print("=" * 60)
    print("\nCONFIGURATION A UTILISER DANS .env:")
    print("DB_HOST=db.cpuchjragjrkmbejsafy.supabase.co")
    print("DB_PORT=5432")
    print("DB_USER=postgres")
    print("=" * 60)
    
except Exception as e:
    print("ECHEC de la connexion")
    print("-" * 60)
    print(f"Type d'erreur: {type(e).__name__}")
    print(f"Message: {e}")
    print("=" * 60)
    sys.exit(1)
