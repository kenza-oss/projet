import django
import os
import sys

# Set up Django environment
sys.path.append(r"C:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini")
os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'
django.setup()

from products.models import Product, Category

def scan():
    print("--- Scanning for corruptions (UTF-8 Output) ---")
    
    corruptions = {}
    
    def check(instance, field_name):
        val = getattr(instance, field_name)
        if not val: return
        
        # Check for non-standard sequences or known corruptions
        found = False
        if 'à\x89' in val: found = True
        if 'à\xa6' in val: found = True
        if 'Ã©' in val: found = True
        if 'Ã ' in val: found = True
        if '\xc2' in val.encode('utf-8', 'replace').decode('utf-8', 'ignore') and any(ord(c) > 127 for c in val):
             # This is a bit broad, but let's see
             pass

        if any(ord(c) == 0x89 or ord(c) == 0xA6 for c in val):
            found = True

        if found:
            # We encode to utf-8 and then print as repr to avoid terminal crash
            print(f"[{instance.__class__.__name__} {instance.id}] {field_name}: {repr(val)}")

    for p in Product.objects.all():
        check(p, 'name')
        check(p, 'description')
    
    for c in Category.objects.all():
        check(c, 'name')
        check(c, 'description')

if __name__ == "__main__":
    scan()
