from django.urls import path
from . import views

urlpatterns = [
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('mark-as-read/', views.MarkAsReadView.as_view(), name='mark-as-read'),
]