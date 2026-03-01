import os
import django
import sys

# Add the current directory to sys.path to find 'config'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from user_messages.models import Message

def clear_messages():
    count = Message.objects.all().count()
    print(f"Deleting {count} messages...")
    Message.objects.all().delete()
    print("Done.")

if __name__ == "__main__":
    clear_messages()
