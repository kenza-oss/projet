import urllib.parse

def get_cloudinary_url(name):
    """
    Retourne l'URL Cloudinary propre pour un nom de fichier donné.
    Gère les préfixes erronés comme /media/products_images/ ou products_images/.
    """
    if not name:
        return None
    
    if name.startswith('http'):
        return name
        
    # Nettoyage de l'URL pour correspondre à la structure Cloudinary
    clean_name = name.replace('/media/products_images/', 'products/')
    clean_name = clean_name.replace('media/products_images/', 'products/')
    clean_name = clean_name.replace('products_images/', 'products/')
    
    # Supprimer le slash initial si présent
    if clean_name.startswith('/'):
        clean_name = clean_name[1:]
        
    encoded_name = urllib.parse.quote(clean_name, safe='/')
    return f"https://res.cloudinary.com/dptb2m02i/image/upload/{encoded_name}"
