import os

def find_urls():
    logs = ['upload_results.log', 'product_upload_results.log']
    keywords = ['Zellige', 'Huile', 'Savon', 'Deglet', 'Zellige_Iridescent', 'Huile_d_Olive']
    
    found = []
    for log in logs:
        if not os.path.exists(log): continue
        with open(log, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                if any(k.lower() in line.lower() for k in keywords):
                    found.append(line.strip())
    
    for f in found:
        print(f)

if __name__ == "__main__":
    find_urls()
