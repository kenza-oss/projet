from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    """Serializer for Event model"""
    
    # Read-only computed fields
    is_upcoming = serializers.ReadOnlyField()
    days_until = serializers.ReadOnlyField()
    formatted_date = serializers.ReadOnlyField()
    
    # Custom field for frontend compatibility
    date = serializers.SerializerMethodField()
    dateStart = serializers.SerializerMethodField()
    color = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id',
            'name',
            'location',
            'country',
            'start_date',
            'end_date',
            'date',  # formatted for display
            'dateStart',  # JS Date object
            'event_type',
            'categories',
            'description',
            'url',
            'image',
            'image_url',
            'icon',
            'color',
            'is_upcoming',
            'days_until',
            'formatted_date',
            'source',
            'auto_published',
            'is_verified',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'auto_published']
    
    def get_date(self, obj):
        """Return formatted date for frontend"""
        return obj.formatted_date
    
    def get_dateStart(self, obj):
        """Return ISO date string for JS Date parsing"""
        if obj.start_date:
            return obj.start_date.isoformat()
        return None
    
    def get_color(self, obj):
        """Return gradient colors based on event type"""
        if obj.event_type == 'national':
            return "from-[#B85C38] to-[#8B4513]"
        else:
            return "from-[#D4AF37] to-[#B8860B]"

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class EventListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    
    days_until = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = [
            'id',
            'name',
            'location',
            'start_date', 
            'event_type',
            'categories',
            'icon',
            'days_until',
            'image',
            'image_url',
        ]
