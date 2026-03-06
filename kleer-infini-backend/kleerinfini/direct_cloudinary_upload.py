import os
import cloudinary
import cloudinary.uploader
from pathlib import Path

# 1. Direct Cloudinary Configuration (No Django)
cloudinary.config(
    cloud_name="dptb2m02i",
    api_key="432596188994381",
    api_secret="dHTbwxJTQ8DgiqzHhvt1P2mpLNY",
    secure=True
)

def upload_category_images():
    print("--- Starting Direct Cloudinary Upload (Categories) ---")
    
    # Path to local category images
    base_dir = Path(r"C:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini")
    media_cat_dir = base_dir / 'media' / 'categories'
    
    if not media_cat_dir.exists():
        print(f"Error: Directory not found: {media_cat_dir}")
        return

    files = [f for f in os.listdir(media_cat_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    print(f"Found {len(files)} images to upload.\n")

    results = []
    
    for filename in files:
        local_path = media_cat_dir / filename
        print(f"Uploading: {filename}...")
        
        try:
            # Use binary mode for robust upload
            with open(local_path, 'rb') as f:
                upload_result = cloudinary.uploader.upload(
                    f,
                    folder="categories",
                    public_id=filename.split('.')[0],
                    overwrite=True
                )
            
            secure_url = upload_result.get('secure_url')
            public_id = upload_result.get('public_id')
            print(f"  SUCCESS: {public_id}")
            print(f"  URL: {secure_url}")
            results.append(f"{filename} | {public_id} | {secure_url}")
            
        except Exception as e:
            print(f"  FAILED: {filename} - {str(e)}")

    print("\n--- Upload Process Complete ---")
    print("\nSummary (Filename | Public ID | URL):")
    for res in results:
        print(res)

if __name__ == "__main__":
    upload_category_images()
