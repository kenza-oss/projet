import os

def list_non_capture():
    log = 'product_upload_results.log'
    if not os.path.exists(log):
        print("Log missing")
        return
        
    print(f"--- First 50 non-capture files in {log} ---")
    try:
        with open(log, 'rb') as f:
            content = f.read()
            try: text = content.decode('utf-16')
            except: text = content.decode('utf-8', errors='ignore')
            
            lines = text.splitlines()
            count = 0
            for line in lines:
                if "Capture" not in line and "|" in line:
                    print(line.strip())
                    count += 1
                if count >= 50: break
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_non_capture()
