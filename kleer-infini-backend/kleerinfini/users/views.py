# -*- coding: utf-8 -*-
import pyotp
from rest_framework import status, permissions
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RegisterProducerSerializer, LoginSerializer
from producers.serializers import ProducerProfileCreateSerializer
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from subscriptions.models import Subscription
from django.utils import timezone
from datetime import timedelta
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class RegisterProducerView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        try:
            serializer = ProducerProfileCreateSerializer(data=request.data)
            if serializer.is_valid():
                producer_profile = serializer.save()
                user = producer_profile.user
                return Response({
                    'status': 'success',
                    'message': 'Inscription réussie.',
                    'user': {
                        'id': str(user.id),
                        'email': user.email,
                        'role': user.role
                    }
                }, status=status.HTTP_201_CREATED)
            return Response({'error': 'Validation Error', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    refresh = RefreshToken.for_user(user)
                    user_data = {
                        'id': str(user.id),
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'role': user.role,
                        'is_2fa_enabled': user.is_2fa_enabled
                    }
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'user': user_data
                    })
                return Response({'error': 'Mot de passe incorrect.'}, status=status.HTTP_401_UNAUTHORIZED)
            except User.DoesNotExist:
                return Response({'error': 'Utilisateur non trouvé.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterClientView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request):
        import logging
        import traceback
        logger = logging.getLogger(__name__)
        
        from .serializers import RegisterClientSerializer
        from clients.models import Invitation
        try:
            logger.info(f"Registration Attempt - Data: {request.data}")
            
            invitation_token = request.data.get('invitation_token')
            invitation = None
            if invitation_token:
                try:
                    invitation = Invitation.objects.get(token=invitation_token)
                    if not invitation.is_valid() or request.data.get('email') != invitation.email:
                        logger.warning(f"Invalid invitation token: {invitation_token}")
                        return Response({'error': 'Invitation invalide ou expirée'}, status=status.HTTP_400_BAD_REQUEST)
                except Invitation.DoesNotExist:
                    logger.warning(f"Invitation token not found: {invitation_token}")
                    return Response({'error': 'Invitation non trouvée'}, status=status.HTTP_400_BAD_REQUEST)

            serializer = RegisterClientSerializer(data=request.data)
            if serializer.is_valid():
                logger.info("Serializer is valid, saving...")
                user = serializer.save()
                
                if invitation:
                    invitation.used = True
                    invitation.save()
                    logger.info("Invitation marked as used.")
                
                from subscriptions.models import Subscription
                from django.utils import timezone
                from datetime import timedelta
                
                Subscription.objects.get_or_create(
                    user=user,
                    defaults={
                        'status': 'active',
                        'start_date': timezone.now().date(),
                        'end_date': (timezone.now() + timedelta(days=365)).date()
                    }
                )
                logger.info("Subscription created.")
                
                from rest_framework_simplejwt.tokens import RefreshToken
                refresh = RefreshToken.for_user(user)
                return Response({
                    'status': 'success',
                    'message': 'Compte créé avec succès.',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': {'id': str(user.id), 'email': user.email, 'role': user.role}
                }, status=status.HTTP_201_CREATED)
            
            logger.warning(f"Serializer validation failed: {serializer.errors}")
            return Response({'error': 'Erreur de validation', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"CRITICAL Registration Error: {str(e)}")
            logger.error(traceback.format_exc())
            # Return a cleaner error message but keep traceback for debugging in development
            return Response({
                'error': str(e),
                'details': 'Une erreur serveur est survenue. Veuillez contacter l\'administrateur.',
                'traceback': traceback.format_exc() if settings.DEBUG else None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TwoFactorSetupView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.otp_base32:
            user.otp_base32 = pyotp.random_base32()
            user.save()

        otp_uri = pyotp.totp.TOTP(user.otp_base32).provisioning_uri(
            name=user.email,
            issuer_name="Kleer Infini"
        )
        return Response({
            "otp_base32": user.otp_base32,
            "otp_uri": otp_uri
        })

class TwoFactorVerifyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        otp_code = request.data.get("otp_code")
        user = request.user
        if not user.otp_base32:
            return Response({"error": "2FA non configuré"}, status=status.HTTP_400_BAD_REQUEST)

        totp = pyotp.totp.TOTP(user.otp_base32)
        if totp.verify(otp_code):
            user.is_2fa_enabled = True
            user.save()
            return Response({"message": "2FA activé avec succès"})
        return Response({"error": "Code OTP invalide"}, status=status.HTTP_400_BAD_REQUEST)
