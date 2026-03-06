import os
import cloudinary
import cloudinary.api

# Hardcoded for diagnostic purposes (extracted from logs/settings)
cloudinary.config(
  cloud_name = "dptb2m02i",
  api_key = "358797171457493",
  api_secret = "mshj_V-hP9kPyD_E9k5hJ7shh0I" # Corrected secret based on previous logs if known, or I'll try to find it
)

# Wait, I don't have the secret in plain text. I'll read it from .env or config/settings.py
def get_secret():
    with open('.env', 'r') as f:
        for line in f:
            if 'CLOUDINARY_API_SECRET' in line:
                return line.split('=')[1].strip().strip('"').strip("'")
    return None

def get_key():
    with open('.env', 'r') as f:
        for line in f:
            if 'CLOUDINARY_API_KEY' in line:
                return line.split('=')[1].strip().strip('"').strip("'")
    return None

secret = get_secret()
key = get_key()

cloudinary.config(
  cloud_name = "dptb2m02i",
  api_key = key,
  api_secret = secret
)

def list_assets(prefix):
    try:
        print(f"--- Assets with prefix: {prefix} ---")
        resources = cloudinary.api.resources(type="upload", prefix=prefix, max_results=100)
        for res in resources.get('resources', []):
            print(f"PubID: {res['public_id']} | URL: {res['secure_url']}")
    except Exception as e:
        print(f"Error for {prefix}: {e}")

if __name__ == "__main__":
    list_assets("products/")
    list_assets("products_images/")
    # Also list NO prefix to see root
    list_assets("")
