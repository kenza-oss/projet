import React, { useEffect, useState, useRef } from "react";
import { Users, Globe, Award, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import heroBg1 from "../assets/hero_bg_1_hd.png";
import heroBg2 from "../assets/hero_bg_marina.jpg";
import heroBg4 from "../assets/hero_bg_3_breakfast.jpg";

const backgroundImages = [heroBg1, heroBg2, heroBg4];

export default function HeroSection({ onOpenMap }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 8000); // 8 seconds interval
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { icon: Users, label: "home.hero.stats.verified", value: "850+" },
    { icon: Globe, label: "home.hero.stats.sectors", value: "46" },
    { icon: Award, label: "home.hero.stats.compliance", value: "ISO" }
  ];

  return (
    <section className="relative min-h-screen bg-[#0A0A0A] overflow-hidden flex items-center justify-center grainy-texture">
      {/* Background Media Wrapper */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBgIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={backgroundImages[currentBgIndex]}
              alt={`Luxury Background ${currentBgIndex + 1}`}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.72) contrast(1.05)' }}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Luminous Overlays - Restored for premium dark aesthetic and readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10"></div>
      </div>

      {/* Algeria Flag Badge - Luxury Design */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute top-8 left-8 z-50 group cursor-pointer"
      >
        <div className="relative flex items-center">
          {/* Outer Glass Ring */}
          <div className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-105 z-20">
            {/* Inner Gold Ring */}
            <div className="w-10 h-10 rounded-full overflow-hidden border-[1px] border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.3)] relative">
              <img
                src="https://flagcdn.com/w160/dz.png"
                alt="Algeria Flag"
                className="w-full h-full object-cover scale-150"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/20"></div>
            </div>
          </div>

          {/* Sliding Label */}
          <div className="absolute left-7 h-10 bg-black/90 backdrop-blur-2xl border-y border-r border-luxury-gold/40 text-luxury-gold text-xs font-serif-luxury italic tracking-[0.2em] pl-10 pr-6 py-2 rounded-r-full whitespace-nowrap opacity-0 -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 ease-out flex items-center -z-10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {t("home.hero.excellence_label")}
          </div>
        </div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl px-6 md:px-8 flex flex-col items-center text-center pt-40 md:pt-56 pb-64 md:pb-96">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-6 md:space-y-10 w-full"
        >
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="w-12 h-[1px] bg-[#FF6600]"></div>
            <span className="text-[#FF6600] font-black uppercase tracking-[0.6em] text-[10px]">
              {t("home.hero.group_label")}
            </span>
            <div className="w-12 h-[1px] bg-[#FF6600]"></div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display-luxury text-white leading-tight tracking-tight mb-4 md:mb-8 text-shadow-premium px-2">
            {t("home.hero.title")}
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-[#FFD700] font-serif-luxury italic mb-8 md:mb-12 drop-shadow-[0_0_30px_rgba(255,215,0,0.6)] tracking-wide brightness-125 saturate-150 px-2">
            {t("home.hero.subtitle")}
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl text-white font-serif-luxury font-medium max-w-5xl mx-auto leading-relaxed border-l border-white/20 pl-6 md:pl-16 py-2 md:py-4 mx-4 md:mx-auto italic letter-spacing-finesse text-left md:text-center">
            {t("home.hero.desc1")} <span className="text-white not-italic font-medium">{t("home.hero.desc2")}</span>
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-24 py-10 md:py-16 border-y border-white/5 backdrop-blur-sm bg-white/[0.02] rounded-none px-6 md:px-24 mt-8 md:mt-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-4 group">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-3">
                    <stat.icon size={20} className="text-[#FF6600]" />
                    <span className="text-3xl font-display-luxury font-light tracking-tighter text-white group-hover:text-luxury-gold transition-colors duration-500">
                      {stat.value}
                    </span>
                  </div>
                  <div className="w-8 h-[1px] bg-luxury-orange/40 group-hover:w-16 transition-all duration-700"></div>
                </div>
                <p className="text-[11px] uppercase font-cinzel font-medium tracking-[0.3em] text-gray-200 whitespace-nowrap">
                  {t(stat.label)}
                </p>
              </div>
            ))}
          </div>

          {/* Action Hub */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10 pt-8 md:pt-10 w-full px-4 md:px-0">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#FF6600" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/products")}
              className="group bg-white text-black px-8 py-5 md:px-12 md:py-7 rounded-full font-black uppercase tracking-[0.3em] text-[10px] md:text-xs flex items-center justify-center gap-4 md:gap-6 transition-all duration-500 shadow-3xl w-full sm:w-auto"
            >
              {t("home.nav.products")}
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/producers")}
              className="group border border-white/20 px-8 py-5 md:px-12 md:py-7 rounded-full font-black uppercase tracking-[0.3em] text-[10px] md:text-xs flex items-center justify-center gap-4 md:gap-6 transition-all duration-500 backdrop-blur-xl w-full sm:w-auto"
            >
              <Globe size={18} className="text-[#D4AF37]" />
              <span className="!text-white">
                {t("home.search.mapAction")}
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Persistent Bottom Gradient for Search Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-10 pointer-events-none"></div>

      {/* Elegant Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-24 md:bottom-48 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40 z-20"
      >
        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white vertical-text hidden md:block">{t("home.hero.scroll")}</span>
        <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-white to-transparent"></div>
      </motion.div>
    </section>
  );
}
