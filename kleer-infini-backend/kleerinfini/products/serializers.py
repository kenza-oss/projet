import urllib.parse
from rest_framework import serializers
from .models import Product, Category, Region, Type, ProductImage, ProductCertification
from .utils import get_cloudinary_url

class HybridImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str):
            return data
        return super().to_internal_value(data)

class HybridFileField(serializers.FileField):
    def to_internal_value(self, data):
        if isinstance(data, str):
            return data
        return super().to_internal_value(data)

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
    
    fiche_tech = HybridFileField(required=False, allow_null=True)
    certification_file = HybridFileField(required=False, allow_null=True)
    catalogue = HybridFileField(required=False, allow_null=True)
    video = HybridFileField(required=False, allow_null=True)
    
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
        request = self.context.get('view').request
        
        # Extract files from multipart request
        images_files = request.FILES.getlist('images')
        certs_files = request.FILES.getlist('certification_files')
        
        # Extract direct uploaded Cloudinary URLs
        images_urls = request.data.getlist('images') if hasattr(request.data, 'getlist') else request.data.get('images', [])
        certs_urls = request.data.getlist('certification_files') if hasattr(request.data, 'getlist') else request.data.get('certification_files', [])
        
        # Normalize URLs inputs
        if isinstance(images_urls, str):
            images_urls = [images_urls]
        elif not isinstance(images_urls, list):
            images_urls = []
            
        if isinstance(certs_urls, str):
            certs_urls = [certs_urls]
        elif not isinstance(certs_urls, list):
            certs_urls = []

        product = Product.objects.create(**validated_data)
        
        # Save image files
        for image_data in images_files:
            ProductImage.objects.create(product=product, image=image_data)
            
        # Save image URLs
        for image_url in images_urls:
            if isinstance(image_url, str) and image_url.startswith('http'):
                ProductImage.objects.create(product=product, image=image_url)
                
        # Save certification files
        for cert_data in certs_files:
            ProductCertification.objects.create(product=product, file=cert_data)
            
        # Save certification URLs
        for cert_url in certs_urls:
            if isinstance(cert_url, str) and cert_url.startswith('http'):
                ProductCertification.objects.create(product=product, file=cert_url)
            
        return product

    def update(self, instance, validated_data):
        request = self.context.get('view').request
        
        # On met à jour les champs classiques
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Extract files from multipart request
        images_files = request.FILES.getlist('images')
        certs_files = request.FILES.getlist('certification_files')
        
        # Extract direct uploaded Cloudinary URLs
        images_urls = request.data.getlist('images') if hasattr(request.data, 'getlist') else request.data.get('images', [])
        certs_urls = request.data.getlist('certification_files') if hasattr(request.data, 'getlist') else request.data.get('certification_files', [])
        
        # Normalize URLs inputs
        if isinstance(images_urls, str):
            images_urls = [images_urls]
        elif not isinstance(images_urls, list):
            images_urls = []
            
        if isinstance(certs_urls, str):
            certs_urls = [certs_urls]
        elif not isinstance(certs_urls, list):
            certs_urls = []

        # 1. Sync / Add Images
        # Save image files
        for image_data in images_files:
            ProductImage.objects.create(product=instance, image=image_data)
            
        # Save image URLs (only if not already created)
        existing_images = set(instance.images.values_list('image', flat=True))
        for image_url in images_urls:
            if isinstance(image_url, str) and image_url.startswith('http') and image_url not in existing_images:
                ProductImage.objects.create(product=instance, image=image_url)

        # Optional: Delete images that are no longer in the request
        if images_urls:
            # Get list of URLs sent
            sent_urls = []
            for img in images_urls:
                if isinstance(img, str):
                    sent_urls.append(img)
                elif isinstance(img, dict):
                    url = img.get('image') or img.get('image_url')
                    if url:
                        sent_urls.append(url)
            
            # Delete ProductImage objects that are not in sent_urls (for existing URLs)
            for pi in instance.images.all():
                pi_url = pi.image.name if pi.image else ''
                # check if pi_url or complete url is in sent_urls
                is_kept = False
                for su in sent_urls:
                    if pi_url in su or su in pi_url:
                        is_kept = True
                        break
                if not is_kept and sent_urls: # only delete if we actually received a list of urls
                    pi.delete()

        # 2. Sync / Add Certifications
        # Save certification files
        for cert_data in certs_files:
            ProductCertification.objects.create(product=instance, file=cert_data)
            
        # Save certification URLs (only if not already created)
        existing_certs = set(instance.certification_files.values_list('file', flat=True))
        for cert_url in certs_urls:
            if isinstance(cert_url, str) and cert_url.startswith('http') and cert_url not in existing_certs:
                ProductCertification.objects.create(product=instance, file=cert_url)

        # Optional: Delete certifications that are no longer in the request
        if certs_urls:
            sent_certs = [c if isinstance(c, str) else c.get('file') for c in certs_urls if isinstance(c, str) or (isinstance(c, dict) and 'file' in c)]
            for pc in instance.certification_files.all():
                pc_file = pc.file.name if pc.file else ''
                is_kept = False
                for sc in sent_certs:
                    if pc_file in sc or sc in pc_file:
                        is_kept = True
                        break
                if not is_kept and sent_certs:
                    pc.delete()
        
        return instance


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'

