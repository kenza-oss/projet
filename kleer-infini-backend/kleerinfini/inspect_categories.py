
import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Category

def inspect_categories():
    categories = Category.objects.all()
    data = []
    for c in categories:
        data.append({
            "id": c.id,
            "name": c.name,
            "image_field": str(c.image),
            "image_url": c.image.url if c.image else None
        })
    print(json.dumps(data, indent=2))

if __name__ == "__main__":
    inspect_categories()
