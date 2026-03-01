
import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Product, Category

products = Product.objects.all()[:10]
categories = Category.objects.all()[:10]

data = {
    "products": [
        {
            "id": p.id,
            "name": p.name,
            "images": p.images,
            "description": p.description[:50] if p.description else ""
        } for p in products
    ],
    "categories": [
        {
            "id": c.id,
            "name": c.name
        } for c in categories
    ]
}

print(json.dumps(data, indent=2))
