from django import forms
from django.contrib import admin
from django.utils.safestring import mark_safe
from unfold.admin import ModelAdmin

from admin_panel.admin_mixins import EditToggleAdminMixin
from admin_panel.widgets import AdminImagePreviewWidget

from products.models import Product, Category, Region, Type, ProductImage
from products.utils import get_cloudinary_url


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'cloudinary_link']
    readonly_fields = ['cloudinary_link']
    can_delete = True

    def cloudinary_link(self, obj):
        if obj.image:
            url = get_cloudinary_url(obj.image.name)
            return mark_safe(f'<a href="{url}" target="_blank" style="color: #2563eb; font-weight: bold; text-decoration: underline;">🔗 Ouvrir dans Cloudinary</a>')
        return "Pas d'image"
    cloudinary_link.short_description = "Lien Cloudinary"


@admin.register(Product)
class ProductAdmin(ModelAdmin):
    list_display = ('id', 'name', 'category', 'views', 'created_at')
    list_filter = ('category',)
    search_fields = ('name', 'description')
    ordering = ('-created_at',)
    autocomplete_fields = ['category']
    readonly_fields = ('views',)  # Optionnel mais conseillé si les vues sont comptées automatiquement
    unfold_icon = "fa-solid fa-box"
    unfold_section = "Catalogue"
    inlines = [ProductImageInline]

    fieldsets = (
        (None, {
            'fields': (
                'name',
                'category',
                'description',
                'desc_courte',
                'desc_longue',
                'views',
            )
        }),
        ("Détails supplémentaires", {
            'fields': (
                'cle_min',
                'prix_indicatif',
                'delai_production',
                'fiche_tech',
                'catalogue',
                # 'images', # Removed as it's now an inline
                'video',
                'est_pret',
                'region_org',
                'langue_du_product',
            ),
            'classes': ('collapse',),
        }),
    )


class CategoryAdminForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = '__all__'
        widgets = {
            'image': AdminImagePreviewWidget(),
        }


@admin.register(Category)
class CategoryAdmin(EditToggleAdminMixin, ModelAdmin):
    form = CategoryAdminForm
    list_display = ('id', 'name', 'type', 'certifications_count', 'certifications_list', 'image_preview')
    search_fields = ('name', 'type', 'description')
    ordering = ('name',)
    unfold_icon = "fa-solid fa-layer-group"
    unfold_section = "Catalogue"
    readonly_fields = ('image_preview', 'cloudinary_link', 'certifications_count', 'certifications_list')
    filter_horizontal = ('certifications',)

    def image_preview(self, obj):
        if obj.image:
            url = get_cloudinary_url(obj.image.name)
            return mark_safe(f'<img src="{url}" width="120" style="border-radius: 6px; box-shadow: 0 1px 4px rgba(0,0,0,0.15);" />')
        return "Pas d'image"
    image_preview.short_description = 'Aperçu'

    def cloudinary_link(self, obj):
        if obj.image:
            url = get_cloudinary_url(obj.image.name)
            return mark_safe(f'<a href="{url}" target="_blank" style="color: #2563eb; font-weight: bold; text-decoration: underline;">🔗 Ouvrir dans Cloudinary</a>')
        return "Pas d'image"
    cloudinary_link.short_description = "Lien Cloudinary"


    def certifications_count(self, obj):
        return obj.certifications.count()
    certifications_count.short_description = 'Nombre'

    def certifications_list(self, obj):
        """Affiche la liste des certifications avec leurs détails"""
        from django.utils import timezone
        
        certifications = obj.certifications.all()
        if not certifications:
            return mark_safe('<span style="color: #999; font-style: italic;">Aucune certification</span>')
        
        cert_list = []
        for cert in certifications:
            # Vérifier le statut de la certification
            if cert.valid_until:
                is_valid = cert.valid_until > timezone.now().date()
                status_color = '#28a745' if is_valid else '#dc3545'
                status_text = 'Valide' if is_valid else 'Expirée'
            else:
                status_color = '#17a2b8'
                status_text = 'Permanente'
            
            cert_html = f'''
                <div style="margin-bottom: 8px; padding: 6px; background: #f8f9fa; border-radius: 4px; border-left: 3px solid {status_color};">
                    <strong style="color: #333;">{cert.name}</strong><br>
                    <small style="color: #666;">
                        Émise par: {cert.issued_by or 'Non spécifié'}<br>
                        Statut: <span style="color: {status_color}; font-weight: bold;">{status_text}</span>
                        {f'<br>Expire le: {cert.valid_until}' if cert.valid_until else ''}
                    </small>
                </div>
            '''
            cert_list.append(cert_html)
        
        return mark_safe(''.join(cert_list))
    certifications_list.short_description = 'Certifications associées'

    fieldsets = (
        ('Informations de base', {
            'fields': ('name', 'type', 'description', 'specific_fields'),
            'description': 'Informations générales de la catégorie'
        }),
        ('Image', {
            'fields': ('image', 'image_preview', 'cloudinary_link'),
            'description': 'Image de la catégorie (formats supportés : JPG, PNG)',
            'classes': ('wide',),
        }),
        ('Certifications', {
            'fields': ('certifications_count', 'certifications_list', 'certifications'),
            'description': 'Certifications associées à cette catégorie',
            'classes': ('wide',),
        }),
    )
@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Type)
class TypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(ProductImage)
class ProductImageAdmin(ModelAdmin):
    list_display = ('id', 'product', 'image_preview')
    list_filter = ('product',)
    search_fields = ('product__name',)
    actions = ['delete_selected']
    
    def image_preview(self, obj):
        if obj.image:
            url = get_cloudinary_url(obj.image.name)
            return mark_safe(f'<img src="{url}" width="100" style="border-radius: 6px;" />')
        return "Pas d'image"
    image_preview.short_description = "Aperçu"
