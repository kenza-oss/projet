import uuid
from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    
    # New fields for 'Zero Defect' messaging
    conversation_id = models.CharField(max_length=255, db_index=True, blank=True)
    sender_uuid = models.UUIDField(null=True, blank=True)
    receiver_uuid = models.UUIDField(null=True, blank=True)
    
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Always set UUIDs from foreign keys
        self.sender_uuid = self.sender.id
        self.receiver_uuid = self.receiver.id
        
        # Create deterministic conversation ID (sorted user IDs)
        ids = sorted([str(self.sender.id), str(self.receiver.id)])
        self.conversation_id = f"{ids[0]}_{ids[1]}"
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"From {self.sender} to {self.receiver}: {self.content[:20]}"
