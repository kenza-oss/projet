from django.contrib import admin
from django.utils.safestring import mark_safe
from unfold.admin import ModelAdmin
from .models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(ModelAdmin):
    list_display = ['user', 'status', 'start_date', 'end_date', 'is_online_payment', 'proof_file_display']
    list_filter = ['status', 'is_online_payment']
    readonly_fields = ['created_at', 'proof_file_display', 'activate_button']
    actions = ['activate_for_one_year']
    unfold_icon = "fa-solid fa-credit-card"
    unfold_section = "Paiements"

    def activate_for_one_year(self, request, queryset):
        for subscription in queryset:
            subscription.activate(days=365)
        self.message_user(request, f"{queryset.count()} abonnements ont été activés pour 1 an.")
    activate_for_one_year.short_description = "Activer pour 1 an (Statut: Actif, Durée: 365j)"

    def proof_file_display(self, obj):
        if obj.proof_file:
            url = obj.proof_file.url
            if url.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                return mark_safe(f'<a href="{url}" target="_blank"><img src="{url}" width="100" style="border-radius: 5px; border: 1px solid #ddd;" /></a>')
            return mark_safe(f'<a href="{url}" target="_blank" style="color: #2563eb; font-weight: bold; text-decoration: underline;">Voir le reçu</a>')
        return "Aucun reçu"
    proof_file_display.short_description = "Preuve de paiement"

    def activate_button(self, obj):
        if not obj.pk: return ""
        if obj.status != 'active':
            return mark_safe(f'<a href="activate-one-year/" style="background: #2563eb; color: white; padding: 10px 20px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">🚀 Valider et Activer pour 1 an</a>')
        return mark_safe('<span style="color: #10b981; font-weight: bold;">✅ Abonnement déjà actif</span>')
    activate_button.short_description = "Action rapide"

    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('<path:object_id>/activate-one-year/', self.admin_site.admin_view(self.activate_one_year_view), name='subscription-activate-one-year'),
        ]
        return custom_urls + urls

    def activate_one_year_view(self, request, object_id):
        from django.shortcuts import redirect
        subscription = self.get_object(request, object_id)
        if subscription:
            subscription.activate(days=365)
            self.message_user(request, f"L'abonnement de {subscription.user.email} a été activé pour 365 jours.")
        return redirect(f"../../{object_id}/change/")
