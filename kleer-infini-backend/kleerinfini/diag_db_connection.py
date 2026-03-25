import os
import django
from decouple import config

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings

print(f"DATABASE ENGINE: {settings.DATABASES['default']['ENGINE']}")
if 'sqlite' in settings.DATABASES['default']['ENGINE']:
    print(f"SQLITE PATH: {settings.DATABASES['default']['NAME']}")
else:
    print(f"POSTGRES HOST: {settings.DATABASES['default']['HOST']}")
    print(f"POSTGRES DB: {settings.DATABASES['default']['NAME']}")

from django.contrib.auth import get_user_model
User = get_user_model()
print(f"TOTAL USERS FOUND: {User.objects.count()}")
