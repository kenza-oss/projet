import os
import django
from datetime import timedelta
from django.utils import timezone

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from producers.models import ProducerProfile
from subscriptions.models import Subscription
from users.models import User
from subscriptions.tasks import relance_abonnements

def test_automation():
    print("--- Starting Subscription Automation Test ---")
    
    # 1. Create a test user and profile
    email = "test_automation@example.com"
    user, created = User.objects.get_or_create(email=email, defaults={'role': 'producer'})
    user.set_password("password123")
    user.save()
    
    profile, created = ProducerProfile.objects.get_or_create(
        user=user,
        defaults={'company_name': 'Test Company', 'email': email, 'is_approved': False}
    )
    
    print(f"Created/found test profile: {profile.company_name} (Approved: {profile.is_approved})")
    
    # 2. Approve the producer
    print("Approving producer...")
    profile.is_approved = True
    profile.save()
    
    profile.refresh_from_db()
    print(f"Approval Date recorded: {profile.approval_date}")
    
    sub = Subscription.objects.filter(user=user).first()
    if sub:
        print(f"Subscription initialized: status={sub.status}, end_date={sub.end_date}")
    else:
        print("ERROR: Subscription not created!")
        return

    # 3. Simulate Reminder (7 days left)
    print("\n--- Testing 7-day Reminder ---")
    sub.end_date = timezone.now().date() + timedelta(days=7)
    sub.save()
    relance_abonnements()
    print("Check console for 7-day reminder email.")

    # 4. Simulate Expiration
    print("\n--- Testing Expiration (Block Account) ---")
    sub.end_date = timezone.now().date() - timedelta(days=1)
    sub.status = "free"
    sub.save()
    
    relance_abonnements()
    
    profile.refresh_from_db()
    sub.refresh_from_db()
    
    print(f"Post-Expiration status: sub_status={sub.status}, profile_is_approved={profile.is_approved}")
    
    if not profile.is_approved:
        print("SUCCESS: Account automatically deactivated!")
    else:
        print("FAILURE: Account still approved after expiration!")

    # Cleanup
    # profile.delete()
    # user.delete()
    print("\n--- Test Finished ---")

if __name__ == "__main__":
    test_automation()
