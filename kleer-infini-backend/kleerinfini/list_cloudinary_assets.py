import os
import cloudinary
import cloudinary.api
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
  api_key = os.getenv("CLOUDINARY_API_KEY"),
  api_secret = os.getenv("CLOUDINARY_API_SECRET")
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
