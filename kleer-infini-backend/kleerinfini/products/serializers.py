import urllib.parse
from rest_framework import serializers
from .models import Product, Category, Region, Type, ProductImage, ProductCertification
from .utils import get_cloudinary_url

class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    certifications = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'type', 'specific_fields', 'image', 'image_url', 'certifications']

    def get_image(self, obj):
        if not obj.image:
            return None
        name = obj.image.name
        if not name:
            return None
        if name.startswith('http'):
            return name
        
        # Nettoyage de l'URL pour correspondre à la structure Cloudinary
        # On gère les cas avec ou sans 'media/' et avec ou sans slash initial
        clean_name = name.replace('/media/products_images/', 'products/')
        clean_name = clean_name.replace('media/products_images/', 'products/')
        clean_name = clean_name.replace('products_images/', 'products/')
        
        # Supprimer le slash initial si présent pour éviter les doubles slashes dans l'URL finale
        if clean_name.startswith('/'):
            clean_name = clean_name[1:]
        
        encoded_name = urllib.parse.quote(clean_name, safe='/')
        return f"https://res.cloudinary.com/dptb2m02i/image/upload/{encoded_name}"

    def get_image_url(self, obj):
        return self.get_image(obj)

    def get_certifications(self, obj):
        from producers.serializers import CertificationSerializer
        return CertificationSerializer(obj.certifications.all(), many=True, context=self.context).data

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url']

    def get_image(self, obj):
        if not obj.image:
            return None
        return get_cloudinary_url(obj.image.name)

    def get_image_url(self, obj):
        return self.get_image(obj)

class ProductCertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCertification
        fields = ['id', 'name', 'file']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    certification_files = ProductCertificationSerializer(many=True, read_only=True)
    category_name = serializers.ReadOnlyField(source='category.name')
    
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category'
    )
    
    producer_name = serializers.ReadOnlyField(source='producer.company_name')
    producer_id = serializers.ReadOnlyField(source='producer.id')
    producer_user_id = serializers.SerializerMethodField()
    
    def get_producer_user_id(self, obj):
        if obj.producer and obj.producer.user:
            return obj.producer.user.id
        return None
    
    fiche_tech_url = serializers.SerializerMethodField()
    catalogue_url = serializers.SerializerMethodField()
    certification_file_url = serializers.SerializerMethodField()

    def _get_file_url(self, field_file):
        if not field_file:
            return None
        return get_cloudinary_url(field_file.name)

    def get_fiche_tech_url(self, obj):
        return self._get_file_url(obj.fiche_tech)

    def get_catalogue_url(self, obj):
        return self._get_file_url(obj.catalogue)

    def get_certification_file_url(self, obj):
        return self._get_file_url(obj.certification_file)

    def validate_fiche_tech(self, value):
        if value and not value.name.lower().endswith('.pdf'):
            raise serializers.ValidationError("Le fichier doit être au format PDF.")
        return value

    def validate_images(self, value):
        for img_url in value:
            if not (img_url.lower().endswith('.jpg') or img_url.lower().endswith('.jpeg') or img_url.lower().endswith('.png')):
                raise serializers.ValidationError("Les images doivent être au format JPG ou PNG.")
        return value

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category_id', 'category_name', 'images',
            'producer', 'producer_id', 'producer_user_id', 'producer_name',
            'description', 'desc_courte', 'desc_longue', 'cle_min', 
            'prix_indicatif', 'currency', 'delai_production', 'fiche_tech', 'fiche_tech_url',
            'certification_file', 'certification_file_url', 'certification_files', 'catalogue', 'catalogue_url', 'video',
            'est_pret', 'region_org', 'langue_du_product', 'views', 'created_at'
        ]

    def create(self, validated_data):
        # Extraire les fichiers multiples du multipart
        images_data = self.context.get('view').request.FILES.getlist('images')
        certs_data = self.context.get('view').request.FILES.getlist('certification_files')
        
        product = Product.objects.create(**validated_data)
        
        for image_data in images_data:
            ProductImage.objects.create(product=product, image=image_data)
            
        for cert_data in certs_data:
            ProductCertification.objects.create(product=product, file=cert_data)
            
        return product

    def update(self, instance, validated_data):
        images_data = self.context.get('view').request.FILES.getlist('images')
        certs_data = self.context.get('view').request.FILES.getlist('certification_files')
        
        # On met à jour les champs classiques
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Ajouter de nouvelles images
        if images_data:
            for image_data in images_data:
                ProductImage.objects.create(product=instance, image=image_data)
        
        # Ajouter de nouvelles certifications
        if certs_data:
            for cert_data in certs_data:
                ProductCertification.objects.create(product=instance, file=cert_data)
        
        return instance


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'

