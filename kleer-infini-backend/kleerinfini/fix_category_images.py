
import os
import django
from django.core.files import File
from django.conf import settings
import shutil

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Category

# Absolute path to frontend assets
FRONTEND_ASSETS_DIR = r"c:\Users\DELL\Desktop\dev\kleerinfini-b2b-platform\kleerinfini-ui\src\assets"

def fix_category_images():
    # Define mapping: Category Name -> Filename in assets
    mapping = {
        "Produits Cosmétiques": "aloe_vera_1.png",
        "Parfums & Eaux de Parfum": "essence_1.png",
        "Produits de la pêche & Aquaculture": "image3.jpeg",
        "Produits Pharmaceutiques & Médicaux": "image4.jpeg",
        "Agroalimentaire": "olive_oil_1.png"
    }

    print("Updating category images from frontend assets...")

    for cat_name, filename in mapping.items():
        try:
            category = Category.objects.get(name=cat_name)
            src_path = os.path.join(FRONTEND_ASSETS_DIR, filename)
            
            if os.path.exists(src_path):
                print(f"Found asset for '{cat_name}': {src_path}")
                # Use Django File wrapper to save
                with open(src_path, 'rb') as f:
                    # save=True saves the model instance too
                    category.image.save(filename, File(f), save=True)
                print(f"✅ Successfully updated image for: {cat_name}")
            else:
                print(f"❌ Asset not found: {src_path}")
        
        except Category.DoesNotExist:
            print(f"⚠️ Category not found in DB: {cat_name}")
        except Exception as e:
            print(f"❌ Error updating {cat_name}: {e}")

if __name__ == "__main__":
    fix_category_images()
