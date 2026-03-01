import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

# Créer un superutilisateur
email = "admin@kleerinfini.com"
password = "Admin123!"

# Vérifier si l'utilisateur existe déjà
if User.objects.filter(email=email).exists():
    print(f"[OK] L'utilisateur {email} existe deja.")
    user = User.objects.get(email=email)
    # Mettre à jour le mot de passe
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.role = 'admin'
    user.save()
    print(f"[OK] Mot de passe mis a jour pour {email}")
else:
    user = User.objects.create_superuser(
        email=email,
        password=password
    )
    print(f"[OK] Superutilisateur cree: {email}")

print("\n" + "="*60)
print("INFORMATIONS DE CONNEXION ADMIN")
print("="*60)
print(f"URL: http://localhost:8000/admin/")
print(f"Email: {email}")
print(f"Mot de passe: {password}")
print("="*60)
