import os
import django
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from user_messages.models import Message

def delete_self_messages():
    # More robust way to find self-messages
    all_msgs = Message.objects.all()
    count = 0
    for m in all_msgs:
        if m.sender_id == m.receiver_id:
            m.delete()
            count += 1
    print(f"Deleted {count} self-sent messages (Total check).")

if __name__ == "__main__":
    delete_self_messages()
