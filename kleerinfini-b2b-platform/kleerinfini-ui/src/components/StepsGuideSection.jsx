import React from "react";
import { UserPlus, Search, FileText, CheckCircle, ArrowRight, Play, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import excellenceBg from "@/assets/import_request_bg.jpg";

export default function StepsGuideSection() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const steps = [
    {
      id: "exploration",
      icon: <Search size={24} />,
      title: t("home.steps.items.exploration.title"),
      desc: t("home.steps.items.exploration.desc"),
      color: "#D4AF37"
    },
    {
      id: "interactions",
      icon: <FileText size={24} />,
      title: t("home.steps.items.interactions.title"),
      desc: t("home.steps.items.interactions.desc"),
      color: "#FF6600"
    },
    {
      id: "excellence",
      icon: <CheckCircle size={24} />,
      title: t("home.steps.items.excellence.title"),
      desc: t("home.steps.items.excellence.desc"),
      color: "#D4AF37"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden bg-gradient-to-br from-[#0A0A0A] via-[#1a0f0a] to-[#0A0A0A] grainy-texture">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#FF6600]/8 rounded-full blur-[150px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24 space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-6"
          >
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37]"></div>
            <p className="text-[#D4AF37] font-black uppercase tracking-[0.8em] text-[10px] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
              {t("home.steps.badge")}
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
            </p>
            <div className="w-16 h-[2px] bg-gradient-to-l from-transparent via-[#D4AF37] to-[#D4AF37]"></div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-8xl font-luxury !text-white leading-[1.1] tracking-tight px-2"
          >
            {t("home.steps.title")}{" "}
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FF6600] to-[#D4AF37] font-serif-luxury italic font-light">
              {t("home.steps.subtitle")}
            </span>
          </motion.h2>

          {/* Importer Mention - Secondary Information */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center gap-4 mt-6 md:mt-8 px-4"
          >
            <div className="flex flex-col items-center gap-3">
              <p className="!text-white text-base sm:text-lg md:text-xl font-luxury tracking-wide max-w-3xl text-center italic font-light">
                {t("home.steps.items.guide_text")}
              </p>
            </div>

            {/* Import Request Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/producer-inscription')}
              className="group relative px-8 py-3 bg-gradient-to-r from-[#FF0000]/20 to-[#FF4500]/20 border border-[#FF0000]/30 text-[#FF4500] font-semibold text-xs uppercase tracking-[0.3em] rounded-full overflow-hidden transition-all duration-500 hover:border-[#FF0000] hover:shadow-[0_0_30px_rgba(255,0,0,0.3)] backdrop-blur-sm"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Globe size={14} />
                {t("home.steps.buttons.leave_demand")}
              </span>
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </motion.button>
          </motion.div>
        </div>

        <div className="relative mb-20 md:mb-32 group">
          {/* Luxury Video Hero with Premium Frame */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="relative w-full h-[800px] md:h-[600px] overflow-hidden rounded-3xl md:rounded-[2rem] border-2 border-[#D4AF37]/20 shadow-[0_0_80px_rgba(212,175,55,0.15)] backdrop-blur-xl"
          >
            {/* Decorative Corner Accents */}
            <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-[#D4AF37]/40 rounded-tl-3xl z-20"></div>
            <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-[#D4AF37]/40 rounded-tr-3xl z-20"></div>
            <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-[#D4AF37]/40 rounded-bl-3xl z-20"></div>
            <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-[#D4AF37]/40 rounded-br-3xl z-20"></div>

            <img
              src={excellenceBg}
              alt="Excellence Background"
              className="w-full h-full object-cover brightness-[0.8] contrast-[1.0] group-hover:scale-105 transition-transform duration-[5000ms] ease-out"
            />

            {/* Sophisticated Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-[#FF6600]/10 mix-blend-overlay"></div>

            {/* Luxury Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

            {/* Premium Play Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative w-24 h-24 rounded-full border-2 border-white/30 flex items-center justify-center backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/20 transition-all duration-700 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
              >
                <Play fill="white" className="text-white ml-2" size={28} />
                {/* Pulse Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-20"></div>
              </motion.div>
            </div>

            {/* Steps Over Grid with Glassmorphism */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-16 z-10 w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.12, duration: 0.7 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group/card relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl p-6 rounded-2xl border border-white/20 hover:border-[#D4AF37]/50 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_48px_rgba(212,175,55,0.2)]"
                  >
                    {/* Gradient Background on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#FF6600]/0 group-hover/card:from-[#D4AF37]/10 group-hover/card:to-[#FF6600]/10 rounded-2xl transition-all duration-500"></div>

                    <div className="flex flex-col h-full space-y-5 relative z-10">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-500 shadow-lg group-hover/card:shadow-2xl group-hover/card:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
                          color: step.color,
                          border: `1.5px solid ${step.color}40`
                        }}
                      >
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-luxury text-white uppercase tracking-tight mb-2 group-hover/card:text-[#D4AF37] transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-gray-200 text-sm leading-relaxed font-light">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Premium Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 px-2 md:px-0"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/producer-inscription')}
            className="group relative px-8 py-5 md:px-14 md:py-7 bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] text-black font-black uppercase tracking-[0.5em] text-[9px] rounded-full overflow-hidden transition-all duration-500 shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] w-full md:w-auto flex justify-center"
          >
            <span className="relative z-10 flex items-center gap-4">
              {t('home.steps.buttons.leave_demand')}
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </span>
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/products')}
            className="group relative px-8 py-5 md:px-14 md:py-7 border-2 border-[#D4AF37]/40 text-white font-black uppercase tracking-[0.5em] text-[9px] rounded-full hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-500 backdrop-blur-xl shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] w-full md:w-auto flex justify-center"
          >
            <span className="relative z-10 flex items-center gap-4">
              {t('home.steps.buttons.showroom')}
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
