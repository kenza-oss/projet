import os
import sys
import django

# FORCE UTF-8 ENCODING for Windows/Console consistency
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from events.models import Event

def repair_urls():
    print("Starting URL repair...")
    events = Event.objects.filter(url__contains='eventseye.com')
    count = 0
    for event in events:
        if '/fairs/' not in event.url:
            old_url = event.url
            event.url = event.url.replace('https://www.eventseye.com/', 'https://www.eventseye.com/fairs/')
            event.save()
            print(f"Repaired: {event.name}")
            print(f"  Old: {old_url}")
            print(f"  New: {event.url}")
            count += 1
    
    print(f"Finished. Repaired {count} URLs.")

if __name__ == "__main__":
    repair_urls()
