import django
import os
import sys

# Set up Django environment
sys.path.append(r"C:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini")
os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'
django.setup()

from products.models import Product, Category

def repair():
    print("=== Database Character Repair Logic ===")
    
    # Mapping for common corruptions
    # 1. Direct character replacements
    REPLACEMENTS = {
        '\xe0\x89': '\xc9',      # à\x89 -> É
        '\xe0\x32': 'à ',        # Just in case
    }
    
    # 2. Sequence replacements (Mojibake UTF-8 read as Latin-1)
    # These strings contain the actual Unicode characters for Ã, © etc.
    MOJIBAKE = {
        'Ã©': 'é',
        'Ã ': 'à',
        'Ã¨': 'è',
        'Ã¹': 'ù',
        'Ãª': 'ê',
        'Ã«': 'ë',
        'Ã®': 'î',
        'Ã': 'É',  # Actually Ã\x89 often becomes Ã
        'â€™': "'",
        'â€”': "—",
        'â€“': "–",
    }

    def fix_text(text):
        if not text: return text
        original = text
        
        # Apply hardcoded replacements first
        for bad, good in REPLACEMENTS.items():
            text = text.replace(bad, good)
        
        # Apply mojibake fixes
        # We do this carefully for common patterns
        for bad, good in MOJIBAKE.items():
            text = text.replace(bad, good)
            
        return text

    # Apply to Products
    print("\nProcessing Products...")
    p_count = 0
    for p in Product.objects.all():
        old_name = p.name
        old_desc = p.description
        
        new_name = fix_text(old_name)
        new_desc = fix_text(old_desc)
        
        if new_name != old_name or new_desc != old_desc:
            p.name = new_name
            p.description = new_desc
            p.save()
            p_count += 1
            print(f"  Fixed Product {p.id}")

    # Apply to Categories
    print("\nProcessing Categories...")
    c_count = 0
    for c in Category.objects.all():
        old_name = c.name
        old_desc = c.description
        
        new_name = fix_text(old_name)
        new_desc = fix_text(old_desc)
        
        if new_name != old_name or new_desc != old_desc:
            c.name = new_name
            c.description = new_desc
            c.save()
            c_count += 1
            print(f"  Fixed Category {c.id}")

    print(f"\nRepair complete. {p_count} products and {c_count} categories updated.")

if __name__ == "__main__":
    repair()
