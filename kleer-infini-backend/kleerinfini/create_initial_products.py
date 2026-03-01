
import os
import django
import random
import shutil

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Product, Category
from producers.models import Certification

def create_initial_data():
    print("Clearing existing data...")
    Product.objects.all().delete()
    Category.objects.all().delete()
    Certification.objects.all().delete()

    print("Creating Categories (Domaines d'Excellence)...")
    
    # Categories from category.jsx filter list
    cat_cosmetique = Category.objects.create(
        name="Produits Cosmétiques", 
        description="L'excellence naturelle au service de la beauté.",
        image="assets/aloe_vera_1.png" # Placeholder logic handled by frontend
    )
    
    cat_parfum = Category.objects.create(
        name="Parfums & Eaux de Parfum",
        description="Essences rares et savoir-faire ancestral.",
        image="assets/essence_1.png"
    )
    
    cat_peche = Category.objects.create(
        name="Produits de la pêche & Aquaculture",
        description="Richesse marine de la Méditerranée.",
        image="assets/image3.jpeg" 
    )
    
    cat_pharma = Category.objects.create(
        name="Produits Pharmaceutiques & Médicaux",
        description="Innovation et standards internationaux.",
        image="assets/image4.jpeg"
    )

    # General Agro for other products if needed, aligned with previous context
    cat_agro = Category.objects.create(
        name="Agroalimentaire",
        description="Le terroir algérien dans toute sa splendeur.",
        image="assets/olive_oil_1.png"
    )

    print("Creating Products...")

    # Products based on ExportProductsSection.jsx imports & naming
    
    # 1. Essence Products (Parfums)
    Product.objects.create(
        name="Essence de Rose – Huile Essentielle Pure",
        category=cat_parfum,
        description="Huile essentielle de rose de Damas, distillée à la vapeur. Haute concentration pour parfumerie de luxe.",
        desc_courte="Distillation vapeur, 100% pure.",
        prix_indicatif=450.00,
        cle_min="1 Litre",
        region_org="Blida",
        est_pret=True,
        images=["essence_1.png", "essence_2.png", "essence_3.png", "essence_4.png"],
        views=random.randint(100, 500)
    )

    # 2. Aloe Vera Products (Cosmétique)
    Product.objects.create(
        name="Gel d'Aloe Vera Bio – 100% Naturel",
        category=cat_cosmetique,
        description="Gel d'Aloe Vera pur extrait de feuilles fraîches. Idéal pour cosmétiques et parapharmacie.",
        desc_courte="Extrait frais, certifié Bio.",
        prix_indicatif=18.00,
        cle_min="50 kg",
        region_org="El Oued",
        est_pret=True,
        images=["aloe_vera_1.png", "aloe_vera_2.png", "aloe_vera_3.png", "aloe_vera_4.png"],
        views=random.randint(100, 500)
    )

    # 3. Olive Oil Products (Agroalimentaire)
    Product.objects.create(
        name="Huile d’Olive Extra Vierge – Première Pression",
        category=cat_agro,
        description="Huile d'olive extra vierge de Kabylie, pression à froid. Acidité inférieure à 0.8%. Médaillée d'or.",
        desc_courte="Pression à froid, Acidité < 0.8%.",
        prix_indicatif=12.50,
        cle_min="100 Litres",
        region_org="Kabylie",
        est_pret=True,
        images=["olive_oil_1.png", "olive_oil_2.png", "olive_oil_3.png", "olive_oil_4.jpg"],
        views=random.randint(100, 500)
    )

    # 4. Dates (Agroalimentaire)
    Product.objects.create(
        name="Dattes Deglet Nour – Qualité Premium",
        category=cat_agro,
        description="Dattes Deglet Nour de Biskra, mielleuses et translucides. 'Doigts de lumière'. Conditionnement export.",
        desc_courte="AOP Biskra, Mielleuses.",
        prix_indicatif=5.00,
        cle_min="500 kg",
        region_org="Biskra",
        est_pret=True,
        images=["deglet_nour_1.png", "deglet_nour_2.png", "deglet_nour_3.png", "deglet_nour_4.jpg"],
        views=random.randint(100, 500)
    )
    
    # 5. Generic items to fill grid if needed (using general images)
    Product.objects.create(
        name="Miel Pur – Montagnes de Kabylie",
        category=cat_agro,
        description="Miel de fleurs sauvages récolté dans les montagnes de Kabylie, 100% naturel et pur.",
        desc_courte="Récolte artisanale, 100% Pur.",
        prix_indicatif=35.00,
        cle_min="50 kg",
        region_org="Tizi Ouzou",
        est_pret=True,
        images=["honey_excellence.jpg"],
        views=random.randint(50, 200)
    )
    
    Product.objects.create(
        name="Savon Naturel à la Menthe",
        category=cat_cosmetique,
        description="Savon artisanal rafraîchissant à la menthe sauvage et aux huiles essentielles. Propriétés apaisantes.",
        desc_courte="Menthe sauvage, Rafraîchissant.",
        prix_indicatif=5.00,
        cle_min="200 Unités",
        region_org="Bejaia",
        est_pret=True,
        images=["soap_mint_1.png", "soap_mint_2.png", "soap_mint_3.png", "soap_mint_4.png"],
        views=random.randint(50, 200)
    )

    print("Data restoration complete.")

if __name__ == "__main__":
    create_initial_data()
