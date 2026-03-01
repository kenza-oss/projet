from unfold.admin import ModelAdmin
from django.contrib import admin
from .models import Invitation, ClientProfile

@admin.register(Invitation)
class InvitationAdmin(ModelAdmin):
    list_display = ('id', 'email', 'token', 'expires_at', 'used')
    search_fields = ('email', 'token')
    ordering = ('-expires_at',)
    list_filter = ('used',)
    unfold_icon = "mail"
    unfold_section = "Clients"

@admin.register(ClientProfile)
class ClientProfileAdmin(ModelAdmin):
    list_display = ('company_name', 'first_name', 'last_name', 'email', 'country', 'sector', 'phone', 'language')
    search_fields = ('company_name', 'first_name', 'last_name', 'user__email', 'phone')
    list_filter = ('sector', 'country', 'language')
    ordering = ('-user__created_at',)
    readonly_fields = ('email',)
    
    fieldsets = (
        ('Informations Utilisateur', {
            'fields': ('user', 'email', 'first_name', 'last_name')
        }),
        ('Informations Entreprise', {
            'fields': ('company_name', 'sector', 'phone', 'country', 'website', 'logo')
        }),
        ('Préférences', {
            'fields': ('language',)
        }),
    )
    
    unfold_icon = "badge"
    unfold_section = "Clients"
    
    def email(self, obj):
        return obj.user.email
    email.short_description = 'Email'

