import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
email = "admin@kleerinfini.com"

try:
    user = User.objects.get(email=email)
    print(f"User found: {user.email}")
    print(f"Role: {user.role}")
    print(f"Is active: {user.is_active}")
    print(f"Is staff: {user.is_staff}")
    print(f"Is superuser: {user.is_superuser}")
    print(f"Has password set: {user.has_usable_password()}")
except User.DoesNotExist:
    print(f"User NOT found: {email}")
except Exception as e:
    print(f"Error: {e}")
