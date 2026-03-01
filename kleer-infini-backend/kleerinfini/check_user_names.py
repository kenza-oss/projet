import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kleerinfini.settings')
django.setup()

from users.models import User

print("=" * 60)
print("USERS IN DATABASE")
print("=" * 60)

users = User.objects.all()
for u in users:
    print(f"\nEmail: {u.email}")
    print(f"First Name: '{u.first_name}'")
    print(f"Last Name: '{u.last_name}'")
    print(f"Role: {u.role}")
    print(f"ID: {u.id}")
    print("-" * 40)
