import json

def get_cat_map():
    try:
        content = open('categories_dump.json', 'rb').read()
        try:
            data = json.loads(content.decode('utf-16'))
        except:
            data = json.loads(content.decode('utf-8', errors='ignore'))
            
        mapping = {}
        for item in data:
            name = item.get('name')
            img_url = item.get('image_url', '')
            if name and img_url:
                # Extract filename without extension
                filename = img_url.split('/')[-1].split('.')[0]
                mapping[name] = filename
                
        with open('category_name_to_file.json', 'w') as f:
            json.dump(mapping, f, indent=2)
    except Exception as e:
        with open('cat_map_error.txt', 'w') as f:
            f.write(str(e))

if __name__ == "__main__":
    get_cat_map()
