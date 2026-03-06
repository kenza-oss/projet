import json
from pathlib import Path

BASE_DIR = Path(r"C:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini")

def peek_products():
    try:
        with open(BASE_DIR / 'products_api_ps.json', 'rb') as f:
            content = f.read()
            # Try to handle the potential utf-16le issue
            try:
                data = json.loads(content.decode('utf-16'))
            except:
                data = json.loads(content.decode('utf-8', errors='ignore'))
            
            items = data.get('value', [])
            print(f"Total items in JSON: {len(items)}")
            if items:
                print("First item structure:")
                # Show keys and first item values
                first = items[0]
                for k, v in first.items():
                    if k != 'description' and k != 'desc_longue':
                        print(f"  {k}: {v}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    peek_products()
