import React from 'react';
import { Shield, Sparkles, TrendingUp, Handshake, ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Whychoose() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const advantages = [
    {
      icon: <Shield size={32} />,
      key: "sourcing",
      color: "#FF6600",
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1000" // Shipping containers
    },
    {
      icon: <Sparkles size={32} />,
      key: "quality",
      color: "#D4AF37",
      image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=1000" // Quality control
    },
    {
      icon: <TrendingUp size={32} />,
      key: "vision",
      color: "#FF6600",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000" // Global trade
    },
    {
      icon: <Handshake size={32} />,
      key: "support",
      color: "#D4AF37",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1000" // Business handshake
    }
  ];

  return (
    <section className="section-spacing relative py-16 md:py-32 overflow-hidden">
      {/* Dark Background Image - Export themed */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=2000"
          alt="International Export"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/85"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/10 via-transparent to-transparent"></div>
      </div>

      {/* Decorative golden lines */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent z-10"></div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24 space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4 md:gap-6"
          >
            <div className="w-20 h-[2px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
            <p className="text-[#D4AF37] font-black uppercase tracking-[0.7em] text-[10px] flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.6)]"></span>
              {t("home.why.elite")}
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.6)]"></span>
            </p>
            <div className="w-20 h-[2px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-luxury !text-[#FFFAFA] leading-[1.1] tracking-tight px-2 md:px-0"
          >
            {t("home.why.title")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] font-serif-luxury italic font-light">
              {t("home.why.subtitle")}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 font-light text-base md:text-xl max-w-3xl mx-auto leading-relaxed px-4 md:px-0"
          >
            {t("home.why.desc")}
          </motion.p>
        </div>

        {/* Cards Grid - Images bien visibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {advantages.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.8 }}
              className="group relative"
            >
              {/* Card - responsive height with visible images */}
              <div className="relative h-[280px] md:h-[320px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-2 border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all duration-700 shadow-[0_15px_50px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_70px_rgba(212,175,55,0.4)]">
                {/* Background Image - BIEN VISIBLE */}
                <div className="absolute inset-0">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover brightness-90 group-hover:scale-110 group-hover:brightness-100 transition-all duration-[2500ms]"
                  />
                  {/* Overlay léger pour lisibilité du texte */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/20 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative h-full p-6 md:p-8 flex flex-col justify-between">
                  {/* Icon and Number */}
                  <div className="flex justify-between items-start">
                    <div
                      className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-700 shadow-xl group-hover:scale-110 group-hover:rotate-6 backdrop-blur-sm"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}50, ${item.color}30)`,
                        border: `2px solid ${item.color}`,
                        color: item.color
                      }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      >
                        {item.icon}
                      </motion.div>
                    </div>

                    {/* Number Badge */}
                    <div className="text-white/30 text-4xl md:text-5xl leading-none font-black transition-colors duration-700 group-hover:text-[#D4AF37]/50">
                      0{idx + 1}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-4">
                    <div
                      className="w-12 h-1 rounded-full group-hover:w-full transition-all duration-700 shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                      style={{ background: `linear-gradient(to right, ${item.color}, #D4AF37)` }}
                    ></div>

                    <h3 className="text-lg font-black text-white group-hover:text-[#D4AF37] transition-colors uppercase tracking-tight leading-tight drop-shadow-lg">
                      {t(`home.why.reasons.${item.key}.title`)}
                    </h3>

                    <p className="text-gray-200 font-light text-sm leading-relaxed line-clamp-3 drop-shadow-md">
                      {t(`home.why.reasons.${item.key}.desc`)}
                    </p>
                  </div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Moved CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="flex justify-center mt-12 md:mt-16 relative z-10 px-4 md:px-0"
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/about')}
          className="group relative px-8 py-5 md:px-12 md:py-6 bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-full overflow-hidden transition-all duration-500 shadow-[0_8px_30px_rgba(212,175,55,0.35)] hover:shadow-[0_12px_50px_rgba(212,175,55,0.5)] w-full md:w-auto flex justify-center"
        >
          <span className="relative z-10 flex items-center justify-center gap-4 w-full">
            {t("home.why.about_button")}
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform shrink-0" />
          </span>
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </motion.button>
      </motion.div>
    </section >
  );
}
