import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

# Delete test users
User.objects.filter(email__contains='test_final_').delete()
User.objects.filter(email__contains='diag_').delete()
print("Cleanup successful.")
