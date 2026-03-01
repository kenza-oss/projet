import psycopg2
import sys

# Test avec la chaine de connexion EXACTE du dashboard
connection_string = "postgresql://postgres.cpuchjragjrkmbejsafy:7NLK2gr6SGBFf4s!@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"

print("=" * 70)
print("TEST AVEC LA CHAINE DE CONNEXION EXACTE DU DASHBOARD")
print("=" * 70)
print(f"Connection string: {connection_string[:50]}...")
print("-" * 70)

try:
    print("Tentative de connexion avec la chaine URI...")
    conn = psycopg2.connect(connection_string)
    
    print(">>> SUCCESS! Connexion etablie <<<")
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
    for table in tables[:20]:
        print(f"   - {table[0]}")
    if len(tables) > 20:
        print(f"   ... et {len(tables) - 20} autres tables")
    
    print("-" * 70)
    
    # Test 3: Compter les enregistrements
    if len(tables) > 0:
        print("\nVerification des donnees (5 premieres tables):")
        for table in tables[:5]:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table[0]};")
                count = cursor.fetchone()[0]
                print(f"   {table[0]}: {count} enregistrements")
            except Exception as e:
                print(f"   {table[0]}: Erreur - {str(e)[:50]}")
    
    cursor.close()
    conn.close()
    
    print("\n" + "=" * 70)
    print("CONNEXION REUSSIE!")
    print("=" * 70)
    print("\nProchaines etapes:")
    print("1. Mise a jour de settings.py Django")
    print("2. Execution des migrations")
    print("3. Verification de Django Admin")
    print("=" * 70)
    
except psycopg2.OperationalError as e:
    error_msg = str(e)
    print("ECHEC de la connexion")
    print("-" * 70)
    print(f"Type d'erreur: OperationalError")
    print(f"Message: {error_msg}")
    
    if "password authentication failed" in error_msg:
        print("\n" + "=" * 70)
        print("PROBLEME: Mot de passe incorrect")
        print("=" * 70)
        print("\nActions possibles:")
        print("1. Verifiez que le mot de passe n'a pas ete reinitialise")
        print("2. Essayez de copier le mot de passe depuis le dashboard")
        print("3. Ou reinitialisez le mot de passe dans Supabase")
        
    print("=" * 70)
    sys.exit(1)
    
except Exception as e:
    print("ERREUR INATTENDUE")
    print("-" * 70)
    print(f"Type: {type(e).__name__}")
    print(f"Message: {e}")
    print("=" * 70)
    sys.exit(1)
