import React, { useState, useEffect } from 'react';
import { Globe, TrendingDown, Info, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ZLECAF_DATA = {
    Sénégal: [
        { product: 'Produits Agricoles', reduction: 100, type: 'Total' },
        { product: 'Produits Manufacturés', reduction: 20, type: 'Progressif' }
    ],
    Nigeria: [
        { product: 'Produits Agricoles', reduction: 80, type: 'Progressif' },
        { product: 'Produits Manufacturés', reduction: 0, type: 'Sensible' }
    ],
    Mauritanie: [
        { product: 'Produits Agricoles', reduction: 100, type: 'Total' },
        { product: 'Produits Manufacturés', reduction: 100, type: 'Total' }
    ]
};

const Skeleton = () => (
    <div className="animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 rounded-2xl w-full"></div>
        <div className="space-y-4">
            <div className="h-20 bg-gray-100 rounded-3xl"></div>
            <div className="h-20 bg-gray-100 rounded-3xl"></div>
        </div>
    </div>
);

const ZLECAFWidget = () => {
    const [loading, setLoading] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState('Sénégal');

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    const handleCountryChange = (e) => {
        setLoading(true);
        const country = e.target.value;
        setSelectedCountry(country);
        setTimeout(() => setLoading(false), 800);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#050B18] p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-900/10 h-full overflow-hidden relative"
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-10 -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                            <Globe size={24} className="text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold">Zone ZLECAF</h3>
                    </div>

                    <select
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                        {Object.keys(ZLECAF_DATA).map(c => (
                            <option key={c} value={c} className="bg-[#050B18]">{c}</option>
                        ))}
                    </select>
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="skeleton"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Skeleton />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <p className="text-blue-200/60 text-[11px] font-bold uppercase mb-4">
                                Algérie vers {selectedCountry}
                            </p>

                            {ZLECAF_DATA[selectedCountry].map((item, i) => (
                                <div key={i} className="group p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-lg text-white">{item.product}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${item.type === 'Total' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-blue-400 font-bold text-3xl">
                                                <TrendingDown size={24} />
                                                -{item.reduction}%
                                            </div>
                                            <p className="text-xs font-bold text-white/60 uppercase">Réduction de droits</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-3 items-start">
                                <Info size={16} className="text-blue-400 mt-0.5 shrink-0" />
                                <p className="text-[11px] text-blue-100/70 leading-relaxed">
                                    Les taux sont sujets à validation par certificat d'origine.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ZLECAFWidget;
