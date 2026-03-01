import axios from './axios';

/**
 * Unified search across products, producers, and categories
 * @param {string} query - Search query (empty string returns all results)
 * @returns {Promise<{products: Array, producers: Array, categories: Array}>}
 */
export const globalSearch = async (query) => {
    try {
        // If query is empty, fetch all items; otherwise search
        const searchParam = query && query.trim() !== '' ? `?search=${encodeURIComponent(query)}` : '';

        // Search in parallel for better performance
        const [productsRes, producersRes, categoriesRes] = await Promise.allSettled([
            axios.get(`products/${searchParam}`),
            axios.get(`profiles/${searchParam}`),
            axios.get(`categories/${searchParam}`)
        ]);

        return {
            products: productsRes.status === 'fulfilled' ? (productsRes.value.data.results || productsRes.value.data || []) : [],
            producers: producersRes.status === 'fulfilled' ? (producersRes.value.data.results || producersRes.value.data || []) : [],
            categories: categoriesRes.status === 'fulfilled' ? (categoriesRes.value.data.results || categoriesRes.value.data || []) : []
        };
    } catch (error) {
        console.error('Global search failed:', error);
        return { products: [], producers: [], categories: [] };
    }
};
