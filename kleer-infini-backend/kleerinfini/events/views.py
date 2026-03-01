from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from datetime import date

from django.db.models import Case, When, Value, IntegerField
from .models import Event
from .serializers import EventSerializer, EventListSerializer


class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Events
    """
    permission_classes = [AllowAny]
    
    queryset = Event.objects.filter(is_verified=True).annotate(
        is_algeria=Case(
            When(country__iexact='Algeria', then=Value(0)),
            When(event_type='national', then=Value(0)),
            default=Value(1),
            output_field=IntegerField(),
        )
    )
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'location', 'description']
    ordering_fields = ['start_date', 'created_at']
    ordering = ['is_algeria', 'start_date']
    
    def get_queryset(self):
        """
        Optionally filter events by query parameters
        """
        queryset = super().get_queryset()
        
        # Filter by event_type (national/international)
        event_type = self.request.query_params.get('type', None)
        if event_type:
            queryset = queryset.filter(event_type=event_type)
        
        # Filter by sector
        sector = self.request.query_params.get('sector', None)
        if sector:
            queryset = queryset.filter(sector=sector)
        
        # Filter by country
        country = self.request.query_params.get('country', None)
        if country:
            queryset = queryset.filter(country__icontains=country)
        
        return queryset
    
    def get_serializer_class(self):
        """Use lightweight serializer for list view"""
        if self.action == 'list':
            return EventListSerializer
        return EventSerializer
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """
        Get only upcoming events (future dates)
        GET /api/events/upcoming/
        """
        upcoming_events = self.get_queryset().filter(
            start_date__gte=date.today()
        ).order_by('is_algeria', 'start_date')
        
        # Apply filters from query params
        event_type = request.query_params.get('type', None)
        sector = request.query_params.get('sector', None)
        
        if event_type:
            upcoming_events = upcoming_events.filter(event_type=event_type)
        if sector:
            upcoming_events = upcoming_events.filter(sector=sector)
        
        serializer = self.get_serializer(upcoming_events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get event statistics
        GET /api/events/stats/
        """
        total = self.queryset.count()
        upcoming = self.queryset.filter(start_date__gte=date.today()).count()
        by_type = {
            'national': self.queryset.filter(event_type='national').count(),
            'international': self.queryset.filter(event_type='international').count(),
        }
        
        return Response({
            'total': total,
            'upcoming': upcoming,
            'by_type': by_type,
        })
