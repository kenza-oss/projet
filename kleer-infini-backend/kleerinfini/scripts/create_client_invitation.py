#!/usr/bin/env python
"""
Script to create a client invitation token for testing registration.
Usage: python manage.py shell < scripts/create_client_invitation.py
"""

import uuid
from datetime import timedelta
from django.utils import timezone
from clients.models import Invitation

# Configuration
email = "test@client.com"  # Change this to your test email
expiry_days = 7

# Generate unique token
token = str(uuid.uuid4())
expires_at = timezone.now() + timedelta(days=expiry_days)

# Create or update invitation
invitation, created = Invitation.objects.update_or_create(
    email=email,
    defaults={
        'token': token,
        'expires_at': expires_at,
        'used': False
    }
)

action = "Created" if created else "Updated"
print(f"\n✅ {action} invitation for {email}")
print(f"Token: {token}")
print(f"Expires: {expires_at}")
print(f"\n🔗 Registration URL:")
print(f"http://localhost:5173/register?token={token}")
print(f"\nℹ️  Copy this URL and paste it in your browser to register as a client.\n")
