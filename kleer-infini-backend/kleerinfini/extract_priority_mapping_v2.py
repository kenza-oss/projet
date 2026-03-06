import json
import os

def extract_mapping():
    ids = [49, 50, 64, 52] # Adding 52 just in case (Rouge à lèvres)
    filepath = r"C:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini\products_api_ps.json"
    
    results = {}
    try:
        with open(filepath, 'rb') as f:
            content = f.read()
            try:
                data = json.loads(content.decode('utf-16'))
            except:
                data = json.loads(content.decode('utf-8', errors='ignore'))
            
            for item in data.get('value', []):
                if item.get('id') in ids:
                    pid = item.get('id')
                    imgs = item.get('images', [])
                    if not imgs and 'image' in item:
                        imgs = [item['image']]
                    
                    filenames = []
                    for img in imgs:
                        url = img if isinstance(img, str) else img.get('image')
                        if url:
                            filenames.append(os.path.basename(url))
                    results[pid] = {"name": item.get('name'), "filenames": filenames}
                    
        with open('priority_filename_map.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"Extracted mapping for {len(results)} priority products.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_mapping()
