from django.db import models

class Estimate(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('accepted', 'Accepté'),
        ('refused', 'Refusé'),
        ('sent', 'Envoyé'),
    ]

    created_at = models.DateTimeField(auto_now_add=True)
    producer = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='producer_estimates',
        verbose_name="Producteur",
        null=True,
        blank=True
    )
    client = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='client_estimates',
        verbose_name="Client"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Statut")
    comment = models.TextField(blank=True, null=True, verbose_name="Commentaire")
    response_file = models.FileField(upload_to='estimates/responses/', blank=True, null=True, verbose_name="Document PDF joint")

    def __str__(self):
        return f"Devis de {self.client} pour {self.producer}"


class Estimate_Product(models.Model):
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        related_name='estimate_products',
        verbose_name="Produit",
        null=True,
        blank=True
    )
    estimate = models.ForeignKey(
        Estimate,
        on_delete=models.CASCADE,
        related_name='estimate_products',
        verbose_name="Devis"
    )
    quantity = models.CharField(max_length=255, default='0', verbose_name="Quantité")
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name='Prix unitaire')

    def __str__(self):
        return f"{self.quantity} x {self.product} (Devis {self.estimate_id})"
