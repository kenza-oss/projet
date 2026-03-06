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

def simulate_registration_with_invitation():
    print("--- Simulating Registration with Invitation Diagnostic ---")
    email = f"diag_inv_{uuid.uuid4().hex[:6]}@gmail.com"
    token = "test_token_123"
    
    # Create an invitation
    print(f"1. Creating Invitation for {email}")
    invitation = Invitation.objects.create(
        email=email,
        token=token,
        expires_at=timezone.now() + timedelta(days=7)
    )

    data = {
        'first_name': 'Diag',
        'last_name': 'Inv',
        'email': email,
        'company_name': 'Diag Inv Corp',
        'phone': '0555000000',
        'country': 'Algérie',
        'sector': 'Services',
        'language': 'fr',
        'website': '',
        'invitation_token': token
    }

    try:
        # Simulate logic in RegisterClientView.post
        print(f"2. Verifying Invitation Token: {token}")
        inv_token = data.get('invitation_token')
        if inv_token:
            inv = Invitation.objects.get(token=inv_token)
            if not inv.is_valid() or data.get('email') != inv.email:
                print("   - FAILED: Invitation invalid or email mismatch.")
                return
            print("   - Invitation verified.")

        print(f"3. Creating User: {email}")
        user = User.objects.create_user(
            email=data['email'],
            password="password123",
            role='client',
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        
        if inv_token:
            inv.used = True
            inv.save()
            print("   - Invitation marked as used.")

        print("4. Creating Subscription")
        Subscription.objects.get_or_create(
            user=user,
            defaults={
                'status': 'active',
                'start_date': timezone.now().date(),
                'end_date': (timezone.now() + timedelta(days=365)).date()
            }
        )
        print("   - Subscription created.")
        
        print("\nDIAGNOSTIC SUCCESS: Registration with invitation completed.")
        
        # Cleanup
        user.delete()
        invitation.delete()

    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    simulate_registration_with_invitation()
