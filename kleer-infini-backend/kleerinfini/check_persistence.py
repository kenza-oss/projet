import os
import django
import sys

# Setup Django environment
sys.path.append(r'c:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User
from producers.models import ProducerProfile

print("--- DATA PERSISTENCE CHECK ---")

try:
    last_user = User.objects.filter(role='producer').latest('created_at')
    print(f"Last User Found: {last_user.email}")
    
    try:
        profile = ProducerProfile.objects.get(user=last_user)
        print(f"PROFILE STATUS: EXISTS")
        print(f"Company: {profile.company_name}")
        print(f"Activity: {profile.activity}")
    except ProducerProfile.DoesNotExist:
        print(f"PROFILE STATUS: MISSING")

except Exception as e:
    print(f"Error checking data: {e}")

print("--- CHECK FINISHED ---")
