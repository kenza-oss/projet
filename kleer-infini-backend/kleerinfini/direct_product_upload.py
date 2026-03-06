import os
import cloudinary
import cloudinary.uploader
from pathlib import Path

# 1. Direct Cloudinary Configuration
cloudinary.config(
    cloud_name="dptb2m02i",
    api_key="432596188994381",
    api_secret="dHTbwxJTQ8DgiqzHhvt1P2mpLNY",
    secure=True
)

def upload_product_images():
    print("--- Starting Direct Cloudinary Upload (Products) ---")
    
    # Path to local product images
    base_dir = Path(r"C:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini")
    media_prod_dir = base_dir / 'media' / 'products'
    
    if not media_prod_dir.exists():
        print(f"Error: Directory not found: {media_prod_dir}")
        return

    files = [f for f in os.listdir(media_prod_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    print(f"Found {len(files)} product images to upload.\n")

    results = []
    
    for filename in files:
        local_path = media_prod_dir / filename
        # Clean filename for public_id (avoid dots other than extension)
        public_id_base = filename.rsplit('.', 1)[0]
        
        print(f"Uploading: {filename}...")
        
        try:
            with open(local_path, 'rb') as f:
                upload_result = cloudinary.uploader.upload(
                    f,
                    folder="products",
                    public_id=public_id_base,
                    overwrite=True
                )
            
            secure_url = upload_result.get('secure_url')
            public_id = upload_result.get('public_id')
            print(f"  SUCCESS: {public_id}")
            print(f"  URL: {secure_url}")
            results.append(f"{filename} | {public_id} | {secure_url}")
            
        except Exception as e:
            print(f"  FAILED: {filename} - {str(e)}")

    print("\n--- Product Upload Process Complete ---")
    # Write specifically to product_upload_results.log
    with open(base_dir / 'product_upload_results.log', 'w', encoding='utf-8') as log_file:
        log_file.write("Filename | Public ID | URL\n")
        log_file.write("-" * 50 + "\n")
        for res in results:
            log_file.write(res + "\n")

if __name__ == "__main__":
    upload_product_images()
