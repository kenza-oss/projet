import os
import django
import json
import sys

# Setup Django environment
sys.path.append(r'c:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from producers.serializers import ProducerProfileCreateSerializer
from users.models import User

# Simulated Frontend Data (multipart/form-data often sends strings)
payload = {
    'user_email': 'debug_test_123@example.com',
    'password': 'SecurePassword123!',
    'company_name': 'Debug Company',
    'activity': 'Agriculture',
    'email': 'debug_test_123@example.com',
    'phone': '1234567890',
    'whatsapp': '1234567890',
    'country': '{"label": "Algeria", "value": "DZ"}', # JSON string
    'target_markets': '[{"label": "France", "value": "FR"}]', # JSON string
    'export_categories': '["Fruits", "Vegetables"]', # JSON string - wait, frontend sends list of objects or strings?
    # Serializer expects list of dicts based on earlier code, let's verify logic
    'description': 'A test description',
    'min_export_quantity': '1000',
    'monthly_capacity': '5000',
    'yearly_capacity': '60000',
    'city': 'Algiers',
    'address': '123 Street',
    'latitude': '36.75',
    'longitude': '3.05',
}

print("--- STARTING SERIALIZER TEST ---")
try:
    # 1. Validation Phase
    serializer = ProducerProfileCreateSerializer(data=payload)
    if serializer.is_valid():
        print("Serializer is VALID.")
        # 2. Save Phase
        try:
            instance = serializer.save()
            print(f"SUCCESS: Created ProducerProfile ID: {instance.id}")
        except Exception as e:
            print(f"SAVE ERROR: {type(e).__name__}: {e}")
            import traceback
            traceback.print_exc()
    else:
        print("Serializer VALIDATION ERROR:")
        print(serializer.errors)

except Exception as e:
    print(f"GENERAL ERROR: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()

print("--- TEST FINISHED ---")
