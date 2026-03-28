import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  FaGlobe, FaBrain, FaCalendarAlt, FaMapMarkerAlt,
  FaExternalLinkAlt, FaStar, FaRobot, FaCheckCircle, FaTimes
} from 'react-icons/fa';
import { Sparkles, Zap, Award, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import luxuryBg from '../assets/event-bg-luxury-gold.png';
import luxuryCenterpiece from '../assets/luxury_centerpiece_red.png';
import eventCardBg1 from '../assets/event-card-bg-1.png';
import eventCardBg2 from '../assets/event-card-bg-2.png';
import batimatecImg from '../assets/batimatec_event.png';
import hannoverImg from '../assets/hannover_messe_2026.png';
import plmaImg from '../assets/plma_amsterdam_2026.png';
import gulfoodImg from '../assets/gulfood_2026.png';
import gitexImg from '../assets/gitex_global_2026.png';

import api from '../api/axios';

const DjazagroPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Lock body scroll when modal is open to ensure clean interaction
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedEvent]);

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1920';
    e.target.onerror = null; // Prevent infinite loop if fallback also fails
  };

  const fallbackEvents = [
    {
      id: 1,
      name: "DJAZAGRO 2026",
      location: "Alger, Algérie",
      date: "12 - 15 Avril 2026",
      type: "Agroalimentaire",
      aiScore: 99,
      description: t("home.events.fallback.djazagro.desc"),
      link: "https://www.djazagro.com/",
      image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=1920",
      featured: true
    }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get('events/upcoming/');
        const apiData = response.data;

        if (apiData && apiData.length > 0) {
          // Comprehensive mapping: Pools of high-quality images per sector
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
            dentex: [
              'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1920'
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
              'https://images.unsplash.com/photo-1548337138-e87d889cc369?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=1920'
            ],
            hydrogen: [
              'https://images.unsplash.com/photo-1567954970774-58d6aa6c50ec?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1548337138-e87d889cc369?auto=format&fit=crop&q=80&w=1920'
            ],
            construction: [
              'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1503387762223-264b1d748f3c?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1590486803833-ffc5d1050595?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1517089596392-db9a5bc655c6?auto=format&fit=crop&q=80&w=1920'
            ],
            hvac: [
              'https://images.unsplash.com/photo-1601050638949-364440058b3a?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=1920'
            ],
            printing: [
              'https://images.unsplash.com/photo-1598301257942-e6b919e70e01?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1616467554511-b1e605d8f289?auto=format&fit=crop&q=80&w=1920'
            ],
            optical: [
              'https://images.unsplash.com/photo-1533519080182-42225bbbbde4?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1555663276-847c1a92e10c?auto=format&fit=crop&q=80&w=1920'
            ],
            office: [
              'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1920'
            ],
            logistics: [
              'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1566633330350-019672052445?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1920'
            ],
            luxury: [
              'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1524234107056-1c1f48f64ab8?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1920'
            ],
            tourism: [
              'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=1920'
            ],
            finance: [
              'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1551280838-23d7a6974883?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1920'
            ],
            environment: [
              'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1532187863486-abf9d39d99c5?auto=format&fit=crop&q=80&w=1920',
              'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1920'
            ]
          };

          const getRelevantImage = (name, id) => {
            const n = name.toLowerCase();
            const pick = (pool) => pool[id % pool.length];

            // Specific Priority Mapping
            if (n.includes('batimatec')) return batimatecImg;
            if (n.includes('djazagro')) return pick(IMAGE_POOLS.food);
            if (n.includes('siphal') || n.includes('alpharma') || n.includes('maghreb pharma') || n.includes('pharmaceu')) return pick(IMAGE_POOLS.pharma);
            if (n.includes('dentex') || n.includes('dental') || n.includes('dentaire')) return pick(IMAGE_POOLS.dentex);
            if (n.includes('mega clima') || n.includes('best5') || n.includes('hvac') || n.includes('air cond')) return pick(IMAGE_POOLS.hvac);
            if (n.includes('printpack') || n.includes('printing') || n.includes('graphic')) return pick(IMAGE_POOLS.printing);
            if (n.includes('siol') || n.includes('optique') || n.includes('optics') || n.includes('eyewear')) return pick(IMAGE_POOLS.optical);
            if (n.includes('work space') || n.includes('office') || n.includes('furniture') || n.includes('mobilier')) return pick(IMAGE_POOLS.office);
            if (n.includes('ceramica') || n.includes('ceramic') || n.includes('marble') || n.includes('stone')) return pick(IMAGE_POOLS.luxury);
            if (n.includes('naepec') || n.includes('napec') || n.includes('hydrogen') || n.includes('petrol') || n.includes('gas')) return pick(IMAGE_POOLS.hydrogen);
            if (n.includes('textyle') || n.includes('texstyle') || n.includes('textile') || n.includes('leather')) return pick(IMAGE_POOLS.luxury);
            if (n.includes('cto forum') || n.includes('digital african summit') || n.includes('ict maghreb') || n.includes('innov build')) return pick(IMAGE_POOLS.tech);
            if (n.includes('siaha') || n.includes('tourism') || n.includes('travel') || n.includes('voyage')) return pick(IMAGE_POOLS.tourism);
            if (n.includes('sipsa') || n.includes('livestock') || n.includes('agriculture') || n.includes('agricole')) return pick(IMAGE_POOLS.agro);
            if (n.includes('fia ') || n.includes('international fair') || n.includes('multi-sector')) return pick(IMAGE_POOLS.industry);
            if (n.includes('qhse') || n.includes('safety') || n.includes('environ') || n.includes('waste')) return pick(IMAGE_POOLS.environment);
            if (n.includes('hannover')) return hannoverImg;
            if (n.includes('plma')) return plmaImg;
            if (n.includes('gulfood')) return gulfoodImg;
            if (n.includes('gitex')) return gitexImg;

            // General Industry fallback
            if (n.includes('agro') || n.includes('agri') || n.includes('fruit') || n.includes('veget')) return pick(IMAGE_POOLS.agro);
            if (n.includes('food') || n.includes('alimen') || n.includes('horeca') || n.includes('bakery')) return pick(IMAGE_POOLS.food);
            if (n.includes('drink') || n.includes('bever') || n.includes('coffee') || n.includes('tea') || n.includes('wine')) return pick(IMAGE_POOLS.food);
            if (n.includes('tech') || n.includes('it ') || n.includes('digital') || n.includes('soft') || n.includes('ai ') || n.includes('electron')) return pick(IMAGE_POOLS.tech);
            if (n.includes('medical') || n.includes('health') || n.includes('sante') || n.includes('hospital')) return pick(IMAGE_POOLS.medical);
            if (n.includes('solar') || n.includes('renew') || n.includes('green') || n.includes('energy') || n.includes('power')) return pick(IMAGE_POOLS.energy);
            if (n.includes('build') || n.includes('construct') || n.includes('archit') || n.includes('civil')) return pick(IMAGE_POOLS.construction);
            if (n.includes('beauty') || n.includes('cosmet') || n.includes('spa') || n.includes('jewelry') || n.includes('watch')) return pick(IMAGE_POOLS.luxury);
            if (n.includes('indust') || n.includes('manufac') || n.includes('facto') || n.includes('machine')) return pick(IMAGE_POOLS.industry);
            if (n.includes('transp') || n.includes('logist') || n.includes('supply') || n.includes('cargo')) return pick(IMAGE_POOLS.logistics);

            return pick(IMAGE_POOLS.industry);
          };

          // Mapping et calcul du score IA factice pour le "look & feel"
          const transformed = apiData.map((e, index) => {
            const isAgro = e.name.toLowerCase().includes('agro') ||
              e.description?.toLowerCase().includes('alimentaire') ||
              e.categories?.includes(1);

            // Clean name (remove duplicated description if present)
            let cleanName = e.name;
            if (e.description && cleanName.length > 50 && cleanName.toLowerCase().includes(e.description.toLowerCase().substring(0, 20))) {
              const firstDescriptionPart = e.description.substring(0, 15);
              const splitIndex = cleanName.indexOf(firstDescriptionPart);
              if (splitIndex > 5) {
                cleanName = cleanName.substring(0, splitIndex).trim();
              }
            }
            if (cleanName.length > 80 && cleanName.includes(' is ')) {
              cleanName = cleanName.split(' is ')[0].trim();
            }

            // High Precision image mapping
            const eventImage = e.image || getRelevantImage(e.name, e.id || index);

            return {
              id: e.id,
              name: cleanName,
              location: e.location,
              date: e.formatted_date || e.date || e.start_date,
              type: e.event_type === 'national' ? t("home.events.filters.national") : t("home.events.filters.international"),
              aiScore: isAgro ? 95 + (index % 5) : 80 + (index % 15),
              description: e.description || t("home.events.event_default"),
              url: e.url || "#",
              image: eventImage,
              featured: isAgro || e.event_type === 'national',
              dateStart: e.start_date
            };
          });

          // Priorité Agro + Algérie
          const sorted = transformed.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
          });

          setEvents(sorted); // Afficher tous les événements stratégiques identifiés
        } else {
          setEvents(fallbackEvents);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [t]);

  useEffect(() => {
    if (events.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [events]);

  const getDaysRemaining = (dateStr) => {
    if (!dateStr) return 0;
    try {
      const targetDate = new Date(dateStr);
      if (!isNaN(targetDate)) {
        const diff = targetDate - new Date();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      }
      return 0;
    } catch (e) { return 0; }
  };

  // Helper for flags
  const getCountryCode = (location) => {
    if (!location) return null;
    const lowerLoc = location.toLowerCase();
    if (lowerLoc.includes('algérie') || lowerLoc.includes('alger') || lowerLoc.includes('algeria')) return 'dz';
    if (lowerLoc.includes('uae') || lowerLoc.includes('dubai') || lowerLoc.includes('dubaï')) return 'ae';
    if (lowerLoc.includes('france') || lowerLoc.includes('paris')) return 'fr';
    if (lowerLoc.includes('germany') || lowerLoc.includes('allemagne')) return 'de';
    if (lowerLoc.includes('italy') || lowerLoc.includes('italie')) return 'it';
    if (lowerLoc.includes('spain') || lowerLoc.includes('espagne')) return 'es';
    if (lowerLoc.includes('netherlands') || lowerLoc.includes('pays-bas')) return 'nl';
    if (lowerLoc.includes('saudi') || lowerLoc.includes('arabie')) return 'sa';
    if (lowerLoc.includes('turkey') || lowerLoc.includes('turquie')) return 'tr';
    return null;
  };

  return (
    <div className="bg-[#050B18] text-white font-sans min-h-screen selection:bg-[#FF6600] selection:text-white">
      <Header />

      {/* LUXURY HERO SECTION */}
      <div className="relative h-[60vh] md:h-[70vh] min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden bg-black">
        {/* Animated Background Image */}
        <div className="absolute inset-0 z-0">
          <motion.img
            src={luxuryBg}
            alt="Luxury Background"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 0.8 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full object-cover"
          />
          {/* Magic Filters Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B18] via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-[#FF6600]/5 mix-blend-overlay z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-30 px-6 sm:px-12 max-w-7xl mx-auto w-full pt-6 md:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="max-w-3xl text-left"
          >
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#DC2626] text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm shadow-2xl mb-6 md:mb-8 border-l-4 border-white/30 backdrop-blur-md">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                {t("events_page.hero.badge")}
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6 md:mb-8 tracking-tight leading-[1.1] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <span className="block mb-2 text-neutral-200/90 italic">{t("events_page.hero.title_part1")}</span>
              <span className="text-white">
                {t("events_page.hero.title_part2")}
              </span>
            </h1>

            <div className="w-16 md:w-24 h-1 bg-[#FF6600] mb-6 md:mb-8 shadow-[0_0_15px_rgba(184,92,56,0.6)]"></div>

            <p className="text-lg md:text-2xl text-neutral-200 font-light max-w-2xl mb-8 md:mb-12 leading-relaxed drop-shadow-md tracking-wide">
              {t("events_page.hero.subtitle")}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-start"
            >
              <button
                onClick={() => document.getElementById('events-section').scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-6 py-4 md:px-8 md:py-4 bg-[#DC2626] text-white rounded-full transition-all duration-500 overflow-hidden shadow-[0_10px_40px_rgba(220,38,38,0.4)] hover:shadow-[0_15px_50px_rgba(220,38,38,0.6)] w-fit"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="relative flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em]">
                  <FaBrain className="animate-pulse" /> {t("events_page.hero.button")}
                </span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* AI INTELLIGENCE SECTION */}
      <section id="events-section" className="relative py-32 bg-[#FFFAFA] overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute -left-20 top-40 w-96 h-96 bg-[#FF6600]/5 rounded-full blur-[100px]" />
        <div className="absolute -right-20 bottom-0 w-96 h-96 bg-[#FF6600]/5 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-16 md:mb-24">
            <div className="flex-1 space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#FF6600]/10 rounded-full border border-[#FF6600]/20">
                <Zap className="text-[#FF6600] w-4 h-4 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6600]">{t("events_page.ai.badge")}</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-serif font-bold text-neutral-900 leading-tight">
                {t("events_page.ai.title_part1")} <span className="italic text-[#FF6600]">{t("events_page.ai.title_part2")}</span>
              </h2>

              <p className="text-neutral-600 text-base md:text-lg leading-relaxed font-light max-w-xl">
                {t("events_page.ai.desc")}
              </p>

              <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-xl border border-neutral-100 w-fit shadow-xl">
                <div className="w-10 h-10 rounded-full bg-[#FF6600]/10 flex items-center justify-center">
                  <FaRobot className="text-[#FF6600]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">{t("events_page.ai.data_label")}</span>
                  <span className="text-xs text-neutral-800 font-semibold italic">{t("events_page.ai.data_status")}</span>
                </div>
              </div>
            </div>

            {/* Added Luxury Centerpiece Image here - Enhanced styling */}
            <div className="w-full lg:w-2/5 relative">
              <div className="absolute inset-0 bg-[#FF6600]/20 blur-[60px] opacity-30 rounded-full"></div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 p-2 bg-white rounded-3xl shadow-2xl border border-neutral-100"
              >
                <img
                  src={luxuryCenterpiece}
                  alt="Luxury Setup"
                  className="rounded-2xl w-full grayscale-[0.2] contrast-[1.1]"
                />
              </motion.div>

              <motion.div
                initial={{ rotate: -5, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                className="absolute -bottom-8 -right-8 bg-neutral-900 p-6 rounded-2xl border-l-4 border-[#DC2626] shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-20"
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping"></div>
                  <p className="text-[#DC2626] font-black text-xl md:text-2xl uppercase tracking-tighter">{t("events_page.ai.vip_badge")}</p>
                </div>
                <p className="text-neutral-400 text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold">{t("events_page.ai.vip_access")}</p>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="flex justify-center py-20 col-span-1 md:col-span-2 lg:col-span-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6600]"></div>
              </div>
            ) : events.length > 0 ? (
              events.map((event, index) => {
                const countryCode = getCountryCode(event.location);
                const flagUrl = countryCode ? `https://flagcdn.com/w40/${countryCode}.png` : null;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-2 h-full"
                  >
                    {/* Event Image Header */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.name}
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
                      />
                      {/* Premium Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* AI Match Score Glassmorphism */}
                      <div className="absolute top-4 right-4 z-20 backdrop-blur-xl bg-white/10 border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
                        <span className="text-white font-serif font-bold text-sm">{event.aiScore}%</span>
                        <Sparkles size={14} className="text-amber-400 animate-pulse" />
                      </div>

                      {/* Featured/Recommended Badge */}
                      {event.featured && (
                        <div className="absolute top-4 left-4 z-20 bg-[#DC2626] text-white text-[8px] font-black px-3 py-1.5 uppercase tracking-[0.2em] rounded-sm shadow-2xl border-l-2 border-white/30">
                          {t("events_page.card.elite_match")}
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1 cursor-pointer" onClick={() => setSelectedEvent(event)}>
                      {/* Category & Info */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF6600] bg-[#FF6600]/5 px-2.5 py-1 rounded-sm border border-[#FF6600]/10">
                          {event.type}
                        </span>
                        <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                          <FaCalendarAlt size={10} />
                          {event.date}
                        </div>
                      </div>

                      {/* Title - Serif & Refined */}
                      <h3 className="text-xl font-serif font-bold text-neutral-900 mb-3 leading-tight line-clamp-2 group-hover:text-[#FF6600] transition-colors h-14">
                        {event.name}
                      </h3>

                      {/* Location with Flag */}
                      <div className="flex items-center gap-2 mb-4">
                        {flagUrl ? (
                          <div className="w-4 h-3 rounded-[2px] overflow-hidden border border-neutral-100 shadow-sm">
                            <img src={flagUrl} alt="flag" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <FaMapMarkerAlt size={10} className="text-neutral-400" />
                        )}
                        <span className="text-[11px] font-medium text-neutral-500 truncate italic">
                          {event.location}
                        </span>
                      </div>

                      {/* Description - Smaller & Professional */}
                      <p className="text-[12px] text-neutral-400 font-light leading-relaxed line-clamp-3 mb-6 italic">
                        "{event.description || "Événement majeur pour le développement des exportations."}"
                      </p>

                      {/* Action Button - Red Style */}
                      <div className="mt-auto">
                        <motion.a
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-full py-3.5 bg-[#DC2626] hover:bg-[#FF6600] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-red-900/10"
                        >
                          {t("events_page.card.reserve")}
                          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-20 text-neutral-500 font-medium col-span-1 md:col-span-2 lg:col-span-3">
                {t("events_page.card.no_events")}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EVENT SLIDESHOW SECTION */}
      {events.length > 0 && (
        <section className="py-0 bg-neutral-950 relative overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 bg-[#FF6600]/5 z-0" />
          <div className="w-full relative z-10">
            <div className="py-12 md:py-16 text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
                {t("events_page.slideshow.title_part1")} <span className="text-[#FF6600] italic">{t("events_page.slideshow.title_part2")}</span>
              </h2>
              <div className="w-16 h-0.5 bg-[#FF6600] mx-auto mt-4 opacity-50"></div>
            </div>

            <div className="relative h-[450px] w-full overflow-hidden bg-black border-y border-white/5">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                >
                  {/* Background Image with Premium Gradient */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
                    <motion.img
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 10, ease: "linear" }}
                      src={events[currentIndex]?.image}
                      alt={events[currentIndex]?.name}
                      className="w-full h-full object-cover opacity-60"
                    />
                    {/* Subtle Golden Glow Overlay */}
                    <div className="absolute inset-0 bg-[#FF6600]/10 mix-blend-overlay z-10" />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12">
                    <div className="max-w-7xl mx-auto w-full">
                      <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="max-w-4xl"
                      >
                        <div className="flex items-center gap-5 mb-6">
                          <span className="px-4 py-1.5 bg-[#DC2626] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm">
                            {events[currentIndex]?.type}
                          </span>
                          <span className="text-[#FF6600] font-bold flex items-center gap-2 text-xs uppercase tracking-widest">
                            <FaMapMarkerAlt /> {events[currentIndex]?.location}
                          </span>
                        </div>

                        <h3 className="text-2xl md:text-4xl font-serif font-bold text-white mb-6 leading-tight line-clamp-2">
                          {events[currentIndex]?.name?.length > 60 ? events[currentIndex].name.substring(0, 60) + '...' : events[currentIndex]?.name}
                        </h3>

                        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 justify-between mt-6 md:mt-8">
                          <p className="text-neutral-300 text-xs md:text-base max-w-2xl leading-relaxed font-light italic opacity-80 line-clamp-2">
                            "{events[currentIndex]?.description}"
                          </p>

                          {/* Countdown Timer - Elite Glass Version */}
                          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 px-8 py-4 md:px-10 md:py-6 rounded-2xl flex items-center gap-6 md:gap-8 shadow-2xl relative overflow-hidden group w-fit md:w-auto self-start md:self-auto">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6600]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                              <span className="block text-3xl md:text-5xl font-serif font-black text-white leading-none tracking-tighter">
                                J-{getDaysRemaining(events[currentIndex]?.dateStart || events[currentIndex]?.date)}
                              </span>
                              <span className="text-[8px] md:text-[10px] text-neutral-400 uppercase tracking-[0.3em] font-bold mt-1 md:mt-2 block">{t("events_page.slideshow.remaining_time")}</span>
                            </div>
                            <div className="h-10 md:h-12 w-px bg-white/10 relative z-10"></div>
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              href={events[currentIndex]?.url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FF6600] text-white flex items-center justify-center shadow-xl relative z-10"
                            >
                              <ArrowUpRight size={18} />
                            </motion.a>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Bar - Refined Style */}
              <div className="absolute bottom-6 md:bottom-10 left-0 right-0 z-30 flex justify-center gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {events.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1 transition-all duration-700 rounded-full shrink-0 ${idx === currentIndex ? 'w-12 md:w-16 bg-[#FF6600]' : 'w-3 md:w-4 bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* EVENT DETAIL MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-[#050B18]/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl md:rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row max-h-[95vh] lg:max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] w-10 h-10 md:w-12 md:h-12 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all border border-white/20 shadow-xl"
              >
                <FaTimes className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Modal Left: Visual */}
              <div className="w-full lg:w-1/2 relative min-h-[250px] sm:min-h-[300px] lg:h-auto shrink-0">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.name}
                  onError={handleImageError}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent opacity-80" />

                {/* Score and Tag in Modal */}
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-10 ring-0">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <span className="bg-[#FF6600] px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-white/20">
                      {selectedEvent.type}
                    </span>
                    <div className="flex items-center gap-2 text-amber-400">
                      <Sparkles size={14} className="md:w-4 md:h-4" />
                      <span className="font-serif font-black text-lg md:text-2xl">{selectedEvent.aiScore}% {t("events_page.modal.match_score")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 opacity-80 italic text-sm md:text-lg">
                    <FaMapMarkerAlt className="text-[#FF6600]" /> {selectedEvent.location}
                  </div>
                </div>
              </div>

              {/* Modal Right: Details */}
              <div className="w-full lg:w-1/2 p-6 md:p-10 lg:p-16 flex flex-col justify-center bg-white">
                <div className="space-y-6 md:space-y-8">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#DC2626]/5 rounded-full border border-[#DC2626]/20">
                    <FaCalendarAlt className="text-[#DC2626] w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DC2626]">{selectedEvent.date}</span>
                  </div>

                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 leading-tight">
                    {selectedEvent.name}
                  </h2>

                  <div className="w-12 md:w-16 h-1 bg-[#FF6600]"></div>

                  <div className="space-y-4 md:space-y-6">
                    <p className="text-neutral-500 text-sm md:text-lg leading-relaxed italic border-l-4 border-neutral-100 pl-4 md:pl-6">
                      "{selectedEvent.description}"
                    </p>

                    <p className="text-neutral-600 text-xs md:text-base leading-relaxed font-light">
                      {t("events_page.modal.accompagnement")}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:gap-6 py-4 md:py-6 border-y border-neutral-100">
                    <div>
                      <span className="text-[9px] md:text-[10px] text-neutral-400 uppercase tracking-widest font-bold block mb-1">{t("events_page.modal.status_label")}</span>
                      <span className="text-neutral-900 font-bold flex items-center gap-2 text-xs md:text-sm">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500"></div> {t("events_page.modal.status_value")}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] md:text-[10px] text-neutral-400 uppercase tracking-widest font-bold block mb-1">{t("events_page.modal.support_label")}</span>
                      <span className="text-neutral-900 font-bold text-xs md:text-sm">{t("events_page.modal.support_value")}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 md:gap-5 pt-2 md:pt-4">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={selectedEvent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-4 md:px-10 md:py-5 bg-[#DC2626] text-white font-bold rounded-xl md:rounded-2xl transition-all shadow-2xl shadow-red-900/20 flex items-center justify-center gap-3 text-[10px] md:text-xs uppercase tracking-widest flex-1"
                    >
                      {t("events_page.card.reserve")} <FaExternalLinkAlt size={12} className="md:w-[14px] md:h-[14px]" />
                    </motion.a>

                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="px-6 py-4 md:px-10 md:py-5 bg-neutral-50 text-neutral-900 font-bold rounded-xl md:rounded-2xl transition-all hover:bg-neutral-100 text-[10px] md:text-xs uppercase tracking-widest border border-neutral-200"
                    >
                      {t("events_page.modal.close")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DjazagroPage;