import React, { useEffect, useState, useRef } from "react";
import { Users, Globe, Award, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import video1 from "../assets/video3.mp4";
import video2 from "../assets/videoC.mp4";
import background from "../assets/background.mp4";
import olives from "../assets/olives_hero.png";
import soap from "../assets/soap_hero.png";
import luxuryHero from "../assets/luxury_hero.png";
import heroGreenGold from "../assets/hero_green_gold.png";
import heroLeavesGold from "../assets/hero_leaves_gold.png";
import heroBg1 from "../assets/hero-bg-1.jpg";
import heroBg2 from "../assets/hero-bg-2.png";
import heroBg3 from "../assets/hero-bg-3.png";
import heroBg4 from "../assets/hero-bg-4.png";
import heroBg5 from "../assets/hero-bg-5.png";
import heroVideoNew from "../assets/hero_video_new.mp4";
import blueTexture from "../assets/blue_magic_texture.png";

export default function HeroSection({ onOpenMap }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const backgroundImage = luxuryHero;

  const stats = [
    { icon: Users, label: "home.hero.stats.verified", value: "850+" },
    { icon: Globe, label: "home.hero.stats.sectors", value: "46" },
    { icon: Award, label: "home.hero.stats.compliance", value: "ISO" }
  ];

  return (
    <section className="relative min-h-screen bg-[#0A0A0A] overflow-hidden flex items-center justify-center grainy-texture">
      {/* Background Media Wrapper */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <video
            src={heroVideoNew}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 opacity-60"
            style={{ filter: 'brightness(0.7) contrast(1.2)' }}
          />
          {/* Luminous Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
          {/* Luminous Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent"></div>
        </div>
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
          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="relative px-8 py-2 overflow-hidden rounded-full border border-[#0055FF]/30 backdrop-blur-xl group"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={blueTexture}
                  alt="Magic Texture"
                  className="w-full h-full object-cover opacity-60 mix-blend-overlay group-hover:scale-110 transition-transform duration-1000"
                />
              </div>
              <span className="relative z-10 text-[#00E0FF] font-black uppercase tracking-[0.8em] text-[12px] drop-shadow-[0_0_15px_rgba(0,224,255,0.8)]">
                Excellence Algérienne
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0055FF]/20 to-transparent translate-x-[-100%] animate-shimmer"></div>
            </motion.div>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#0055FF] to-transparent"></div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display-luxury text-white leading-tight tracking-tight mb-4 md:mb-8 text-shadow-premium px-2">
            {t("home.hero.title")}
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-[#FFD700] font-serif-luxury italic mb-8 md:mb-12 opacity-100 drop-shadow-[0_0_30px_rgba(255,215,0,0.6)] tracking-wide brightness-125 saturate-150 px-2">
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
