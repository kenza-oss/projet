import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from producers.models import ProducerProfile

profiles = ProducerProfile.objects.all()
print(f"Total profiles: {profiles.count()}")
for p in profiles:
    print(f"Profile ID: {p.id}, User: {p.user.email}, Company: {p.company_name}")
