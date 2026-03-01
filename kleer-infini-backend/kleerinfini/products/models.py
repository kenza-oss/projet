from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    type = models.CharField(max_length=50, blank=True)
    specific_fields = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', null=True, blank=True, verbose_name='Image de la catégorie')
    certifications = models.ManyToManyField('producers.Certification', blank=True, related_name='categories', verbose_name='Certifications')

    def __str__(self):
        return self.name

    # class Meta:
    #     verbose_name = "Catégorie"
    #     verbose_name_plural = "Catégories"


class Product(models.Model):
    name = models.CharField(max_length=255, verbose_name='Nom')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    producer = models.ForeignKey(
        'producers.ProducerProfile', 
        on_delete=models.CASCADE, 
        related_name='products_list',
        null=True, 
        blank=True,
        verbose_name='Producteur'
    )

    description = models.TextField(blank=True, verbose_name='Description')
    desc_courte = models.CharField(max_length=255, blank=True, verbose_name='Description courte')
    desc_longue = models.TextField(blank=True, verbose_name='Description longue')

    cle_min = models.CharField(max_length=100, blank=True, verbose_name='Clé minimum')
    prix_indicatif = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True, verbose_name='Prix indicatif'
    )
    currency = models.CharField(max_length=10, default='USD', verbose_name='Devise')
    delai_production = models.CharField(max_length=100, blank=True, verbose_name='Délai de production')


    fiche_tech = models.FileField(upload_to='fiches_tech/', null=True, blank=True, verbose_name='Fiche technique')
    certification_file = models.FileField(upload_to='certifications/', null=True, blank=True, verbose_name='Certification')
    catalogue = models.FileField(upload_to='catalogues/', null=True, blank=True, verbose_name='Catalogue Produit')
    # images = models.JSONField(default=list, blank=True, verbose_name='Images') # Field does not exist in DB
    video = models.FileField(upload_to='videos/', null=True, blank=True, verbose_name='Vidéo')

    est_pret = models.BooleanField(default=False, verbose_name='Est prêt')
    region_org = models.CharField(max_length=100, blank=True, verbose_name="Région d'origine")
    langue_du_product = models.CharField(max_length=50, blank=True, verbose_name='Langue du produit')

    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Produit'
        verbose_name_plural = 'Produits'


class ProductCertification(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='certification_files')
    name = models.CharField(max_length=255, blank=True, verbose_name='Nom du certificat')
    file = models.FileField(upload_to='product_certifications/', verbose_name='Fichier du certificat')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Certificat pour {self.product.name}"

    class Meta:
        verbose_name = 'Certification Produit'
        verbose_name_plural = 'Certifications Produit'


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/', verbose_name='Image')

    class Meta:
        verbose_name = "Image du produit"
        verbose_name_plural = "Images du produit"

class Region(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Type(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

