import os
import django
import json
import sys
import cloudinary
import cloudinary.uploader
from pathlib import Path
import urllib.parse

# For Windows console encoding issues
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer)

# 1. Setup Django
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
from products.models import Category, Product, ProductImage

# 2. Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME', 'dptb2m02i'),
    api_key=os.getenv('CLOUDINARY_API_KEY', '432596188994381'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET', 'dHTbwxJTQ8DgiqzHhvt1P2mpLNY'),
    secure=True
)

def sync_categories():
     print("\n--- Syncing Category Images ---")
     categories_path = BASE_DIR / 'categories_dump.json'
     if not categories_path.exists():
         print(f"Error: {categories_path} not found.")
         return

     try:
         with open(categories_path, 'r', encoding='utf-16') as f:
             data = json.load(f)
             for item in data:
                 name = item.get('name')
                 remote_path = item.get('image_url')
                 if not remote_path: continue

                 # Filename might be URL quoted: Capture_d%C3%A9cran
                 quoted_filename = os.path.basename(remote_path)
                 filename = urllib.parse.unquote(quoted_filename)
                 
                 local_file = BASE_DIR / 'media' / 'categories' / filename
                 
                 if local_file.exists():
                     print(f"Uploading category image for {name} ({filename})...")
                     upload_result = cloudinary.uploader.upload(
                         str(local_file),
                         folder="categories",
                         public_id=filename.split('.')[0]
                     )
                     
                     cat = Category.objects.filter(name=name).first()
                     if cat:
                         cat.image = upload_result['public_id']
                         cat.save()
                         print(f"  Successfully synced {name}")
                 else:
                     print(f"  Local file not found for {name}: {local_file}")
     except Exception as e:
         print(f"Error in sync_categories: {str(e).encode('ascii', 'ignore')}")

def sync_products():
    print("\n--- Syncing Product Images ---")
    products_path = BASE_DIR / 'products_api_ps.json'
    if not products_path.exists():
        print(f"Error: {products_path} not found.")
        return

    try:
        with open(products_path, 'r', encoding='utf-16') as f:
            full_data = json.load(f)
            items = full_data.get('value', [])
            for item in items:
                name = item.get('name')
                images_list = item.get('images', []) 
                
                if not images_list and 'image' in item:
                    img = item['image']
                    images_list = [img] if isinstance(img, str) else img

                product = Product.objects.filter(name=name).first()
                if not product: continue

                # Dedup check to avoid duplicate images
                existing_images = list(product.images.values_list('image', flat=True))

                for img_data in images_list:
                    url = img_data if isinstance(img_data, str) else img_data.get('image')
                    if not url: continue

                    quoted_filename = os.path.basename(url)
                    filename = urllib.parse.unquote(quoted_filename)
                    local_file = BASE_DIR / 'media' / 'products' / filename

                    if local_file.exists():
                        print(f"Uploading product image for {name} ({filename})...")
                        upload_result = cloudinary.uploader.upload(
                            str(local_file),
                            folder="products",
                            public_id=filename.split('.')[0]
                        )
                        
                        # Use public_id as the 'image' field value for Cloudinary storage
                        public_id = upload_result['public_id']
                        
                        # Basic check to avoid duplicates in ProductImage
                        # Note: we compare filename part because public_id might have a random suffix if not specified
                        if not any(f in public_id for f in existing_images):
                            ProductImage.objects.create(
                                product=product,
                                image=public_id
                            )
                            print(f"  Successfully synced image for {name}")
                        else:
                            print(f"  Image already exists in DB for {name}")
                    else:
                        print(f"  Local file not found for {name}: {local_file}")
    except Exception as e:
         print(f"Error in sync_products: {str(e).encode('ascii', 'ignore')}")

if __name__ == "__main__":
    sync_categories()
    sync_products()
    print("\n--- Media Sync Complete ---")
