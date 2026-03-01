from rest_framework import generics
from .models import Message
from django.db import models
from .serializers import MessageSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.utils.translation import gettext as _
import logging
from notifications.models import Notification
from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

User = get_user_model()

logger = logging.getLogger(__name__)

class MessageListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(operation_summary="List all messages related to the authenticated user")

    def get_queryset(self):
        user = self.request.user
        if not user or user.is_anonymous:
            return Message.objects.none()
            
        # Correctly get all messages where user is involved
        return Message.objects.filter(
            models.Q(sender=user) | models.Q(receiver=user)
        ).distinct().order_by('-timestamp')
    
    @swagger_auto_schema(
        operation_summary="Send a message",
        request_body=MessageSerializer,
        responses={201: MessageSerializer()}
    )
    def perform_create(self, serializer):
        try:
            print(f"[DEBUG] perform_create starting for request user: {self.request.user}")
            
            # Use request.user strictly
            sender = self.request.user
            if not sender or sender.is_anonymous:
                raise permissions.exceptions.NotAuthenticated("Authentication required to send messages.")
            
            message = serializer.save(sender=sender)
            
            # Use Serializer for standardized output
            # Use Serializer for standardized output - must use a mock request or ensure context is handled
            # Since websocket broadcast happens in background, we mimic request context if possible
            # But the best way is to ensure MessageSerializer.get_partner_name handles missing request gracefully
            # which it now does by falling back to receiver_name.
            message_data = MessageSerializer(message, context={'request': self.request}).data

            # Send message via WebSocket
            channel_layer = get_channel_layer()

            async_to_sync(channel_layer.group_send)(
                f'chat_{message.receiver_id}',
                {
                    'type': 'chat_message',
                    'message': message_data
                }
            )

            async_to_sync(channel_layer.group_send)(
                f'chat_{message.sender_id}',
                {
                    'type': 'message_sent',
                    'message': message_data
                }
            )

            # Create notification
            try:
                notification = Notification.objects.create(
                    user=message.receiver,
                    message=f"You received a message from {message.sender.email}",
                    notification_type='message',
                    related_id=str(message.id)
                )
                print("[SUCCESS] Notification created:", notification.id)
                logger.info(f"Notification created: {notification.id}")

                # Send notification via WebSocket
                notification_data = {
                    'id': notification.id,
                    'message': notification.message,
                    'is_read': False,
                    'notification_type': notification.notification_type,
                    'related_id': notification.related_id,
                    'created_at': notification.created_at.isoformat()
                }

                async_to_sync(channel_layer.group_send)(
                    f'notifications_{message.receiver_id}',
                    {
                        'type': 'send_notification',
                        'notification': notification_data
                    }
                )
            except Exception as e:
                logger.error(f"[ERROR] Failed to create or send notification: {str(e)}")
                print("[ERROR] Notification creation error:", str(e))

            logger.info(f"Message and notification sent: {message.id}")

        except Exception as e:
            logger.error(f"Error in perform_create: {str(e)}")
            raise

    def create(self, request, *args, **kwargs):
        """Override create to handle errors properly and log headers for debugging"""
        auth_header = request.headers.get('Authorization', 'MISSING')
        print(f"[DEBUG] POST /api/messages/ | Auth Header: {auth_header[:25]}...")
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error creating message via API: {str(e)}")
            return Response(
                {'error': 'Failed to send message', 'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MessageByReceiverAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Get messages between authenticated user and specific receiver",
        manual_parameters=[
            openapi.Parameter('receiver_id', openapi.IN_PATH, description="Receiver User ID", type=openapi.TYPE_STRING)
        ],
        responses={200: MessageSerializer(many=True)}
    )
    def get(self, request, receiver_id):
        try:
            # Get messages between current user and specified receiver
            messages = Message.objects.filter(
                (models.Q(sender=request.user) & models.Q(receiver_id=receiver_id)) |
                (models.Q(sender_id=receiver_id) & models.Q(receiver=request.user))
            ).order_by("timestamp")
            
            serializer = MessageSerializer(messages, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching messages: {str(e)}")
            return Response(
                {'error': 'Failed to fetch messages', 'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


