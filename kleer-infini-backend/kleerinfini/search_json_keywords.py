import json
import os

def search_keywords():
    filepath = r"C:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini\products_api_ps.json"
    keywords = ["Zellige", "Olive", "Savon"]
    
    try:
        with open(filepath, 'rb') as f:
            content = f.read()
            try: data = json.loads(content.decode('utf-16'))
            except: data = json.loads(content.decode('utf-8', errors='ignore'))
            
            found_count = 0
            for item in data.get('value', []):
                name = str(item.get('name', ''))
                if any(k.lower() in name.lower() for k in keywords):
                    found_count += 1
                    print(f"Match: {name}")
                    print(f"  JSON ID: {item.get('id')}")
                    print(f"  Images: {item.get('images')}")
                    print(f"  Single Image: {item.get('image')}")
                    print("-" * 20)
            
            print(f"Total keyword matches: {found_count}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    search_keywords()
