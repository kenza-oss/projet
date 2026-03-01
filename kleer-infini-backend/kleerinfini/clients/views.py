from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, viewsets
from rest_framework.decorators import action
from .models import Invitation, ClientProfile
from .serializers import InviteClientSerializer, ClientProfileSerializer
from users.permissions import IsAdmin
import uuid
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.hashers import make_password
from estimate.models import Estimate
from notifications.models import Notification
from producers.models import ProducerProfile
from subscriptions.models import Subscription
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your views here.

class InviteClientView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = InviteClientSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            token = str(uuid.uuid4())
            expires_at = timezone.now() + timedelta(hours=72)
            invitation = Invitation.objects.create(
                email=email,
                token=token,
                expires_at=expires_at,
            )
            # Ici, on renvoie juste le lien d'invitation (à envoyer par email côté admin plus tard)
            link = f"/api/register/invite/{token}/"
            return Response({'message': 'Invitation créée.', 'invitation_link': link}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        """List all invitations for admin"""
        invitations = Invitation.objects.all().order_by('-id')
        from .serializers import InviteClientSerializer
        serializer = InviteClientSerializer(invitations, many=True)
        return Response(serializer.data)

class ClientDashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'client':
            return Response({'error': 'Permission refusée.'}, status=status.HTTP_403_FORBIDDEN)
        
        total_requests = Estimate.objects.filter(client=user).count()
        received_responses = Estimate.objects.filter(client=user, status__in=['accepted', 'sent']).count()
        conversations = Notification.objects.filter(user=user, notification_type='message').values('related_id').distinct().count()
        documents = Estimate.objects.filter(client=user).exclude(response_file='').count()
        producers_contacted = Estimate.objects.filter(client=user).values('producer').distinct().count()

        recent_estimates = Estimate.objects.filter(client=user).order_by('-created_at')[:5]
        activities = []
        for est in recent_estimates:
            activities.append({
                'title': f"Devis {est.status} de {est.producer.get_full_name() or est.producer.email if est.producer else 'Unknown'}",
                'time': est.created_at.strftime("%Y-%m-%d %H:%M"),
                'status': est.status,
                'has_file': bool(est.response_file)
            })

        return Response({
            'stats': {
                'total_requests': total_requests,
                'received_responses': received_responses,
                'conversations': conversations,
                'documents': documents,
                'producers_contacted': producers_contacted,
            },
            'recent_activities': activities
        })

class AdminDashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        total_clients = User.objects.filter(role='client').count()
        total_producers = User.objects.filter(role='producer').count()
        total_invitations = Invitation.objects.count()
        
        active_subscriptions = Subscription.objects.filter(status='active').count()
        pending_subscriptions = Subscription.objects.filter(status='pending_validation').count()
        expired_subscriptions = Subscription.objects.filter(status='expired').count()

        recent_invitations = Invitation.objects.all().order_by('-id')[:5]
        
        return Response({
            'stats': {
                'total_clients': total_clients,
                'total_producers': total_producers,
                'total_invitations': total_invitations,
                'active_subscriptions': active_subscriptions,
                'pending_subscriptions': pending_subscriptions,
                'expired_subscriptions': expired_subscriptions,
            },
            'recent_invitations': InviteClientSerializer(recent_invitations, many=True).data
        })

class RegisterInviteGetView(APIView):
    def get(self, request, token):
        try:
            invitation = Invitation.objects.get(token=token)
            if not invitation.is_valid():
                return Response({'error': 'Invitation expirée ou déjà utilisée.'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'email': invitation.email, 'expires_at': invitation.expires_at})
        except Invitation.DoesNotExist:
            return Response({'error': 'Invitation introuvable.'}, status=status.HTTP_404_NOT_FOUND)

class RegisterInvitePostView(APIView):
    def post(self, request, token):
        try:
            invitation = Invitation.objects.get(token=token)
            if not invitation.is_valid():
                return Response({'error': 'Invitation expirée ou déjà utilisée.'}, status=status.HTTP_400_BAD_REQUEST)
            password = request.data.get('password')
            if not password:
                return Response({'error': 'Mot de passe requis.'}, status=status.HTTP_400_BAD_REQUEST)
            user = User.objects.create_user(email=invitation.email, password=password, role='client')
            invitation.used = True
            invitation.save()
            return Response({'message': 'Compte client créé avec succès.'})
        except Invitation.DoesNotExist:
            return Response({'error': 'Invitation introuvable.'}, status=status.HTTP_404_NOT_FOUND)

class ClientProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ClientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'user_id'

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'admin':
            return ClientProfile.objects.all()
        
        # For producers, we only allow access to clients who sent them an estimate
        if user.role == 'producer':
            client_ids = Estimate.objects.filter(producer=user).values_list('client_id', flat=True)
            return ClientProfile.objects.filter(user_id__in=client_ids)
            
        # Default: user sees only their own profile
        return ClientProfile.objects.filter(user=user)

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='me')
    def me(self, request):
        profile = ClientProfile.objects.filter(user=request.user).first()
        if not profile:
            # Auto-create profile if missing
            profile = ClientProfile.objects.create(
                user=request.user,
                company_name=request.user.email,
                sector="Non spécifié"
            )
        
        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
