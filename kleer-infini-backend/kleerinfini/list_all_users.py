import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("--- LIST OF ACCOUNTS ---")

producers = User.objects.filter(role='producer').order_by('email')
print(f"\nPRODUCTEURS ({producers.count()}):")
for u in producers:
    print(f"- {u.email}")

clients = User.objects.filter(role='client').order_by('email')
print(f"\nCLIENTS ({clients.count()}):")
for u in clients:
    print(f"- {u.email}")

admins = User.objects.filter(role='admin').order_by('email')
print(f"\nADMINS ({admins.count()}):")
for u in admins:
    print(f"- {u.email}")
