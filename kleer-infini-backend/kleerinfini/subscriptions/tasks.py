from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings
from .models import Subscription
from producers.models import ProducerProfile
import logging

logger = logging.getLogger(__name__)

@shared_task
def relance_abonnements():
    """
    Daily task to manage producer subscriptions:
    - 7 days before end: Send explanation/marketing email.
    - 3 days before end: Send urgent reminder email.
    - At expiration: Deactivate producer profile and notify.
    """
    today = timezone.now().date()
    
    # Check for 7-day reminder
    target_7_days = today + timedelta(days=7)
    subs_7_days = Subscription.objects.filter(end_date=target_7_days, status="free")
    for sub in subs_7_days:
        send_reminder_email(sub, days_left=7)

    # Check for 3-day reminder
    target_3_days = today + timedelta(days=3)
    subs_3_days = Subscription.objects.filter(end_date=target_3_days, status="free")
    for sub in subs_3_days:
        send_reminder_email(sub, days_left=3)

    # Check for expiration
    expired_subs = Subscription.objects.filter(end_date__lt=today, status__in=["free", "active"])
    for sub in expired_subs:
        sub.status = "expired"
        sub.save()
        
        # Deactivate Producer Profile
        try:
            profile = ProducerProfile.objects.get(user=sub.user)
            if profile.is_approved:
                profile.is_approved = False
                profile.save()
                send_deactivation_email(profile)
                logger.info(f"Deactivated producer profile for {sub.user.email} due to expired subscription.")
        except ProducerProfile.DoesNotExist:
            logger.warning(f"No ProducerProfile found for user {sub.user.email} during expiration check.")

def send_reminder_email(subscription, days_left):
    user = subscription.user
    try:
        profile = ProducerProfile.objects.get(user=user)
        company_name = profile.company_name
    except ProducerProfile.DoesNotExist:
        company_name = user.email

    if days_left == 7:
        subject = "Bientôt la fin de votre mois gratuit sur Kleer Infini - État de votre situation"
        content = f"""
Bonjour {company_name},

Votre mois d'essai gratuit sur la plateforme Kleer Infini arrive à son terme dans 7 jours. 

Nous espérons que cette période vous a permis de découvrir le potentiel de notre vitrine internationale pour vos exportations.

Pour rappel, afin de maintenir votre visibilité et continuer à recevoir des opportunités d'affaires après ces 7 jours, un abonnement annuel de 2 000 DA est nécessaire. 

Comment procéder ?
1. Effectuez le paiement de 2 000 DA via l'un des moyens disponibles sur votre dashboard (Virement, BaridiMob, ou Paiement par carte).
2. Téléchargez votre reçu dans la section "Paiements" de votre tableau de bord.

Une fois validé, votre compte restera actif pour une année entière !

L'équipe Kleer Infini.
"""
    else: # days_left == 3
        subject = "URGENT : Plus que 3 jours pour valider votre abonnement Kleer Infini"
        content = f"""
Bonjour {company_name},

Ceci est un dernier rappel : votre période d'essai gratuit sur Kleer Infini expire dans seulement 3 jours.

Si aucune action n'est entreprise, votre profil et vos produits seront automatiquement retirés de la vitrine publique et votre accès au dashboard sera suspendu.

Ne perdez pas vos contacts en cours et votre visibilité internationale ! Procédez au paiement de votre licence annuelle (2 000 DA) dès aujourd'hui.

Connectez-vous ici : http://localhost:5173/producer-dashboard/payments

L'équipe Kleer Infini.
"""

    send_mail(
        subject,
        content,
        "contact@kleerinfini-export.com",
        [user.email],
        fail_silently=True
    )

def send_deactivation_email(profile):
    subject = "Votre accès à la plateforme Kleer Infini a été suspendu"
    content = f"""
Bonjour {profile.company_name},

Votre période d'essai gratuit est terminée et nous n'avons pas encore reçu votre preuve de paiement pour la licence annuelle.

En conséquence, votre compte a été suspendu et vos produits ne sont plus visibles par les acheteurs internationaux.

Pour réactiver votre compte instantanément :
Effectuez votre paiement et envoyez-nous le reçu via votre espace personnel. Votre visibilité sera rétablie dès validation du service financier.

E-mail support : contact@kleerinfini-export.com

Cordialement,
L'équipe Kleer Infini.
"""
    send_mail(
        subject,
        content,
        "contact@kleerinfini-export.com",
        [profile.email or profile.user.email],
        fail_silently=True
    )
