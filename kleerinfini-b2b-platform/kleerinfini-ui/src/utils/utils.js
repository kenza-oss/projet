import { BASE_HOST } from "../api/axios";

// ----------------------------------------------------------------------
// Image Mapping (Wait for backend images, no local fallback)
// ----------------------------------------------------------------------

const imageMap = {};

/**
 * Returns an array of images for a product.
 * @param {object} product - The full product object.
 * @returns {string[]} Array of image URLs.
 */
export const getProductImages = (product) => {
    if (!product) return [];

    // Prioritize backend images
    let images = [];

    // Check for images list (many-to-one relation in Django)
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        images = product.images.map(img => getProductImage(img, 0, product));
    }
    // Check for single image field
    else if (product.image) {
        images = [getProductImage(product.image, 0, product)];
    }

    // Filter out nulls and remove duplicates
    const uniqueImages = [...new Set(images.filter(Boolean))];

    // Default limit to 4
    return uniqueImages.slice(0, 4);
};

/**
 * Resolves a product image from various possible backend formats.
 * @param {object|string} imageField - The `product.image` or `product.images` field.
 * @param {number} index - Optional index for deterministic fallback selection.
 * @param {object} product - Optional full product object for category-based fallback.
 * @returns {string} The resolved image URL (remote URL).
 */
export const getProductImage = (imageField, index = 0, product = {}) => {
    let source = imageField;
    const FALLBACK_IMAGE = '/images/placeholder.png';

    // 0. Fallback to product.images if source is null/undefined
    if (!source && product) {
        source = product.images || product.image;
    }

    if (!source) return FALLBACK_IMAGE;

    // 1. Try parsing JSON string if it looks like one (Django ArrayField or JSON stringified list)
    if (typeof source === 'string' && (source.startsWith('[') || source.startsWith('{'))) {
        try {
            source = JSON.parse(source);
        } catch (e) {
            // Not valid JSON, keep as string
        }
    }

    // 2. Handle arrays (JSONField or actual array)
    if (Array.isArray(source) && source.length > 0) {
        // Use index if possible, otherwise use first
        source = source[index] || source[0];
    }

    // 3. Handle object with 'image' or 'image_url' property
    if (source && typeof source === 'object') {
        source = source.image_url || source.image;
    }

    if (!source || typeof source !== 'string') return FALLBACK_IMAGE;

    // REJECT invalid patterns immediately
    if (source.includes('src/assets') || source.includes('localhost:5173')) {
        return FALLBACK_IMAGE;
    }

    // A. Handle Cloudinary images
    if (source.includes('/media/image/upload/')) {
        const parts = source.split('/media/image/upload/');
        const path = parts[parts.length - 1];
        // Updated to match backend Cloudinary account 'dptb2m02i'
        return `https://res.cloudinary.com/dptb2m02i/image/upload/f_auto,q_auto,e_sharpen:100,dpr_auto/${path}`;
    }

    // B. Handle Local Media & Absolute URLs
    if (source.startsWith('http')) {
        // Handle mismatch between 8000 and 8001 if necessary
        if (source.includes('localhost:8000') && BASE_HOST.includes('8001')) {
            return source.replace('8000', '8001');
        }
        return source;
    }

    // Relative path, ensure leading slash
    const path = source.startsWith('/') ? source : `/${source}`;

    // Check if it already has /media/ prefix
    if (path.startsWith('/media/')) {
        return `${BASE_HOST}${path}`;
    }

    // If it's a direct product path without /media
    if (path.startsWith('/products/')) {
        return `${BASE_HOST}/media${path}`;
    }

    return `${BASE_HOST}/media${path}`;
};

// ----------------------------------------------------------------------
// Certification Parsing
// ----------------------------------------------------------------------

/**
 * Standardizes certification parsing from the messes that backends can return.
 * @param {object} productOrCategory - The object containing `certifications` field (usually category).
 * @param {object} certificationsById - Lookup object of all certifications {id: certObj}.
 * @returns {Array} Array of certification objects with {id, name, image_url, ...}
 */
export const getCertificationsForProduct = (product, categoriesById, certificationsById) => {
    // Usually certifications are on the CATEGORY
    if (!product || !product.category) return [];

    const categoryData = categoriesById[product.category];
    if (!categoryData || !categoryData.certifications) return [];

    const rawCerts = categoryData.certifications;
    let certIds = [];

    // Parse different formats
    if (Array.isArray(rawCerts)) {
        certIds = rawCerts;
    } else if (typeof rawCerts === 'number') {
        certIds = [rawCerts];
    } else if (typeof rawCerts === 'string') {
        try {
            const parsed = JSON.parse(rawCerts);
            if (Array.isArray(parsed)) certIds = parsed;
            else if (typeof parsed === 'object') certIds = [parsed];
            else certIds = [parsed]; // number or string
        } catch (e) {
            // Regex fallback for string like "[1, 2]" or "1,2"
            const matches = rawCerts.match(/\d+/g);
            if (matches) certIds = matches.map(n => parseInt(n));
        }
    }

    // Resolve IDs to Objects
    return certIds
        .map(item => {
            const id = typeof item === 'object' ? item.id : item; // Handle {id: 1} vs 1
            const cert = certificationsById[id];
            if (!cert) return null;

            let imageUrl = cert.image_url || cert.image;
            if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
                const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
                // Fallback to media prefix if not there
                const finalPath = (path.startsWith('/media') || path.startsWith('/products')) ? path : `/media${path}`;
                imageUrl = `${BASE_HOST}${finalPath}`;
            }

            return {
                ...cert,
                id: cert.id,
                name: cert.name,
                image_url: imageUrl,
                hasImage: !!imageUrl
            };
        })
        .filter(Boolean);
};
