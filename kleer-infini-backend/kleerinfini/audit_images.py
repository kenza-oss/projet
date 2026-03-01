import os
import django
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Product, ProductImage
from products.models import Category
from producers.models import ProducerProfile

def check_images():
    print("--- Auditing Image Paths in Database ---")
    invalid_found = False

    # Check Categories
    print("\nChecking Categories...")
    for cat in Category.objects.all():
        if cat.image:
            url = str(cat.image)
            if 'src/assets' in url or 'localhost:5173' in url:
                print(f"[INVALID] Category '{cat.name}' image: {url}")
                invalid_found = True

    # Check Products
    print("\nChecking Products...")
    for prod in Product.objects.all():
        # Check main image field if it exists (adjust based on actual model)
        if hasattr(prod, 'image') and prod.image:
             url = str(prod.image)
             if 'src/assets' in url or 'localhost:5173' in url:
                print(f"[INVALID] Product '{prod.name}' main image: {url}")
                invalid_found = True

    # Check Product Images (Gallery)
    print("\nChecking ProductGallery Images...")
    for img in ProductImage.objects.all():
        url = str(img.image)
        if 'src/assets' in url or 'localhost:5173' in url:
            print(f"[INVALID] ProductImage {img.id} for '{img.product.name}': {url}")
            invalid_found = True
            
    # Check Producers
    print("\nChecking Producers...")
    for producer in ProducerProfile.objects.all():
        if producer.profile_picture:
            url = str(producer.profile_picture)
            if 'src/assets' in url or 'localhost:5173' in url:
                print(f"[INVALID] Producer '{producer.user.username}' profile: {url}")
                invalid_found = True
        if producer.cover_picture:
            url = str(producer.cover_picture)
            if 'src/assets' in url or 'localhost:5173' in url:
                print(f"[INVALID] Producer '{producer.user.username}' cover: {url}")
                invalid_found = True

    if not invalid_found:
        print("\n✅ No invalid image paths found in the database.")
    else:
        print("\n❌ Invalid paths detected! Please run a correction script.")

if __name__ == "__main__":
    check_images()
