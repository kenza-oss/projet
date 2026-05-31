from rest_framework import serializers
from .models import Invitation, ClientProfile

class HybridImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str):
            return data
        return super().to_internal_value(data)

class InviteClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = '__all__'

class ClientProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    logo = HybridImageField(required=False, allow_null=True)
    logo_url = serializers.SerializerMethodField()
    
    user_id = serializers.UUIDField(source='user.id', read_only=True)
    
    class Meta:
        model = ClientProfile
        fields = [
            'id', 'user_id', 'email', 'first_name', 'last_name', 'company_name', 
            'phone', 'country', 'sector', 'language', 'website', 'logo', 'logo_url',
            'rc_number', 'address', 'preferred_port', 'is_verified'
        ]
        read_only_fields = ['id', 'user_id', 'email', 'is_verified', 'logo_url']

    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None

    def update(self, instance, validated_data):
        # Handle source='user.first_name' style updates
        user_data = validated_data.pop('user', {})
        
        has_user_changes = False
        if 'first_name' in user_data:
            instance.user.first_name = user_data['first_name']
            has_user_changes = True
        if 'last_name' in user_data:
            instance.user.last_name = user_data['last_name']
            has_user_changes = True
            
        if has_user_changes:
            instance.user.save()

        # If logo is provided as a string, it will be saved directly since we use HybridImageField
        return super().update(instance, validated_data)
 