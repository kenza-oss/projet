import os
import django
import sys
import uuid

# Setup Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from user_messages.models import Message

User = get_user_model()

def verify_messaging():
    print("--- Verifying Messaging System ---")
    
    # 1. Get or create users
    james, _ = User.objects.get_or_create(email='james.wilson@atlantic-trading.com', defaults={'role': 'client', 'first_name': 'James', 'last_name': 'Wilson'})
    jugurtha, _ = User.objects.get_or_create(email='jugurtha.garoui@producer.com', defaults={'role': 'producer', 'first_name': 'Jugurtha', 'last_name': 'Garoui'})
    
    print(f"James UUID: {james.id}")
    print(f"Jugurtha UUID: {jugurtha.id}")
    
    # 2. Create a message from James to Jugurtha
    msg = Message.objects.create(
        sender=james,
        receiver=jugurtha,
        content="Hello Jugurtha, this is James."
    )
    
    print(f"Message ID: {msg.id}")
    print(f"Sender UUID in model: {msg.sender_uuid}")
    print(f"Receiver UUID in model: {msg.receiver_uuid}")
    print(f"Conversation ID: {msg.conversation_id}")
    
    # Check if conversation ID is deterministic
    ids = sorted([str(james.id), str(jugurtha.id)])
    expected_cid = f"{ids[0]}_{ids[1]}"
    
    if msg.conversation_id == expected_cid:
        print("[SUCCESS] Conversation ID is deterministic and correct.")
    else:
        print(f"[FAILURE] Conversation ID mismatch. Expected {expected_cid}, got {msg.conversation_id}")

    # 3. Create a reply from Jugurtha to James
    reply = Message.objects.create(
        sender=jugurtha,
        receiver=james,
        content="Hello James, I received your message."
    )
    
    if reply.conversation_id == expected_cid:
        print("[SUCCESS] Reply belongs to the same conversation.")
    else:
        print(f"[FAILURE] Reply conversation ID mismatch. Got {reply.conversation_id}")

if __name__ == "__main__":
    verify_messaging()
