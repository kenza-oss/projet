from django.urls import path
from .views import InvoiceAnalysisView

urlpatterns = [
    path('analyze-invoice/', InvoiceAnalysisView.as_view(), name='analyze-invoice'),
]
