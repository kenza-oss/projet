import os

def find_real_images():
    logs = ['upload_results.log', 'product_upload_results.log']
    keywords = ['Zellige', 'Olive', 'Savon', 'Savon_naturel', 'Zellige_artisanal']
    
    print("--- Searching for REAL product images (excluding screenshots) ---")
    found = []
    for log in logs:
        if not os.path.exists(log): continue
        with open(log, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                # Filter out "Capture" or "Capture_d_cran"
                if any(k.lower() in line.lower() for k in keywords) and "Capture" not in line and "cran" not in line:
                    found.append(line.strip())
    
    for f in found:
        print(f)

if __name__ == "__main__":
    find_real_images()
