# -*- coding: utf-8 -*-
import os
import django
import sys
import json
from django.test import Client

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from user_messages.models import Message

User = get_user_model()

def debug_cross_test():
    print("\n--- Cross-User Verification ---")
    
    users = [
        {"email": "james.wilson@atlantic-trading.com", "name": "James Wilson"},
        {"email": "jugurtha.garoui@producer.com", "name": "Jugurtha Garoui"}
    ]
    
    for user_info in users:
        print(f"\nActing as: {user_info['email']} ({user_info['name']})")
        user = User.objects.get(email=user_info['email'])
        
        # Simulate request context
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = user
        
        messages = Message.objects.filter(django.db.models.Q(sender=user) | django.db.models.Q(receiver=user))
        
        from user_messages.serializers import MessageSerializer
        # Pass request in context
        serializer = MessageSerializer(messages, many=True, context={'request': request})
        
        if messages:
            msg_data = serializer.data[0]
            print(f"Partner Name: '{msg_data.get('partner_name')}'")
            print(f"Partner UUID: {msg_data.get('partner_uuid')}")
            
            # Validation
            expected_partner = "Jugurtha Garoui" if user_info['name'] == "James Wilson" else "James Wilson"
            if msg_data.get('partner_name') == expected_partner:
                print(f"SUCCESS: {user_info['name']} correctly sees {expected_partner}")
            else:
                print(f"FAILURE: {user_info['name']} sees '{msg_data.get('partner_name')}' but expected '{expected_partner}'")

if __name__ == "__main__":
    debug_cross_test()
