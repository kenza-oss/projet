from rest_framework import serializers
from .models import Certification, ProducerProfile
from users.models import User
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import json
import logging

logger = logging.getLogger('producers')

class CertificationSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Certification
        fields = ['id', 'name', 'description', 'issued_by', 'valid_until', 'image', 'image_url']
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class ProducerProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_id = serializers.UUIDField(source='user.id', read_only=True)
    country_display = serializers.SerializerMethodField()
    target_markets_display = serializers.SerializerMethodField()
    export_categories_display = serializers.SerializerMethodField()
    documents_url = serializers.SerializerMethodField()
    certifications_detail = serializers.SerializerMethodField()
    profile_photo_url = serializers.SerializerMethodField()
    logo_url = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()
    subscription = serializers.SerializerMethodField()

    def get_subscription(self, obj):
        from subscriptions.models import Subscription
        from subscriptions.serializers import SubscriptionSerializer
        sub = Subscription.objects.filter(user=obj.user).first()
        if sub:
            return SubscriptionSerializer(sub).data
        return None

    def to_internal_value(self, data):
        # Pour le multipart/form-data, DRF reçoit souvent des chaînes pour les JSONFields
        # On convertit en dict classique pour éviter les problèmes de stringification de QueryDict
        if hasattr(data, 'dict'):
            mutable_data = data.dict()
        else:
            mutable_data = data.copy() if hasattr(data, 'copy') else data
            
        json_fields = ['target_markets', 'export_categories', 'country', 'stats', 'incoterms', 'logistics_details']
        
        for field in json_fields:
            if field in mutable_data and isinstance(mutable_data[field], str):
                val = mutable_data[field].strip()
                if val.startswith('{') or val.startswith('['):
                    try:
                        mutable_data[field] = json.loads(val)
                    except (json.JSONDecodeError, TypeError):
                        pass
                elif field == 'country' and val:
                    # Si c'est une chaîne simple pour le pays, on l'encapsule
                    mutable_data[field] = {'label': val, 'value': val}
                elif field in ['target_markets', 'export_categories'] and not val:
                    mutable_data[field] = []
        
        return super().to_internal_value(mutable_data)

    class Meta:
        model = ProducerProfile
        fields = [
            'id', 'user', 'user_email', 'user_id', 'first_name', 'last_name', 'company_name', 'activity', 'email',
            'phone', 'whatsapp', 'website', 'country', 'country_display', 'city', 'address', 
            'latitude', 'longitude', 'rc_number', 'nif_number', 'year_established', 'cert_files', 'tech_files', 
            'min_export_quantity', 'monthly_capacity', 'yearly_capacity', 'target_markets',
            'target_markets_display', 'export_categories', 'export_categories_display',
            'description', 'stats', 'certifications', 'certifications_detail', 'documents',
            'documents_url', 'is_editable', 'profile_photo', 'profile_photo_url', 'logo', 'logo_url', 
            'cover_image', 'cover_image_url', 'is_approved', 'lead_time', 'incoterms', 'logistics_details',
            'subscription'
        ]
        read_only_fields = ['id', 'user_email', 'user_id', 'country_display', 
                           'target_markets_display', 'export_categories_display', 
                           'documents_url', 'certifications_detail', 'is_approved',
                           'profile_photo_url', 'logo_url', 'cover_image_url', 'subscription']
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Inject all 3 bonus values for maximum compatibility
        views = instance.get_views_with_bonus()
        likes = instance.get_likes_with_bonus()
        quotes = instance.get_quotes_with_bonus()
        
        if 'stats' in ret:
            if not isinstance(ret['stats'], dict):
                ret['stats'] = {}
            ret['stats']['views'] = views
            ret['stats']['likes'] = likes
            ret['stats']['quotes'] = quotes
            
        ret['views_with_bonus'] = views
        ret['likes_with_bonus'] = likes
        ret['quotes_with_bonus'] = quotes
        return ret

    def get_country_display(self, obj):
        if obj.country and isinstance(obj.country, dict):
            return f"{obj.country.get('label', '')} ({obj.country.get('code', '')})"
        return str(obj.country) if obj.country else None
    
    def get_target_markets_display(self, obj):
        if obj.target_markets and isinstance(obj.target_markets, list):
            return [f"{market.get('label', '')} ({market.get('value', '')})" 
                   for market in obj.target_markets if isinstance(market, dict)]
        return obj.target_markets
    
    def get_export_categories_display(self, obj):
        if obj.export_categories and isinstance(obj.export_categories, list):
            return [f"{cat.get('label', '')} ({cat.get('value', '')})" 
                   for cat in obj.export_categories if isinstance(cat, dict)]
        return obj.export_categories
    
    def get_documents_url(self, obj):
        if obj.documents:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.documents.url)
            return obj.documents.url
        return None
    
    def get_certifications_detail(self, obj):
        return CertificationSerializer(obj.certifications.all(), many=True, context=self.context).data

    def get_profile_photo_url(self, obj):
        if obj.profile_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_photo.url)
            return obj.profile_photo.url
        return None

    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None

class ProducerProfileCreateSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, required=True)
    
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)

    # Override JSONFields to accept file uploads
    cert_files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )
    tech_files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = ProducerProfile
        fields = [
            'user_email', 'password', 'first_name', 'last_name', 'company_name', 'activity', 'email',
            'phone', 'whatsapp', 'country', 'city', 'address', 'latitude', 'longitude',
            'rc_number', 'nif_number', 'year_established', 'cert_files', 'tech_files', 'min_export_quantity',
            'monthly_capacity', 'yearly_capacity', 'target_markets', 'export_categories',
            'description', 'stats', 'certifications', 'documents', 'lead_time', 'incoterms', 'logistics_details'
        ]

    def to_internal_value(self, data):
        if hasattr(data, 'dict'):
            mutable_data = data.dict()
        else:
            mutable_data = data.copy() if hasattr(data, 'copy') else data
            
        json_fields = ['target_markets', 'export_categories', 'country', 'stats', 'incoterms', 'logistics_details']
        for field in json_fields:
            if field in mutable_data and isinstance(mutable_data[field], str):
                val = mutable_data[field].strip()
                if val.startswith('{') or val.startswith('['):
                    try:
                        mutable_data[field] = json.loads(val)
                    except (json.JSONDecodeError, TypeError):
                        pass
                elif field == 'country' and val:
                    mutable_data[field] = {'label': val, 'value': val}
                elif field in ['target_markets', 'export_categories'] and not val:
                    mutable_data[field] = []
        
        return super().to_internal_value(mutable_data)
    
    def create(self, validated_data):
        try:
            user_email = validated_data.pop('user_email')
            password = validated_data.pop('password')
            first_name = validated_data.pop('first_name', '')
            last_name = validated_data.pop('last_name', '')
            
            # Extract files
            cert_files_data = validated_data.pop('cert_files', [])
            tech_files_data = validated_data.pop('tech_files', [])
            
            logger.debug(f"Creating/updating producer: {user_email}")
            
            # Find or create user safely
            user = User.objects.filter(email=user_email).first()
            if not user:
                user = User.objects.create_user(
                    email=user_email, 
                    password=password, 
                    role='producer',
                    first_name=first_name,
                    last_name=last_name
                )
            else:
                user.role = 'producer'
                user.first_name = first_name
                user.last_name = last_name
                if password:
                    user.set_password(password)
                user.save()
            
            # Defensive M2M extraction
            certifications = validated_data.pop('certifications', [])
            
            # Link user to profile data
            validated_data['user'] = user
            
            # Handle File Uploads - Save to disk and store paths
            saved_cert_files = []
            for f in cert_files_data:
                # Generate a unique path or keep original name if safe
                file_path = default_storage.save(f"producers/docs/{user.id}_{f.name}", ContentFile(f.read()))
                # We store the URL or relative path. default_storage.url(file_path) might be better if using S3/Media
                saved_cert_files.append(default_storage.url(file_path))
            
            validated_data['cert_files'] = saved_cert_files

            saved_tech_files = []
            for f in tech_files_data:
                file_path = default_storage.save(f"producers/docs/{user.id}_{f.name}", ContentFile(f.read()))
                saved_tech_files.append(default_storage.url(file_path))
            
            validated_data['tech_files'] = saved_tech_files

            if not validated_data.get('company_name'):
                validated_data['company_name'] = 'Entreprise Sans Nom'
            if not validated_data.get('phone'):
                validated_data['phone'] = '0000000000'

            # Use update_or_create to prevent IntegrityError
            profile, created = ProducerProfile.objects.update_or_create(
                user=user,
                defaults=validated_data
            )
            
            if certifications:
                profile.certifications.set(certifications)
                
            logger.info(f"Successfully { 'created' if created else 'updated' } profile for {user_email}")
            return profile
        except Exception as e:
            logger.error(f"Error in ProducerProfileCreateSerializer: {str(e)}", exc_info=True)
            print(f"CRITICAL ERROR IN SERIALIZER: {str(e)}") # Added for immediate debugging
            raise