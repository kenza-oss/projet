from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions # Needed for AllowAny
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsProducer
from .services.ai_service import AIService, AIServiceError

class InvoiceAnalysisView(APIView):
    """
    Endpoint pour l'analyse OCR des factures export.
    Réservé aux producteurs algériens.
    """
    # permission_classes = [IsAuthenticated, IsProducer]
    permission_classes = [permissions.AllowAny] # TEMP DEBUG: Allow everyone to test endpoint

    def post(self, request):
        print(f"DEBUG AUTH: User={request.user}, Auth={request.auth}")
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response(
                {"error": "Aucun fichier n'a été fourni."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            ai_service = AIService()
            # Simulation d'extraction de texte (en prod, on utiliserait Tesseract/Cloud Vision/etc.)
            # Pour l'instant, on passe le nom du fichier pour simuler le contexte
            analysis = ai_service.analyze_invoice(file_content=file_obj, text_content=file_obj.name)
            return Response(analysis, status=status.HTTP_200_OK)
            
        except AIServiceError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {"error": f"Crash Backend: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
