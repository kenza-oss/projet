from django.db import models
from django.utils import timezone
from datetime import date
from products.models import Category


class Event(models.Model):
    """
    Model representing trade fairs and export events
    """
    
    EVENT_TYPE_CHOICES = [
        ('national', 'National (Algérie)'),
        ('international', 'International'),
    ]
    
    SECTOR_CHOICES = [
        ('agroalimentaire', 'Agroalimentaire'),
        ('agriculture', 'Agriculture'),
        ('pharmacie', 'Pharmacie & Biotech'),
        ('construction', 'Construction'),
        ('industrie', 'Industrie'),
        ('tourisme', 'Tourisme'),
        ('cosmétique', 'Cosmétique'),
        ('textile', 'Textile'),
        ('énergie', 'Énergie'),
        ('technologie', 'Technologie'),
        ('autre', 'Autre'),
    ]
    
    # Basic Information
    name = models.CharField(max_length=255, verbose_name="Nom de l'événement")
    location = models.CharField(max_length=255, verbose_name="Lieu")
    country = models.CharField(max_length=100, verbose_name="Pays")
    
    # Dates
    start_date = models.DateField(verbose_name="Date de début")
    end_date = models.DateField(verbose_name="Date de fin", null=True, blank=True)
    
    # Classification
    event_type = models.CharField(
        max_length=20, 
        choices=EVENT_TYPE_CHOICES, 
        default='international',
        verbose_name="Type d'événement"
    )
    categories = models.ManyToManyField(
        Category, 
        related_name='events', 
        blank=True, 
        verbose_name="Catégories"
    )
    
    # Details
    description = models.TextField(verbose_name="Description", blank=True)
    url = models.URLField(max_length=500, verbose_name="Site web", blank=True)
    image = models.ImageField(upload_to='events/', blank=True, null=True, verbose_name="Image")
    icon = models.CharField(max_length=10, default="🌍", verbose_name="Icône", blank=True)
    
    # Scraping metadata
    source = models.CharField(max_length=255, verbose_name="Source", blank=True, help_text="Site d'où l'événement a été extrait")
    auto_published = models.BooleanField(default=False, verbose_name="Publication automatique")
    is_verified = models.BooleanField(default=True, verbose_name="Vérifié", help_text="Événement vérifié et approuvé")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Mis à jour le")
    
    class Meta:
        verbose_name = "Événement"
        verbose_name_plural = "Événements"
        ordering = ['start_date']
        indexes = [
            models.Index(fields=['start_date']),
            models.Index(fields=['event_type']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.location} ({self.start_date})"
    
    @property
    def is_upcoming(self):
        """Check if event is in the future"""
        return self.start_date >= date.today()
    
    @property
    def days_until(self):
        """Calculate days until event"""
        if not self.is_upcoming:
            return None
        delta = self.start_date - date.today()
        return delta.days
    
    @property
    def formatted_date(self):
        """Get nicely formatted date range"""
        if self.end_date and self.end_date != self.start_date:
            # Different dates
            if self.start_date.month == self.end_date.month:
                # Same month: "23-28 Juin 2026"
                return f"{self.start_date.day}-{self.end_date.day} {self.start_date.strftime('%b %Y')}"
            else:
                # Different months: "30 Jan - 2 Fév 2026"
                return f"{self.start_date.strftime('%d %b')} - {self.end_date.strftime('%d %b %Y')}"
        else:
            # Single day: "15 Mars 2026"
            return self.start_date.strftime('%d %b %Y')
    
    def save(self, *args, **kwargs):
        """Override save to set icon based on event_type if not provided"""
        if not self.icon:
            self.icon = "🇩🇿" if self.event_type == "national" else "🌍"
        super().save(*args, **kwargs)
