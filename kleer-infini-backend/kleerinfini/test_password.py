import psycopg2
import sys
import urllib.parse

# Test avec differents encodages du mot de passe
password_raw = "7NLK2gr6SGBFf4s!"

# Differentes versions du mot de passe a tester
passwords_to_test = [
    ("Brut (avec !)", password_raw),
    ("URL encoded (%21)", "7NLK2gr6SGBFf4s%21"),
    ("Sans le !", "7NLK2gr6SGBFf4s"),
]

config_base = {
    "host": "aws-1-eu-west-1.pooler.supabase.com",
    "database": "postgres",
    "user": "postgres.cpuchjragjrkmbejsafy",
    "port": 5432,
    "connect_timeout": 10
}

print("=" * 70)
print("TEST DES DIFFERENTS ENCODAGES DE MOT DE PASSE")
print("=" * 70)

for i, (description, password) in enumerate(passwords_to_test, 1):
    print(f"\n[{i}/{len(passwords_to_test)}] Test: {description}")
    print("-" * 70)
    print(f"Password: {password}")
    
    try:
        conn = psycopg2.connect(
            **config_base,
            password=password
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
        print(f"MOT DE PASSE CORRECT: {description}")
        print("=" * 70)
        print(f"\nUtilisez ce mot de passe dans votre .env:")
        print(f"DB_PASSWORD={password}")
        print("=" * 70)
        sys.exit(0)
        
    except psycopg2.OperationalError as e:
        if "password authentication failed" in str(e):
            print(f"ECHEC: Mot de passe incorrect")
        else:
            print(f"ECHEC: {str(e)[:80]}")
    except Exception as e:
        print(f"ERREUR: {type(e).__name__}: {str(e)[:80]}")

print("\n" + "=" * 70)
print("AUCUN MOT DE PASSE N'A FONCTIONNE")
print("=" * 70)
print("\nVerifiez le mot de passe dans votre dashboard Supabase:")
print("Settings -> Database -> Database Password")
sys.exit(1)
