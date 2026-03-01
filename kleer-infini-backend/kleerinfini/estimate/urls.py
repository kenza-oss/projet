from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from .views import EstimateViewSet, EstimateProductViewSet

# Swagger schema view
schema_view = get_schema_view(
    openapi.Info(
        title="Estimate API",
        default_version='v1',
        description="API for managing client estimates, producers' responses, and related products.",
        contact=openapi.Contact(email="support@example.com"),
    ),
    public=True,
    permission_classes=(permissions.IsAuthenticated,),  # ✅ Swagger now requires login/token
)

# Router for the viewset
router = DefaultRouter()
router.register(r'estimates', EstimateViewSet)

urlpatterns = router.urls
