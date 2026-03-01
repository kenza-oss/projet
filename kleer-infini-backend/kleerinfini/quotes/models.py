from django.db import models
from producers.models import ProducerProfile
from products.models import Product

class Quote(models.Model):
    producer = models.ForeignKey(ProducerProfile, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    client_name = models.CharField(max_length=255)
    client_email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='pending')
    is_processed = models.BooleanField(default=False)

    def process_quote(self):
        self.is_processed = True
        self.save(update_fields=['is_processed'])

    def post(self, request, pk):
        quote = Quote.objects.get(pk=pk)
        quote.is_processed = True
        quote.save(update_fields=['is_processed'])
