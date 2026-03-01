from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .models import ProducerProfile
from subscriptions.models import Subscription

@receiver(pre_save, sender=ProducerProfile)
def track_approval_date(sender, instance, **kwargs):
    if instance.pk:
        previous = ProducerProfile.objects.get(pk=instance.pk)
        if instance.is_approved and not previous.is_approved:
            instance.approval_date = timezone.now()

@receiver(post_save, sender=ProducerProfile)
def handle_producer_profile_save(sender, instance, created, **kwargs):
    """
    Handles post-save logic for ProducerProfile:
    - Admin notifications on creation.
    - Approval email and subscription initialization.
    """
    if created:
        # Admin Notification
        subject = f"Nouveau Producteur en Attente de Validation : {instance.company_name}"
        message = f"""
        Un nouveau producteur s'est inscrit sur Kleer Infini.
        
        Détails :
        - Entreprise : {instance.company_name}
        - Email : {instance.email}
        - Utilisateur : {instance.user.email}
        
        Veuillez vous connecter à l'interface d'administration pour valider ce compte.
        """
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.EMAIL_HOST_USER], # Or a designated admin list
                fail_silently=True,
            )
        except Exception as e:
            print(f"Failed to send admin notification email: {e}")

    # Approval Notification (Triggered when is_approved is True)
    if instance.is_approved:
        # Initialize or update subscription to 'free' for 30 days if not already active
        sub, sub_created = Subscription.objects.get_or_create(user=instance.user)
        
        # Only set to free trial if they don't have an active or already free subscription
        # This prevents resetting the 30-day clock on Every profile update.
        if sub_created or sub.status not in ['active', 'free', 'pending_validation']:
            sub.status = "free"
            sub.start_date = timezone.now().date()
            sub.end_date = sub.start_date + timedelta(days=30)
            sub.save()
            
            # Send the approval email ONLY when the trial starts
            send_approval_email(instance)

def send_approval_email(instance):
    subject = "Votre demande d'inscription à la plateforme Kleer Infini est validée !"
    
    email_content = f"""
Bonjour {instance.company_name},

Nous avons le plaisir de vous informer que votre demande d'inscription à la plateforme internationale Kleer Infini a été validée par notre équipe !

Félicitations, vous faites désormais partie du réseau leader de l'exportation des produits algériens hors-hydrocarbures. En tant que partenaire certifié, vous bénéficiez dès maintenant d'avantages exclusifs pour propulser votre entreprise sur la scène internationale :

- Gérez votre vitrine : Ajoutez vos meilleurs produits avec des détails complets (photos, fiches techniques, certifications) pour attirer l'attention des acheteurs mondiaux.
- Suivez vos performances : Accédez à votre tableau de bord personnalisé pour consulter vos statistiques en temps réel.
- Facilitation d'export : Profitez de notre programme d'accompagnement dédié pour simplifier vos démarches à l'international.
- Connexions directes : Recevez des messages et des demandes de devis provenant de clients sérieux et vérifiés à travers le monde.

OFFRE DE BIENVENUE : 
Pour célébrer votre arrivée, nous vous offrons un ACCÈS GRATUIT ILLIMITÉ pendant 1 mois (30 jours). 

Passé ce délai, pour continuer à profiter de toutes nos fonctionnalités sans limites, un abonnement annuel de seulement 2 000 DA vous sera demandé. Il vous suffira de télécharger votre preuve de paiement directement dans votre espace personnel (Dashboard) pour activer définitivement votre compte.

Soyez parmi les premiers à bénéficier du rayonnement de notre plateforme et donnez à vos produits l'exposition qu'ils méritent !

Connectez-vous dès maintenant : http://localhost:5173/producer-login

L'équipe Kleer Infini, à votre service pour l'excellence de l'exportation.

---
Kleer Infini - Entreprise d'exportation de produits hors-hydrocarbures
Adresse : [Adresse exacte de Kleer Infini]
E-mail : contact@kleerinfini-export.com | Site Web : www.kleerinfini.com
"""
    try:
        send_mail(
            subject,
            email_content,
            "contact@kleerinfini-export.com", 
            [instance.email or instance.user.email],
            fail_silently=False,
        )
        print(f"Approval email sent to {instance.email or instance.user.email}")
    except Exception as e:
        print(f"Failed to send approval email: {e}")

