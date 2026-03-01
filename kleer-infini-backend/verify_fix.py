import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kleerinfini.settings')
django.setup()

from users.models import User
from producers.models import ProducerProfile
from products.models import Product
from estimate.models import Estimate
from estimate.serializers import EstimateSerializer
from rest_framework import serializers

def run_test():
    print("--- User List ---")
    for u in User.objects.all()[:5]:
        print(f"Email: {u.email}, Role: {u.role}, ID: {u.id}")

    print("\n--- Product/Producer Check ---")
    product = Product.objects.filter(producer__isnull=False).first()
    if not product:
        print("No product with producer found!")
        return
    
    producer_profile = product.producer
    producer_user = producer_profile.user
    
    print(f"Product: {product.name}")
    print(f"Producer Profile ID: {producer_profile.id}")
    print(f"Producer User ID (UUID): {producer_user.id}")

    # Find a client
    client = User.objects.filter(role='client').first()
    if not client:
        # Create a test client if none exists
        client = User.objects.create_user(email='test_client@example.com', password='password123', role='client')
    
    print(f"Client: {client.email}, ID: {client.id}")

    # Simulate the data the frontend would send
    # Payload now uses the UUID for 'producer'
    data = {
        "producer": str(producer_user.id),
        "comment": "Test Estimate with UUID",
        "products": [
            {
                "product": product.id,
                "quantity": "100",
                "unit_price": 0
            }
        ]
    }

    print("\n--- Serializer Verification ---")
    serializer = EstimateSerializer(data=data)
    if serializer.is_valid():
        print("Serializer is VALID with UUID!")
        # We don't save here because EstimateViewSet.perform_create handles role check
        # But we can verify the validated_data
        print(f"Validated Producer: {serializer.validated_data['producer']}")
    else:
        print("Serializer is INVALID!")
        print(serializer.errors)

if __name__ == "__main__":
    run_test()
