from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django_rest_passwordreset.signals import reset_password_token_created
from django.conf import settings

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    """
    import logging
    logger = logging.getLogger(__name__)
    
    # URL pointing to the frontend reset password page
    from decouple import config
    raw_frontend_url = config('FRONTEND_URL', default='https://projet-1-y2ku.onrender.com')
    
    # In case multiple URLs are provided in FRONTEND_URL, use the first one or the valid one
    frontend_url = raw_frontend_url.split(',')[0].strip().rstrip('/')
    
    # If the request came from a specific origin, we could try to use it, 
    # but for now we'll stick to the configured FRONTEND_URL
    reset_password_url = f"{frontend_url}/reset-password/{reset_password_token.key}"

    logger.info(f"Generating password reset email for {reset_password_token.user.email}. URL: {reset_password_url}")

    # context of the email
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': reset_password_url
    }

    try:
        # render email text
        email_html_message = render_to_string('users/password_reset_email.html', context)
        email_plaintext_message = f"Veuillez réinitialiser votre mot de passe en visitant le lien suivant : {reset_password_url}"

        msg = EmailMultiAlternatives(
            "Réinitialisation de votre mot de passe - Kleer Infini",
            email_plaintext_message,
            settings.DEFAULT_FROM_EMAIL,
            [reset_password_token.user.email]
        )
        msg.attach_alternative(email_html_message, "text/html")
        
        # Send email synchronously to ensure it's sent before the process/request ends
        # and to catch any immediate SMTP errors.
        msg.send()
        logger.info(f"Password reset email sent successfully to {reset_password_token.user.email}")
        
    except Exception as e:
        logger.error(f"Failed to send password reset email to {reset_password_token.user.email}: {str(e)}")

from django.db.models.signals import post_delete
from clients.models import ClientProfile
from producers.models import ProducerProfile

# @receiver(post_delete, sender=ClientProfile)
# def delete_user_on_client_profile_delete(sender, instance, **kwargs):
#     if instance.user:
#         instance.user.delete()

# @receiver(post_delete, sender=ProducerProfile)
# def delete_user_on_producer_profile_delete(sender, instance, **kwargs):
#     if instance.user:
#         instance.user.delete()
