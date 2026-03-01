# -*- coding: utf-8 -*-
import os
import django
import sys
import json
from django.test import Client

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def verify():
    print("--- Direct Login Verification ---")
    client = Client()
    email = "james.wilson@atlantic-trading.com"
    password = "demo-password-2026"
    
    print(f"Attempting login for {email}...")
    response = client.post('/api/login/', 
                           data=json.dumps({"email": email, "password": password}),
                           content_type='application/json')
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("SUCCESS: Login logic is functional.")
        data = response.json()
        print(f"Access Token: {data.get('access')[:20]}...")
        user_role = data.get('user', {}).get('role')
        print(f"User Role: {user_role}")
    else:
        print(f"FAILURE: Received {response.status_code}")
        print(f"Detail: {response.content.decode('utf-8', errors='ignore')}")

if __name__ == "__main__":
    verify()
