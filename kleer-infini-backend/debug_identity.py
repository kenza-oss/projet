import os
import django
import sys
import json
from django.conf import settings
from django.db import models

# Setup Django environment
# The manage.py is in kleerinfini/, so we need that in path to find 'config'
sys.path.append(r'c:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from producers.models import ProducerProfile
from users.models import User
from user_messages.models import Message
from producers.serializers import ProducerProfileSerializer
from user_messages.serializers import MessageSerializer

def debug_identity():
    print("--- DEBUGGING IDENTITY & MESSAGES ---")
    
    # 1. Find the producer user (Garoui)
    # We'll look for email containing 'garoui'
    producer_user = User.objects.filter(email__icontains='garoui').first()
    if not producer_user:
        print("ERROR: Could not find producer user 'garoui'")
        return

    print(f"Producer User: {producer_user.email} (ID: {producer_user.id})")
    
    # 2. Get Profile
    try:
        profile = ProducerProfile.objects.get(user=producer_user)
        print(f"Producer Profile ID: {profile.id}")
        
        # 3. Simulate Serializer Output
        serializer = ProducerProfileSerializer(profile)
        data = serializer.data
        print(f"Serialized Profile 'user_id': {data.get('user_id')}")
        print(f"Serialized Profile 'id': {data.get('id')}")
        print(f"Serialized Profile 'user': {data.get('user')}")
        
        # Check type of user_id in data
        print(f"Type of user_id: {type(data.get('user_id'))}")
        
    except ProducerProfile.DoesNotExist:
        print("Producer has no profile!")

    # 4. Find the 'Client James'
    james = User.objects.filter(email__icontains='james').first()
    if james:
        print(f"\nClient James: {james.email} (ID: {james.id})")
    else:
        print("\nClient James not found.")

    # 5. Inspect ALL Messages involving the producer
    if producer_user:
        messages_api_url = "/api/messages/"
        # We'll simulate the response of MessageListCreateAPIView
        from user_messages.serializers import MessageSerializer
        msgs = Message.objects.filter(
            models.Q(sender=producer_user) | models.Q(receiver=producer_user)
        ).order_by('-timestamp')[:5]
        
        print(f"\nRecent Messages involving producer {producer_user.email}:")
        print(f"Producer user_id: {data.get('user_id')}")
        for m in msgs:
            data_out = MessageSerializer(m).data
            print(f"Msg ID: {data_out['id']}")
            print(f"  Sender: {data_out['sender']} ({data_out['sender_name']})")
            print(f"  Receiver: {data_out['receiver']} ({data_out['receiver_name']})")
            
            # IDENTITY TEST
            is_me = (str(data_out['sender']) == str(data.get('user_id')))
            print(f"  Is sender == user_id (Me)? {is_me}")

if __name__ == '__main__':
    debug_identity()
