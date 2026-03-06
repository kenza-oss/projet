import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

email_to_delete = "mahlebkenza1@gmail.com"

print(f"Attempting to delete user with email: {email_to_delete}")

try:
    user = User.objects.get(email=email_to_delete)
    user_id = user.id
    user.delete()
    print(f"SUCCESS: User {email_to_delete} (ID: {user_id}) has been deleted successfully.")
except User.DoesNotExist:
    print(f"WARNING: User with email {email_to_delete} does not exist.")
except Exception as e:
    print(f"ERROR: {str(e)}")
