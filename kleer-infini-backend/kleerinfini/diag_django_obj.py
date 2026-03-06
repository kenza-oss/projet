import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Product, ProductImage

def diag():
    try:
        pi = ProductImage.objects.filter(product_id=64).first()
        if not pi:
            print("ProductImage not found for ID 64")
            return
            
        print(f"--- Django Context Diagnostic (ID 64) ---")
        print(f"Raw .image.name: {pi.image.name}")
        print(f"Generated .image.url: {pi.image.url}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    diag()
