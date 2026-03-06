import json
import os

def analyze_robust(filename):
    if not os.path.exists(filename):
        print(f"{filename} not found.")
        return
    
    print(f"\n--- Robust Analysis of {filename} (Size: {os.path.getsize(filename)} bytes) ---")
    encodings = ['utf-8', 'utf-16', 'latin-1', 'cp1252']
    data = None
    for enc in encodings:
        try:
            with open(filename, 'r', encoding=enc) as f:
                data = json.load(f)
                print(f"  Successfully decoded using {enc}")
                break
        except Exception:
            continue
    
    if data:
        if isinstance(data, dict):
            print(f"  Type: Dict. Keys: {list(data.keys())}")
            for key in data.keys():
                val = data[key]
                if isinstance(val, list):
                    print(f"    Key '{key}' has {len(val)} items.")
        elif isinstance(data, list):
            print(f"  Type: List. Length: {len(data)}")
    else:
        print("  Failed to decode or parse as JSON with all attempted encodings.")

files = [
    'products_api_ps.json',
    'categories_dump.json',
    '../../temp_products.json',
    '../../kleerinfini-b2b-platform/kleerinfini-ui/products_old.json',
    '../../event_audit.json'
]

for f in files:
    analyze_robust(f)
