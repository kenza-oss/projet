import json
import os

def analyze(filename, encoding='utf-8'):
    if not os.path.exists(filename):
        print(f"{filename} not found.")
        return
    
    print(f"\n--- Analyzing {filename} (Size: {os.path.getsize(filename)} bytes) ---")
    try:
        with open(filename, 'r', encoding=encoding) as f:
            data = json.load(f)
            if isinstance(data, dict):
                print(f"Top-level Keys: {list(data.keys())}")
                for key in data.keys():
                    val = data[key]
                    if isinstance(val, list):
                        print(f"  Key '{key}' is a list with {len(val)} items.")
                        if len(val) > 0:
                            print(f"    First item keys: {list(val[0].keys()) if hasattr(val[0], 'keys') else 'Not a dict'}")
            elif isinstance(data, list):
                print(f"Top-level is a list with {len(data)} items.")
                if len(data) > 0:
                    print(f"  First item keys: {list(data[0].keys()) if hasattr(data[0], 'keys') else 'Not a dict'}")
    except Exception as e:
        print(f"Error: {e}")

analyze('products_api_ps.json', 'utf-16')
analyze('categories_dump.json', 'utf-16')
analyze('products_api.json', 'utf-16')
analyze('../../temp_products.json', 'utf-8')
