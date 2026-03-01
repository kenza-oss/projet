import psycopg2
import sys

# Test de differentes configurations de pooler
configs = [
    {
        "name": "Session Mode - eu-central-1",
        "host": "aws-0-eu-central-1.pooler.supabase.com",
        "user": "postgres.cpuchjragjrkmbejsafy",
        "port": 5432
    },
    {
        "name": "Transaction Mode - eu-central-1",
        "host": "aws-0-eu-central-1.pooler.supabase.com",
        "user": "postgres.cpuchjragjrkmbejsafy",
        "port": 6543
    },
    {
        "name": "Direct Connection IPv6",
        "host": "db.cpuchjragjrkmbejsafy.supabase.co",
        "user": "postgres",
        "port": 5432
    },
    {
        "name": "Pooler sans region specifique",
        "host": "pooler.supabase.com",
        "user": "postgres.cpuchjragjrkmbejsafy",
        "port": 5432
    }
]

password = "7NLK2gr6SGBFf4s!"
database = "postgres"

print("=" * 70)
print("TEST DE CONNEXION SUPABASE - TOUTES LES CONFIGURATIONS")
print("=" * 70)

for i, config in enumerate(configs, 1):
    print(f"\n[{i}/{len(configs)}] Test: {config['name']}")
    print("-" * 70)
    print(f"Host: {config['host']}")
    print(f"Port: {config['port']}")
    print(f"User: {config['user']}")
    
    try:
        conn = psycopg2.connect(
            host=config['host'],
            database=database,
            user=config['user'],
            password=password,
            port=config['port'],
            connect_timeout=10
        )
        
        print(">>> SUCCESS! Connexion etablie <<<")
        
        cursor = conn.cursor()
        cursor.execute("SELECT current_database(), current_user;")
        result = cursor.fetchone()
        print(f"Database: {result[0]}, User: {result[1]}")
        
        # Liste des tables
        cursor.execute("""
            SELECT COUNT(*) 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        """)
        table_count = cursor.fetchone()[0]
        print(f"Nombre de tables: {table_count}")
        
        cursor.close()
        conn.close()
        
        print("\n" + "=" * 70)
        print(f"CONFIGURATION GAGNANTE: {config['name']}")
        print("=" * 70)
        print(f"\nUtilisez cette configuration dans votre .env:")
        print(f"DB_HOST={config['host']}")
        print(f"DB_PORT={config['port']}")
        print(f"DB_USER={config['user']}")
        print("=" * 70)
        sys.exit(0)
        
    except Exception as e:
        print(f"ECHEC: {type(e).__name__}")
        print(f"Message: {str(e)[:100]}")
        continue

print("\n" + "=" * 70)
print("AUCUNE CONFIGURATION N'A FONCTIONNE")
print("=" * 70)
print("\nAction requise:")
print("1. Verifiez votre dashboard Supabase")
print("2. Copiez la chaine de connexion exacte")
print("3. Verifiez que votre projet est bien dans la region eu-central-1")
sys.exit(1)
