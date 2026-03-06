import json

def find_filenames():
    try:
        content = open('products_api_ps.json', 'rb').read()
        try:
            data = json.loads(content.decode('utf-16'))
        except:
            data = json.loads(content.decode('utf-8', errors='ignore'))
            
        items = data.get('value', [])
        results = []
        for i in items:
            name = i.get('name', '')
            if any(k in name for k in ["Zellige", "Olive", "Savon", "Huile"]):
                results.append({
                    "name": name,
                    "images": i.get("images", [])
                })
                
        with open('found_filenames.json', 'w') as f:
            json.dump(results, f, indent=2)
    except Exception as e:
        with open('find_error.txt', 'w') as f:
            f.write(str(e))

if __name__ == "__main__":
    find_filenames()
