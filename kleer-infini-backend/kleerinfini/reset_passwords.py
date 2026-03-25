import os
import django

# Load settings since django needs it
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

# Reseting kleernetinfini@gmail.com and admin@kleerinfini.com
emails = ["kleernetinfini@gmail.com", "admin@kleerinfini.com"]
new_password = "AdminLogin2026!"

for email in emails:
    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        print(f"SUCCESS: Reset password for {email} to {new_password}")
    except User.DoesNotExist:
        print(f"WARNING: User {email} not found.")
