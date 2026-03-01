from django.contrib import admin
from .models import Estimate, Estimate_Product


# Inline: show Estimate_Product inside the Estimate page
class EstimateProductInline(admin.TabularInline):
    model = Estimate_Product
    extra = 1  # how many empty rows to display for adding new items
    fields = ('product', 'quantity', 'unit_price')
    autocomplete_fields = ['product']


@admin.register(Estimate)
class EstimateAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'producer', 'status', 'created_at')
    list_filter = ('status', 'created_at', 'producer')
    search_fields = ('client__username', 'producer__username', 'comment')
    inlines = [EstimateProductInline]
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)


@admin.register(Estimate_Product)
class EstimateProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'estimate', 'product', 'quantity', 'unit_price')
    list_filter = ('estimate__producer', 'estimate__client')
    search_fields = ('product__name', 'estimate__id')
