import os
import django
import sys
from datetime import timedelta
from django.utils import timezone
from django.test.utils import setup_test_environment
from django.core import mail

# Setup Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
setup_test_environment()

from django.contrib.auth import get_user_model
from django_rest_passwordreset.models import ResetPasswordToken
from django.test import Client
import json

User = get_user_model()

def test_security_audit():
    print("--- Starting Password Reset Security Audit ---\n")
    
    # Setup test user
    email = "audit-security@kleerinfini.com"
    User.objects.filter(email=email).delete()
    user = User.objects.create_user(email=email, password="initial-password-123")
    
    client = Client()

    # 1. Test Generic Response (Point 2 of Audit)
    print("[STEP] Testing Audit Point 2: Generic Response for non-existent emails...")
    response = client.post('/api/password_reset/', {'email': 'non-existent@example.com'})
    print(f"   Status: {response.status_code}")
    # Even if configured, the app returns 200/OK if NO_USER_FOUND_GENERIC_RESPONSE is True
    if response.status_code == 200:
        print("   [OK] PASS: System returns 200 even if user not found (Generic Response).")
    else:
        print(f"   [ERR] FAIL: System returned {response.status_code}")

    # 2. Test Token Creation and Email Signal
    print("\n[STEP] Testing Signal and Token Creation...")
    response = client.post('/api/password_reset/', {'email': email})
    token = ResetPasswordToken.objects.filter(user=user).first()
    if token and len(mail.outbox) > 0:
        print(f"   [OK] PASS: Token generated and Email sent to outbox.")
        print(f"   [INFO] Email Subject: {mail.outbox[0].subject}")
    else:
        print("   [ERR] FAIL: Token not found or Email not sent.")

    # 3. Test Token Single Use (Point 1 of Audit)
    print("\n[STEP] Testing Audit Point 1: Token Invalidation after use...")
    reset_password_data = {
        'token': token.key,
        'password': 'new-secure-password-456'
    }
    reset_response = client.post('/api/password_reset/confirm/', reset_password_data)
    
    if reset_response.status_code == 200:
        print("   [OK] Password changed successfully.")
        # Try using the same token again
        retry_response = client.post('/api/password_reset/confirm/', {
            'token': token.key,
            'password': 'another-password-789'
        })
        if retry_response.status_code != 200:
            print("   [OK] PASS: Token correctly invalidated after first use.")
        else:
            print("   [ERR] FAIL: Token was usable twice!")
    else:
        print(f"   [ERR] FAIL: Password change failed with status {reset_response.status_code}")

    # 4. Test Token Expiration (General Security)
    print("\n[STEP] Testing Token Expiration (24h)...")
    expired_token = ResetPasswordToken.objects.create(user=user)
    expired_token.created_at = timezone.now() - timedelta(hours=25)
    expired_token.save()
    
    exp_response = client.post('/api/password_reset/confirm/', {
        'token': expired_token.key,
        'password': 'expired-test-password'
    })
    if exp_response.status_code != 200:
        print(f"   [OK] PASS: Expired token rejected (Status {exp_response.status_code}).")
    else:
        print("   [ERR] FAIL: Expired token was accepted!")

    print("\n[DONE] Security Audit Complete.")

if __name__ == "__main__":
    test_security_audit()
