from django.urls import path
from .views import RegisterProducerView, LoginView, RegisterClientView, TwoFactorSetupView, TwoFactorVerifyView, AcademyRegistrationView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/producer/', RegisterProducerView.as_view(), name='register_producer'),
    path('register/', RegisterClientView.as_view(), name='register_client'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('2fa/setup/', TwoFactorSetupView.as_view(), name='2fa-setup'),
    path('2fa/verify/', TwoFactorVerifyView.as_view(), name='2fa-verify'),
    path('academy/register/', AcademyRegistrationView.as_view(), name='academy_register'),
]