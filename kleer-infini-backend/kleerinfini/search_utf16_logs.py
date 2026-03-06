import os

def search_utf16_logs():
    logs = ['upload_results.log', 'product_upload_results.log', 'recent_logs.log']
    keywords = ['Zellige', 'Olive', 'Savon']
    
    print("--- Searching UTF-16 Logs for Priority Keywords ---")
    for log in logs:
        if not os.path.exists(log): continue
        print(f"\nChecking {log}...")
        try:
            with open(log, 'rb') as f:
                content = f.read()
                try: text = content.decode('utf-16')
                except: text = content.decode('utf-8', errors='ignore')
                
                lines = text.splitlines()
                match_count = 0
                for line in lines:
                    if any(k.lower() in line.lower() for k in keywords):
                        print(f"  {line.strip()}")
                        match_count += 1
                print(f"  Found {match_count} matches in {log}.")
        except Exception as e:
            print(f"  Error reading {log}: {e}")

if __name__ == "__main__":
    search_utf16_logs()
