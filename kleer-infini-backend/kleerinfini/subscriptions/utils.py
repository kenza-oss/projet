from datetime import timedelta
from django.utils import timezone
from .models import Subscription

def activate_subscription(user, invoice_id=None, checkout_id=None):
    """
    Called when online payment is confirmed (Chargily).
    It updates or creates the subscription to active status for 365 days.
    """
    now = timezone.now()
    end = now + timedelta(days=365)

    subscription, created = Subscription.objects.get_or_create(user=user)

    subscription.status = "active"
    subscription.is_online_payment = True
    subscription.start_date = now.date()
    subscription.end_date = end.date()

    if invoice_id:
        subscription.chargily_invoice_id = invoice_id
    if checkout_id:
        subscription.chargily_checkout_id = checkout_id

    subscription.save()

    return subscription


from django.contrib.auth import get_user_model
from subscriptions.models import Subscription
from subscriptions.utils import activate_subscription
import logging

logger = logging.getLogger(__name__)

def handle_successful_payment(checkout_data):
    try:
        user_email = checkout_data.get("customer", {}).get("email") or checkout_data.get("email")

        if not user_email:
            logger.warning("No user email found in checkout_data.")
            return

        User = get_user_model()
        user = User.objects.get(email=user_email)

        invoice_id = checkout_data.get("invoice_id")
        checkout_id = checkout_data.get("id")

        activate_subscription(user, invoice_id=invoice_id, checkout_id=checkout_id)
        logger.info(f"Subscription activated for user: {user_email}")

    except User.DoesNotExist:
        logger.error(f"User with email {user_email} not found.")
    except Exception as e:
        logger.error(f"Error in handle_successful_payment: {str(e)}")
