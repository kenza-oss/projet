import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

def create_or_update(email, role, password):
    user, created = User.objects.get_or_create(email=email)
    user.role = role
    user.set_password(password)
    user.is_active = True
    user.save()
    status = "Created" if created else "Updated password for"
    print(f"{status} {role} account: {email} / {password}")
    
    # Also create profile if needed
    if role == 'producer':
        from producers.models import ProducerProfile
        ProducerProfile.objects.get_or_create(user=user, defaults={'company_name': 'Test Producer Inc', 'is_approved': True})
    elif role == 'client':
        from clients.models import ClientProfile
        ClientProfile.objects.get_or_create(user=user, defaults={'company_name': 'Test Client LLC'})

print("Setting up test accounts for Dashboard Verification...")
create_or_update('producer@kleerinfini.com', 'producer', 'password123')
create_or_update('client@kleerinfini.com', 'client', 'password123')

# Also reset admin password just in case
create_or_update('admin@kleerinfini.com', 'admin', 'password123')
# Also add client profile for existing producer to avoid confusion? No.
