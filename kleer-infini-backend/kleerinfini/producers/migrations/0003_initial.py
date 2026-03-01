from django.db import migrations

CERTIFICATIONS_INIT = [
    {
        "name": "ECOCERT",
        "description": "Certification biologique internationale pour les produits alimentaires et cosmétiques.",
        "issued_by": "ECOCERT",
    },
    {
        "name": "AB (Agriculture Biologique)",
        "description": "Label français garantissant des pratiques agricoles biologiques.",
        "issued_by": "Ministère de l’Agriculture",
    },
    {
        "name": "USDA Organic",
        "description": "Certification biologique américaine pour les produits agricoles.",
        "issued_by": "USDA",
    },
    {
        "name": "Demeter",
        "description": "Certification pour les produits issus de l’agriculture biodynamique.",
        "issued_by": "Demeter International",
    },
    {
        "name": "Fairtrade",
        "description": "Label de commerce équitable pour assurer des conditions justes aux producteurs.",
        "issued_by": "Fairtrade International",
    },
    {
        "name": "COSMOS",
        "description": "Certification bio pour les cosmétiques selon les normes européennes.",
        "issued_by": "COSMOS-standard AISBL",
    },
    {
        "name": "ISO 22000",
        "description": "Norme internationale pour la sécurité des denrées alimentaires.",
        "issued_by": "ISO",
    },
    {
        "name": "Halal",
        "description": "Certification conforme aux exigences alimentaires islamiques.",
        "issued_by": "Autorités Halal locales",
    },
    {
        "name": "Vegan",
        "description": "Label pour les produits sans origine animale.",
        "issued_by": "Vegan Society",
    },
]

def create_certifications(apps, schema_editor):
    Certification = apps.get_model('producers', 'Certification')
    for cert in CERTIFICATIONS_INIT:
        Certification.objects.get_or_create(
            name=cert["name"],
            defaults={
                "description": cert["description"],
                "issued_by": cert["issued_by"]
            }
        )

class Migration(migrations.Migration):

    dependencies = [
        ("producers", "0002_initial"),
    ]

    operations = [
        migrations.RunPython(create_certifications),
    ]
