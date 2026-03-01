tu ajo
import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

User = get_user_model()
email = 'admin@kleerinfini.com'
password = 'KleerInfiniSecurePassword2024!'

if not User.objects.filter(email=email).exists():
    User.objects.create_superuser(email=email, password=password)
    print(f"Superuser created successfully.")
    print(f"Email: {email}")
    print(f"Password: {password}")
else:
    print(f"Superuser '{email}' already exists.")
    user = User.objects.get(email=email)
    user.set_password(password)
    user.save()
    print(f"Password for '{email}' has been reset to: {password}")
