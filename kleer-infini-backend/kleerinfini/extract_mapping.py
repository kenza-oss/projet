import json
import os

def extract_mapping():
    try:
        with open('products_api_ps.json', 'rb') as f:
            content = f.read().decode('utf-16')
            data = json.loads(content)
        
        mapping = {}
        for product in data:
            name = product.get('name')
            images = product.get('images', [])
            if name:
                # Extract filename from URL
                filenames = []
                for img in images:
                    if 'products_images/' in img:
                        filenames.append('products_images/' + img.split('products_images/')[-1])
                    elif 'products/' in img:
                        filenames.append('products/' + img.split('products/')[-1])
                mapping[name] = filenames
        
        with open('/tmp/product_image_mapping.json', 'w', encoding='utf-8') as f:
            json.dump(mapping, f, indent=2, ensure_ascii=False)
        print(f"Extracted {len(mapping)} mappings.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_mapping()
