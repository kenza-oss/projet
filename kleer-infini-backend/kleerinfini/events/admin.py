from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Event


@admin.register(Event)
class EventAdmin(ModelAdmin):
    """Admin interface for Event model"""
    
    list_display = [
        'name', 
        'location', 
        'start_date', 
        'event_type', 
        'is_verified',
        'auto_published',
        'days_until_display',
        'image',
    ]
    
    list_filter = [
        'event_type',
        'categories',
        'is_verified',
        'auto_published',
        'start_date',
    ]
    
    search_fields = ['name', 'location', 'description', 'country']
    
    date_hierarchy = 'start_date'
    
    readonly_fields = ['created_at', 'updated_at', 'days_until', 'auto_published']
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('name', 'location', 'country', 'icon')
        }),
        ('Dates', {
            'fields': ('start_date', 'end_date')
        }),
        ('Classification', {
            'fields': ('event_type', 'categories')
        }),
        ('Détails', {
            'fields': ('description', 'url', 'image')
        }),
        ('Métadonnées de scraping', {
            'fields': ('source', 'auto_published', 'is_verified'),
            'classes': ('collapse',)
        }),
        ('Informations système', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_verified', 'mark_as_unverified']
    
    def days_until_display(self, obj):
        """Display days until event or 'Passé' if past"""
        if obj.days_until is not None:
            if obj.days_until == 0:
                return "Aujourd'hui"
            elif obj.days_until == 1:
                return "Demain"
            else:
                return f"{obj.days_until} jours"
        return "Passé"
    days_until_display.short_description = "Dans"
    
    def mark_as_verified(self, request, queryset):
        """Mark selected events as verified"""
        updated = queryset.update(is_verified=True)
        self.message_user(request, f"{updated} événement(s) marqué(s) comme vérifié(s).")
    mark_as_verified.short_description = "Marquer comme vérifié"
    
    def mark_as_unverified(self, request, queryset):
        """Mark selected events as unverified"""
        updated = queryset.update(is_verified=False)
        self.message_user(request, f"{updated} événement(s) marqué(s) comme non vérifié(s).")
    mark_as_unverified.short_description = "Marquer comme non vérifié"
