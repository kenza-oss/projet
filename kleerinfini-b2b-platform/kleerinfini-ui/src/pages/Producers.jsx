import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getProfiles } from '../api/profiles';
import { Link } from 'react-router-dom';
import { MapPin, CheckCircle, Search, Filter, Globe, ChevronRight, X, Layers, Navigation, Phone, Mail, Heart, Star, Eye } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, UserPlus } from 'lucide-react';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Red Marker
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const REGION_COORDINATES = {
    'Alger': [36.7528, 3.0420],
    'Oran': [35.6971, -0.6308],
    'Constantine': [36.3650, 6.6147],
    'Annaba': [36.9009, 7.7669],
    'Sétif': [36.1868, 5.4034],
    'Blida': [36.4715, 2.8259],
    'Tlemcen': [34.8790, -1.3157],
    'Ghardaïa': [32.4909, 3.6735],
    'Biskra': [34.8504, 5.7280],
    'default': [36.7528, 3.0420]
};

const MapController = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, { duration: 2 });
        }
    }, [center, zoom, map]);
    return null;
};

const Producers = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [producers, setProducers] = useState([]);
    const [filteredProducers, setFilteredProducers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [regions, setRegions] = useState([]);
    const [mapCenter, setMapCenter] = useState([36.7528, 3.0420]);
    const [zoomLevel, setZoomLevel] = useState(6);
    const [selectedProducerId, setSelectedProducerId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        const fetchProducers = async () => {
            try {
                const data = await getProfiles();
                console.log("[DEBUG] Producers from Backend:", data);

                if (!data || data.length === 0) {
                    setProducers([]);
                    setFilteredProducers([]);
                    setLoading(false);
                    return;
                }

                const augmentedData = data.map(p => {
                    const region = p.city || p.location || 'Alger';
                    const baseCoords = REGION_COORDINATES[region] || REGION_COORDINATES['default'];

                    // Standardize coordinate fields from backend (latitude/longitude)
                    let lat = parseFloat(p.latitude);
                    let lng = parseFloat(p.longitude);

                    // If coordinates are missing or invalid (0,0), use base coords + jitter
                    if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
                        lat = baseCoords[0];
                        lng = baseCoords[1];
                        const jitter = 0.02;
                        lat += (Math.random() - 0.5) * jitter;
                        lng += (Math.random() - 0.5) * jitter;
                    }

                    return {
                        ...p,
                        lat,
                        lng,
                        // Engagement metrics (Random for UI feel if not in DB)
                        likes: p.likes || Math.floor(Math.random() * 500) + 100,
                        rating: p.rating || (Math.random() * 1.5 + 3.5).toFixed(1),
                        views: p.views || Math.floor(Math.random() * 5000) + 1000,
                        // Ensure all items have details
                        address: p.address || t("home.map.no_address", "Adresse non spécifiée"),
                        phone: p.phone || "+213 000 000 000",
                        website: p.website || "www.kleer-infini.com",
                        name: p.company_name || p.name || t("home.map.fallback_name", "Entreprise"),
                        cover_image: p.cover_image || p.image || null
                    };
                });

                setProducers(augmentedData);
                setFilteredProducers(augmentedData);
                const uniqueRegions = [...new Set(data.map(p => p.city || p.location).filter(Boolean))];
                setRegions(uniqueRegions);
            } catch (err) {
                console.error("❌ Failed to load producers", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducers();
    }, []);

    useEffect(() => {
        let result = producers;
        if (selectedRegion) {
            result = result.filter(p => (p.city || p.location || '').toLowerCase().includes(selectedRegion.toLowerCase()));
            if (REGION_COORDINATES[selectedRegion]) {
                setMapCenter(REGION_COORDINATES[selectedRegion]);
                setZoomLevel(10);
            }
        }
        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }
        setFilteredProducers(result);
    }, [selectedRegion, searchQuery, producers]);

    const handleProducerClick = (producer) => {
        setSelectedProducerId(producer.id);
        setMapCenter([producer.lat, producer.lng]);
        setZoomLevel(14);
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    if (loading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0A0A0A] text-white">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 lg:w-16 lg:h-16 border-t-2 border-[#e11d48] rounded-full mb-6"
            />
            <p className="tracking-[0.2em] font-light text-slate-400 animate-pulse text-[10px] lg:text-base">{t("home.map.loading", "KLEER INFINI MAPPING...")}</p>
        </div>
    );

    return (
        <div className="relative min-h-screen bg-black flex flex-col overflow-x-hidden pt-14">
            <Header theme="dark" />

            <div className="flex-1 relative min-h-[600px] h-[80vh] w-full overflow-hidden">
                {/* Full Screen Map */}
                <div className="absolute inset-0 z-0">
                    <MapContainer
                        center={mapCenter}
                        zoom={zoomLevel}
                        style={{ height: "100%", width: "100%" }}
                        zoomControl={false}
                    >
                        <MapController center={mapCenter} zoom={zoomLevel} />
                        <TileLayer
                            attribution='&copy; CARTO'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                        {filteredProducers.map(producer => (
                            <Marker
                                key={producer.id}
                                position={[producer.lat, producer.lng]}
                                icon={redIcon}
                                eventHandlers={{ click: () => handleProducerClick(producer) }}
                            >
                                <Popup className="custom-popup-premium">
                                    <div className="text-center min-w-[240px] overflow-hidden rounded-2xl bg-white">
                                        <div className="w-full h-32 overflow-hidden bg-slate-100 relative group">
                                            {producer.cover_image ? (
                                                <img src={producer.cover_image} alt={producer.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 font-serif text-4xl bg-slate-50 uppercase font-black">
                                                    {producer.name.charAt(0)}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-black text-gray-900 mb-0.5 text-[15px] uppercase tracking-tight leading-tight">{producer.name}</h4>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.1em] mb-4">{producer.city || "Algérie"}</p>

                                            <div className="flex items-center justify-center gap-5 mb-5 bg-slate-50 py-3 rounded-2xl border border-slate-100 shadow-inner">
                                                <div className="flex items-center gap-2 px-1">
                                                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-50" />
                                                    <span className="text-[11px] font-black text-slate-800 tracking-tight">{producer.likes}</span>
                                                </div>
                                                <div className="w-px h-3 bg-slate-200"></div>
                                                <div className="flex items-center gap-2 px-1">
                                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                    <span className="text-[11px] font-black text-slate-800 tracking-tight">{producer.rating}</span>
                                                </div>
                                                <div className="w-px h-3 bg-slate-200"></div>
                                                <div className="flex items-center gap-2 px-1">
                                                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                                                    <span className="text-[11px] font-black text-slate-800 tracking-tight">{producer.views}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (isAuthenticated) {
                                                    navigate(`/producer/${producer.id}`);
                                                } else {
                                                    setShowAuthModal(true);
                                                }
                                            }}
                                            className="block w-full py-2.5 bg-[#e11d48] text-white text-[11px] font-black rounded-xl hover:bg-[#be123c] transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest shadow-lg shadow-rose-500/20 text-center"
                                        >
                                            {t("home.map.view_profile", "Voir le profil")}
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                        <ZoomControl position="bottomright" />
                    </MapContainer>
                </div>

                {/* Glassmorphic Floating Sidebar */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ x: -400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -400, opacity: 0 }}
                            className="absolute top-0 left-0 right-0 bottom-0 md:top-6 md:left-6 md:bottom-6 md:w-[420px] bg-[#0f0f0f]/90 md:bg-[#0f0f0f]/80 backdrop-blur-2xl border-b md:border border-white/15 md:rounded-3xl z-40 flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto"
                        >
                            {/* Sidebar Header */}
                            <div className="p-5 md:p-8 pb-4">
                                <div className="flex items-center justify-between mb-4 md:mb-8">
                                    <h1 className="text-xl md:text-2xl font-bold font-serif text-white tracking-tight">{t("home.map.title", "Producteurs")}</h1>
                                    <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <X size={20} className="text-slate-400" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#e11d48] transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder={t("home.map.placeholder", "Rechercher par nom...")}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 md:py-3.5 pl-11 md:pl-12 pr-4 text-xs md:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#e11d48]/50 transition-all shadow-inner"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2">
                                        <button
                                            onClick={() => setSelectedRegion('')}
                                            className={`px-4 md:px-5 py-2 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${selectedRegion === '' ? 'bg-[#e11d48] text-white shadow-[0_0_15px_rgba(242,92,5,0.4)]' : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'}`}
                                        >
                                            {t("home.map.all", "Tous")}
                                        </button>
                                        {regions.map(r => (
                                            <button
                                                key={r}
                                                onClick={() => setSelectedRegion(r)}
                                                className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${selectedRegion === r ? 'bg-[#e11d48] text-white shadow-[0_0_15px_rgba(242,92,5,0.4)]' : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'}`}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Producer List */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
                                {filteredProducers.length > 0 ? (
                                    filteredProducers.map(p => (
                                        <motion.div
                                            key={p.id}
                                            onClick={() => handleProducerClick(p)}
                                            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                                            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-4 ${selectedProducerId === p.id ? 'bg-white/20 border-[#e11d48]/80 shadow-2xl' : 'bg-white/[0.08] border-white/10 hover:border-white/20'}`}
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-20 h-20 rounded-xl bg-black/40 overflow-hidden flex-shrink-0 border border-white/10 shadow-lg">
                                                    {p.cover_image ? (
                                                        <img src={p.cover_image} alt={p.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300 font-serif text-2xl bg-slate-800 uppercase">
                                                            {p.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-start pt-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (isAuthenticated) {
                                                                    navigate(`/producer/${p.id}`);
                                                                } else {
                                                                    setShowAuthModal(true);
                                                                }
                                                            }}
                                                            className="hover:underline text-left"
                                                        >
                                                            <h3 className="text-white font-bold text-lg tracking-tight leading-tight uppercase">
                                                                {p.name}
                                                            </h3>
                                                        </button>
                                                        {p.verified && <CheckCircle className="text-[#e11d48] w-4 h-4 flex-shrink-0 ml-2" />}
                                                    </div>



                                                    <div className="space-y-1.5 border-t border-white/10 pt-3">
                                                        <div className="flex items-start text-slate-200 text-[11px] leading-snug">
                                                            <MapPin className="w-3.5 h-3.5 mr-2 mt-0.5 text-[#e11d48] flex-shrink-0" />
                                                            <span>{p.address || p.location || t("home.map.no_address", "Adresse non spécifiée")}</span>
                                                        </div>

                                                        {p.phone && (
                                                            <div className="flex items-center text-[11px] font-medium transition-colors">
                                                                <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                                                <a href={`tel:${p.phone}`} className="text-white hover:text-[#e11d48] transition-colors">{p.phone}</a>
                                                            </div>
                                                        )}

                                                        {p.website && (
                                                            <div className="flex items-center text-[11px] font-medium transition-colors">
                                                                <Globe className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                                                <a href={p.website.startsWith('http') ? p.website : `https://${p.website}`} target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
                                                                    {p.website.replace(/^https?:\/\//, '')}
                                                                </a>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center text-slate-200 text-[11px]">
                                                            <Globe className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                                            <span className="flex items-center gap-1.5">{t("home.map.country", "Algérie")} <span className="text-sm">🇩🇿</span></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-20">
                                        <p className="text-slate-500 text-xs italic">{t("home.map.no_results", "Aucun producteur trouvé...")}</p>
                                    </div>
                                )}
                            </div>

                            {/* List Footer */}
                            <div className="p-6 bg-black/20 border-t border-white/5 text-center">
                                <p className="text-[9px] md:text-[10px] text-slate-500 tracking-[0.2em] uppercase">
                                    {filteredProducers.length} {t("home.map.certified_count", "ÉTABLISSEMENTS CERTIFIÉS")}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sidebar Toggle Button (if closed) */}
                {!sidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="absolute top-6 left-6 z-30 bg-black/80 backdrop-blur-lg border border-white/10 p-4 rounded-2xl text-white shadow-2xl hover:bg-black transition-all"
                    >
                        <Navigation size={20} className="text-[#e11d48]" />
                    </button>
                )}

                {/* Information Badge */}
                <div className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl shadow-2xl border border-white/20 hidden md:block max-w-[200px]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-800 tracking-[0.1em] uppercase">{t("home.map.live_network", "Réseau Live")}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed italic">
                        {t("home.map.explore_desc", "Explorez l'excellence B2B algérienne par géo-localisation.")}
                    </p>
                </div>
            </div>

            <Footer />

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(242, 92, 5, 0.3);
                }
                .leaflet-container {
                    background: #f0f0f0 !important;
                }
                .custom-popup-premium .leaflet-popup-content-wrapper {
                    background: white;
                    border-radius: 20px;
                    padding: 4px;
                    box-shadow: 0 15px 50px rgba(0,0,0,0.15) !important;
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .custom-popup-premium .leaflet-popup-tip {
                    background: white;
                }
                .custom-popup-premium .leaflet-popup-content {
                    margin: 12px;
                }
            `}</style>
        </div>
    );
};

export default Producers;
