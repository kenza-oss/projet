from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product, Category, Region, Type
from .serializers import ProductSerializer, CategorySerializer, RegionSerializer, TypeSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'desc_courte', 'producer__company_name']
    
    def get_queryset(self):
        queryset = Product.objects.all()
        producer_id = self.request.query_params.get('producer')
        
        if producer_id == 'me':
            if self.request.user.is_authenticated:
                from producers.models import ProducerProfile
                profile = ProducerProfile.objects.filter(user=self.request.user).first()
                if profile:
                    return queryset.filter(producer=profile)
                return queryset.none()
            return queryset.none()
        elif producer_id:
            return queryset.filter(producer_id=producer_id)
            
        return queryset

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            from producers.models import ProducerProfile
            profile = ProducerProfile.objects.filter(user=self.request.user).first()
            if profile:
                if not profile.is_approved:
                    return Response({"error": "Votre profil doit être approuvé pour ajouter des produits."}, status=403)
                serializer.save(producer=profile)
            else:
                serializer.save()
        else:
            serializer.save()
    
    def get(self, request, pk):
        product = Product.objects.get(pk=pk)
        product.views += 1
        product.save(update_fields=['views'])
    @action(detail=False, methods=['get'])
    def names_and_views(self, request):
        products = Product.objects.all().values('name', 'views')
        return Response(products)

class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [permissions.AllowAny]

class TypeViewSet(viewsets.ModelViewSet):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    permission_classes = [permissions.AllowAny]

