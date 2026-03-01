import os
import django
from django.core.files.base import ContentFile
from cloudinary.uploader import upload
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def test_cloudinary():
    try:
        print(f"Testing Cloudinary connection for Cloud: {settings.CLOUDINARY_STORAGE['CLOUD_NAME']}...")
        # Simple test: upload a tiny text file as a raw file
        result = upload(
            ContentFile(b"Kleer Infini Production Test"),
            public_id="test_launch_connection"
        )
        print(f"[SUCCESS] Cloudinary is live! File URL: {result['url']}")
    except Exception as e:
        print(f"[ERROR] Cloudinary setup failed: {e}")

if __name__ == "__main__":
    test_cloudinary()
