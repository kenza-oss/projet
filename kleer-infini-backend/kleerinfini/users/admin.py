from unfold.admin import ModelAdmin
from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(ModelAdmin):
    list_display = ('id', 'email', 'role', 'is_active', 'is_staff', 'created_at')
    search_fields = ('email', 'role')
    list_filter = ('role', 'is_active', 'is_staff')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    fieldsets = (
        (None, {
            'fields': ('email', 'role', 'is_active', 'is_staff', 'password', 'created_at')
        }),
    )
    unfold_icon = "fa-solid fa-user"
    unfold_section = "Utilisateurs"
