import os
import django
import sys
from datetime import timedelta
from django.utils import timezone
import uuid

# Setup Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from clients.models import Invitation, ClientProfile
from estimate.models import Estimate, Estimate_Product
from products.models import Product
from producers.models import ProducerProfile

User = get_user_model()

def seed_data():
    print("--- Seeding Demonstration Data ---")

    # 1. Create 5 Invitations
    print("[STEP] Creating 5 Invitations...")
    invitation_data = [
        ("contact@lux-imports.fr", "LUX-TOKEN-001"),
        ("direction@export-partner.de", "EXPORT-TOKEN-002"),
        ("procurement@global-trade.uk", "GLOBAL-TOKEN-003"),
        ("ceo@premium-wholesale.it", "PREMIUM-TOKEN-004"),
        ("buyer@middle-east-connect.ae", "ME-TOKEN-005"),
    ]
    
    for email, token in invitation_data:
        Invitation.objects.get_or_create(
            email=email,
            defaults={
                'token': token,
                'expires_at': timezone.now() + timedelta(days=7),
                'used': False
            }
        )
    print(f"   [OK] 5 Invitations injected.")

    print("[STEP] Creating 2 Premium Clients...")
    client_data = [
        {
            'email': 'james.wilson@atlantic-trading.com',
            'first_name': 'James',
            'last_name': 'Wilson',
            'company_name': 'Atlantic Trading Co.',
            'sector': 'Distribution Agroalimentaire',
            'country': 'USA',
            'website': 'https://atlantic-trading.com'
        },
        {
            'email': 'sara.bernard@med-exports.fr',
            'first_name': 'Sara',
            'last_name': 'Bernard',
            'company_name': 'Méditerranée Exports SAS',
            'sector': 'Import-Export Luxe',
            'country': 'France',
            'website': 'https://med-exports.fr'
        }
    ]

    clients_created = []
    for data in client_data:
        user, created = User.objects.get_or_create(
            email=data['email'],
            defaults={
                'role': 'client',
                'first_name': data['first_name'],
                'last_name': data['last_name']
            }
        )
        if created:
            user.set_password('demo-password-2026')
            user.save()
        
        profile, p_created = ClientProfile.objects.get_or_create(
            user=user,
            defaults={
                'first_name': data['first_name'],
                'last_name': data['last_name'],
                'company_name': data['company_name'],
                'sector': data['sector'],
                'country': data['country'],
                'language': 'fr',
                'website': data['website']
            }
        )
        clients_created.append(user)
    print(f"   [OK] 2 Clients created.")

    # 3. Create 3 Estimates
    print("Creating 3 Estimates for Analytics...")
    
    # Get a producer and some products
    producers = User.objects.filter(role='producer')
    products = Product.objects.all()

    if not producers.exists() or not products.exists():
        print("   [ERR] Need at least one producer and one product to create estimates.")
        return

    # Estimate 1: Pending
    est1 = Estimate.objects.create(
        client=clients_created[0],
        producer=producers[0],
        status='pending',
        comment="Demande urgente pour une expédition vers New York. Qualité Premium attendue."
    )
    Estimate_Product.objects.create(estimate=est1, product=products[0], quantity="500 KG", unit_price=12.50)

    # Estimate 2: Sent
    est2 = Estimate.objects.create(
        client=clients_created[1],
        producer=producers[1] if producers.count() > 1 else producers[0],
        status='sent',
        comment="Demande de cotation pour la saison 2026. Prévision de commandes récurrentes."
    )
    Estimate_Product.objects.create(estimate=est2, product=products[1] if products.count() > 1 else products[0], quantity="1200 Unités", unit_price=8.75)

    # Estimate 3: Accepted
    est3 = Estimate.objects.create(
        client=clients_created[0],
        producer=producers[0],
        status='accepted',
        comment="Contrat validé pour 2 ans. Début des opérations en Mars."
    )
    Estimate_Product.objects.create(estimate=est3, product=products[0], quantity="2 Tonnes", unit_price=11.00)

    print("\n[OK] Seeding Complete. The dashboard is now alive.")

if __name__ == "__main__":
    seed_data()
