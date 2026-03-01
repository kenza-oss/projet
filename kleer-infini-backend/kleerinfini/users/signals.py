from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.conf import settings

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    """
    # URL pointing to the frontend reset password page
    # Example: http://localhost:5173/reset-password/TOKEN
    frontend_url = "http://localhost:5173/reset-password"
    reset_password_url = f"{frontend_url}/{reset_password_token.key}"

    # context of the email
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': reset_password_url
    }

    # render email text
    email_html_message = render_to_string('users/password_reset_email.html', context)
    email_plaintext_message = f"Veuillez réinitialiser votre mot de passe en visitant le lien suivant : {reset_password_url}"

    msg = EmailMultiAlternatives(
        # title:
        "Réinitialisation de votre mot de passe - Kleer Infini",
        # message:
        email_plaintext_message,
        # from:
        settings.DEFAULT_FROM_EMAIL or "noreply@kleerinfini.com",
        # to:
        [reset_password_token.user.email]
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()
