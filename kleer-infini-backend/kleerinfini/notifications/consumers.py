import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from .models import Notification
from urllib.parse import parse_qs


from django.contrib.auth import get_user_model
User = get_user_model()
logger = logging.getLogger(__name__)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            query_params = parse_qs(self.scope['query_string'].decode())
            token = query_params.get('token', [None])[0]
            
            if not token:
                await self.close()
                return

            self.user = await self.get_user(token)
            if not self.user or self.user.is_anonymous:
                await self.close()
                return

            self.user_id = str(self.user.id)
            self.notification_group_name = f'notifications_{self.user_id}'

            await self.channel_layer.group_add(
                self.notification_group_name,
                self.channel_name
            )
            await self.accept()
            logger.info(f"User {self.user_id} connected to notifications")

        except Exception as e:
            logger.error(f"Notification connection error: {str(e)}")
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'notification_group_name'):
            await self.channel_layer.group_discard(
                self.notification_group_name,
                self.channel_name
            )
            logger.info(f"User {self.user_id} disconnected from notifications")

    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification': event['notification']
        }))

    async def notification_read(self, event):
        await self.send(text_data=json.dumps({
            'type': 'notification.read',
            'notification_id': event['notification_id']
        }))

    @database_sync_to_async
    def get_user(self, token):
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            return User.objects.get(id=user_id)
        except Exception:
            return AnonymousUser()