from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(ModelAdmin):
    list_display = ('user', 'message', 'is_read', 'notification_type', 'created_at')
    list_filter = ('is_read', 'notification_type', 'created_at')
    search_fields = ('user__email', 'message')
    unfold_icon = "fa-solid fa-bell"
    unfold_section = "Utilisateurs"