import requests
import random
import json

url = "http://localhost:8000/api/register/"
email = f"test_final_{random.randint(1000, 9999)}@gmail.com"

payload = {
    "first_name": "Test",
    "last_name": "Final",
    "email": email,
    "password": "password123",
    "company_name": "Test Final Co",
    "phone": "0555000000",
    "country": "Algérie",
    "sector": "Tech",
    "language": "fr",
    "website": ""
}

print(f"Testing registration for: {email}")
try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    try:
        data = response.json()
        print("Response JSON:")
        print(json.dumps(data, indent=2))
    except:
        print("Response Text (Not JSON):")
        print(response.text)
except Exception as e:
    print(f"Request failed: {e}")
