from django.db import migrations

CATEGORIES_INIT = [
    {"name": "Agroalimentaire", "description": "Produits agricoles, alimentaires, boissons à l'export", "type": "Produit", "specific_fields": "Type de produits, capacité, certifications, fiches techniques, marchés visés"},
    {"name": "Construction & BTP", "description": "Produits/services du bâtiment et travaux publics", "type": "Produit + Service", "specific_fields": "Matériaux/équipements, normes, capacités, références chantiers"},
    {"name": "Équipements électriques", "description": "Produits électriques, domotique, équipements techniques", "type": "Produit", "specific_fields": "Type, certifications, fiches techniques, capacité mensuelle, destinations"},
    {"name": "Artisanat traditionnel", "description": "Créations artisanales faites main", "type": "Produit", "specific_fields": "Type, origine, techniques, photos, production (commande/stock)"},
    {"name": "Bois et ameublement", "description": "Produits bois, meubles, dérivés", "type": "Produit", "specific_fields": "Type de bois, certifications, capacités, gammes, fiches"},
    {"name": "Industrie mécanique", "description": "Composants ou services mécaniques", "type": "Produit + Service", "specific_fields": "Spécialité, capacité, normes ISO, références clients"},
    {"name": "Chimie et détergence", "description": "Produits chimiques, cosmétiques, d’entretien", "type": "Produit", "specific_fields": "Composition, certifications, fiches sécurité, conditions export, volume"},
    {"name": "Beauté & cosmétiques", "description": "Soins, parfums, hygiène", "type": "Produit", "specific_fields": "Ingrédients, certifications, conditionnement, origine naturelle"},
    {"name": "Événementiel & salons", "description": "Services événementiels internationaux", "type": "Service", "specific_fields": "Types événements, références, formats, langues, équipe"},
    {"name": "Services numériques", "description": "Dev, design, marketing digital", "type": "Service", "specific_fields": "Spécialité, technologies, portfolio, TJM/forfait, zones"},
    {"name": "Contenus & production intellectuelle", "description": "Rédaction, traduction, copywriting", "type": "Service", "specific_fields": "Type, langues, expérience, références, droits"},
    {"name": "Formation & coaching", "description": "Formation pro et soft skills", "type": "Service", "specific_fields": "Thèmes, formats, durée, public, certifications"},
    {"name": "Patrimoine & culture immatérielle", "description": "Traditions, musique, savoir-faire", "type": "Savoir-faire / Service", "specific_fields": "Type, transmission, produits associés, exportabilité"},
    {"name": "Tourisme & destinations", "description": "Circuits, agences, packages culturels", "type": "Service", "specific_fields": "Prestations, zones, tarifs, langues, agréments"},
    {"name": "Expertise locale & consulting", "description": "Export de services experts", "type": "Service", "specific_fields": "Domaine, expérience, langues, références, modalités"},
    {"name": "Licences & franchises", "description": "Marques ou concepts exportables", "type": "Propriété intellectuelle", "specific_fields": "Nom, secteur, zones, modalités d’exploitation"},
    {"name": "Données & études de marché", "description": "Statistiques, bases de données locales", "type": "Données / Service", "specific_fields": "Type, méthodologie, public cible, format, tarifs"},
    {"name": "Innovation & prototypes", "description": "Projets R&D, inventions", "type": "Prototype / IP", "specific_fields": "Description, TRL, brevets, investissements recherchés"},
    {"name": "Immobilier à exporter", "description": "Terrain, local industriel ou touristique", "type": "Immobilier", "specific_fields": "Localisation, usage, surface, statut, disponibilité, prix"},
    {"name": "Main-d'œuvre & sous-traitance", "description": "Ressources humaines ou ateliers sous-traitants", "type": "Ressource humaine / Service", "specific_fields": "Compétences, disponibilité, tarifs, lieu, langues"},
    {"name": "Média & création audiovisuelle", "description": "Photo, vidéo, design, création digitale", "type": "Service / Création", "specific_fields": "Type, langues, portfolio, tarifs, livrables"},
    {"name": "Projets d’investissement", "description": "Projets algériens ouverts à investisseurs", "type": "Opportunité", "specific_fields": "Type, budget, part recherchée, faisabilité, localisation"},
    {"name": "Éducation & coopération académique", "description": "Partenariats, stages, recherche", "type": "Collaboration", "specific_fields": "Thème, partenaire, modalités, niveau académique"},
    {"name": "Produits recyclés ou écologiques", "description": "Produits écoresponsables à l'export", "type": "Produit", "specific_fields": "Matériaux, certifications éco, revalorisation, marché cible"},
]

def create_categories(apps, schema_editor):
    Category = apps.get_model('products', 'Category')
    for cat in CATEGORIES_INIT:
        Category.objects.get_or_create(
            name=cat["name"],
            defaults={
                "description": cat["description"],
                "type": cat["type"],
                "specific_fields": cat["specific_fields"]
            }
        )

class Migration(migrations.Migration):
    dependencies = [
        ("products", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_categories),
    ]
