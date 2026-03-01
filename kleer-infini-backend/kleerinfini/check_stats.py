import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from producers.models import ProducerProfile

profiles = ProducerProfile.objects.all()
print(f"Total profiles: {profiles.count()}")

for p in profiles:
    views = p.get_views_with_bonus()
    likes = p.get_likes_with_bonus()
    print(f"Profile: {p.company_name} (ID: {p.id})")
    print(f"  Approved: {p.is_approved}, Date: {p.approval_date}")
    print(f"  Stats in DB: {p.stats}")
    print(f"  Calculated Views: {views}")
    print(f"  Calculated Likes: {likes}")
    print("-" * 20)
