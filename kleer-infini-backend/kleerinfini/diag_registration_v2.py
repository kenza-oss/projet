import os
import django
import uuid
from datetime import timedelta
from django.utils import timezone

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User
from clients.models import ClientProfile, Invitation
from subscriptions.models import Subscription
from users.serializers import RegisterClientSerializer

def simulate_registration_with_serializer():
    print("--- Simulating Registration with Serializer ---")
    email = f"diag_ser_{uuid.uuid4().hex[:6]}@gmail.com"
    password = "password123"
    
    data = {
        'first_name': 'Diag',
        'last_name': 'Test',
        'email': email,
        'password': password,
        'company_name': 'Diag Corp',
        'phone': '0555000000',
        'country': 'Algérie',
        'sector': 'Services',
        'language': 'fr',
        'website': 'https://example.com'
    }

    try:
        print("1. Validating data with RegisterClientSerializer")
        serializer = RegisterClientSerializer(data=data)
        if not serializer.is_valid():
            print(f"   - Validation Failed: {serializer.errors}")
            return

        print("2. Saving with serializer.save()")
        user = serializer.save()
        print(f"   - User ID: {user.id}")

        print("3. Creating Subscription (as in view)")
        Subscription.objects.get_or_create(
            user=user,
            defaults={
                'status': 'active',
                'start_date': timezone.now().date(),
                'end_date': (timezone.now() + timedelta(days=365)).date()
            }
        )
        print("   - Subscription created/retrieved.")
        
        print("\nDIAGNOSTIC SUCCESS: Registration flow completed without errors.")
        
        # Cleanup
        print("\n4. Cleaning up test data...")
        user.delete()
        print("   - Cleanup successful.")

    except Exception as e:
        import traceback
        print("\nDIAGNOSTIC FAILED!")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Message: {str(e)}")
        print("\nFull Traceback:")
        traceback.print_exc()

if __name__ == "__main__":
    simulate_registration_with_serializer()
