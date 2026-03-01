from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, RegionViewSet, TypeViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'regions', RegionViewSet)
router.register(r'types', TypeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
