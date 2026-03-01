from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer, MarkAsReadSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    

    @swagger_auto_schema(
        operation_description="Get notifications for the current user",
        responses={200: NotificationSerializer(many=True)},
    )

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

class MarkAsReadView(generics.GenericAPIView):
    serializer_class = MarkAsReadSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=MarkAsReadSerializer,
        responses={200: openapi.Response("Success", openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={'status': openapi.Schema(type=openapi.TYPE_STRING)}
        ))},
        operation_description="Mark notifications as read by providing their IDs",
        security=[{'Bearer': []}]
    )

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        notifications = Notification.objects.filter(
            id__in=serializer.validated_data['notification_ids'],
            user=request.user
        )
        
        # Mark as read
        notifications.update(is_read=True)
        
        # Send real-time update
        channel_layer = get_channel_layer()
        for notification in notifications:
            async_to_sync(channel_layer.group_send)(
                f'notifications_{request.user.id}',
                {
                    'type': 'notification.read',
                    'notification_id': notification.id
                }
            )
        
        return Response({'status': 'success'}, status=status.HTTP_200_OK)