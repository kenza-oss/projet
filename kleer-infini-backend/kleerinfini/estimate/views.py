from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response   # ← Add this line
from .models import Estimate, Estimate_Product
from .serializers import EstimateSerializer, EstimateProductSerializer
from users.permissions import IsClient, IsProducer



class EstimateViewSet(viewsets.ModelViewSet):
    queryset = Estimate.objects.all()
    serializer_class = EstimateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # If admin, see all
        if user.role == 'admin':
            return Estimate.objects.all()

        # Producer sees only estimates assigned to them
        if user.role == 'producer':
            return Estimate.objects.filter(producer=user)

        # Client sees only their own estimates
        if user.role == 'client':
            return Estimate.objects.filter(client=user)

        return Estimate.objects.none()

    def perform_create(self, serializer):
        """
        When a client creates an estimate, associate it with them automatically.
        """
        user = self.request.user
        print(f"[DEBUG] User Role: {user.role}, User: {user.email}")
        if user.role != 'client':
            print(f"[ERROR] Permission Denied: User role is {user.role}")
            raise permissions.PermissionDenied("Only clients can create estimates.")
        
        try:
            instance = serializer.save(client=user)
            print(f"[DEBUG] Estimate created: {instance.id}")
            
            # Send real-time notification to the producer
            if instance.producer:
                from asgiref.sync import async_to_sync
                from channels.layers import get_channel_layer
                channel_layer = get_channel_layer()
                
                async_to_sync(channel_layer.group_send)(
                    f'chat_{instance.producer.id}',
                    {
                        'type': 'notification',
                        'notification_type': 'new_quote_request',
                        'message': 'Nouvelle demande de devis reçue',
                        'data': serializer.data
                    }
                )

            # 📧 Notify Admin Email
            try:
                from django.core.mail import send_mail
                from django.conf import settings
                
                subject = f"📝 [Kleer Infini] Nouvelle Demande de Consultation : {user.email}"
                message = f"""
                Bonjour Admin,
                
                Une nouvelle demande de consultation (devis) a été soumise sur la plateforme.
                
                Client : {user.email}
                Catégorie : {instance.category.name if instance.category else 'N/A'}
                Sujet : {instance.subject}
                
                Détails consultables dans le Dashboard Admin :
                http://localhost:8000/admin/estimate/estimate/{instance.id}/change/
                """
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    ["kleernetinfini@gmail.com"],
                    fail_silently=True,
                )
            except Exception as e:
                print(f"[ERROR] Failed to send admin email for estimate: {e}")
        except Exception as e:
            print(f"[ERROR] Serializer save failed: {str(e)}")
            raise e
    @action(detail=False, methods=['get'])
    def total_count(self, request):
        total = Estimate.objects.count()
        return Response({'total_estimates': total})


class EstimateProductViewSet(viewsets.ModelViewSet):
    queryset = Estimate_Product.objects.all()
    serializer_class = EstimateProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Admin sees all
        if user.role == 'admin':
            return Estimate_Product.objects.all()

        # Producer sees products only for their estimates
        if user.role == 'producer':
            return Estimate_Product.objects.filter(estimate__producer=user)

        # Client sees products only in their estimates
        if user.role == 'client':
            return Estimate_Product.objects.filter(estimate__client=user)

        return Estimate_Product.objects.none()
