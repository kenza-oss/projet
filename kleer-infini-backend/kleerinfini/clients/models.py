from django.db import models
import uuid
from django.utils import timezone
from users.models import User

# Create your models here.

class Invitation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField()
    token = models.CharField(max_length=255, unique=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    def is_valid(self):
        return not self.used and self.expires_at > timezone.now()

    def __str__(self):
        return f"Invitation pour {self.email}"


class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    company_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    sector = models.CharField(max_length=100)
    language = models.CharField(max_length=10)
    website = models.URLField(max_length=255, blank=True, null=True)
    logo = models.ImageField(upload_to='clients/logos/', null=True, blank=True, verbose_name='Logo entreprise')
    rc_number = models.CharField(max_length=100, blank=True, null=True, verbose_name='Registre du commerce')
    address = models.TextField(blank=True, null=True, verbose_name='Adresse du siège')
    preferred_port = models.CharField(max_length=100, blank=True, null=True, verbose_name='Port de destination préféré')
    is_verified = models.BooleanField(default=False, verbose_name='Vérifié par Kleer Infini')

    def __str__(self):
        return f"Profil de {self.email} ({self.company_name})"

    @property
    def email(self):
        return self.user.email
