import urllib.parse

CLOUDINARY_BASE = "https://res.cloudinary.com/dptb2m02i/image/upload/"

# Domaines externes non-Cloudinary (ex: anciennes données mock) → on retourne None
EXTERNAL_DOMAINS_TO_SKIP = [
    'images.unsplash.com',
    'unsplash.com',
    'picsum.photos',
    'loremflickr.com',
    'placeholder.com',
]


def get_cloudinary_url(name):
    """
    Retourne l'URL Cloudinary complète et propre pour un nom/chemin/URL donné.
    Gère tous les cas :
      - URL Cloudinary déjà complète (https://res.cloudinary.com/...)
      - URL Cloudinary sans protocole (res.cloudinary.com/...)
      - URLs externes non-Cloudinary (Unsplash, etc.) → None
      - Chemins relatifs avec préfixes variés (media/products/, products/, etc.)
      - Public ID seul (ex: 625_xgqno3)
    """
    if not name:
        return None

    name = str(name).strip()

    # ── Cas 1 : URL complète commençant par https:// ──────────────────────────
    if name.startswith('https://'):
        # URL Cloudinary déjà complète → retourner telle quelle
        if 'res.cloudinary.com' in name:
            return name
        # URL externe non-Cloudinary (Unsplash, etc.) → invalide
        for domain in EXTERNAL_DOMAINS_TO_SKIP:
            if domain in name:
                return None
        return name  # autre URL externe inconnue, on la retourne quand même

    # ── Cas 2 : URL sans protocole mais avec domaine Cloudinary ───────────────
    if name.startswith('res.cloudinary.com'):
        return 'https://' + name

    # ── Cas 3 : URL http:// (non-https) ──────────────────────────────────────
    if name.startswith('http://'):
        for domain in EXTERNAL_DOMAINS_TO_SKIP:
            if domain in name:
                return None
        return name

    # ── Cas 4 : Chemin relatif ou public ID → construire l'URL Cloudinary ─────
    clean = name

    # Supprimer les préfixes media/products* variés
    for prefix in ['/media/products_images/', 'media/products_images/',
                   '/media/products/', 'media/products/',
                   'products_images/', '/products_images/']:
        if clean.startswith(prefix):
            clean = 'products/' + clean[len(prefix):]
            break

    # Supprimer le slash initial restant
    if clean.startswith('/'):
        clean = clean[1:]

    encoded = urllib.parse.quote(clean, safe='/')
    return f"{CLOUDINARY_BASE}{encoded}"
