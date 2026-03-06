import json
import os

def extract_mapping():
    ids = [49, 50, 64]
    filepath = r"C:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini\products_api_ps.json"
    
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    try:
        with open(filepath, 'rb') as f:
            content = f.read()
            # Try UTF-16 then UTF-8
            try:
                data = json.loads(content.decode('utf-16'))
            except:
                data = json.loads(content.decode('utf-8', errors='ignore'))
            
            for item in data.get('value', []):
                if item.get('id') in ids:
                    print(f"ID: {item.get('id')} | Name: {item.get('name')}")
                    imgs = item.get('images', [])
                    if not imgs and 'image' in item:
                        imgs = [item['image']]
                    for img in imgs:
                        url = img if isinstance(img, str) else img.get('image')
                        print(f"  - Image: {url}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_mapping()
