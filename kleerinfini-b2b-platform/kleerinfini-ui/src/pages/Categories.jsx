import React, { useState, useEffect } from "react";
import { Search, ChevronRight, Menu, Phone, ShoppingCart, User, List, ChevronDown, X, CheckCircle, Shield, Globe, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import api from '../api/axios';
import { getProductImage } from '../utils/utils';
import Header from "../components/Header";
import Footer from "../components/Footer";
import QuoteRequestModal from "../components/QuoteRequestModal";
import luxurySearchBg from "../assets/luxury-search-bg-dark.png";

const Categories = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [detailCategory, setDetailCategory] = useState(null);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    const handleCloseDetail = () => {
        setDetailCategory(null);
        setSelectedCategory("all");
        navigate("/categories");
    };

    // Color Palette based on luxury background
    const RAJA_BLUE = "#001529"; // Midnight Blue / Bleu Nuit
    const LUXURY_GOLD = "#F97316"; // Orange Accent
    const RAJA_RED = "#D31245"; // Promo Red

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('categories/');
                const data = response.data.results || response.data || [];
                const sortedData = Array.isArray(data) ? data.sort((a, b) => a.name.localeCompare(b.name)) : [];
                setCategories(sortedData);

                // Auto-open detail if ID is present in URL
                if (id) {
                    const matchedCat = sortedData.find(c => String(c.id) === String(id));
                    if (matchedCat) {
                        setDetailCategory(matchedCat);
                        setSelectedCategory(matchedCat.id);
                    }
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [id]);

    // Helper for images - Use Backend Images First via Utils
    const getCategoryImage = (cat) => {
        // Priority 1: Use the robust helper from utils.js to process Cloudinary URLs
        if (cat.image_url || cat.image) {
            return getProductImage(cat.image_url || cat.image);
        }

        // Priority 2: Elegant architectural placeholder for missing images
        return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=90';
    };

    // Helper for translating backend category names dynamically
    const getTranslatedCategory = (cat) => {
        if (!cat || !cat.name) return { name: "", description: "" };
        const baseKey = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').trim();
        // Generate a clean key: e.g. "Produits Cosmétiques" -> "produits_cosm_tiques" (we'll manually map these in JSON)

        // We will map specific known backend IDs or exact string matches to i18n keys for safety.
        let i18nKey = "";
        if (cat.name.includes("Cosmétique")) i18nKey = "cosmetics";
        else if (cat.name.includes("Parfum")) i18nKey = "perfumes";
        else if (cat.name.includes("pêche") || cat.name.includes("Aquaculture")) i18nKey = "fishery";
        else if (cat.name.includes("Pharmaceutique")) i18nKey = "pharma";
        else if (cat.name.includes("Agroalimentaire")) i18nKey = "agri_processed";
        else if (cat.name.includes("Agricole")) i18nKey = "agri_raw";
        else if (cat.name.includes("Artisanat")) i18nKey = "crafts";
        else if (cat.name.includes("Bois")) i18nKey = "wood";
        else if (cat.name.includes("Électrique")) i18nKey = "electrical";
        else if (cat.name.includes("Mécanique")) i18nKey = "mechanical";
        else if (cat.name.includes("Textile") || cat.name.includes("Confection")) i18nKey = "textile";
        else if (cat.name.includes("Construction") || cat.name.includes("Bâtiment")) i18nKey = "construction";
        else if (cat.name.includes("minier") || cat.name.includes("métallurgique")) i18nKey = "mining_metallurgy";
        else if (cat.name.includes("Hydraulique")) i18nKey = "hydraulic_systems";
        else if (cat.name.includes("Solaire") || cat.name.includes("Énergie du Soleil")) i18nKey = "solar_energy";
        else if (cat.name.includes("Plastique") || cat.name.includes("EPI")) i18nKey = "plastic_ppe";
        else if (cat.name.includes("Jus") || cat.name.includes("Boisson")) i18nKey = "juice_drinks";
        else if (cat.name.includes("Industriel") || cat.name.includes("Machine")) i18nKey = "industrial";
        else if (cat.name.includes("Meuble") || cat.name.includes("Décoration")) i18nKey = "furniture_decoration";
        else if (cat.name.includes("Bijou")) i18nKey = "jewelry";
        else if (cat.name.includes("Laitier")) i18nKey = "dairy";
        else if (cat.name.includes("Épice") || cat.name.includes("Thé")) i18nKey = "spices";
        else if (cat.name.includes("Électroménager")) i18nKey = "appliances";
        else i18nKey = baseKey;

        // Priority 1: ALWAYS use the real database name from Admin. 
        // Only fallback to i18n for the description if none is provided.
        const translatedName = cat.name;
        const translatedDesc = cat.description || t(`categories.sectors_dynamic.${i18nKey}.desc`, { defaultValue: t("categories.card.description_default") });

        return { name: translatedName, description: translatedDesc };
    };

    const descriptionDefault = t("categories.card.description_default");

    return (
        <div className="min-h-screen bg-white font-sans text-[#333] pt-24 text-left">
            <Header theme="light" />

            {/* B2B Action Bar (Premium Refinement) - Midnight Blue */}
            <div className="bg-[#001529] text-white py-2.5 shadow-md border-b border-white/10 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex items-center justify-between text-[10px] md:text-[11px] font-black tracking-widest uppercase gap-6 min-w-max md:min-w-0">
                    <div className="flex items-center gap-4 md:gap-8">
                        <span className="flex items-center gap-2.5 cursor-pointer hover:text-amber-400 transition-colors">
                            <Menu size={16} />
                            {t("categories.action_bar.nos_produits", "NOS PRODUITS D'EXPORTATION")}
                        </span>
                        <span className="h-4 w-px bg-white/20 hidden md:block"></span>
                        <span className="opacity-90 font-medium hidden lg:block text-[10px]">
                            {t("categories.action_bar.standard_excellence", "Standard d'Excellence pour les Marchés Internationaux")}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 md:gap-8">
                        <span className="flex items-center gap-2.5 cursor-pointer hover:text-amber-400 transition-colors">
                            <Phone size={16} />
                            {t("home.footer.contact")}
                        </span>
                        <span className="flex items-center gap-2.5 cursor-pointer hover:text-amber-400 transition-colors">
                            <Globe size={16} className="text-amber-500" />
                            {t("home.footer.carte")}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-10 flex flex-col xl:flex-row gap-6 md:gap-10">
                {/* 1. LEFT SIDEBAR NAVIGATION - Premium Polish */}
                <aside className="w-72 flex-shrink-0 hidden xl:block bg-gray-50/50 border border-gray-100 rounded-2xl self-start sticky top-32 p-1 shadow-sm">
                    <div className="p-5 font-black text-[12px] text-black uppercase tracking-[0.2em] border-b border-gray-200/50 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                        {t("categories.sidebar.titre")}
                    </div>
                    <ul className="text-sm py-4 space-y-1">
                        {loading && <li className="p-4 text-gray-400 animate-pulse uppercase font-bold tracking-widest">{t("categories.sidebar.initialisation")}</li>}
                        {!loading && categories.map((cat) => (
                            <li key={cat.id} className="px-2">
                                <button
                                    onClick={() => {
                                        setSelectedCategory(cat.id);
                                        setDetailCategory(cat);
                                    }}
                                    className={`w-full text-left py-3.5 px-4 rounded-xl flex items-center justify-between transition-all duration-300 ${selectedCategory === cat.id ? 'bg-white text-black font-black shadow-sm border border-gray-100 translate-x-1' : 'text-black font-bold hover:bg-white hover:text-black hover:shadow-sm hover:translate-x-1'}`}
                                >
                                    <span className="truncate">{cat.name}</span>
                                    <ChevronRight size={14} className={`transition-transform duration-300 ${selectedCategory === cat.id ? 'text-amber-600' : 'text-gray-400'}`} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* 2. MAIN CONTENT AREA */}
                <main className="flex-1">

                    {/* A. Search / Finder Tool - LUXURY GLASS REDESIGN */}
                    <div
                        className="p-6 md:p-10 border border-white/20 rounded-3xl shadow-2xl mb-8 md:mb-12 relative overflow-hidden group bg-cover bg-center bg-slate-900"
                        style={{ backgroundImage: luxurySearchBg ? `url(${luxurySearchBg})` : 'none' }}
                    >
                        {/* Overlay for Contrast - Darker for visibility on dark image */}
                        <div className="absolute inset-0 bg-black/40"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4 text-amber-500">
                                    <div className="h-[2px] w-8 bg-amber-500"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t("categories.search.moteur_titre")}</span>
                                </div>
                                <h2 className="text-2xl font-black text-white mb-4 tracking-tight uppercase flex items-center gap-3">
                                    {t("categories.search.rechercher_titre")}
                                </h2>
                                <p className="text-sm text-white/90 mb-8 font-bold">{t("categories.search.rechercher_desc")}</p>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1 relative group/input">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/60 group-focus-within/input:text-amber-900 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder={t("categories.search.placeholder")}
                                            className="w-full bg-white/60 border border-white/40 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-black placeholder-black/50 focus:bg-white/90 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all text-left"
                                        />
                                    </div>
                                    <button className="bg-black hover:bg-slate-900 text-white px-10 py-4 text-xs font-black tracking-[0.2em] rounded-2xl shadow-xl hover:scale-105 transition-all uppercase active:scale-95">
                                        {t("categories.search.trouver_btn")}
                                    </button>
                                </div>
                            </div>

                            {/* Catalog CTA Section - Glass Dark Style */}
                            <div className="w-full lg:w-72 flex-shrink-0 bg-black/20 p-8 rounded-3xl border border-white/20 shadow-lg backdrop-blur-sm">
                                <h3 className="text-white font-black text-xs mb-3 tracking-widest uppercase flex items-center gap-2">
                                    <Award size={16} className="text-amber-500" />
                                    {t("categories.search.catalogues_pdf")}
                                </h3>
                                <p className="text-[11px] text-white/80 mb-6 font-bold leading-relaxed">
                                    {t("categories.search.catalogues_desc")}
                                </p>
                                <button className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all underline underline-offset-8">
                                    {t("categories.search.consulter_btn")} <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* MOBILE CATEGORY NAVIGATION (Visible only on smaller screens) */}
                    <div className="xl:hidden mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <List size={18} className="text-amber-500" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">{t("categories.sidebar.titre", "NOS CATÉGORIES")}</h3>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar snap-x">
                            <button
                                onClick={() => { setSelectedCategory("all"); setDetailCategory(null); }}
                                className={`flex-shrink-0 px-6 py-3 rounded-full text-xs font-bold transition-all snap-start ${selectedCategory === "all" ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'}`}
                            >
                                {t("categories.voir_tout", "VOIR TOUT")}
                            </button>
                            {categories.map((cat) => {
                                const { name } = getTranslatedCategory(cat);
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => { setSelectedCategory(cat.id); setDetailCategory(cat); }}
                                        className={`flex-shrink-0 px-6 py-3 rounded-full text-xs font-bold transition-all snap-start ${selectedCategory === cat.id ? 'bg-amber-500 text-white shadow-md' : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'}`}
                                    >
                                        {name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* B. "Nos Bons Plans" / Product Grid */}
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-[#333]">{t("categories.phares")}</h2>
                        <span className={`text-xs font-bold text-[${RAJA_BLUE}] cursor-pointer hover:underline uppercase`}>{t("categories.voir_tout")}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {categories.map((cat, idx) => {
                            const translatedCat = getTranslatedCategory(cat);
                            return (
                                <div
                                    key={cat.id}
                                    className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-2xl transition-all duration-500 cursor-pointer group min-h-[420px] flex flex-col hover:scale-[1.01] hover:border-gray-200"
                                >
                                    {/* Image with full bleed coverage and Badge Overlay */}
                                    <div className="h-64 -mx-5 -mt-5 mb-5 overflow-hidden rounded-t-xl relative group">
                                        <img
                                            src={getCategoryImage(cat)}
                                            alt={translatedCat.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                                        {/* LUXURY BADGE (AS PER SCREENSHOT) */}
                                        <div className="absolute top-5 left-5">
                                            <div className="bg-white/95 text-emerald-800 text-[10px] font-black px-3 py-1.5 rounded-[2px] shadow-sm tracking-[0.15em] uppercase border-l-4 border-emerald-500 flex items-center justify-center">
                                                {t("categories.card.disponible", "DISPONIBLE")}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Title - Premium Black Weight */}
                                    <h3 className="text-[15px] font-black text-slate-900 group-hover:text-amber-800 mb-3 transition-colors leading-snug min-h-[55px] flex items-start uppercase tracking-tight line-clamp-2">
                                        {translatedCat.name}
                                    </h3>

                                    {/* Description - Refined spacing */}
                                    <p className="text-[11px] text-slate-500 line-clamp-3 mb-3 flex-1 leading-relaxed font-medium">
                                        {translatedCat.description}
                                    </p>

                                    {/* Action Section / Pricing */}
                                    <div className="mt-auto pt-3 border-t border-gray-50 flex flex-col gap-1">
                                        <div className="text-[8px] text-[#7B1113] text-center uppercase tracking-[0.4em] font-black opacity-90">
                                            {t("categories.card.tarification", "TARIFICATION")}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter line-through decoration-gray-200">{t("categories.card.prix_public", "Prix-Public")}</span>
                                                <span className="text-base font-black text-slate-900 tracking-tighter">{t("categories.card.sur_devis", "Sur Devis")}</span>
                                            </div>

                                            <button
                                                onClick={() => setDetailCategory(cat)}
                                                className="bg-[#D48D0B] hover:bg-[#B67808] text-white pl-6 pr-4 py-2 rounded-md text-[11px] font-black tracking-widest shadow-md transition-all duration-300 flex items-center gap-3 group/btn uppercase"
                                            >
                                                {t("categories.card.explorer", "Explorer")}
                                                <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </main>
            </div>

            {/* LUXURY DETAIL DRAWER */}
            <AnimatePresence>
                {detailCategory && (
                    <>
                        {/* Overlay - NO BLUR */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseDetail}
                            className="fixed inset-0 bg-black/40 z-[100] cursor-zoom-out"
                        />

                        {/* Drawer Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full sm:w-[500px] md:w-[600px] lg:w-[700px] bg-white z-[101] shadow-2xl flex flex-col overflow-hidden"
                        >
                            {/* Close Button UI - NO BLUR */}
                            <button
                                onClick={handleCloseDetail}
                                className="absolute top-6 right-6 z-[110] bg-black/20 hover:bg-black text-white p-3 rounded-full transition-all duration-300 shadow-xl"
                            >
                                <X size={24} />
                            </button>

                            {/* Hero Image Section - Optimized for HD Clarity and "Complete" view */}
                            <div className="h-[250px] md:h-[400px] flex-shrink-0 relative overflow-hidden group transition-all duration-700 ease-in-out">
                                <img
                                    src={getCategoryImage(detailCategory)}
                                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                                    alt={detailCategory.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-0 transition-opacity"></div>
                                <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10">
                                    <div className="bg-amber-500 text-white text-[9px] md:text-[10px] font-black px-4 py-1 rounded-full w-fit mb-4 tracking-widest uppercase shadow-lg">
                                        {t("categories.drawer.secteur")} : {detailCategory.type || t("categories.drawer.export_platinum")}
                                    </div>
                                    <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-white leading-tight uppercase tracking-tighter">
                                        {getTranslatedCategory(detailCategory).name}
                                    </h2>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-slate-50/30">
                                {/* Description Box */}
                                <div className="mb-10">
                                    <div className="flex items-center gap-3 mb-6 text-slate-400">
                                        <div className="h-[2px] w-12 bg-amber-500"></div>
                                        <span className="text-[10px] font-black tracking-[0.2em] uppercase">{t("categories.drawer.profil_titre")}</span>
                                    </div>
                                    <p className="text-base text-slate-700 leading-relaxed font-medium first-letter:text-4xl first-letter:font-black first-letter:text-slate-900 first-letter:mr-3 first-letter:float-left">
                                        {getTranslatedCategory(detailCategory).description}
                                    </p>
                                </div>

                                {/* Specifications Grid */}
                                <div className="grid grid-cols-2 gap-6 mb-10">
                                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm group hover:border-amber-200 transition-colors">
                                        <div className="flex items-center gap-2 mb-2 text-amber-600">
                                            <Shield size={18} />
                                            <span className="text-[10px] font-black uppercase tracking-wider">{t("categories.drawer.qualite_label")}</span>
                                        </div>
                                        <div className="text-xs text-slate-600 font-bold leading-tight">{t("categories.drawer.qualite_desc")}</div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm group hover:border-amber-200 transition-colors">
                                        <div className="flex items-center gap-2 mb-2 text-amber-600">
                                            <CheckCircle size={18} />
                                            <span className="text-[10px] font-black uppercase tracking-wider">{t("categories.drawer.provenance_label")}</span>
                                        </div>
                                        <div className="text-xs text-slate-600 font-bold leading-tight">{t("categories.drawer.provenance_desc")}</div>
                                    </div>
                                </div>

                                {/* Certifications Section */}
                                {detailCategory.certifications && detailCategory.certifications.length > 0 && (
                                    <div className="mb-10">
                                        <div className="flex items-center gap-3 mb-6 text-slate-400">
                                            <div className="h-[2px] w-12 bg-amber-500"></div>
                                            <span className="text-[10px] font-black tracking-[0.2em] uppercase">{t("categories.drawer.certifications_titre")}</span>
                                        </div>
                                        <div className="space-y-4">
                                            {detailCategory.certifications.map((cert) => (
                                                <div key={cert.id} className="flex items-start gap-4 p-5 bg-white rounded-xl border-l-4 border-amber-500 shadow-sm hover:translate-x-1 transition-transform cursor-default">
                                                    <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
                                                        <Award size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-sm text-slate-900 mb-1 uppercase tracking-tight">{cert.name}</h4>
                                                        <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">{cert.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Marketing Callout */}
                                <div className="bg-slate-950 p-8 rounded-2xl text-white relative overflow-hidden group">
                                    <div className="absolute -right-10 -bottom-10 opacity-10 transform rotate-12 transition-transform duration-700 group-hover:rotate-0">
                                        <Globe size={180} />
                                    </div>
                                    <h4 className="text-xl font-black mb-2 uppercase tracking-tight">{t("categories.drawer.expedition_titre")}</h4>
                                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                        {t("categories.drawer.expedition_desc")}
                                    </p>
                                    <button
                                        onClick={() => navigate(`/products?category=${detailCategory.id}`)}
                                        className="bg-[#D4AF37] hover:bg-white hover:text-black text-black px-8 py-5 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-2xl transition-all duration-300 w-full lg:w-fit flex items-center justify-center gap-3"
                                    >
                                        {t("categories.drawer.voir_produits", "VOIR TOUS LES PRODUITS")}
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Global Sourcing Request Modal */}
            <QuoteRequestModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                category={detailCategory}
            />

            <Footer />
        </div>
    );
};

export default Categories;
