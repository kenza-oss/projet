import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    MapPin, Globe, Mail, Phone, Award, ChevronRight, Play,
    MessageSquare, FileText, CheckCircle2, Users, Linkedin,
    Download, Shield, Package, Search, Settings, User, Star,
    Menu, X, Send, ArrowUpRight, BarChart3, ExternalLink,
    Zap, ShoppingBag, Info, PieChart, Activity, Clock
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProductImage } from "../utils/utils";
import {
    PieChart as RePieChart, Pie, Cell, ResponsiveContainer,
    XAxis, CartesianGrid, Tooltip as ReTooltip, AreaChart, Area
} from 'recharts';

// API
import { getProfileById, getProducerProfile } from "../api/profiles";
import { getProductsByProducer } from "../api/products";
import { createMessage } from "../api/messages";
import { createEstimate } from "../api/estimates";

// Static Assets (Fallback)
import executiveCover from "../assets/producer_factory_cover.png";
import executiveLogo from "../assets/luxury_blue_logo.png";
import logo from "../assets/logo.png";
import ProductModal from "../components/ProductModal";

// Market Images (Custom User Assets)
import marketEurope from "../assets/europe.png";
import marketAfrica from "../assets/africa.jpg";
import marketAmerica from "../assets/america.jpg";
import marketMiddleEast from "../assets/middle_east.jpg";

const ProducerProfile2 = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [producer, setProducer] = useState(null);
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState("products");
    const [loading, setLoading] = useState(true);
    const [showMessaging, setShowMessaging] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isIdOpen, setIsIdOpen] = useState(false); // Modal for product
    const [messageContent, setMessageContent] = useState("");
    const [messageSubject, setMessageSubject] = useState("");
    const [isSending, setIsSending] = useState(false);

    // Mock Data for Analytics (Consistent with Dashboard)
    const topLocations = [
        { name: 'Alger', value: 45, color: '#E31E24' },
        { name: 'Oran', value: 28, color: '#00c49f' },
        { name: 'Constantine', value: 12, color: '#ffbb28' },
        { name: 'Sétif', value: 15, color: '#ff8042' },
    ];

    const monthlyData = [
        { month: 'Jan', views: 400 },
        { month: 'Feb', views: 300 },
        { month: 'Mar', views: 600 },
        { month: 'Apr', views: 800 },
        { month: 'May', views: 700 },
        { month: 'Jun', views: 900 },
        { month: 'Jul', views: 1100 },
    ];

    const partners = [
        { id: 1, name: 'EuroFood GmbH', initial: 'EF', status: 'Actif', type: 'Partenaire Stratégique' },
        { id: 2, name: 'Organic Plus', initial: 'OP', status: 'Vérifié', type: 'Producteur Certifié' },
        { id: 3, name: 'Global Trade Co', initial: 'GT', status: 'Actif', type: 'Hub Export' },
    ];

    const activityLedger = [
        { id: 1, title: 'Exportation Validée', time: 'il y a 2h', icon: Zap, color: 'text-red-500', bg: 'bg-red-50' },
        { id: 2, title: 'Devis Finalisé', time: 'il y a 5h', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { id: 3, title: 'Produit Mis à jour', time: 'Hier', icon: Package, color: 'text-amber-500', bg: 'bg-amber-50' },
    ];


    useEffect(() => {
        console.log("PROFIL DEBUG: useEffect triggered", { id, userId: user?.id, authLoading });

        if (authLoading) return;

        async function fetchData() {
            setLoading(true);
            try {
                // HIGH RESILIENCE: Try context first, then direct localStorage keys
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                const activeUserId = user?.id || storedUser.id || storedUser.pk || storedUser.user_id;

                let currentId = id || "me";
                console.log("PROFIL DEBUG: Final Resolution Path", { currentId, activeUserId, urlParam: id });

                let profileData = null;

                if (currentId === "me") {
                    if (activeUserId) {
                        profileData = await getProducerProfile(activeUserId);
                    } else {
                        // Fail silently or show not found if absolutely no identity exists
                        console.warn("PROFIL DEBUG: No identity found for 'me'");
                    }
                } else {
                    profileData = await getProfileById(currentId);
                    if (!profileData) {
                        profileData = await getProducerProfile(currentId);
                    }
                }

                console.log("PROFIL DEBUG: Got profile data", profileData);

                if (profileData) {
                    setProducer(profileData);
                    // Fetch products using the resolved Profile ID
                    const productsData = await getProductsByProducer(profileData.id);
                    console.log("PROFIL DEBUG: Got products", productsData?.length);
                    if (productsData) {
                        setProducts(productsData);
                    }
                } else {
                    console.warn("PROFIL DEBUG: Final profile resolution is null");
                }
            } catch (err) {
                console.error("PROFIL DEBUG: Fetch error", err);
                // We only show toast if it's a real error (not just 404)
                if (err.response?.status !== 404) {
                    toast.error("Problème de connexion au serveur.");
                }
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id, user, authLoading]);

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#D4A574] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#D4A574] text-xs font-bold uppercase tracking-widest animate-pulse">{t("producer_profile.loading")}</p>
        </div>
    );

    if (!producer) {
        // Fallback pour le producteur lui-même si son profil n'est pas encore créé
        if (id === 'me' || String(id) === String(user?.id) || String(id) === String(user?.user_id)) {
            return (
                <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-[#111] p-6 text-center font-inter mt-10">
                    <div className="max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-inner">
                            <Settings size={40} />
                        </div>
                        <h2 className="text-3xl font-black mb-4 tracking-tight">Profil Incomplet</h2>
                        <p className="text-gray-500 mb-8 font-medium leading-relaxed">
                            Votre vitrine internationale n'est pas encore configurée. Veuillez remplir les informations de votre entreprise dans votre tableau de bord.
                        </p>
                        <button
                            onClick={() => navigate('/producer-dashboard/profile')}
                            className="px-10 py-4 w-full bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                        >
                            Configurer Mon Profil
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-white flex items-center justify-center text-[#111] p-6 text-center">
                <div className="max-w-md">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <User size={40} />
                    </div>
                    <h2 className="text-3xl font-black mb-4">{t("producer_profile.not_found.title")}</h2>
                    <p className="text-gray-500 mb-8 font-medium">{t("producer_profile.not_found.desc")}</p>
                    <button onClick={() => navigate('/')} className="px-10 py-4 bg-[#E31E24] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-red-500/20">{t("producer_profile.not_found.back_home")}</button>
                </div>
            </div>
        );
    }

    // Derived Data
    const displayCover = producer.cover_image_url || producer.cover_image || executiveCover;
    const displayLogo = producer.logo_url || producer.logo || executiveLogo;
    const displayManagerPhoto = producer.profile_photo_url || producer.profile_photo;

    // Get actual stats from backend or use defaults if empty
    const backendStats = producer.stats || {};
    const stats = [
        { label: t("producer_profile.tabs.products"), value: products.length },
        { label: t("home.search.stats.views", "Vues"), value: producer.views_with_bonus || backendStats.views || 0 },
        { label: t("home.search.stats.likes", "Likes"), value: producer.likes_with_bonus || backendStats.likes || 0 },
    ];

    const tabs = [
        { id: "products", label: t("producer_profile.tabs.products") },
        { id: "videos", label: t("producer_profile.tabs.videos") },
        { id: "performance", label: t("producer_profile.tabs.performance") },
        { id: "documents", label: t("producer_profile.tabs.documents") },
        { id: "logistics", label: t("producer_profile.tabs.logistics") }
    ];

    const marketImages = {
        "Europe": marketEurope,
        "Afrique": marketAfrica,
        "Amérique": marketAmerica,
        "Moyen-Orient": marketMiddleEast,
        "Middle East": marketMiddleEast,
        "Africa": marketAfrica,
        "America": marketAmerica,
        "Asie": marketMiddleEast,
        "Asia": marketMiddleEast,
        "Oceania": marketEurope,
        "Océanie": marketEurope,
        "Monde": marketEurope,
        "World": marketEurope
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#111] font-sans overflow-x-hidden pt-20">
            <style>
                {`
                  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                  body { font-family: 'Inter', sans-serif; background: #FAFAFA; }
                  .behance-shadow { shadow: 0 1px 2px rgba(25,25,25,0.2); }
                  .glass-nav { background: rgba(255, 255, 255, 0.95); border-bottom: 1px solid #e8e8e8; }
                `}
            </style>

            <Header />

            {/* FULL WIDTH COVER */}
            <section className="relative w-full h-[320px] lg:h-[450px]">
                <img src={displayCover} className="w-full h-full object-cover" alt="Producer Cover" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
            </section>

            {/* MAIN CONTENT AREA */}
            <main className="max-w-[1400px] mx-auto px-6 -mt-32 relative z-[10] flex flex-col lg:flex-row gap-8 pb-32">

                {/* LEFT SIDEBAR (STICKY) */}
                <aside className="w-full lg:w-[380px] flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-[#e8e8e8] p-8 sticky top-24">
                        {/* AVATAR OVERLAP */}
                        <div className="flex justify-center -mt-24 mb-6">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 bg-white p-2 rounded-full shadow-lg border border-[#e8e8e8] overflow-hidden">
                                <img src={displayLogo} className="w-full h-full object-contain rounded-full" alt="Company Logo" />
                            </div>
                        </div>

                        {/* COMPANY TITLE & INFO */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl lg:text-3xl font-black text-[#111] mb-4">{producer.company_name || producer.name}</h1>

                            {/* 1. ADRESSE */}
                            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm font-medium mb-4">
                                <MapPin size={16} className="flex-shrink-0" />
                                <span className="leading-tight">
                                    {producer.address ? `${producer.address}, ` : ""}{producer.city || ""}{producer.city ? ", " : ""}{typeof producer.country === 'object' ? (producer.country?.label || producer.country?.name || "Algérie") : (producer.country || "Algérie")}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {/* 2. SITE WEB (BLEU) */}
                                {producer.website && (
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Site Web</p>
                                        <a
                                            href={producer.website.startsWith('http') ? producer.website : `https://${producer.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-2"
                                        >
                                            {producer.website.replace(/^https?:\/\//, '')} <ExternalLink size={14} />
                                        </a>
                                    </div>
                                )}

                                {/* 3. TYPE / ACTIVITÉ (BLEU) */}
                                {producer.activity && (
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t("producer_profile.sidebar.type")}</p>
                                        <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{producer.activity}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-center gap-3 pt-4">
                                    {(String(producer.user_id || producer.user).toLowerCase() !== String(user?.user_id || user?.user || user?.id).toLowerCase()) ? (
                                        <button
                                            onClick={() => setShowMessaging(true)}
                                            className="px-8 py-3 bg-[#E31E24] text-white rounded-full font-black text-sm tracking-tight flex items-center gap-2 hover:bg-black transition-all w-full justify-center shadow-lg shadow-red-500/20"
                                        >
                                            <Send size={16} /> {t("producer_profile.sidebar.message")}
                                        </button>
                                    ) : (
                                        <div className="w-full py-3 bg-gray-50 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100 italic text-center">
                                            {t("producer_profile.sidebar.public_space")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* STATS */}
                        <div className="grid grid-cols-3 border-t border-b border-[#f0f0f0] py-6 mb-8 text-center">
                            {stats.map((s, idx) => (
                                <div key={idx} className={idx < stats.length - 1 ? "border-r border-[#f0f0f0]" : ""}>
                                    <p className="text-lg font-black text-[#111]">{s.value}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* ABOUT / ADN */}
                        <div className="mb-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-[#111]">{t("producer_profile.sidebar.about")}</h3>
                            <p className="text-sm text-[#444] leading-relaxed font-medium">
                                {producer.description || t("producer_profile.sidebar.no_desc")}
                            </p>
                        </div>

                        {/* CONTACT DETAILS LIST */}
                        <div className="space-y-4 pt-6 border-t border-[#f0f0f0]">
                            {producer.whatsapp && (
                                <div className="flex items-center gap-4 text-sm font-semibold text-[#666]">
                                    <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"><Phone size={16} /></div>
                                    <span className="truncate">{producer.whatsapp}</span>
                                </div>
                            )}
                            {producer.email && (
                                <div className="flex items-center gap-4 text-sm font-semibold text-[#666]">
                                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><Mail size={16} /></div>
                                    <span className="truncate">{producer.email}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-4 text-sm font-semibold text-[#666]">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center"><BarChart3 size={16} /></div>
                                <span>{t("producer_profile.sidebar.capacity")}: {producer.yearly_capacity || t("home.map.no_address", "Non définie")}</span>
                            </div>
                        </div>

                        {/* MANAGER PHOTO / CONTACT PERSON */}
                        {displayManagerPhoto && (
                            <div className="mt-8 pt-6 border-t border-[#f0f0f0]">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-[#111]">{t("producer_profile.sidebar.leader")}</h3>
                                <div className="flex items-center gap-4">
                                    <img src={displayManagerPhoto} className="w-14 h-14 rounded-xl object-cover shadow-sm" alt="Manager" />
                                    <div>
                                        <p className="text-sm font-black text-[#111] leading-tight">
                                            {producer.first_name || ""} {producer.last_name || ""}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{t("producer_profile.sidebar.role")}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* RIGHT CONTENT AREA */}
                <div className="flex-1">
                    {/* TABS HEADER */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#e8e8e8] mb-8 sticky top-24 z-40">
                        <div className="flex px-4 md:px-8 border-b border-[#f0f0f0] overflow-x-auto no-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="py-4 md:py-6 px-4 md:px-10 text-[10px] md:text-xs font-black uppercase tracking-widest relative transition-all text-[#111] whitespace-nowrap"
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div layoutId="profileTabAlpha" className="absolute bottom-0 left-0 right-0 h-1 bg-black" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div >

                    {/* CONTENT DISPLAY */}
                    < AnimatePresence mode="wait" >
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="min-h-[600px] px-4 md:px-0"
                        >
                            {activeTab === "products" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {products.length > 0 ? products.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            whileHover={{ y: -5 }}
                                            className="group bg-white rounded-xl overflow-hidden border border-[#e8e8e8] shadow-sm hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
                                                <img
                                                    src={getProductImage(product.images?.[0] || product.image, 0, product)}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    alt={product.name}
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setIsIdOpen(true);
                                                        }}
                                                        className="px-6 py-2 bg-[#0066FF] text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 hover:bg-[#0052cc] transition-all shadow-lg shadow-blue-500/30 border border-transparent"
                                                    >
                                                        {t("producer_profile.products.details")} <ExternalLink size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-lg font-black text-[#111] mb-1">{product.name}</h4>
                                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{product.category_name || product.category}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-black text-[#E31E24] bg-red-50 px-3 py-1 rounded-lg">FOB {product.prix_indicatif || "Contact"} {product.currency}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <div className="col-span-full py-40 border-2 border-dashed border-[#e8e8e8] rounded-2xl flex flex-col items-center justify-center text-gray-300">
                                            <ShoppingBag size={64} className="mb-4" />
                                            <p className="text-lg font-bold">{t("producer_profile.products.no_products")}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "videos" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {products.filter(p => p.video || p.video_url).length > 0 ? (
                                        products.filter(p => p.video || p.video_url).map((product) => (
                                            <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-[#e8e8e8] shadow-sm">
                                                <div className="aspect-video bg-black relative">
                                                    <video
                                                        src={product.video || product.video_url}
                                                        controls
                                                        className="w-full h-full object-cover"
                                                        poster={getProductImage(product.images?.[0] || product.image, 0, product)}
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-black text-[#111]">{product.name}</h4>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                                                        {product.category_name || product.category}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-40 border-2 border-dashed border-[#e8e8e8] rounded-2xl flex flex-col items-center justify-center text-gray-300">
                                            <Play size={64} className="mb-4" />
                                            <p className="text-lg font-bold">{t("producer_profile.videos.no_videos")}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "performance" && (
                                <div className="space-y-8">
                                    {/* Company Identity & Stats Summary */}
                                    <div className="bg-white rounded-xl shadow-sm border border-[#e8e8e8] p-6 md:p-10">
                                        <h3 className="text-lg md:text-xl font-black mb-8 flex items-center gap-4">
                                            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><Info size={24} /></div>
                                            {t("producer_profile.performance.details")}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{t("producer_profile.performance.nif")}</p>
                                                <p className="text-sm font-black text-[#111]">{producer.nif_number || t("home.map.no_address", "Non fourni")}</p>
                                            </div>
                                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{t("producer_profile.performance.year")}</p>
                                                <p className="text-sm font-black text-[#111]">{producer.year_established || t("home.map.no_address", "Non fournie")}</p>
                                            </div>
                                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{t("producer_profile.performance.prod_capacity")}</p>
                                                <p className="text-sm font-black text-[#111]">{producer.monthly_capacity || t("home.map.no_address", "Non précisée")} / {t("month") || "mois"}</p>
                                            </div>
                                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{t("producer_profile.performance.headquarters")}</p>
                                                <p className="text-sm font-black text-[#111]">
                                                    {producer.address ? `${producer.address}, ` : ""}
                                                    {producer.city || t("home.map.no_address", "Non précisé")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="bg-white rounded-xl p-6 md:p-8 border border-[#e8e8e8] shadow-sm">
                                            <h3 className="flex items-center gap-3 text-base md:text-lg font-black text-[#111] uppercase tracking-widest mb-8">
                                                <PieChart size={20} className="text-[#E31E24]" /> {t("producer_profile.performance.visitors")}
                                            </h3>
                                            <div className="h-[250px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RePieChart>
                                                        <Pie
                                                            data={topLocations}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={80}
                                                            dataKey="value"
                                                        >
                                                            {topLocations.map((entry, index) => (
                                                                <Cell key={index} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <ReTooltip />
                                                    </RePieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-8">
                                                {topLocations.map((loc, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: loc.color }} />
                                                        <span className="text-xs font-bold text-gray-600">{loc.name}: {loc.value}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl p-6 md:p-8 border border-[#e8e8e8] shadow-sm">
                                            <h3 className="flex items-center gap-3 text-base md:text-lg font-black text-[#111] uppercase tracking-widest mb-8">
                                                <Activity size={20} className="text-[#E31E24]" /> {t("producer_profile.performance.visibility")}
                                            </h3>
                                            <div className="h-[250px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={monthlyData}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#999' }} />
                                                        <ReTooltip />
                                                        <Area type="monotone" dataKey="views" stroke="#E31E24" fill="#eef2ff" strokeWidth={4} />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100 italic">
                                                <p className="text-[10px] font-bold text-red-700">Evolution de la visibilité sur les 6 derniers mois. Croissance organique stable.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="bg-white rounded-xl p-6 md:p-8 border border-[#e8e8e8] shadow-sm">
                                            <h3 className="flex items-center gap-3 text-base md:text-lg font-black text-[#111] uppercase tracking-widest mb-8">
                                                <Users size={20} className="text-[#E31E24]" /> {t("producer_profile.performance.partners")}
                                            </h3>
                                            <div className="space-y-4">
                                                {partners.map(p => (
                                                    <div key={p.id} className="flex justify-between items-center bg-gray-50 p-6 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-[#050B18] text-white rounded-xl flex items-center justify-center font-black text-sm">
                                                                {p.initial}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-sm text-[#111]">{p.name}</h4>
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{p.type}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase text-red-600 bg-red-50 px-4 py-2 rounded-full border border-red-100">
                                                            {p.status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl p-6 md:p-8 border border-[#e8e8e8] shadow-sm">
                                            <h3 className="flex items-center gap-3 text-base md:text-lg font-black text-[#111] uppercase tracking-widest mb-8">
                                                <Activity size={20} className="text-[#E31E24]" /> {t("producer_profile.performance.activity")}
                                            </h3>
                                            <div className="space-y-6">
                                                {activityLedger.map(a => {
                                                    const Icon = a.icon;
                                                    return (
                                                        <div key={a.id} className="flex items-center gap-5 p-2 rounded-2xl hover:bg-gray-50 transition-colors">
                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${a.bg} ${a.color}`}>
                                                                <Icon size={20} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-bold text-sm text-[#111]">{a.title}</h4>
                                                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{a.time}</span>
                                                            </div>
                                                            <div className="text-gray-300">
                                                                <ChevronRight size={16} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* International Markets (Refined Grid) */}
                                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 relative overflow-hidden mt-8">
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-10">
                                                <h3 className="flex items-center gap-3 text-base md:text-lg font-black text-[#111] uppercase tracking-widest">
                                                    <Globe size={20} className="text-[#E31E24]" /> {t("producer_profile.performance.markets")}
                                                </h3>
                                                <div className="px-4 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-100">
                                                    {t("producer_profile.performance.global_coverage")}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                                {(Array.isArray(producer.target_markets) ? producer.target_markets : ["Afrique", "Europe", "Moyen-Orient", "Amérique"]).map((m, i) => {
                                                    const marketName = typeof m === 'object' ? (m.label || m.value || m.name || JSON.stringify(m)) : m;
                                                    // Robust matching
                                                    const normalizedKey = Object.keys(marketImages).find(key =>
                                                        marketName.toLowerCase().includes(key.toLowerCase())
                                                    ) || "Europe";

                                                    const marketImage = marketImages[normalizedKey];

                                                    return (
                                                        <motion.div
                                                            key={i}
                                                            whileHover={{ y: -8 }}
                                                            className="group relative h-64 rounded-[2.5rem] overflow-hidden cursor-pointer bg-black border border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500"
                                                        >
                                                            {/* Image Background with intentional overlay for text contrast */}
                                                            <div className="absolute inset-0">
                                                                <img
                                                                    src={marketImage}
                                                                    alt={marketName}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
                                                                />
                                                                {/* Dark gradient for the "Look" - big white text on image */}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                                            </div>

                                                            {/* Content - Simple Big White Text */}
                                                            <div className="absolute inset-0 flex flex-col justify-end p-8 pb-10">
                                                                <div className="transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                                                    <h4 className="text-3xl font-black text-white tracking-tighter uppercase drop-shadow-2xl">
                                                                        {marketName}
                                                                    </h4>
                                                                </div>

                                                                {/* Minimalist interactive indicator */}
                                                                <div className="w-12 h-1 bg-red-600 rounded-full mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                                            </div>

                                                            {/* Clean corner arrow */}
                                                            <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                                <ArrowUpRight className="text-white" size={18} />
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "documents" && (
                                <div className="bg-white rounded-xl shadow-sm border border-[#e8e8e8] p-10">
                                    <h3 className="text-xl font-black mb-8 flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText size={24} /></div>
                                        {t("producer_profile.documents.title")}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {(producer.tech_files?.length > 0 || products.some(p => p.fiche_tech || p.fiche_tech_url || p.tech_sheet || p.catalogue || p.catalogue_url || p.catalog || p.catalog_url || p.file_catalogue || p.catalog_file)) ? (
                                            <>
                                                {/* Profile Level Documents */}
                                                {producer.tech_files?.map((file, i) => (
                                                    <div key={`tech-file-${i}`} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-3 bg-white text-blue-500 rounded-lg shadow-sm font-bold"><FileText size={24} /></div>
                                                            <div>
                                                                <h5 className="font-bold text-[#111]">{file.name || "Document de l'entreprise"}</h5>
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Fiche / Catalogue Global</p>
                                                            </div>
                                                        </div>
                                                        <a
                                                            href={file.url || file}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-gray-300 group-hover:text-blue-600 transition-colors"
                                                        >
                                                            <Download size={20} />
                                                        </a>
                                                    </div>
                                                ))}

                                                {/* Product Level Documents */}
                                                {products.map((product) => (
                                                    <React.Fragment key={`prod-docs-${product.id}`}>
                                                        {(product.fiche_tech || product.fiche_tech_url || product.tech_sheet) && (
                                                            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all group">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="p-3 bg-white text-blue-400 rounded-lg shadow-sm font-bold"><FileText size={24} /></div>
                                                                    <div>
                                                                        <h5 className="font-bold text-[#111]">Fiche : {product.name}</h5>
                                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Spécification Produit</p>
                                                                    </div>
                                                                </div>
                                                                <a
                                                                    href={product.fiche_tech_url || product.fiche_tech || product.tech_sheet}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-gray-300 group-hover:text-blue-600 transition-colors"
                                                                >
                                                                    <Download size={20} />
                                                                </a>
                                                            </div>
                                                        )}
                                                        {(product.catalogue || product.catalogue_url || product.catalog || product.catalog_url || product.file_catalogue || product.catalog_file) && (
                                                            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all group">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="p-3 bg-white text-indigo-500 rounded-lg shadow-sm font-bold"><FileText size={24} /></div>
                                                                    <div>
                                                                        <h5 className="font-bold text-[#111]">Catalogue : {product.name}</h5>
                                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Catalogue Produit</p>
                                                                    </div>
                                                                </div>
                                                                <a
                                                                    href={product.catalogue_url || product.catalogue || product.catalog_url || product.catalog || product.file_catalogue || product.catalog_file}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-gray-300 group-hover:text-blue-600 transition-colors"
                                                                >
                                                                    <Download size={20} />
                                                                </a>
                                                            </div>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="col-span-full py-20 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-300">
                                                <FileText size={48} className="mb-4" />
                                                <p className="font-bold">{t("producer_profile.documents.no_docs")}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "logistics" && (
                                <div className="bg-white rounded-xl shadow-sm border border-[#e8e8e8] p-10">
                                    <h3 className="text-xl font-black mb-8 flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package size={24} /></div>
                                        {t("producer_profile.logistics.title")}
                                    </h3>
                                    <div className="flex flex-col gap-10">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-6 bg-blue-50/30 rounded-2xl border border-blue-100">
                                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2">{t("producer_profile.logistics.lead_time")}</p>
                                                <p className="text-2xl font-black text-blue-600">{producer.lead_time || "—"}</p>
                                            </div>
                                            <div className="p-6 bg-blue-50/30 rounded-2xl border border-blue-100">
                                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2">{t("producer_profile.logistics.moq")}</p>
                                                <p className="text-2xl font-black text-blue-600">{producer.min_export_quantity || "—"}</p>
                                            </div>
                                            <div className="p-6 bg-blue-50/30 rounded-2xl border border-blue-100">
                                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2">{t("producer_profile.logistics.incoterms")}</p>
                                                <p className="text-xl font-black text-blue-600">
                                                    {Array.isArray(producer.incoterms) && producer.incoterms.length > 0
                                                        ? producer.incoterms.join(", ")
                                                        : "—"}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-gray-400">{t("producer_profile.logistics.points")}</h4>
                                            <div className="space-y-4">
                                                {Array.isArray(producer.logistics_details) && producer.logistics_details.length > 0 ? (
                                                    producer.logistics_details.map((line, i) => (
                                                        <div key={i} className="flex items-center gap-4 text-sm font-semibold text-[#444]">
                                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                            {line}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-400 italic">{t("producer_profile.logistics.no_info")}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence >
                </div >
            </main >

            {/* MESSAGING MODAL */}
            < AnimatePresence >
                {showMessaging && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setShowMessaging(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative bg-white w-full max-w-xl rounded-[2rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] z-10"
                        >
                            <div className="bg-[#E31E24] p-10 text-white flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl md:text-3xl font-black uppercase tracking-tight">{t("producer_profile.messaging.title")}</h3>
                                    <p className="text-sm font-bold text-white/60 mt-1 uppercase tracking-widest">
                                        {t("to") || "À"}: {producer.first_name || producer.last_name
                                            ? `${producer.first_name || ""} ${producer.last_name || ""}`.trim()
                                            : producer.company_name || producer.name}
                                    </p>
                                </div>
                                <button onClick={() => setShowMessaging(false)} className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <form
                                className="p-10 space-y-8"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!user) {
                                        toast.error(t("auth.login_required") || "Veuillez vous connecter pour envoyer un message.");
                                        navigate('/login');
                                        return;
                                    }

                                    const targetReceiver = producer.user_id || producer.user;
                                    console.log("[DEBUG] Sending message to:", targetReceiver);

                                    if (!targetReceiver) {
                                        toast.error(t("errors.receiver_missing") || "Impossible d'identifier le destinataire.");
                                        return;
                                    }

                                    setIsSending(true);
                                    try {
                                        const fullMessage = messageSubject
                                            ? `[${messageSubject}] ${messageContent}`
                                            : messageContent;

                                        await createMessage({
                                            receiver: targetReceiver,
                                            content: fullMessage
                                        });

                                        // ✅ NEW: Create an Estimate so it appears in "Mes Demandes"
                                        try {
                                            await createEstimate({
                                                producer: targetReceiver,
                                                comment: fullMessage,
                                                products: [] // General inquiry, no specific product
                                            });
                                            console.log("Estimate created successfully");
                                        } catch (estErr) {
                                            // We log but don't block the UI if estimate creation fails (e.g. role restriction)
                                            console.warn("Estimate creation failed (likely role-based):", estErr);
                                        }

                                        toast.success(t("producer_profile.messaging.success"));
                                        setShowMessaging(false);
                                        setMessageContent("");
                                        setMessageSubject("");
                                    } catch (err) {
                                        console.error("Messaging Error:", err);
                                        toast.error(`${t("errors.send_failed") || "Erreur lors de l'envoi du message"}: ${err.response?.data?.error || err.message}`);
                                    } finally {
                                        setIsSending(false);
                                    }
                                }}
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#111] uppercase tracking-[0.2em] pl-2">{t("your_name") || "Votre Nom"}</label>
                                    <div className="w-full bg-gray-100 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-gray-500 outline-none">
                                        {user?.first_name || user?.last_name
                                            ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                                            : user?.email || (t("auth.login_to_continue") || "Connectez-vous pour continuer")}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#111] uppercase tracking-[0.2em] pl-2">{t("producer_profile.messaging.subject")}</label>
                                    <input
                                        type="text"
                                        required
                                        value={messageSubject}
                                        onChange={(e) => setMessageSubject(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#111] outline-none focus:border-[#E31E24] transition-all"
                                        placeholder={t("producer_profile.messaging.subject_placeholder") || "Demande de cotation / Partenariat"}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#111] uppercase tracking-[0.2em] pl-2">{t("producer_profile.messaging.message")}</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#111] outline-none focus:border-[#E31E24] transition-all resize-none"
                                        placeholder={t("producer_profile.messaging.message_placeholder") || "Décrivez votre demande détaillée..."}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className={`w-full py-5 ${isSending ? 'bg-gray-400 cursor-wait' : 'bg-[#E31E24] hover:bg-black'} text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-4`}
                                >
                                    {isSending ? t("producer_profile.messaging.sending") : t("producer_profile.messaging.send")} <Send size={20} />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >

            <ProductModal
                isOpen={isIdOpen}
                onClose={() => setIsIdOpen(false)}
                product={selectedProduct}
                categoryName={selectedProduct?.category_name}
            />

            {/* FOOTER MINI (Behance Style) */}
            <footer className="bg-white border-t border-[#e8e8e8] py-8 px-6">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center text-gray-400 text-[10px] font-black uppercase tracking-widest gap-4">
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        <span>{t("footer.more_kleer") || "Plus de Kleer Infini"}</span>
                        <span>{t("footer.links.privacy")}</span>
                        <span>{t("footer.links.terms")}</span>
                    </div>
                    <div>
                        © 2026 KLEER INFINI INTERNATIONAL. {t("footer.copyright_rights") || "TOUS DROITS RÉSERVÉS."}
                    </div>
                </div>
            </footer>
        </div >
    );
};

export default ProducerProfile2;
