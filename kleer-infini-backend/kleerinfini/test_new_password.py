import psycopg2
import sys

# Configuration avec le nouveau mot de passe
params = {
    "host": "aws-1-eu-west-1.pooler.supabase.com",
    "database": "postgres",
    "user": "postgres.cpuchjragjrkmbejsafy",
    "password": "9KGM7rj9bMDEl7b@",
    "port": 5432,
    "connect_timeout": 10
}

print("=" * 70)
print("TEST DE CONNEXION AVEC LE NOUVEAU MOT DE PASSE")
print("=" * 70)
print(f"Host: {params['host']}")
print(f"Port: {params['port']}")
print(f"User: {params['user']}")
print(f"Database: {params['database']}")
print("-" * 70)

try:
    print("Tentative de connexion...")
    conn = psycopg2.connect(**params)
    
    print(">>> SUCCESS! CONNEXION ETABLIE <<<")
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
    print(f"\nTables disponibles dans la base ({len(tables)}):")
    for table in tables[:25]:
        print(f"   - {table[0]}")
    if len(tables) > 25:
        print(f"   ... et {len(tables) - 25} autres tables")
    
    print("-" * 70)
    
    # Test 3: Compter les enregistrements
    if len(tables) > 0:
        print("\nVerification des donnees (10 premieres tables):")
        for table in tables[:10]:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table[0]};")
                count = cursor.fetchone()[0]
                print(f"   {table[0]}: {count} enregistrements")
            except Exception as e:
                print(f"   {table[0]}: Erreur - {str(e)[:40]}")
    
    cursor.close()
    conn.close()
    
    print("\n" + "=" * 70)
    print("CONNEXION REUSSIE! CONFIGURATION CORRECTE!")
    print("=" * 70)
    print("\nProchaines etapes:")
    print("1. Mise a jour de .env avec le nouveau mot de passe")
    print("2. Verification de settings.py Django")
    print("3. Execution des migrations Django")
    print("4. Acces a Django Admin")
    print("=" * 70)
    
except Exception as e:
    print("ECHEC de la connexion")
    print("-" * 70)
    print(f"Type d'erreur: {type(e).__name__}")
    print(f"Message: {e}")
    print("=" * 70)
    sys.exit(1)
