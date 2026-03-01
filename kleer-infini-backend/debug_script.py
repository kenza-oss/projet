import os
import django
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'kleerinfini'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kleerinfini.config.settings')
django.setup()

from products.models import Category
from users.models import User
from producers.models import ProducerProfile

print("--- DEBUGGING CATEGORIES ---")
categories = Category.objects.all()
print(f"Total Categories: {categories.count()}")
for cat in categories[:5]:
    print(f" - {cat.name} (ID: {cat.id})")

print("\n--- DEBUGGING USERS ---")
users = User.objects.all().order_by('-created_at')
print(f"Total Users: {users.count()}")
for user in users[:5]:
    print(f" - {user.email} (Role: {user.role}, Is Active: {user.is_active})")
    try:
        profile = ProducerProfile.objects.get(user=user)
        print(f"   -> Profile: {profile.company_name}")
    except ProducerProfile.DoesNotExist:
        print("   -> No ProducerProfile")

print("\n--- DONE ---")
