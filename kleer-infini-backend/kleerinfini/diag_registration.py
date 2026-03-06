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

def simulate_registration():
    print("--- Simulating Registration Diagnostic ---")
    email = f"diag_{uuid.uuid4().hex[:6]}@gmail.com"
    password = "password123"
    
    data = {
        'first_name': 'Diag',
        'last_name': 'Test',
        'email': email,
        'company_name': 'Diag Corp',
        'phone': '0555000000',
        'country': 'Algérie',
        'sector': 'Services',
        'language': 'fr',
        'website': ''
    }

    try:
        print(f"1. Creating User: {email}")
        user = User.objects.create_user(
            email=data['email'],
            password=password,
            role='client',
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        print("   - User created.")

        print("2. Creating ClientProfile")
        profile_data = {
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'company_name': data['company_name'],
            'phone': data['phone'],
            'country': data['country'],
            'sector': data['sector'],
            'language': data['language'],
            'website': data['website'],
        }
        ClientProfile.objects.create(user=user, **profile_data)
        print("   - ClientProfile created.")

        print("3. Creating Subscription")
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
    simulate_registration()
