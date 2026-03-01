from rest_framework.permissions import BasePermission

from subscriptions.models import Subscription
from django.utils import timezone

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')

class IsProducer(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'producer')

class IsClient(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'client')

class HasActiveSubscription(BasePermission):
    message = "Votre abonnement est expiré, suspendu ou non validé. Veuillez le renouveler."
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated and request.user.role == 'producer'):
            return False
        # On récupère l'abonnement le plus récent
        sub = Subscription.objects.filter(user=request.user).order_by('-end_date').first()
        if not sub:
            return False
        if sub.status != 'actif':
            return False
        if sub.end_date < timezone.now():
            return False
        return True 