from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, filters
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import ProducerProfile, Certification
from .serializers import CertificationSerializer, ProducerProfileSerializer, ProducerProfileCreateSerializer
from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from users.permissions import IsProducer
from user_messages.models import Message
from user_messages.serializers import MessageSerializer
from estimate.models import Estimate
from estimate.serializers import EstimateSerializer


from rest_framework.decorators import action

class ProducerProfileViewSet(viewsets.ModelViewSet):
    queryset = ProducerProfile.objects.all()
    serializer_class = ProducerProfileSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['company_name', 'activity', 'city', 'description']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        # Admin can see everything
        if self.request.user.is_authenticated and (self.request.user.is_staff or self.request.user.role == 'admin'):
            return ProducerProfile.objects.all()
        
        # Public or detail view: show only approved producers
        if self.action in ['list', 'retrieve']:
            return ProducerProfile.objects.filter(is_approved=True)

        # For create/update/delete, restrict to owner
        if self.request.user.is_authenticated:
            return ProducerProfile.objects.filter(user=self.request.user)
            
        return ProducerProfile.objects.none()

    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """
        Récupère ou met à jour le profil du producteur connecté.
        """
        user = request.user

        # Producer logic - ONLY if user is a producer OR if profile already exists
        # We don't want to auto-create producer profiles for Admin/Staff unless they specifically register as one
        if user.role != 'producer' and not ProducerProfile.objects.filter(user=user).exists():
            return Response({"error": "Profil producteur introuvable"}, status=status.HTTP_404_NOT_FOUND)

        profile, created = ProducerProfile.objects.get_or_create(
            user=user,
            defaults={
                'company_name': 'Nouvelle Entreprise',
                'activity': 'À définir',
                'email': user.email
            }
        )
        
        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            data = serializer.data
            data['role'] = 'producer'
            return Response(data)
        
        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(profile, data=request.data, partial=(request.method == 'PATCH'))
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProducerDashboardView(APIView):
    permission_classes = [IsAuthenticated] # Removed IsProducer to avoid 403s if role is mismatched but user is valid
    @swagger_auto_schema(
        operation_description="Récupère le tableau de bord d'un producteur avec ses statistiques, certifications et informations",
        operation_summary="Tableau de bord producteur",
        manual_parameters=[
            openapi.Parameter(
                'pk',
                openapi.IN_PATH,
                description="ID du producteur",
                type=openapi.TYPE_INTEGER,
                required=True
            ),
        ],
        responses={
            200: openapi.Response(
                description="Profil producteur complet récupéré avec succès",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'id': openapi.Schema(type=openapi.TYPE_INTEGER, description="ID du profil"),
                        'user': openapi.Schema(type=openapi.TYPE_INTEGER, description="ID de l'utilisateur"),
                        'user_email': openapi.Schema(type=openapi.TYPE_STRING, description="Email de l'utilisateur"),
                        'user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description="ID de l'utilisateur"),
                        'company_name': openapi.Schema(type=openapi.TYPE_STRING, description="Nom de l'entreprise"),
                        'activity': openapi.Schema(type=openapi.TYPE_STRING, description="Activité de l'entreprise"),
                        'email': openapi.Schema(type=openapi.TYPE_STRING, description="Email de contact"),
                        'phone': openapi.Schema(type=openapi.TYPE_STRING, description="Téléphone"),
                        'whatsapp': openapi.Schema(type=openapi.TYPE_STRING, description="Numéro WhatsApp"),
                        'country': openapi.Schema(type=openapi.TYPE_OBJECT, description="Pays (code et label)"),
                        'city': openapi.Schema(type=openapi.TYPE_STRING, description="Ville"),
                        'address': openapi.Schema(type=openapi.TYPE_STRING, description="Adresse"),
                        'latitude': openapi.Schema(type=openapi.TYPE_NUMBER, description="Latitude"),
                        'longitude': openapi.Schema(type=openapi.TYPE_NUMBER, description="Longitude"),
                        'rc_number': openapi.Schema(type=openapi.TYPE_STRING, description="Numéro RC"),
                        'nif_number': openapi.Schema(type=openapi.TYPE_STRING, description="Numéro NIF"),
                        'cert_files': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING), description="Fichiers de certification"),
                        'tech_files': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING), description="Fichiers techniques"),
                        'min_export_quantity': openapi.Schema(type=openapi.TYPE_STRING, description="Quantité minimum d'export"),
                        'monthly_capacity': openapi.Schema(type=openapi.TYPE_STRING, description="Capacité mensuelle"),
                        'yearly_capacity': openapi.Schema(type=openapi.TYPE_STRING, description="Capacité annuelle"),
                        'target_markets': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_OBJECT), description="Marchés cibles"),
                        'export_categories': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_OBJECT), description="Catégories d'export"),
                        'description': openapi.Schema(type=openapi.TYPE_STRING, description="Description de l'entreprise"),
                        'stats': openapi.Schema(type=openapi.TYPE_OBJECT, description="Statistiques du producteur"),
                        'certifications': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_OBJECT), description="Liste des certifications"),
                        'documents': openapi.Schema(type=openapi.TYPE_STRING, description="URL des documents"),
                    }
                )
            ),
            404: openapi.Response(description="Producteur non trouvé"),
        }
    )
    def get(self, request, pk=None):
        # STRICT ROLE CHECK
        if request.user.role != 'producer' and not request.user.is_staff:
            return Response(
                {"error": "Accès refusé. Réservé aux producteurs."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        try:
            if pk == 'me':
                # Use token identity
                producer = ProducerProfile.objects.filter(user=request.user).first()
                if not producer:
                    # ONLY auto-create if user role is producer
                    if request.user.role == 'producer':
                        producer = ProducerProfile.objects.create(
                            user=request.user,
                            company_name='Ma Société',
                            activity='Producteur',
                            email=request.user.email
                        )
                    else:
                        return Response(
                            {"error": "Aucun profil producteur trouvé pour cet utilisateur"},
                            status=status.HTTP_404_NOT_FOUND
                        )
            else:
                producer = ProducerProfile.objects.get(pk=pk)
                # SECURITY CHECK
                if not request.user.is_staff and producer.user != request.user:
                     return Response(
                        {"error": "Vous n'avez pas la permission de voir ce tableau de bord"},
                        status=status.HTTP_403_FORBIDDEN
                    )
            
            # Utiliser le serializer complet pour avoir tous les champs
            serializer = ProducerProfileSerializer(producer, context={'request': request})
            data = serializer.data
            
            # Fetch recent messages
            recent_messages = Message.objects.filter(receiver=request.user).order_by('-timestamp')[:5]
            data['messages'] = MessageSerializer(recent_messages, many=True, context={'request': request}).data
            
            # Fetch recent demands (estimates)
            recent_demands = Estimate.objects.filter(producer=request.user).order_by('-created_at')[:5]
            data['demands'] = EstimateSerializer(recent_demands, many=True).data

            return Response(data)
            
        except ProducerProfile.DoesNotExist:
            return Response(
                {"error": "Producteur non trouvé"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @swagger_auto_schema(
        operation_description="Met à jour les informations du tableau de bord d'un producteur",
        operation_summary="Mettre à jour le profil producteur",
        request_body=ProducerProfileSerializer,
        responses={
            200: ProducerProfileSerializer,
            404: 'Producteur non trouvé',
            403: 'Permission refusée'
        }
    )
    def put(self, request, pk):
        try:
            producer = ProducerProfile.objects.get(pk=pk)
            
            # Vérifier que l'utilisateur peut modifier ce profil
            if not request.user.is_staff and producer.user != request.user:
                return Response(
                    {"error": "Vous n'avez pas la permission de modifier ce profil"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = ProducerProfileSerializer(producer, data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except ProducerProfile.DoesNotExist:
            return Response(
                {"error": "Producteur non trouvé"},
                status=status.HTTP_404_NOT_FOUND
            )

class CertificationListCreateAPIView(generics.ListCreateAPIView):
    """
    Liste et création des certifications
    """
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer
    permission_classes = [AllowAny]

class CertificationRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Récupération, modification et suppression d'une certification
    """
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer
    permission_classes = [AllowAny]

# CRUD Views pour les Producteurs
class ProducerProfileListCreateAPIView(generics.ListCreateAPIView):
    """
    Liste et création des profils producteurs
    """
    queryset = ProducerProfile.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProducerProfileCreateSerializer
        return ProducerProfileSerializer

class ProducerProfileRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Récupération, modification et suppression d'un profil producteur
    """
    queryset = ProducerProfile.objects.all()
    serializer_class = ProducerProfileSerializer
