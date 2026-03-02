import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowUpRight, Globe2, Building2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

import eventBg1 from "../assets/event-bg-1.png";
import eventBg2 from "../assets/event-bg-2.png";
import eventBg3 from "../assets/event-bg-3.png";
import eventBg4 from "../assets/event-bg-4.png";
import eventBg5 from "../assets/event-bg-5.png";
import eventBg6 from "../assets/event-bg-6.png";
import eventBg7 from "../assets/event-bg-7.png";
import eventBgLuxuryGold from "../assets/event-bg-luxury-gold.png";

// Helper to get country code for flagcdn
const getCountryCode = (location) => {
    if (!location) return "";
    const loc = location.toLowerCase();

    // Map common locations to ISO 2-letter codes
    const map = {
        // Africa
        "algérie": "dz", "alger": "dz", "algeria": "dz", "oran": "dz", "constantine": "dz",
        "morocco": "ma", "maroc": "ma", "casablanca": "ma", "rabat": "ma", "marrakech": "ma",
        "tunisia": "tn", "tunisie": "tn", "tunis": "tn",
        "egypt": "eg", "egypte": "eg", "cairo": "eg", "le caire": "eg",
        "south africa": "za", "afrique du sud": "za", "johannesburg": "za", "cape town": "za",
        "senegal": "sn", "sénégal": "sn", "dakar": "sn",
        "ivory coast": "ci", "cote d'ivoire": "ci", "abidjan": "ci",
        "nigeria": "ng", "lagos": "ng",
        "kenya": "ke", "nairobi": "ke",

        // Middle East
        "uae": "ae", "dubaï": "ae", "dubai": "ae", "united arab emirates": "ae", "abu dhabi": "ae",
        "saudi": "sa", "arabie": "sa", "riyadh": "sa", "jeddah": "sa", "ryad": "sa",
        "qatar": "qa", "doha": "qa",
        "turkey": "tr", "turquie": "tr", "istanbul": "tr", "antalya": "tr",
        "kuwait": "kw", "koweit": "kw",
        "bahrain": "bh", "bahreïn": "bh",
        "oman": "om",

        // Europe
        "france": "fr", "paris": "fr", "lyon": "fr", "marseille": "fr", "bordeaux": "fr",
        "germany": "de", "allemagne": "de", "berlin": "de", "hannover": "de", "hanovre": "de", "munich": "de", "frankfurt": "de", "francfort": "de", "cologne": "de", "dusseldorf": "de", "düsseldorf": "de", "nuremberg": "de", "hamburg": "de",
        "italy": "it", "italie": "it", "rome": "it", "milan": "it", "milano": "it", "bologna": "it", "bologne": "it", "verona": "it", "rimini": "it", "turin": "it",
        "spain": "es", "espagne": "es", "madrid": "es", "barcelona": "es", "barcelone": "es", "valencia": "es",
        "uk": "gb", "united kingdom": "gb", "royaume-uni": "gb", "london": "gb", "londres": "gb", "birmingham": "gb",
        "netherlands": "nl", "pays-bas": "nl", "amsterdam": "nl", "rotterdam": "nl", "utrecht": "nl",
        "belgium": "be", "belgique": "be", "brussels": "be", "bruxelles": "be",
        "switzerland": "ch", "suisse": "ch", "geneva": "ch", "genève": "ch", "basel": "ch", "bâle": "ch", "zurich": "ch",
        "austria": "at", "autriche": "at", "vienna": "at", "vienne": "at",
        "poland": "pl", "pologne": "pl", "warsaw": "pl", "varsovie": "pl",
        "russia": "ru", "russie": "ru", "moscow": "ru", "moscou": "ru",
        "portugal": "pt", "lisbon": "pt", "lisbonne": "pt",
        "sweden": "se", "suède": "se", "stockholm": "se",
        "norway": "no", "norvège": "no", "oslo": "no",
        "denmark": "dk", "danemark": "dk", "copenhagen": "dk", "copenhague": "dk",
        "finland": "fi", "finlande": "fi", "helsinki": "fi",
        "greece": "gr", "grèce": "gr", "athens": "gr", "athènes": "gr",

        // Americas
        "usa": "us", "united states": "us", "etats-unis": "us", "las vegas": "us", "chicago": "us", "new york": "us", "atlanta": "us", "houston": "us", "miami": "us", "orlando": "us",
        "canada": "ca", "toronto": "ca", "montreal": "ca", "vancouver": "ca",
        "brazil": "br", "brésil": "br", "sao paulo": "br", "rio": "br",
        "mexico": "mx", "mexique": "mx",

        // Asia
        "china": "cn", "chine": "cn", "shanghai": "cn", "beijing": "cn", "pékin": "cn", "guangzhou": "cn", "canton": "cn", "shenzhen": "cn", "hong kong": "hk",
        "japan": "jp", "japon": "jp", "tokyo": "jp", "osaka": "jp",
        "korea": "kr", "corée": "kr", "seoul": "kr", "séoul": "kr", "south korea": "kr",
        "india": "in", "inde": "in", "new delhi": "in", "mumbai": "in", "bangalore": "in",
        "singapore": "sg", "singapour": "sg",
        "thailand": "th", "thaïlande": "th", "bangkok": "th",
        "vietnam": "vn", "hanoi": "vn", "ho chi minh": "vn",
        "indonesia": "id", "indonésie": "id", "jakarta": "id",
        "malaysia": "my", "malaisie": "my", "kuala lumpur": "my",
        "taiwan": "tw", "taipei": "tw",

        // Oceania
        "australia": "au", "australie": "au", "sydney": "au", "melbourne": "au"
    };

    // Check direct matches
    for (const [key, code] of Object.entries(map)) {
        if (loc.includes(key)) return code;
    }

    return ""; // Fallback no flag
};

// Helper to clean duplicated text
const cleanText = (text) => {
    if (!text) return "";

    // 1. Fix "WordThe" or "ALGERIAThe" -> "Word The"
    // Heuristic: Lowercase followed by Uppercase (handled by cleanLocation usually, but good here too)
    // AND Uppercase followed by "The" or similar common starts
    let cleaned = text.replace(/([a-z])([A-Z])/g, "$1 $2"); // camelCase split
    cleaned = cleaned.replace(/([A-Z])(The)/g, "$1 $2"); // "ALGERIAThe" -> "ALGERIA The"

    // 2. Check for exact case-insensitive duplication
    const len = cleaned.length;
    const half = Math.floor(len / 2);

    // Try split at exactly half, or with off-by-one for spaces
    for (let i = Math.max(2, half - 1); i <= half + 1; i++) {
        const first = cleaned.slice(0, i).trim();
        const second = cleaned.slice(i).trim();
        if (first.toLowerCase() === second.toLowerCase() && first.length > 2) {
            return first;
        }
    }

    return cleaned.replace(/([A-Z][a-z]+)\1/g, "$1");
};

const cleanLocation = (loc) => {
    if (!loc) return "";
    // Fix "AlgiersPalais..." -> "Algiers, Palais..."
    // This is a naive heuristic but effective for the screenshot issue
    return loc.replace(/([a-z])([A-Z])/g, "$1, $2");
};

// Heuristic to prevent "Title contains full description"
// If title is > 100 chars, it's probably junk data. Truncate it.
const truncateTitle = (text) => {
    if (!text) return "";
    const clean = cleanText(text);
    if (clean.length > 60) {
        return clean.substring(0, 60) + "...";
    }
    return clean;
}

export default function EventsSection() {
    const { t } = useTranslation();
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Fallback static events
    const fallbackEvents = [
        {
            id: 1,
            name: t("home.events.fallback.gulfood.name"),
            location: t("home.events.fallback.gulfood.location"),
            date: t("home.events.fallback.gulfood.date"),
            dateStart: new Date("2026-01-26"),
            sector: t("home.events.event_default"),
            event_type: "international",
            description: t("home.events.fallback.gulfood.desc"),
            url: "https://www.gulfood.com",
            color: "from-[#D4AF37] to-[#B8860B]",
        },
        {
            id: 2,
            name: t("home.events.fallback.agropack.name"),
            location: t("home.events.fallback.agropack.location"),
            date: t("home.events.fallback.agropack.date"),
            dateStart: new Date("2026-02-02"),
            sector: t("home.events.event_default"),
            event_type: "national",
            description: t("home.events.fallback.agropack.desc"),
            url: "https://agropack-expo.com",
            color: "from-[#FF6600] to-[#8B4513]",
        },
        {
            id: 3,
            name: t("home.events.fallback.paris.name"),
            location: t("home.events.fallback.paris.location"),
            date: t("home.events.fallback.paris.date"),
            dateStart: new Date("2026-02-21"),
            sector: t("home.events.event_default"),
            event_type: "international",
            description: t("home.events.fallback.paris.desc"),
            url: "#",
            color: "from-[#D4AF37] to-[#B8860B]",
        },
        {
            id: 4,
            name: t("home.events.fallback.itb.name"),
            location: t("home.events.fallback.itb.location"),
            date: t("home.events.fallback.itb.date"),
            dateStart: new Date("2026-03-03"),
            sector: t("home.events.event_default"),
            event_type: "international",
            description: t("home.events.fallback.itb.desc"),
            url: "#",
            color: "from-[#D4AF37] to-[#B8860B]",
        },
        {
            id: 5,
            name: t("home.events.fallback.hannover.name"),
            location: t("home.events.fallback.hannover.location"),
            date: t("home.events.fallback.hannover.date"),
            dateStart: new Date("2026-04-20"),
            sector: t("home.events.event_default"),
            event_type: "international",
            description: t("home.events.fallback.hannover.desc"),
            url: "#",
            color: "from-[#D4AF37] to-[#B8860B]",
        },
        {
            id: 6,
            name: t("home.events.fallback.djazagro.name"),
            location: t("home.events.fallback.djazagro.location"),
            date: t("home.events.fallback.djazagro.date"),
            dateStart: new Date("2026-04-12"),
            sector: t("home.events.event_default"),
            event_type: "national",
            description: t("home.events.fallback.djazagro.desc"),
            url: "#",
            color: "from-[#FF6600] to-[#8B4513]",
        }
    ];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await api.get('events/upcoming/');
                const apiEvents = response.data;
                if (apiEvents && apiEvents.length > 0) {
                    const IMAGE_POOLS = {
                        agro: [
                            'https://images.unsplash.com/photo-1595841696662-5083f2dc70a9?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1606759234544-77038e9324d7?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1495570683141-ed314debc81c?auto=format&fit=crop&q=80&w=1920'
                        ],
                        food: [
                            'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1590650516781-ef0718608889?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1547514701-a20c3293e506?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1920'
                        ],
                        tech: [
                            'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1540575861501-7ad058df3283?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1519389950477-d8621420757a?auto=format&fit=crop&q=80&w=1920'
                        ],
                        medical: [
                            'https://images.unsplash.com/photo-1505751172107-162b714856f7?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1576602976047-174e57a43851?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=1920'
                        ],
                        pharma: [
                            'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1584017945513-149f7ce00523?auto=format&fit=crop&q=80&w=1920'
                        ],
                        hvac: [
                            'https://images.unsplash.com/photo-1601050638949-364440058b3a?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=1920'
                        ],
                        industry: [
                            'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1581091226823-bc9733748373?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1513824013511-30612649af24?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1920'
                        ],
                        energy: [
                            'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=1920'
                        ],
                        construction: [
                            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1503387762223-264b1d748f3c?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1590486803833-ffc5d1050595?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1517089596392-db9a5bc655c6?auto=format&fit=crop&q=80&w=1920'
                        ],
                        office: [
                            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920',
                            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1920'
                        ]
                    };

                    const getRelevantImage = (name, id) => {
                        const n = name.toLowerCase();
                        const pick = (pool) => pool[id % pool.length];

                        // Precise Keyword Matching
                        if (n.includes('pharma') || n.includes('siphal') || n.includes('medicam')) return pick(IMAGE_POOLS.pharma);
                        if (n.includes('clima') || n.includes('hvac') || n.includes('best5')) return pick(IMAGE_POOLS.hvac);
                        if (n.includes('build') || n.includes('construct') || n.includes('archit')) return pick(IMAGE_POOLS.construction);
                        if (n.includes('agro') || n.includes('food') || n.includes('alimen')) return pick(IMAGE_POOLS.agro);
                        if (n.includes('tech') || n.includes('digital') || n.includes(' it ')) return pick(IMAGE_POOLS.tech);
                        if (n.includes('energy') || n.includes('naepec') || n.includes('power')) return pick(IMAGE_POOLS.energy);
                        if (n.includes('furniture') || n.includes('office') || n.includes('decor')) return pick(IMAGE_POOLS.office);
                        if (n.includes('travel') || n.includes('tourism') || n.includes('hotel')) return pick(IMAGE_POOLS.industry); // Generic fallback

                        return pick(IMAGE_POOLS.industry);
                    };

                    const transformedEvents = apiEvents.map((event, idx) => ({
                        ...event,
                        type: event.event_type,
                        dateStart: new Date(event.dateStart || event.start_date),
                        image: event.image_url || event.image || getRelevantImage(event.name, event.id || idx)
                    }));
                    setEvents(transformedEvents);
                } else {
                    console.warn('API returned empty list, using fallback data');
                    setEvents(fallbackEvents);
                }
            } catch (err) {
                console.warn('API not available, using fallback data');
                setEvents(fallbackEvents);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const getImgForEvent = (index) => {
        const pool = [eventBg1, eventBg2, eventBg3, eventBg4, eventBg5, eventBg6, eventBg7];
        if (index === 0) return eventBgLuxuryGold; // First one is Luxury
        return pool[index % pool.length];
    };

    const getDaysUntil = (date) => {
        if (!date) return 0;
        const today = new Date();
        const eventDate = new Date(date);
        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const filteredEvents = events
        .filter(event => selectedFilter === "all" || (event.type || event.event_type) === selectedFilter)
        .filter(event => getDaysUntil(event.dateStart) >= 0);

    // Reset index when filter changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [selectedFilter]);

    // Auto-advance slideshow
    useEffect(() => {
        if (filteredEvents.length <= 1) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 8000);
        return () => clearInterval(interval);
    }, [currentIndex, filteredEvents.length]);

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % filteredEvents.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + filteredEvents.length) % filteredEvents.length);
    };

    const handleImageError = (e) => {
        e.target.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1920';
        e.target.onerror = null;
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 30 : -30,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 30 : -30,
            opacity: 0
        })
    };

    const currentEvent = filteredEvents[currentIndex];

    // Build the flag URL
    const countryCode = currentEvent ? getCountryCode(currentEvent.location) : "";
    const flagUrl = countryCode ? `https://flagcdn.com/w160/${countryCode}.png` : null;

    const filters = [
        { id: "all", label: t("home.events.filters.all"), icon: Globe2 },
        { id: "national", label: t("home.events.filters.national"), icon: Building2 },
        { id: "international", label: t("home.events.filters.international"), icon: Globe2 }
    ];

    return (
        <section className="relative bg-[#FFFAFA] overflow-hidden flex flex-col justify-center py-20">
            {/* Header Section */}
            <div className="relative z-30 flex flex-col items-center mb-10 px-4">
                <div className="flex items-center gap-4 mb-3 opacity-60">
                    <div className="w-8 h-[1px] bg-[#FF6600]"></div>
                    <span className="text-neutral-500 font-medium uppercase tracking-[0.3em] text-[10px]">
                        {t("home.events.agenda")}
                    </span>
                    <div className="w-8 h-[1px] bg-[#FF6600]"></div>
                </div>
                <h2 className="text-2xl md:text-4xl font-serif font-medium text-neutral-900 text-center mb-6 tracking-tight px-2">
                    {t("home.events.title")} <span className="italic text-[#FF6600]">{t("home.events.subtitle")}</span>
                </h2>
                {/* Filters */}
                <div className="flex justify-center gap-3 flex-wrap z-30">
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setSelectedFilter(filter.id)}
                            className={`px-5 py-2 rounded-full text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 ${selectedFilter === filter.id
                                ? "bg-neutral-900 text-white shadow-lg"
                                : "bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-400"
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* View All Events Button */}
                <div className="flex justify-center mt-6">
                    <a
                        href="/djazagro"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#DC2626] text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-[#B91C1C] transition-colors duration-300 shadow-lg"
                    >
                        {t("home.events.view_all")}
                        <ArrowUpRight size={16} />
                    </a>
                </div>
            </div>

            {/* Event Display Area */}
            <div className="relative w-full max-w-6xl mx-auto px-4 md:px-0 min-h-[400px] md:min-h-[450px] flex items-center justify-center">
                {loading ? (
                    <Loader2 className="animate-spin text-[#FF6600]" size={32} />
                ) : filteredEvents.length > 0 ? (
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.4 }
                            }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {/* V3 Professional Card Concept */}
                            <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl bg-neutral-900">

                                {/* Background Image */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <motion.img
                                        src={currentEvent.image}
                                        alt="Event Background"
                                        onError={handleImageError}
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1.05 }}
                                        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                    {/* Professional Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/20 to-transparent"></div>
                                    {/* Subtle Golden Glow Overlay when Luxury Image is shown */}
                                    {getImgForEvent(currentIndex) === eventBgLuxuryGold && (
                                        <div className="absolute inset-0 bg-[#FF6600]/5 mix-blend-overlay"></div>
                                    )}
                                </div>

                                {/* Content Layer */}
                                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">

                                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8 w-full">

                                        {/* Main Text Content */}
                                        <div className="flex-1 space-y-4 md:space-y-6 max-w-2xl w-full">
                                            {/* Luxury Badge - Matching the user's uploaded reference */}
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-[#DC2626] text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm shadow-xl border-l-4 border-white/20">
                                                <span className="flex items-center gap-1.5 line-clamp-1">
                                                    <div className="w-1 h-1 rounded-full bg-white animate-pulse"></div>
                                                    {currentIndex === 0 ? t("home.events.recommended") : (currentEvent.sector || t("home.events.event_default"))}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h1 className="text-xl sm:text-2xl md:text-4xl font-serif font-bold text-white leading-tight drop-shadow-2xl max-w-xl line-clamp-2">
                                                {truncateTitle(currentEvent.name)}
                                            </h1>

                                            {/* Info Grid */}
                                            <div className="flex flex-wrap items-center gap-y-3 gap-x-4 sm:gap-x-8 text-neutral-300">
                                                {/* Location with Flag Helper */}
                                                <div className="flex items-center gap-2 md:gap-3 group/info">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/10 overflow-hidden backdrop-blur-md group-hover/info:scale-110 transition-transform duration-500">
                                                        {flagUrl ? (
                                                            <img src={flagUrl} alt="flag" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Globe2 size={16} className="text-white md:w-[18px] md:h-[18px]" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-[#B85C38] font-bold">{t("home.events.location")}</span>
                                                        <span className="text-xs md:text-sm font-medium text-white line-clamp-1 max-w-[120px] sm:max-w-none">{cleanLocation(currentEvent.location)}</span>
                                                    </div>
                                                </div>

                                                {/* Date */}
                                                <div className="flex items-center gap-2 md:gap-3 group/info">
                                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md group-hover/info:scale-110 transition-transform duration-500">
                                                        <Calendar size={12} className="text-white md:w-[14px] md:h-[14px]" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-[#B85C38] font-bold">{t("home.events.date")}</span>
                                                        <span className="text-xs md:text-sm font-medium text-white">{currentEvent.date}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Desc - truncated */}
                                            <p className="text-xs md:text-sm text-neutral-300 line-clamp-2 md:line-clamp-3 max-w-lg font-light leading-relaxed tracking-wide italic pb-2 md:pb-0">
                                                {currentEvent.description}
                                            </p>
                                        </div>

                                        {/* Right Side: Action + Small Countdown */}
                                        <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-6 shrink-0 w-full md:w-auto justify-between md:justify-end border-t border-white/10 md:border-none pt-4 md:pt-0">

                                            {/* Minimalist Countdown with Glow */}
                                            <div className="flex flex-col items-center justify-center w-20 h-20 md:w-28 md:h-28 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl relative group/timer overflow-hidden shadow-2xl">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-[#B85C38]/20 to-transparent"></div>
                                                <span className="text-2xl md:text-4xl font-bold text-white font-sans tracking-tighter">{getDaysUntil(currentEvent.dateStart)}</span>
                                                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-neutral-400 mt-0 md:mt-1 font-semibold">{t("home.events.days")}</span>
                                                {/* Animated Border */}
                                                <div className="absolute inset-0 rounded-full border border-white/10"></div>
                                            </div>

                                            {/* Gold/Red Premium Button */}
                                            <motion.a
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                href={currentEvent.url || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 md:gap-3 bg-[#DC2626] text-white px-6 py-3.5 md:px-8 md:py-4 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(220,38,38,0.4)] hover:shadow-[0_15px_40px_rgba(220,38,38,0.6)] transition-all duration-300 w-full sm:w-auto flex-1 sm:flex-none"
                                            >
                                                {t("home.events.reserve")}
                                                <ArrowUpRight size={16} />
                                            </motion.a>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className="text-center py-12 text-neutral-400">{t("home.events.none")}</div>
                )}

                {/* Navigation Arrows - Premium Glass Style */}
                {filteredEvents.length > 1 && (
                    <>
                        <button onClick={prevSlide} className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white hover:bg-[#B85C38] transition-all duration-500 z-40 flex items-center justify-center">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextSlide} className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white hover:bg-[#B85C38] transition-all duration-500 z-40 flex items-center justify-center">
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>

            {/* Pagination Dots */}
            {filteredEvents.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {filteredEvents.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setDirection(idx > currentIndex ? 1 : -1);
                                setCurrentIndex(idx);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-[#B85C38]" : "w-1.5 bg-neutral-300"}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
