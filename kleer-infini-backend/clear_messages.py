import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kleerinfini.settings')
django.setup()

from user_messages.models import Message

def clear_messages():
    count = Message.objects.all().count()
    print(f"Deleting {count} messages...")
    Message.objects.all().delete()
    print("Done.")

if __name__ == "__main__":
    clear_messages()
