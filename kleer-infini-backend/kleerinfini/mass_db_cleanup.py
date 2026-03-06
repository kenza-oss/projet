import os
import psycopg2
import re

# --- SANITIZE ENVIRONMENT ---
os.environ["PYTHONIOENCODING"] = "utf-8"
keys_to_del = [k for k in os.environ if any(ord(c) > 127 for c in k or os.environ[k])]
for k in keys_to_del: del os.environ[k]

DB_CONFIG = {
    'dbname': 'postgres',
    'user': 'postgres.cpuchjragjrkmbejsafy',
    'password': '9KGM7rj9bMDEl7b@',
    'host': 'aws-1-eu-west-1.pooler.supabase.com',
    'port': '5432'
}

# --- UNICODE CORRECTION DICTIONARY (Hex based for precision) ---
CORRECTIONS = {
    chr(0x80) + chr(0x99): "'",  # Mangled apostrophe
    chr(0x80) + chr(0x93): "–",  # En-dash
    chr(0x80) + chr(0x94): "—",  # Em-dash
    chr(0x80) + chr(0x9c): '"',  # Left quote
    chr(0x80) + chr(0x9d): '"',  # Right quote
    "dAlgérie": "d'Algérie",
    "lun ": "l'un ",
    "lartisanat": "l'artisanat",
    "nest ": "n'est ",
    "sharmonise": "s'harmonise",
    "dapparence": "d'apparence",
    "lélément": "l'élément",
    "dun ": "d'un ",
    "lémotion": "l'émotion",
    "oà¹": "où",
    "Dubaà¯": "Dubaï",
    "à©": "é", "à ": "à", "à¨": "è", "à¢": "â",
    "Ã©": "é", "Ã ": "à", "Ãª": "ê", "Ã®": "î", "Ã´": "ô", "Ã»": "û", "Ã¨": "è", "Ã§": "ç",
    "Ã‰": "É", "Ã¢": "â", "Ã": "à", 
    "â€“": "–", "â€™": "'", "â€”": "—", "â€œ": '"', "â€\x9d": '"',
    "€™": "'", "€“": "–", "€œ": '"',
}

def fix_text(text):
    if not text: return ""
    # 1. Apply specific mappings
    for mangled, fixed in CORRECTIONS.items():
        text = text.replace(mangled, fixed)
    
    # 2. Aggressive char cleanup for remaining artifacts
    text = text.replace(chr(0x80), "")
    text = text.replace(chr(0x99), "")
    text = text.replace("â", "")
    text = text.replace("Â", "")
    
    return text

def normalize_path(path):
    if not path: return path
    # If it's a full Cloudinary URL, extract the relative part
    # Pattern: https://res.cloudinary.com/.../upload/(v\d+/)?(path/to/file)
    pattern = r"https?://res\.cloudinary\.com/[^/]+/image/upload/(v\d+/)?(.+)"
    match = re.search(pattern, path)
    if match:
        return match.group(2)
    return path

def mass_cleanup():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # 1. Clean Category Names and Descriptions
        cur.execute("SELECT id, name, description FROM products_category")
        cats = cur.fetchall()
        for cid, name, desc in cats:
            new_name = fix_text(name)
            new_desc = fix_text(desc)
            cur.execute("UPDATE products_category SET name = %s, description = %s WHERE id = %s", (new_name, new_desc, cid))

        # 2. Clean Product Names and Descriptions
        cur.execute("SELECT id, name, description, desc_courte, desc_longue FROM products_product")
        prods = cur.fetchall()
        for pid, name, desc, short, long in prods:
            new_name = fix_text(name)
            new_desc = fix_text(desc)
            new_short = fix_text(short)
            new_long = fix_text(long)
            cur.execute("UPDATE products_product SET name = %s, description = %s, desc_courte = %s, desc_longue = %s WHERE id = %s", 
                        (new_name, new_desc, new_short, new_long, pid))

        # 3. Normalize Category Image Paths
        cur.execute("SELECT id, image FROM products_category WHERE image IS NOT NULL")
        cat_imgs = cur.fetchall()
        for cid, img in cat_imgs:
            new_path = normalize_path(img)
            if new_path != img:
                cur.execute("UPDATE products_category SET image = %s WHERE id = %s", (new_path, cid))

        # 4. Normalize Product Image Paths
        cur.execute("SELECT id, image FROM products_productimage")
        prod_imgs = cur.fetchall()
        for iid, img in prod_imgs:
            new_path = normalize_path(img)
            if new_path != img:
                cur.execute("UPDATE products_productimage SET image = %s WHERE id = %s", (new_path, iid))

        # 5. Move Zellige (ID 64) to Category 191 (Carrelage)
        cur.execute("UPDATE products_product SET category_id = 191 WHERE id = 64")

        # 6. Manual Force for Priority IDs (to ensure they are correct)
        PRIORITY = {
            64: "products_images/ugxttkuwz2rgvi8gx4wm.png",
            50: "products_images/awmjttzdupnhpvup05ro.jpg",
            49: "products_images/fjocfrsfygu2hmvyl8ml.png"
        }
        for pid, rel_path in PRIORITY.items():
            cur.execute("SELECT id FROM products_productimage WHERE product_id = %s", (pid,))
            row = cur.fetchone()
            if row:
                cur.execute("UPDATE products_productimage SET image = %s WHERE product_id = %s", (rel_path, pid))
            else:
                cur.execute("INSERT INTO products_productimage (product_id, image) VALUES (%s, %s)", (pid, rel_path))

        conn.commit()
        cur.close()
        conn.close()
        # Silent success
    except Exception:
        pass

if __name__ == "__main__":
    mass_cleanup()
