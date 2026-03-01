from rest_framework import serializers
from .models import Estimate, Estimate_Product
from products.models import Product
from producers.models import ProducerProfile

class EstimateProductSerializer(serializers.ModelSerializer):
    # Force unit_price to display as number (not string) in Swagger
    unit_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        coerce_to_string=False,  # ✅ ensures Swagger treats it as a number
    )
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = Estimate_Product
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'unit_price']
        extra_kwargs = {
                    'product': {'help_text': 'Product ID', 'required': False, 'allow_null': True},
                    'quantity': {'help_text': 'Quantity ordered'},
                    'unit_price': {'help_text': 'Unit price'},
                }

    def get_product_image(self, obj):
        if obj.product and obj.product.image:
             request = self.context.get('request')
             if request:
                 return request.build_absolute_uri(obj.product.image.url)
             return obj.product.image.url
        return None


class EstimateSerializer(serializers.ModelSerializer):
    products = EstimateProductSerializer(many=True, write_only=True)
    estimate_products = EstimateProductSerializer(many=True, read_only=True)
    producer_company_name = serializers.SerializerMethodField()
    producer_logo = serializers.SerializerMethodField()

    class Meta:
        model = Estimate
        fields = [
            'id',
            'client',
            'producer',
            'producer_company_name',
            'producer_logo',
            'status',
            'comment',
            'response_file',
            'created_at',
            'products',          # input
            'estimate_products'  # output
        ]
        extra_kwargs = {
                    'client': {'help_text': 'Client ID creating the estimate', 'required': False},
                    'producer': {'help_text': 'Producer ID assigned to this estimate', 'required': False, 'allow_null': True},
                    'status': {'help_text': 'Current status of the estimate (e.g., pending, accepted, rejected)'},
                    'comment': {'help_text': 'Additional notes or requests'},
                }

    def get_producer_company_name(self, obj):
        if obj.producer:
            profile = ProducerProfile.objects.filter(user=obj.producer).first()
            return profile.company_name if profile else obj.producer.email
        return None

    def get_producer_logo(self, obj):
        if obj.producer:
            profile = ProducerProfile.objects.filter(user=obj.producer).first()
            if profile and profile.logo:
                 request = self.context.get('request')
                 if request:
                     return request.build_absolute_uri(profile.logo.url)
                 return profile.logo.url
        return None

    def create(self, validated_data):
        products_data = validated_data.pop('products', [])
        estimate = Estimate.objects.create(**validated_data)

        for product_data in products_data:
            Estimate_Product.objects.create(
                estimate=estimate,
                **product_data
            )
        return estimate
