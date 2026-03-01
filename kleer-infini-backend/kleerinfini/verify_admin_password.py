import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
email = "admin@kleerinfini.com"
default_password = '50SnFK-{|7H<$E<qER5NY0Q8*h(N,%CI'

try:
    user = User.objects.get(email=email)
    if user.check_password(default_password):
        print(f"SUCCESS: Password matches default for {email}")
    else:
        print(f"FAILURE: Password does NOT match default for {email}")
except User.DoesNotExist:
    print(f"User NOT found: {email}")
except Exception as e:
    print(f"Error: {e}")
