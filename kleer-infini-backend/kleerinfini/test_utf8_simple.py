import os
import sys
import django

# Force UTF-8 output for Windows
sys.stdout.reconfigure(encoding='utf-8')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Category

print("=" * 60)
print("LISTE DES CATEGORIES DANS SUPABASE")
print("=" * 60)

categories = Category.objects.all()
print(f"\nNombre total de categories: {categories.count()}\n")

for i, category in enumerate(categories, 1):
    print(f"{i}. {category.name}")

print("\n" + "=" * 60)
