from unfold.admin import ModelAdmin
from django.contrib import admin
from django.utils.safestring import mark_safe
from django import forms
from django.db import models

from admin_panel.admin_mixins import EditToggleAdminMixin
from admin_panel.widgets import AdminImagePreviewWidget

from .models import ProducerProfile, Certification

class ProducerProfileAdminForm(forms.ModelForm):
    profile_photo = forms.CharField(widget=AdminImagePreviewWidget(folder='producers/photos'), required=False, label="Photo de profil")
    logo = forms.CharField(widget=AdminImagePreviewWidget(folder='producers/logos'), required=False, label="Logo")
    cover_image = forms.CharField(widget=AdminImagePreviewWidget(folder='producers/covers'), required=False, label="Image de couverture")
    documents = forms.CharField(widget=AdminImagePreviewWidget(folder='producers/docs'), required=False, label="Documents administratifs")

    class Meta:
        model = ProducerProfile
        fields = '__all__'

@admin.register(ProducerProfile)
class ProducerProfileAdmin(EditToggleAdminMixin, ModelAdmin):
    form = ProducerProfileAdminForm
    list_display = ('id', 'user', 'company_name', 'email', 'phone', 'city', 'country_display', 'is_approved')
    list_editable = ('is_approved',)
    search_fields = ('user__email', 'company_name', 'activity', 'email', 'phone', 'city')
    list_filter = ('is_approved', 'activity', 'city')
    ordering = ('-id',)
    unfold_icon = "fa-solid fa-user-tie"
    unfold_section = "Utilisateurs"
    filter_horizontal = ('certifications',)
    actions = ['approve_producers', 'reject_producers']
    
    def country_display(self, obj):
        if obj.country and isinstance(obj.country, dict):
            return f"{obj.country.get('label', '')} ({obj.country.get('code', '')})"
        return str(obj.country)
    country_display.short_description = 'Pays'

    def cert_files_links(self, obj):
        if not obj.cert_files:
            return "Aucun fichier"
        links = []
        for i, url in enumerate(obj.cert_files):
            links.append(f'<a href="{url}" target="_blank" style="color: #2563eb; text-decoration: underline;">Certificat {i+1}</a>')
        return mark_safe("<br>".join(links))
    cert_files_links.short_description = "Fichiers de certification"

    def tech_files_links(self, obj):
        if not obj.tech_files:
            return "Aucun fichier"
        links = []
        for i, url in enumerate(obj.tech_files):
            links.append(f'<a href="{url}" target="_blank" style="color: #2563eb; text-decoration: underline;">Tech {i+1}</a>')
        return mark_safe("<br>".join(links))
    tech_files_links.short_description = "Fichiers techniques"

    def approve_producers(self, request, queryset):
        from django.utils import timezone
        count = queryset.update(is_approved=True, approval_date=timezone.now())
        # Emailing logic will be triggered either here or via signal
        # Note: update() doesn't trigger signals, so we might need a loop if emails are vital
        self.message_user(request, f"{count} producteurs ont été approuvés.")
    approve_producers.short_description = "Approuver les producteurs sélectionnés"

    def reject_producers(self, request, queryset):
        count = queryset.update(is_approved=False)
        self.message_user(request, f"{count} producteurs ont été rejetés/mis en attente.")
    reject_producers.short_description = "Rejeter/Désactiver les producteurs sélectionnés"
    
    def profile_photo_preview(self, obj):
        if obj.profile_photo:
            return mark_safe(f'<img src="{obj.profile_photo.url}" width="100" style="border-radius: 5px;" />')
        return "Aucune photo"
    profile_photo_preview.short_description = "Aperçu Photo"

    def logo_preview(self, obj):
        if obj.logo:
            return mark_safe(f'<img src="{obj.logo.url}" width="100" style="border-radius: 5px;" />')
        return "Aucun logo"
    logo_preview.short_description = "Aperçu Logo"

    def cover_image_preview(self, obj):
        if obj.cover_image:
            return mark_safe(f'<img src="{obj.cover_image.url}" width="200" style="border-radius: 5px;" />')
        return "Aucune bannière"
    cover_image_preview.short_description = "Aperçu Bannière"

    def subscription_status_display(self, obj):
        try:
            from subscriptions.models import Subscription
            sub = Subscription.objects.get(user=obj.user)
            colors = {
                'free': '#f59e42', # Orange
                'active': '#10b981', # Green
                'expired': '#ef4444', # Red
                'pending_validation': '#3b82f6', # Blue
            }
            color = colors.get(sub.status, '#777')
            return mark_safe(f'<span style="background-color: {color}; color: white; padding: 3px 10px; border-radius: 12px; font-weight: bold; font-size: 0.85em;">{sub.get_status_display().upper()}</span>')
        except Exception:
            return "Aucun abonnement"
    subscription_status_display.short_description = "Statut Abonnement"

    def subscription_proof_display(self, obj):
        try:
            from subscriptions.models import Subscription
            sub = Subscription.objects.get(user=obj.user)
            if sub.proof_file:
                url = sub.proof_file.url
                if url.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                    return mark_safe(f'<div style="margin-top:5px;"><a href="{url}" target="_blank"><img src="{url}" width="150" style="border-radius: 5px; border: 1px solid #ddd;" /></a><br><small>Cliquez pour agrandir</small></div>')
                return mark_safe(f'<a href="{url}" target="_blank" style="color: #2563eb; font-weight: bold; text-decoration: underline;">Voir le reçu (PDF/Fichier)</a>')
            return "Aucun reçu téléchargé"
        except Exception:
            return "N/A"
    subscription_proof_display.short_description = "Preuve de Paiement"

    fieldsets = (
        ('Actions & Statut', {
            'fields': (('is_approved', 'is_editable'), 'approval_date'),
        }),
        ('Souscription & Paiement', {
            'fields': (('subscription_status_display', 'subscription_proof_display'),),
            'description': 'État actuel de l\'abonnement et justificatif de paiement'
        }),
        ('Profil Visuel', {
            'fields': (
                ('profile_photo', 'profile_photo_preview'),
                ('logo', 'logo_preview'),
                ('cover_image', 'cover_image_preview')
            ),
            'description': 'Images de profil, logo et bannière'
        }),
        ('Informations de base', {
            'fields': ('user', 'company_name', 'activity', 'description'),
            'description': 'Informations générales du producteur'
        }),
        ('Contact', {
            'fields': ('email', 'phone', 'whatsapp', 'website'),
            'description': 'Informations de contact'
        }),
        ('Localisation', {
            'fields': ('country', 'city', 'address', 'latitude', 'longitude'),
            'description': 'Informations géographiques et adresse'
        }),
        ('Informations légales', {
            'fields': ('rc_number', 'nif_number'),
            'description': 'Numéros d\'enregistrement légal'
        }),
        ('Capacités et quantités', {
            'fields': ('min_export_quantity', 'monthly_capacity', 'yearly_capacity'),
            'description': 'Capacités de production et d\'export'
        }),
        ('Marchés et catégories', {
            'fields': ('target_markets', 'export_categories'),
            'description': 'Marchés cibles et catégories d\'export'
        }),
        ('Documents et fichiers', {
            'fields': ('cert_files_links', 'tech_files_links', 'certifications', 'documents'),
            'description': 'Certifications et fiches techniques enregistrées lors de l\'inscription'
        }),
        ('Statistiques et configuration', {
            'fields': ('stats',),
            'description': 'Données techniques système',
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('cert_files_links', 'tech_files_links', 'profile_photo_preview', 
                      'logo_preview', 'cover_image_preview', 'approval_date',
                      'subscription_status_display', 'subscription_proof_display')


class CertificationAdminForm(forms.ModelForm):
    image = forms.CharField(widget=AdminImagePreviewWidget(folder='producers/certifications'), required=False, label="Image")
    class Meta:
        model = Certification
        fields = '__all__'

@admin.register(Certification)
class CertificationAdmin(EditToggleAdminMixin, ModelAdmin):
    form = CertificationAdminForm
    list_display = ('id', 'name', 'issued_by', 'valid_until', 'image_preview')
    list_filter = ('valid_until',)
    search_fields = ('name', 'issued_by')
    unfold_icon = "fa-solid fa-certificate"
    unfold_section = "Certifications"
    
    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="100" style="border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);" />')
        return "Pas d'image"
    image_preview.short_description = 'Aperçu'
    readonly_fields = ('image_preview',)

    fieldsets = (
        ('Informations principales', {
            'fields': ('name', 'description', 'issued_by', 'valid_until'),
        }),
        ('Image', {
            'fields': ('image', 'image_preview'),
            'description': 'Image de la certification (formats supportés : JPG, PNG)',
            'classes': ('wide',),
        }),
    )
