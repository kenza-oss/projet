from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    InviteClientView, RegisterInviteGetView, RegisterInvitePostView, 
    ClientDashboardStatsView, AdminDashboardStatsView, ClientProfileViewSet
)

router = DefaultRouter()
router.register(r'client-profiles', ClientProfileViewSet, basename='client-profile')

urlpatterns = [
    path('admin/invite-client/', InviteClientView.as_view(), name='invite_client'),
    path('register/invite/<str:token>/', RegisterInviteGetView.as_view(), name='register_invite_get'),
    path('register/invite/<str:token>/', RegisterInvitePostView.as_view(), name='register_invite_post'),
    path('client/stats/', ClientDashboardStatsView.as_view(), name='client_stats'),
    path('admin/stats/', AdminDashboardStatsView.as_view(), name='admin_stats'),
    path('', include(router.urls)),
] 