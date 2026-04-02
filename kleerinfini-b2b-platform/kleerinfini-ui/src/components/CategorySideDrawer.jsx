import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, TrendingUp as TrendingUpIcon, Globe, ShieldCheck } from 'lucide-react';
import { getProductImage } from '../utils/utils';

const CategorySideDrawer = ({ isOpen, onClose, category }) => {
    if (!category) return null;

    // Mock specs if not in backend yet
    const specs = [
        { label: "Capacité d'Export", value: "5000 Tonnes / An", icon: <TrendingUpIcon size={16} /> },
        { label: "Marchés Cibles", value: "UE, MENA, USA", icon: <Globe size={16} /> },
        { label: "Normes Qualité", value: "ISO 9001, HACCP", icon: <ShieldCheck size={16} /> },
    ];

    const imageSrc = getProductImage(category.image || category.image_url, 0, category)
        || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800";

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Side Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-[#111] shadow-2xl z-50 overflow-y-auto flex flex-col border-l border-white/10"
                    >
                        {/* Header Image */}
                        <div className="relative h-64 shrink-0">
                            <img
                                src={imageSrc}
                                alt={category.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/20 to-transparent" />
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black transition-colors border border-white/10"
                            >
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-6 left-6 text-white">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-2">Filière d'Excellence</p>
                                <h2 className="text-4xl font-display-luxury font-medium leading-tight">{category.name}</h2>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-10 flex-1 bg-[#111]">
                            {/* Description */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4 border-b border-white/10 pb-4 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-[#D4AF37] rounded-full"></span>
                                    Présentation
                                </h3>
                                <p className="text-gray-400 leading-relaxed font-light text-sm text-justify">
                                    {category.description || "Cette filière représente un pilier stratégique de l'économie algérienne, offrant des produits de haute qualité certifiés pour les marchés internationaux. Nos producteurs s'engagent à respecter les standards les plus rigoureux."}
                                </p>
                            </div>

                            {/* Key Specs */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-[#D4AF37] rounded-full"></span>
                                    Indicateurs Clés
                                </h3>
                                <div className="space-y-4">
                                    {specs.map((spec, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-[#D4AF37]/50 transition-colors group">
                                            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#D4AF37] shadow-sm group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                                                {spec.icon}
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold group-hover:text-gray-300 transition-colors">{spec.label}</p>
                                                <p className="text-sm font-medium text-white">{spec.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Products Preview (Mock List) */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4 border-b border-white/10 pb-4 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-[#D4AF37] rounded-full"></span>
                                    Produits Phares
                                </h3>
                                <ul className="space-y-3">
                                    {['Produit Premium A', 'Gamme Export Gold', 'Sélection Bio'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-400 text-sm font-light">
                                            <CheckCircle size={14} className="text-[#D4AF37]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-8 border-t border-white/10 bg-[#0A0A0A]">
                            <button
                                onClick={() => window.location.href = `/products?category=${category.slug || category.id}`}
                                className="w-full py-5 bg-[#D4AF37] text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] rounded-sm"
                            >
                                Voir le Catalogue Complet
                            </button>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CategorySideDrawer;
