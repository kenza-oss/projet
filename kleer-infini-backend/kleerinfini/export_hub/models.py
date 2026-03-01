from django.db import models

class LegalVariable(models.Model):
    key_code = models.CharField(max_length=50, unique=True, help_text="e.g., 'RETROCESSION_RATE_2026'")
    display_name = models.CharField(max_length=100, help_text="e.g., 'Taux de conservation des devises'")
    current_value = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=10, help_text="e.g., '%'")
    source_url = models.URLField(max_length=500, blank=True, null=True)
    is_validated = models.BooleanField(default=False)
    last_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.display_name} ({self.key_code})"

class ZlecafTariff(models.Model):
    product_code = models.CharField(max_length=20, help_text="HS Code")
    product_name = models.CharField(max_length=255)
    target_country = models.CharField(max_length=100)
    current_rate = models.DecimalField(max_digits=5, decimal_places=2, help_text="Current tariff rate")
    reduction_schedule = models.JSONField(default=dict, help_text="Yearly reduction roadmap")
    last_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product_name} -> {self.target_country}"

class ScraperLog(models.Model):
    source = models.CharField(max_length=100)
    status = models.CharField(max_length=20)
    message = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
