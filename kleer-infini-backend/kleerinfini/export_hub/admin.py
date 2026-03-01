from django.contrib import admin
from .models import LegalVariable, ZlecafTariff, ScraperLog

@admin.register(LegalVariable)
class LegalVariableAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'key_code', 'current_value', 'unit', 'is_validated', 'last_update')
    list_filter = ('is_validated',)
    search_fields = ('display_name', 'key_code')

@admin.register(ZlecafTariff)
class ZlecafTariffAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'product_code', 'target_country', 'current_rate', 'last_update')
    search_fields = ('product_name', 'product_code', 'target_country')

@admin.register(ScraperLog)
class ScraperLogAdmin(admin.ModelAdmin):
    list_display = ('source', 'status', 'timestamp')
    list_filter = ('source', 'status')
    readonly_fields = ('timestamp',)
