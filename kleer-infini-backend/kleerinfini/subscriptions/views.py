import json
import logging
import pyotp
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from django.utils.translation import gettext as _
from django.core.mail import send_mail

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import Subscription, GlobalSettings
from .serializers import GlobalSettingsSerializer
from users.permissions import IsAdmin

logger = logging.getLogger(__name__)

class UploadPaymentProofView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        proof_file = request.FILES.get("proof")
        user = request.user
        try:
            subscription, created = Subscription.objects.get_or_create(user=user)
            subscription.proof_file = proof_file
            subscription.status = "pending_validation"
            subscription.save()

            subject = f"🔔 [Kleer Infini] Nouvelle preuve de paiement : {user.email}"
            message = f"Bonjour, Un producteur a téléchargé une preuve de paiement. Producteur : {user.email}"
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, ["kleernetinfini@gmail.com"], fail_silently=True)
            return Response({"message": _("Preuve de paiement soumise avec succès ✅")}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PublicSettingsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        settings = GlobalSettings.get_settings()
        serializer = GlobalSettingsSerializer(settings)
        return Response(serializer.data)

class AdminSettingsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        settings = GlobalSettings.get_settings()
        serializer = GlobalSettingsSerializer(settings)
        return Response(serializer.data)

    def patch(self, request):
        settings = GlobalSettings.get_settings()
        serializer = GlobalSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GenerateInvoicePDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from xhtml2pdf import pisa
        from io import BytesIO
        from django.http import HttpResponse

        gs = GlobalSettings.get_settings()
        user = request.user
        
        inv_num = f"INV-{timezone.now().year}-{str(user.id)[:6].upper()}"
        date_str = timezone.now().strftime('%d/%m/%Y')

        html_content = f"""
        <html>
        <head><style>body {{ font-family: sans-serif; p {{ margin: 5px 0; }} }}</style></head>
        <body>
            <h1>FACTURE D'ABONNEMENT</h1>
            <p>Facture N°: {inv_num}</p>
            <p>Date: {date_str}</p>
            <hr>
            <h3>Client:</h3>
            <p>{user.email}</p>
            <hr>
            <h3>Détails du paiement:</h3>
            <p>Service: Licence Annuelle Exportateur</p>
            <p>Montant: {gs.subscription_price} DA</p>
            <hr>
            <h3>Coordonnées Bancaires:</h3>
            <p>Banque: {gs.bank_name}</p>
            <p>Titulaire: {gs.account_holder}</p>
            <p>RIB: {gs.rib}</p>
            <p>CCP: {gs.ccp}</p>
            <p>RIP: {gs.rip}</p>
        </body>
        </html>
        """
        result = BytesIO()
        pisa.pisaDocument(BytesIO(html_content.encode("UTF-8")), result)
        return HttpResponse(result.getvalue(), content_type='application/pdf')
