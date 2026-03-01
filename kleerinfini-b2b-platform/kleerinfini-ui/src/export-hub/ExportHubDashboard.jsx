import React from 'react';
import { Sparkles, ArrowLeft, LayoutDashboard, Database, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LegalVariableWidget from './components/LegalVariableWidget';
import ZLECAFWidget from './components/ZLECAFWidget';
import InvoiceScanner from './components/InvoiceScanner';

const ExportHubDashboard = () => {
    return (
        <div className="space-y-12 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Link
                            to="/producer-dashboard"
                            className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeft size={12} /> Retour Dashboard
                        </Link>
                        <span className="px-3 py-1 bg-blue-600/10 text-blue-700 text-xs font-bold rounded-full border border-blue-600/10 flex items-center gap-1">
                            <Zap size={12} /> Hub de l'Exportateur
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-[#050B18] leading-tight">
                        Centre Stratégique <span className="text-blue-700">Export</span>
                    </h1>
                    <p className="text-gray-500 font-medium text-lg">
                        Données légales et commerciales en temps réel pour optimiser vos exportations.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
                <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <LegalVariableWidget />
                    <ZLECAFWidget />
                    <div className="lg:col-span-2 p-10 bg-gradient-to-br from-blue-900 to-[#050B18] rounded-[3rem] text-white overflow-hidden relative group h-full">
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap size={160} />
                        </div>
                        <div className="relative z-10 max-w-xl">
                            <h3 className="text-4xl font-bold mb-6 leading-tight">Optimisez votre rentabilité</h3>
                            <p className="text-blue-200/80 font-medium text-lg mb-8 leading-relaxed">
                                Le Hub de l'Exportateur centralise toutes les ressources nécessaires pour sécuriser vos transactions et maximiser vos aides d'État.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/producer-dashboard/calculator" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 text-sm font-bold transition-colors cursor-pointer backdrop-blur-sm">
                                    Calculateur FSPE
                                </Link>
                                <Link to="/producer-dashboard/legal-watch" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 text-sm font-bold transition-colors cursor-pointer backdrop-blur-sm">
                                    Veille Juridique
                                </Link>
                                <Link to="/producer-dashboard/iso-norms" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 text-sm font-bold transition-colors cursor-pointer backdrop-blur-sm">
                                    Normes ISO
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-full min-h-[600px]">
                    <InvoiceScanner />
                </div>
            </div>

            {/* Footer Info / Next Tools */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Mises à jour JORADP", desc: "Dernière synchro: il y a 5 min", icon: Database },
                    { title: "Analyse IA", desc: "GPT-4o est actif pour le parsing", icon: Sparkles },
                    { title: "Statut Hub", desc: "Connecté aux sources officielles", icon: LayoutDashboard },
                ].map((item, i) => (
                    <div key={i} className="p-6 bg-white border border-gray-100 rounded-3xl flex items-center gap-4">
                        <div className="p-3 bg-gray-50 text-blue-600 rounded-2xl">
                            <item.icon size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-500 font-bold">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExportHubDashboard;
