import json
import os

def search_keywords():
    filepath = r"C:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini\products_api_ps.json"
    keywords = ["Zellige", "Olive", "Savon", "Miel", "Date", "Dattes"]
    
    try:
        with open(filepath, 'rb') as f:
            content = f.read()
            try: data = json.loads(content.decode('utf-16'))
            except: data = json.loads(content.decode('utf-8', errors='ignore'))
            
            output = []
            for item in data.get('value', []):
                name = str(item.get('name', ''))
                if any(k.lower() in name.lower() for k in keywords):
                    res = {
                        "name": name,
                        "json_id": item.get('id'),
                        "images": item.get('images'),
                        "image": item.get('image')
                    }
                    output.append(res)
            
            with open('priority_results.json', 'w', encoding='utf-8') as f:
                json.dump(output, f, indent=2, ensure_ascii=False)
                
            print(f"Extracted {len(output)} priority results to priority_results.json")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    search_keywords()
