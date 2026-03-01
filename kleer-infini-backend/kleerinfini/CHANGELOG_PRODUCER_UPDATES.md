# Mise à jour des modèles Producer et Category

## Modifications apportées

### 1. Modèle Category (products/models.py)
- **Ajout** : Relation ManyToMany avec Certification
- **Champ ajouté** : `certifications = models.ManyToManyField('producers.Certification', blank=True, related_name='categories')`

### 2. Modèle ProducerProfile (producers/models.py)
- **Champs ajoutés** :
  - `activity` : Activité de l'entreprise
  - `email` : Email de contact
  - `whatsapp` : Numéro WhatsApp
  - `country` : Pays (format JSON avec code et label)
  - `city` : Ville
  - `rc_number` : Numéro RC (Registre du Commerce)
  - `nif_number` : Numéro NIF
  - `cert_files` : Fichiers de certification (JSON array)
  - `tech_files` : Fichiers techniques (JSON array)
  - `min_export_quantity` : Quantité minimum d'export
  - `monthly_capacity` : Capacité mensuelle
  - `yearly_capacity` : Capacité annuelle
  - `target_markets` : Marchés cibles (JSON array)
  - `export_categories` : Catégories d'export (JSON array)
  - `description` : Description de l'entreprise

### 3. Serializers mis à jour
- **ProducerProfileSerializer** : Inclut tous les nouveaux champs
- **ProducerProfileCreateSerializer** : Gère la création avec mot de passe et tous les nouveaux champs
- **CategorySerializer** : Inclut la liste des certifications associées

### 4. Migrations créées et appliquées
- `producers.0007_*` : Ajout de tous les nouveaux champs au ProducerProfile
- `products.0004_*` : Ajout de la relation certifications à Category

## Structure des données attendues

### Format JSON avec wrappers (comme demandé)
```json
{
  "companyName": {"value": "string", "required": true},
  "activity": {"value": "string", "required": true},
  "email": {"value": "string", "required": true},
  "phone": {"value": "string", "required": true},
  "whatsapp": {"value": "string", "required": true},
  "country": {"value": {"code": "string", "label": "string"}, "required": true},
  "city": {"value": "string", "required": true},
  "address": {"value": "string", "required": true},
  "latitude": {"value": 0.0, "required": true},
  "longitude": {"value": 0.0, "required": true},
  "rcNumber": {"value": "string", "required": true},
  "nifNumber": {"value": "string", "required": true},
  "certFiles": {"value": ["file1.pdf"], "required": false},
  "techFiles": {"value": ["file1.pdf"], "required": false},
  "minExportQuantity": {"value": "string", "required": true},
  "monthlyCapacity": {"value": "string", "required": true},
  "yearlyCapacity": {"value": "string", "required": true},
  "targetMarkets": {"value": [{"value":"string","label":"string"}], "required": false},
  "exportCategories": {"value": [{"value":"string","label":"string"}], "required": true},
  "password": {"value": "string", "required": true},
  "description": {"value": "string", "required": true}
}
```

## Utilisation

### Création d'un ProducerProfile
```python
# Via l'API
POST /api/producers/
{
    "user_email": "producer@example.com",
    "password": "motdepasse123",
    "company_name": "Mon Entreprise",
    "activity": "Export de produits agricoles",
    "email": "contact@monentreprise.com",
    "phone": "+213 555 123 456",
    "whatsapp": "+213 555 123 456",
    "country": {"code": "DZ", "label": "Algérie"},
    "city": "Alger",
    "address": "123 Rue Example",
    "latitude": 36.7538,
    "longitude": 3.0588,
    "rc_number": "RC123456789",
    "nif_number": "NIF987654321",
    "cert_files": ["cert1.pdf", "cert2.pdf"],
    "tech_files": ["tech1.pdf"],
    "min_export_quantity": "1000 kg",
    "monthly_capacity": "50000 kg",
    "yearly_capacity": "500000 kg",
    "target_markets": [
        {"value": "EU", "label": "Union Européenne"},
        {"value": "US", "label": "États-Unis"}
    ],
    "export_categories": [
        {"value": "fruits", "label": "Fruits"},
        {"value": "vegetables", "label": "Légumes"}
    ],
    "description": "Description de l'entreprise"
}
```

### Association de certifications à une catégorie
```python
# Via l'admin Django ou l'API
category = Category.objects.get(id=1)
certification = Certification.objects.get(id=1)
category.certifications.add(certification)
```

## Notes importantes
- Tous les nouveaux champs ont des valeurs par défaut pour assurer la compatibilité avec les données existantes
- Les champs JSON stockent des structures complexes (pays, marchés cibles, catégories d'export)
- Le champ `password` est utilisé uniquement lors de la création pour définir le mot de passe de l'utilisateur associé
- La relation ManyToMany entre Category et Certification permet une flexibilité maximale dans l'association des certificats aux catégories
