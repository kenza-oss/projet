import os
import django
import json
import sys

# Setup Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Category, Product

def restore_data():
    print("--- Restoring Real Data to Supabase ---")
    
    # Paths to local dumps
    categories_path = 'categories_dump.json'
    products_path = 'products_api_ps.json'

    if not os.path.exists(categories_path):
        print(f"Error: {categories_path} not found.")
        return

    # 1. Clear the "Demo" data
    print("[1/3] Clearing demo data...")
    Category.objects.all().delete()
    Product.objects.all().delete()

    # 2. Restore Categories
    print("[2/3] Restoring Categories from JSON...")
    try:
        with open(categories_path, 'r', encoding='utf-16') as f:
            categories_data = json.load(f)
            for item in categories_data:
                Category.objects.get_or_create(
                    name=item['name'],
                    defaults={
                        'description': item.get('description', ''),
                    }
                )
        print(f"      Successfully restored {len(categories_data)} categories.")
    except Exception as e:
        print(f"      Error restoring categories: {e}")

    # 3. Restore Products (Basic Info)
    print("[3/3] Restoring Products (Metadata only)...")
    if os.path.exists(products_path):
        try:
            with open(products_path, 'r', encoding='utf-16') as f:
                products_data = json.load(f)
                items = products_data.get('value', [])
                count = 0
                for item in items:
                    cat_name = item.get('category_name', '')
                    category = Category.objects.filter(name=cat_name).first()
                    
                    Product.objects.create(
                        name=item['name'],
                        category=category if category else Category.objects.first(), # Fallback
                        description=item.get('description', ''),
                        prix_indicatif=item.get('prix_indicatif', 0),
                        est_pret=True
                    )
                    count += 1
                print(f"      Successfully restored {count} products.")
        except Exception as e:
            print(f"      Error restoring products: {e}")
    else:
        print("      No products dump found, skipping.")

    print("\n[COMPLETE] Your Supabase database is now updated with your real data!")
    print("Next step: Set up Cloudinary on Render to see your images.")

if __name__ == "__main__":
    restore_data()
