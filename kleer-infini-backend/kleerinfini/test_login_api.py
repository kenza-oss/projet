import requests
import json

def test_login():
    url = "http://127.0.0.1:8001/api/login/"
    payload = {
        "email": "admin@kleerinfini.com",
        "password": "50SnFK-{|7H<$E<qER5NY0Q8*h(N,%CI"
    }
    headers = {
        'Content-Type': 'application/json'
    }

    print(f"Testing login at {url}...")
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("SUCCESS: Login API returned 200 OK.")
            data = response.json()
            print(f"User Role: {data.get('user', {}).get('role')}")
        else:
            print(f"FAILURE: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login()
