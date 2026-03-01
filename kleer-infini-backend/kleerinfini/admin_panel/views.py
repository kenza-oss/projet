from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from users.permissions import IsAdmin
from users.models import User
from producers.models import ProducerProfile
from subscriptions.models import Subscription
from products.models import Product, Category
from django.db import models
from products.serializers import ProductSerializer, CategorySerializer
from rest_framework import viewsets
from django.utils import timezone
from datetime import timedelta

# Create your views here.

class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    def get(self, request):
        # Utilisateurs
        total_users = User.objects.count()
        total_producers = User.objects.filter(role='producer').count()
        total_clients = User.objects.filter(role='client').count()
        # Producteurs actifs/inactifs (actif = abonnement actif)
        active_producers = Subscription.objects.filter(status='actif').values_list('user', flat=True).distinct().count()
        inactive_producers = total_producers - active_producers
        # Abonnements
        active_subs = Subscription.objects.filter(status='actif').count()
        expired_subs = Subscription.objects.filter(status='expire').count()
        # Produits les plus vus (si champ 'views' existe)
        top_products = []
        if hasattr(Product, 'views'):
            top_products = list(Product.objects.all().order_by('-views')[:5].values('id', 'name', 'views'))
        # Statistiques sur les catégories
        total_categories = Category.objects.count()
        top_categories = list(Category.objects.annotate(num_products=models.Count('products')).order_by('-num_products')[:5].values('id', 'name', 'num_products'))
        # Filtres par date (exemple : nouveaux utilisateurs 30 derniers jours)
        last_30d = timezone.now() - timedelta(days=30)
        new_users_30d = User.objects.filter(created_at__gte=last_30d).count()
        return Response({
            'total_users': total_users,
            'total_producers': total_producers,
            'total_clients': total_clients,
            'active_producers': active_producers,
            'inactive_producers': inactive_producers,
            'active_subscriptions': active_subs,
            'expired_subscriptions': expired_subs,
            'top_products': top_products,
            'total_categories': total_categories,
            'top_categories': top_categories,
            'new_users_last_30_days': new_users_30d,
        })