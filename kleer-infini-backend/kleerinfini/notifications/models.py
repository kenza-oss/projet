from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings


User = get_user_model()

class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    notification_type = models.CharField(max_length=50,default='message')  # 'message', 'friend_request', etc.
    related_id = models.CharField(max_length=100, null=True, blank=True)  # ID of related object
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def mark_as_read(self):
        self.is_read = True
        self.save()

    def __str__(self):
     return f"{self.user.email}: {self.message} ({'read' if self.is_read else 'unread'})"
