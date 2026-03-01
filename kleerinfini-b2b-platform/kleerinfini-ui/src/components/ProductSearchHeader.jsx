import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductSearchHeader = ({
    searchTerm,
    onSearchChange,
    onSearchTrigger,
    marketingTitle,
    marketingSubtitle
}) => {
    const { t } = useTranslation();

    const displayTitle = marketingTitle || t('products.search.hero.title');
    const displaySubtitle = marketingSubtitle || t('products.search.hero.subtitle');
    return (
        <div className="relative pt-40 pb-20 overflow-hidden bg-gray-50">
            {/* Background Decorative Elements - Subtle Light */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-100/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-yellow-100/40 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#FF6600] mb-4 block font-cinzel">
                        {displayTitle}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6 leading-tight">
                        {t('products.search.hero.main_title_start')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FF6600] to-[#D4AF37]">{t('products.search.hero.premium')}</span> {t('products.search.hero.main_title_end')}
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-500 text-lg mb-12 font-light">
                        {displaySubtitle}
                    </p>
                </motion.div>

                {/* Global Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] to-[#8E4427] rounded-full blur opacity-5 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center bg-white border border-gray-200 rounded-full p-2 pl-8 shadow-lg hover:shadow-xl transition-shadow">
                            <Search className="text-gray-400 mr-4" size={24} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && onSearchTrigger()}
                                placeholder={t('products.search.placeholder')}
                                className="flex-1 bg-transparent border-none outline-none text-gray-800 text-lg placeholder:text-gray-400 py-4"
                            />
                            <button
                                onClick={onSearchTrigger}
                                className="hidden md:flex items-center gap-2 bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-black transition-colors"
                            >
                                {t('products.search.button')}
                            </button>
                        </div>
                    </div>

                    {/* Quick Filters Info */}
                    <div className="mt-6 flex flex-wrap justify-center gap-6 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-[#D4AF37]" />
                            {t('products.search.hero.badges.certified')}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-[#D4AF37]" />
                            {t('products.search.hero.badges.traceability')}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-[#D4AF37]" />
                            {t('products.search.hero.badges.direct_export')}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductSearchHeader;
