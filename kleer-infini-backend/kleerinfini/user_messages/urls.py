from django.urls import path
from .views import MessageListCreateAPIView,MessageByReceiverAPIView

urlpatterns = [
    path('messages/', MessageListCreateAPIView.as_view(), name='message-list-create'),
     path('messages/<uuid:receiver_id>/', MessageByReceiverAPIView.as_view(), name='message-by-receiver'),
]
