import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Award, ArrowRight, Loader, Package, Grid3x3, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { globalSearch } from '../../api/search';
import { getProductImage } from '../../utils/utils';

const ClientProducerSearch = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [results, setResults] = useState({ products: [], producers: [], categories: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setSearchTerm(query);
            performSearch(query);
        } else {
            // Load all results on initial page load
            performSearch('');
        }
    }, [searchParams]);

    const performSearch = async (query) => {
        setIsLoading(true);
        try {
            const data = await globalSearch(query);
            setResults(data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            performSearch(searchTerm);
        }
    };

    const totalResults = results.products.length + results.producers.length + results.categories.length;

    const tabs = [
        { id: 'all', label: 'Tout', count: totalResults, icon: Grid3x3 },
        { id: 'products', label: 'Produits', count: results.products.length, icon: Package },
        { id: 'producers', label: 'Producteurs', count: results.producers.length, icon: Building2 },
        { id: 'categories', label: 'Catégories', count: results.categories.length, icon: Filter }
    ];

    const getFilteredResults = () => {
        switch (activeTab) {
            case 'products': return { products: results.products, producers: [], categories: [] };
            case 'producers': return { products: [], producers: results.producers, categories: [] };
            case 'categories': return { products: [], producers: [], categories: results.categories };
            default: return results;
        }
    };

    const filtered = getFilteredResults();

    return (
        <div className="space-y-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Recherche Globale</h1>
                    <p className="text-gray-500">Trouvez des produits, producteurs et catégories</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Produit, Entreprise, Catégorie..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all shadow-sm font-medium"
                        />
                    </form>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-100">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2
                                ${activeTab === tab.id
                                    ? 'bg-black text-white shadow-lg shadow-black/20'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}
                            `}
                        >
                            <Icon size={16} />
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-black ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Results */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader className="animate-spin text-blue-600" size={40} />
                </div>
            ) : totalResults === 0 && searchTerm.trim() !== '' ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-lg font-medium">Aucun résultat trouvé pour "{searchTerm}"</p>
                    <p className="text-sm mt-2">Essayez avec d'autres mots-clés</p>
                </div>
            ) : totalResults === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-lg font-medium">Utilisez la barre de recherche pour trouver des produits, producteurs ou catégories</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Products Section */}
                    {filtered.products.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Package size={20} className="text-blue-600" />
                                Produits ({filtered.products.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filtered.products.map(product => (
                                    <motion.div
                                        key={product.id}
                                        whileHover={{ y: -4 }}
                                        onClick={() => navigate(`/products?product=${product.id}`)}
                                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="h-40 overflow-hidden relative bg-gray-100">
                                            {(product.image || product.images?.[0]) ? (
                                                <img
                                                    src={getProductImage(product.image || product.images?.[0], 0, product)}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <Package size={40} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2">{product.description || product.desc_courte}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Producers Section */}
                    {filtered.producers.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Building2 size={20} className="text-green-600" />
                                Producteurs ({filtered.producers.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filtered.producers.map(producer => (
                                    <motion.div
                                        key={producer.id}
                                        whileHover={{ y: -4 }}
                                        onClick={() => navigate(`/producer/${producer.id}`)}
                                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-green-50/50 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="h-32 overflow-hidden relative bg-gray-100">
                                            {(producer.cover_image_url || producer.logo_url || producer.logo || producer.cover_image) ? (
                                                <img
                                                    src={getProductImage(producer.cover_image_url || producer.logo_url || producer.logo || producer.cover_image, 0, producer)}
                                                    alt={producer.company_name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <Building2 size={40} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-900 mb-2">{producer.company_name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin size={14} className="text-gray-400" />
                                                {producer.city || producer.country_display || 'Algérie'}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Categories Section */}
                    {filtered.categories.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Filter size={20} className="text-orange-600" />
                                Catégories ({filtered.categories.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filtered.categories.map(category => (
                                    <motion.div
                                        key={category.id}
                                        whileHover={{ y: -2 }}
                                        onClick={() => navigate(`/category/${category.id}`)}
                                        className="group bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:shadow-orange-50/50 transition-all duration-300 cursor-pointer"
                                    >
                                        <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>
                                        <p className="text-sm text-gray-500">{category.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ClientProducerSearch;
