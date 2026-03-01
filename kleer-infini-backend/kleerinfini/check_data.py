import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.apps import apps
from django.contrib import admin

print("\n" + "="*70)
print("DIAGNOSTIC DES DONNEES DJANGO <-> SUPABASE")
print("="*70)

# 1. Vérifier les modèles enregistrés dans Django Admin
print("\n[1] MODELES ENREGISTRES DANS DJANGO ADMIN:")
print("-"*70)
registered_models = admin.site._registry
if registered_models:
    for model, model_admin in registered_models.items():
        print(f"  - {model._meta.app_label}.{model.__name__}")
else:
    print("  [ATTENTION] Aucun modele enregistre dans Django Admin!")

# 2. Compter les données dans chaque modèle
print("\n[2] NOMBRE D'ENREGISTREMENTS PAR MODELE:")
print("-"*70)

# Liste des apps à vérifier
apps_to_check = ['products', 'producers', 'clients', 'users', 'events', 
                 'notifications', 'subscriptions', 'quotes', 'estimate']

total_records = 0
for app_name in apps_to_check:
    try:
        app_models = apps.get_app_config(app_name).get_models()
        print(f"\n  App: {app_name}")
        for model in app_models:
            try:
                count = model.objects.count()
                total_records += count
                status = "[OK]" if count > 0 else "[VIDE]"
                print(f"    {status} {model.__name__}: {count} enregistrement(s)")
            except Exception as e:
                print(f"    [ERREUR] {model.__name__}: {str(e)[:50]}")
    except Exception as e:
        print(f"  [ERREUR] App {app_name}: {str(e)[:50]}")

# 3. Vérifier spécifiquement les catégories
print("\n[3] VERIFICATION SPECIFIQUE DES CATEGORIES:")
print("-"*70)
try:
    from products.models import Category
    categories = Category.objects.all()
    count = categories.count()
    print(f"  Nombre de categories: {count}")
    
    if count > 0:
        print("\n  Liste des categories:")
        for cat in categories[:10]:  # Afficher max 10
            print(f"    - ID: {cat.id}, Nom: {cat.name}")
        if count > 10:
            print(f"    ... et {count - 10} autres categories")
    else:
        print("  [ATTENTION] Aucune categorie trouvee dans la base de donnees!")
        print("\n  Suggestions:")
        print("    1. Verifier si les donnees existent dans Supabase (via interface web)")
        print("    2. Si oui, verifier le nom de la table (products_category)")
        print("    3. Si non, les donnees doivent etre creees")
        
except Exception as e:
    print(f"  [ERREUR] Impossible de charger les categories: {str(e)}")

# 4. Résumé
print("\n" + "="*70)
print("RESUME")
print("="*70)
print(f"  Total de modeles enregistres dans Admin: {len(registered_models)}")
print(f"  Total d'enregistrements dans la base: {total_records}")

if total_records == 0:
    print("\n  [IMPORTANT] La base de donnees est vide!")
    print("  Les migrations creent la STRUCTURE mais pas les DONNEES.")
    print("\n  Solutions possibles:")
    print("    1. Importer des donnees existantes depuis un fichier")
    print("    2. Creer les donnees via Django Admin")
    print("    3. Utiliser un script de seed/fixtures")
else:
    print("\n  [OK] Des donnees existent dans la base!")

print("="*70 + "\n")
