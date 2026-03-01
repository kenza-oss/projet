from django.urls import path
from .views import UploadPaymentProofView, PublicSettingsView, AdminSettingsView, GenerateInvoicePDFView

urlpatterns = [
    path("upload-proof/", UploadPaymentProofView.as_view(), name="upload-proof"),
    path("settings/public/", PublicSettingsView.as_view(), name="settings-public"),
    path("settings/admin/", AdminSettingsView.as_view(), name="settings-admin"),
    path("invoice-pdf/", GenerateInvoicePDFView.as_view(), name="invoice-pdf"),
]
