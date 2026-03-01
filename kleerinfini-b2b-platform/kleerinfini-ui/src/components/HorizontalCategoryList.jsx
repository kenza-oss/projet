import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { LayoutGrid } from 'lucide-react';

const HorizontalCategoryList = ({ selectedCategory, onSelectCategory }) => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                console.log("[HorizontalCategoryList] Fetching real categories from backend...");
                const response = await api.get('categories/');
                const data = response.data.results || response.data || [];
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("[HorizontalCategoryList] Error fetching categories:", error);
                setCategories([]); // Ensure it's empty on error
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return (
        <div className="flex gap-4 overflow-hidden py-4">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-12 w-32 bg-gray-200 animate-pulse rounded-full" />
            ))}
        </div>
    );

    return (
        <div className="w-full relative group">
            <div className="flex overflow-x-auto py-2 gap-8 scrollbar-hide items-center justify-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <button
                    onClick={() => onSelectCategory('')}
                    className={`flex-shrink-0 py-2 text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-500 relative ${selectedCategory === ''
                        ? 'text-gray-900'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <LayoutGrid size={12} />
                        {t('products.category_list.all')}
                    </span>
                    {selectedCategory === '' && (
                        <motion.div
                            layoutId="activeCategory"
                            className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gray-900"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                    )}
                </button>

                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.name)}
                        className={`flex-shrink-0 py-2 text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-500 whitespace-nowrap relative ${selectedCategory === cat.name
                            ? 'text-gray-900'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        {cat.name}
                        {selectedCategory === cat.name && (
                            <motion.div
                                layoutId="activeCategory"
                                className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gray-900"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>
            {/* Minimalist Indicators */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#F9F8F6] to-transparent pointer-events-none md:hidden" />
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#F9F8F6] to-transparent pointer-events-none md:hidden" />
        </div>
    );
};

export default HorizontalCategoryList;
