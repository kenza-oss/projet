import os
import django
from django.core.mail import send_mail
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def test_email():
    try:
        print(f"Attempting to send test email from {settings.EMAIL_HOST_USER}...")
        send_mail(
            'Test Kleer Infini - Configuration Email',
            'Félicitations mon ami ! Votre serveur email est maintenant configuré à 100%. Les notifications réelles sont activées.',
            settings.DEFAULT_FROM_EMAIL,
            [settings.EMAIL_HOST_USER], # Sending to self for verification
            fail_silently=False,
        )
        print("[SUCCESS] Email sent successfully!")
    except Exception as e:
        print(f"[ERROR] Failed to send email: {e}")

if __name__ == "__main__":
    test_email()
