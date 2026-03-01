from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from notifications.models import Notification
from user_messages.models import Message  # Adjust path if needed
import logging
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from subscriptions.models import Subscription  # new import for subscription signal
from django.contrib.auth import get_user_model

User = get_user_model()
channel_layer = get_channel_layer()


logger = logging.getLogger(__name__)

@receiver(post_save, sender=Message)
def create_notification_on_message(sender, instance, created, **kwargs):
    if created:
        try:
            notification = Notification.objects.create(
                user=instance.receiver,
                message=f"You received a message from {instance.sender.email}",
                notification_type='message',
                related_id=str(instance.id)
            )
            logger.info(f"✅ Notification created: {notification.id}")

            # Send WebSocket notification
            channel_layer = get_channel_layer()
            notification_data = {
                'id': notification.id,
                'message': notification.message,
                'is_read': False,
                'notification_type': notification.notification_type,
                'related_id': notification.related_id,
                'created_at': notification.created_at.isoformat()
            }

            async_to_sync(channel_layer.group_send)(
                f'notifications_{instance.receiver.id}',
                {
                    'type': 'send_notification',
                    'notification': notification_data
                }
            )

        except Exception as e:
            logger.error(f"❌ Failed to create/send notification: {str(e)}")

@receiver(post_save, sender=Subscription)
def notify_admins_on_subscription(sender, instance, created, **kwargs):
    if created:
        try:
            admins = User.objects.filter(is_staff=True)
            for admin in admins:
                notification = Notification.objects.create(
                    user=admin,
                    message=f"New subscription from {instance.user.email} - Status: {instance.status}",
                    notification_type='subscription',
                    related_id=str(instance.id)
                )
                logger.info(f"📢 Admin notified: {admin.email}")

                notification_data = {
                    'id': notification.id,
                    'message': notification.message,
                    'is_read': False,
                    'notification_type': notification.notification_type,
                    'related_id': notification.related_id,
                    'created_at': notification.created_at.isoformat()
                }

                async_to_sync(channel_layer.group_send)(
                    f'notifications_{admin.id}',
                    {
                        'type': 'send_notification',
                        'notification': notification_data
                    }
                )

        except Exception as e:
            logger.error(f"❌ Failed to notify admins of subscription: {str(e)}")
