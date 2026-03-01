from django.db import models
from users.models import User


class Certification(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    issued_by = models.CharField(max_length=255, blank=True)
    valid_until = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to='certifications/', null=True, blank=True, verbose_name='Image du certificat')
    is_editable = models.BooleanField(default=False, verbose_name='Modification activée')

    def __str__(self):
        return self.name


class ProducerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='producer_profile')
    company_name = models.CharField(max_length=255)
    activity = models.CharField(max_length=255, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    phone = models.CharField(max_length=30)
    whatsapp = models.CharField(max_length=30, blank=True, default='')
    country = models.JSONField(default=dict, blank=True, verbose_name='Pays')
    city = models.CharField(max_length=255, blank=True, default='')
    address = models.CharField(max_length=255, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, verbose_name='Latitude')
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, verbose_name='Longitude')
    rc_number = models.CharField(max_length=100, blank=True, default='', verbose_name='Numéro RC')
    nif_number = models.CharField(max_length=100, blank=True, default='', verbose_name='Numéro NIF')
    year_established = models.CharField(max_length=10, blank=True, default='', verbose_name='Année de création')
    cert_files = models.JSONField(default=list, blank=True, verbose_name='Fichiers de certification')
    tech_files = models.JSONField(default=list, blank=True, verbose_name='Fichiers techniques')
    min_export_quantity = models.CharField(max_length=255, blank=True, default='', verbose_name='Quantité minimum d\'export')
    monthly_capacity = models.CharField(max_length=255, blank=True, default='', verbose_name='Capacité mensuelle')
    yearly_capacity = models.CharField(max_length=255, blank=True, default='', verbose_name='Capacité annuelle')
    target_markets = models.JSONField(default=list, blank=True, verbose_name='Marchés cibles')
    export_categories = models.JSONField(default=list, blank=True, verbose_name='Catégories d\'export')
    description = models.TextField(blank=True, default='', verbose_name='Description')
    stats = models.JSONField(default=dict, blank=True, verbose_name='Statistiques')
    certifications = models.ManyToManyField(Certification, blank=True, related_name='producers', verbose_name='Certifications')
    website = models.URLField(max_length=255, blank=True, default='', verbose_name='Site Web')
    profile_photo = models.ImageField(upload_to='producers/photos/', null=True, blank=True, verbose_name='Photo de profil')
    logo = models.ImageField(upload_to='producers/logos/', null=True, blank=True, verbose_name='Logo entreprise')
    cover_image = models.ImageField(upload_to='producers/covers/', null=True, blank=True, verbose_name='Image de couverture')
    documents = models.FileField(upload_to='producer_docs/', null=True, blank=True, verbose_name='Documents')
    is_editable = models.BooleanField(default=False, verbose_name='Modification activée')
    is_approved = models.BooleanField(default=False, verbose_name='Approuvé par l\'admin')
    approval_date = models.DateTimeField(null=True, blank=True, verbose_name='Date d\'approbation')
    importRequests = models.CharField(max_length=255, blank=True, default='', verbose_name='Import Requests')

    # Logistics Fields
    lead_time = models.CharField(max_length=255, blank=True, default='', verbose_name='Temps de traitement')
    incoterms = models.JSONField(default=list, blank=True, verbose_name='Incoterms acceptés')
    logistics_details = models.JSONField(default=list, blank=True, verbose_name='Équipements & Hubs')

    def get_views_with_bonus(self):
        """
        Calculates total views including a trust-building bonus:
        - +90 views after 24h of approval
        - +209 views total after 48h of approval
        """
        from django.utils import timezone
        
        stats = self.stats or {}
        real_views = stats.get('views', 0)
        try:
            real_views = int(real_views)
        except (ValueError, TypeError):
            real_views = 0
            
        if not self.is_approved or not self.approval_date:
            return real_views
            
        diff = timezone.now() - self.approval_date
        bonus = 0
        if diff.total_seconds() >= 48 * 3600:
            bonus = 209
        elif diff.total_seconds() >= 24 * 3600:
            bonus = 90
            
        return real_views + bonus

    def get_likes_with_bonus(self):
        """
        Calculates total likes (appreciations) including a trust-building bonus:
        - +7 likes after 24h of approval
        - +9 likes total after 48h of approval
        """
        from django.utils import timezone
        
        stats = self.stats or {}
        real_likes = stats.get('likes', 0)
        try:
            real_likes = int(real_likes)
        except (ValueError, TypeError):
            real_likes = 0
            
        if not self.is_approved or not self.approval_date:
            return real_likes
            
        diff = timezone.now() - self.approval_date
        bonus = 0
        if diff.total_seconds() >= 48 * 3600:
            bonus = 9
        elif diff.total_seconds() >= 24 * 3600:
            bonus = 7
            
        return real_likes + bonus

    def __str__(self):
        return f"Profil de {self.user.email}"
