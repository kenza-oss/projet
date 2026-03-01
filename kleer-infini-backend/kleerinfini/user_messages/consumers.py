import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs
from .models import Message

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
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
            self.room_group_name = f'chat_{self.user_id}'

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
            logger.info(f"User {self.user_id} connected to WebSocket")

        except Exception as e:
            logger.error(f"Connection error: {str(e)}")
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            logger.info(f"User {self.user_id} disconnected")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            
            if data.get('type') == 'new_message':
                receiver_id = data.get('receiver_id')
                content = data.get('content')
                
                if not receiver_id or not content:
                    await self.send_error('Missing receiver_id or content')
                    return

                # Create message in DB
                message = await self.create_message_instance(
                    sender_id=self.user_id,
                    receiver_id=receiver_id,
                    content=content
                )
                
                # Broadcast specific views to each user
                await self.broadcast_to_user(receiver_id, message)
                await self.broadcast_to_user(self.user_id, message)

        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            await self.send_error('Internal server error')

    async def broadcast_to_user(self, user_id, message_instance):
        """Serializes the message from the perspective of the target user_id and sends it."""
        message_data = await self.serialize_message_for_user(message_instance, user_id)
        await self.channel_layer.group_send(
            f'chat_{user_id}',
            {
                'type': 'chat.message',
                'message': message_data
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message']
        }))

    async def message_sent(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message_sent',
            'message': event['message']
        }))

    async def notification(self, event):
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification_type': event['notification_type'],
            'message': event['message'],
            'data': event.get('data', {})
        }))

    async def send_error(self, message):
        await self.send(text_data=json.dumps({
            'type': 'error',
            'message': message
        }))

    @database_sync_to_async
    def get_user(self, token):
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            return get_user_model().objects.get(id=user_id)
        except Exception:
            return AnonymousUser()

    @database_sync_to_async
    def create_message_instance(self, sender_id, receiver_id, content):
        return Message.objects.create(
            sender_id=sender_id,
            receiver_id=receiver_id,
            content=content
        )

    @database_sync_to_async
    def serialize_message_for_user(self, message, user_id):
        from .serializers import MessageSerializer
        # We pass user_id in context so get_partner_name knows who 'me' is for the recipient
        return MessageSerializer(message, context={'user_id': user_id}).data