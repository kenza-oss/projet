from rest_framework import serializers
from .models import User
from clients.models import ClientProfile

class RegisterProducerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role='producer',
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class RegisterClientSerializer(serializers.Serializer):
    # Identity fields
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    
    # Company fields
    company_name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    country = serializers.CharField(max_length=100, required=False, allow_blank=True)
    sector = serializers.CharField(max_length=100)
    language = serializers.CharField(max_length=10)
    website = serializers.URLField(required=False, allow_blank=True)
    
    def create(self, validated_data):
        # Extract password before creating user
        password = validated_data.pop('password')

        # Extract profile fields
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        
        profile_data = {
            'first_name': first_name,
            'last_name': last_name,
            'company_name': validated_data.pop('company_name', ''),
            'phone': validated_data.pop('phone', ''),
            'country': validated_data.pop('country', ''),
            'sector': validated_data.pop('sector', ''),
            'language': validated_data.pop('language', ''),
            'website': validated_data.pop('website', ''),
        }

        # Create user with validated=True for immediate access
        user = User.objects.create_user(
            email=validated_data['email'],
            password=password,
            role='client',
            first_name=first_name,
            last_name=last_name
        )
        
        # Create ClientProfile
        ClientProfile.objects.create(user=user, **profile_data)
        
        return user
 