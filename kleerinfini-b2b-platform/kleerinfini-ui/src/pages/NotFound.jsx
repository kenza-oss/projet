import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ArrowLeft, Search, AlertCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NotFound = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="bg-[#0A0A0A] min-h-screen font-sans selection:bg-[#FF6600] selection:text-white flex flex-col">
            <Header />

            <main className="flex-grow flex items-center justify-center pt-32 pb-20 relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#FF6600]/10 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[150px]"></div>

                    {/* Animated 404 Text in background */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
                        <span className="text-[40vw] font-black font-display tracking-tighter">404</span>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="mb-12"
                    >
                        <div className="inline-flex items-center justify-center p-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-3xl relative">
                            <AlertCircle size={80} className="text-[#FF6600]" strokeWidth={1} />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF6600] rounded-full"
                            ></motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 tracking-tighter">
                            PAGE <span className="text-[#FF6600] italic">INTROUVABLE</span>
                        </h1>

                        <div className="w-24 h-1.5 bg-[#FF6600] mx-auto mb-10 rounded-full shadow-[0_0_20px_rgba(255,102,0,0.5)]"></div>

                        <p className="text-xl md:text-2xl text-neutral-400 font-light max-w-2xl mx-auto mb-16 leading-relaxed">
                            Il semble que l'itinéraire que vous avez choisi n'existe pas dans l'univers Kleer Infini.
                            Vérifiez l'URL ou revenez à la source pour continuer l'exploration.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <button
                            onClick={() => navigate("/")}
                            className="group relative px-10 py-5 bg-[#FF6600] text-white rounded-full transition-all duration-500 overflow-hidden shadow-[0_20px_50px_rgba(255,102,0,0.3)] hover:shadow-[0_25px_60px_rgba(255,102,0,0.4)] flex items-center gap-3"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            <Home size={20} className="relative z-10" />
                            <span className="relative z-10 text-sm font-bold uppercase tracking-[0.2em]">Retour à l'accueil</span>
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-full hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-md"
                        >
                            <ArrowLeft size={20} />
                            <span className="text-sm font-bold uppercase tracking-[0.2em]">Page précédente</span>
                        </button>
                    </motion.div>

                    {/* Quick Search Suggestion */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-20 pt-12 border-t border-white/5 text-neutral-500 uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-4"
                    >
                        <Search size={14} />
                        Explorez nos catalogues d'exportation
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default NotFound;
