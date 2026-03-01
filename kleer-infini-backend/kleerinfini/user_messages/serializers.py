from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(read_only=True)
    sender_email = serializers.SerializerMethodField()
    receiver_email = serializers.SerializerMethodField()
    sender_name = serializers.SerializerMethodField()
    receiver_name = serializers.SerializerMethodField()
    
    partner_name = serializers.SerializerMethodField()
    partner_uuid = serializers.SerializerMethodField()
    partner_email = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'sender_uuid', 'sender_email', 'sender_name', 
            'receiver', 'receiver_uuid', 'receiver_email', 'receiver_name', 
            'content', 'timestamp', 'is_read', 'conversation_id',
            'partner_name', 'partner_uuid', 'partner_email'
        ]
        read_only_fields = ['id', 'sender', 'sender_uuid', 'receiver_uuid', 'timestamp', 'is_read', 'conversation_id']

    def _norm_id(self, val):
        if not val: return None
        return str(val).replace('-', '').lower()

    def get_partner_name(self, obj):
        request = self.context.get('request')
        context_user_id = None
        if request and request.user.is_authenticated:
            context_user_id = request.user.id
        else:
            context_user_id = self.context.get('user_id')
            
        if not context_user_id:
            return self.get_receiver_name(obj)
            
        my_id_norm = self._norm_id(context_user_id)
        sender_id_norm = self._norm_id(obj.sender_id)
        
        if sender_id_norm == my_id_norm:
            return self.get_receiver_name(obj)
        return self.get_sender_name(obj)

    def get_partner_uuid(self, obj):
        request = self.context.get('request')
        context_user_id = None
        if request and request.user.is_authenticated:
            context_user_id = request.user.id
        else:
            context_user_id = self.context.get('user_id')
            
        if not context_user_id:
            return obj.receiver_uuid
            
        my_id_norm = self._norm_id(context_user_id)
        sender_id_norm = self._norm_id(obj.sender_id)
        
        if sender_id_norm == my_id_norm:
            return obj.receiver_uuid
        return obj.sender_uuid

    def get_partner_email(self, obj):
        request = self.context.get('request')
        context_user_id = None
        if request and request.user.is_authenticated:
            context_user_id = request.user.id
        else:
            context_user_id = self.context.get('user_id')
            
        if not context_user_id:
            return self.get_receiver_email(obj)
            
        my_id_norm = self._norm_id(context_user_id)
        sender_id_norm = self._norm_id(obj.sender_id)
        
        if sender_id_norm == my_id_norm:
            return self.get_receiver_email(obj)
        return self.get_sender_email(obj)

    def get_sender_email(self, obj):
        return obj.sender.email if obj.sender else None

    def get_receiver_email(self, obj):
        return obj.receiver.email if obj.receiver else None

    def get_sender_name(self, obj):
        if not obj.sender: return "Utilisateur"
        full_name = f"{obj.sender.first_name} {obj.sender.last_name}".strip()
        if full_name: return full_name
        
        # Fallback to company name if profile exists
        if hasattr(obj.sender, 'producer_profile') and obj.sender.producer_profile.company_name:
            return obj.sender.producer_profile.company_name
        if hasattr(obj.sender, 'client_profile') and obj.sender.client_profile.company_name:
            return obj.sender.client_profile.company_name
            
        return obj.sender.email.split('@')[0].replace('.', ' ').title()

    def get_receiver_name(self, obj):
        if not obj.receiver: return "Utilisateur"
        full_name = f"{obj.receiver.first_name} {obj.receiver.last_name}".strip()
        if full_name: return full_name
        
        # Fallback to company name if profile exists
        if hasattr(obj.receiver, 'producer_profile') and obj.receiver.producer_profile.company_name:
            return obj.receiver.producer_profile.company_name
        if hasattr(obj.receiver, 'client_profile') and obj.receiver.client_profile.company_name:
            return obj.receiver.client_profile.company_name
            
        return obj.receiver.email.split('@')[0].replace('.', ' ').title()
