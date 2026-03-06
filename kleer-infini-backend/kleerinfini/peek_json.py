import json
import os

files = ['categories_dump.json', 'products_api_ps.json', 'products_api.json']

for filename in files:
    if os.path.exists(filename):
        print(f"\n=== {filename} ===")
        try:
            with open(filename, 'r', encoding='utf-16') as f:
                data = json.load(f)
                if isinstance(data, dict):
                    if 'value' in data:
                        print(f"Type: Dict with 'value' list. Items: {len(data['value'])}")
                        for item in data['value'][:3]:
                            print(f"  - {item.get('name')}")
                    else:
                        print(f"Type: Dict. Keys: {list(data.keys())}")
                elif isinstance(data, list):
                    print(f"Type: List. Items: {len(data)}")
                    for item in data[:3]:
                        print(f"  - {item.get('name')}")
        except Exception as e:
            print(f"Error reading {filename}: {e}")
    else:
        print(f"\n{filename} does not exist.")
