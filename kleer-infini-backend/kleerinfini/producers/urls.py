from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CertificationListCreateAPIView,
    CertificationRetrieveUpdateDestroyAPIView,
    ProducerDashboardView,
    ProducerProfileViewSet
)

router = DefaultRouter()
router.register(r'profiles', ProducerProfileViewSet)

urlpatterns = [
    # URLs pour les certifications
    path('certifications/', CertificationListCreateAPIView.as_view(), name='certification-list-create'),
    path('certifications/<int:pk>/', CertificationRetrieveUpdateDestroyAPIView.as_view(), name='certification-detail'),
    
    # URL pour le tableau de bord (Supporte ID ou 'me')
    path('dashboard/<str:pk>/', ProducerDashboardView.as_view(), name='producer-dashboard'),
    
    # URLs du router pour les profils producteurs
    path('', include(router.urls)),
]