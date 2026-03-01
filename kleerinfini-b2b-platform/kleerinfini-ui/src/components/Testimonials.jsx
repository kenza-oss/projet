import React from 'react';
import { Quote, Star, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Testimonials() {
  const { t } = useTranslation();

  const testimonialList = [
    {
      id: "elena",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400",
      rating: 5,
      accent: "#FF6600",
      bgImage: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2000" // International trade office
    },
    {
      id: "ahmed",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400",
      rating: 5,
      accent: "#D4AF37",
      bgImage: "https://images.unsplash.com/photo-1520110120287-c998e0221dbd?q=80&w=2000" // Professional container ship / International trade
    },
  ];

  return (
    <section className="section-spacing relative py-16 md:py-32 overflow-hidden bg-gradient-to-br from-[#0A0A0A] via-[#1a1a1a] to-[#0A0A0A]">
      {/* Decorative golden glow */}
      <div className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] bg-[#D4AF37]/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-[#FF6600]/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Top golden line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24 space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-6"
          >
            <div className="w-20 h-[2px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
            <p className="text-[#D4AF37] font-black uppercase tracking-[0.7em] text-[10px] flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.6)]"></span>
              {t("home.testimonials.reputation")}
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.6)]"></span>
            </p>
            <div className="w-20 h-[2px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-[#FFFAFA] leading-[1.1] tracking-tight px-2"
          >
            {t("home.testimonials.title")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] font-serif-luxury italic font-light">{t("home.testimonials.subtitle")}</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 md:gap-4 text-gray-400 font-light px-4"
          >
            <Globe size={18} className="text-[#D4AF37] shrink-0" />
            <p className="text-base md:text-xl italic">{t("home.testimonials.desc")}</p>
          </motion.div>
        </div>

        {/* Testimonial Cards - Smaller size */}
        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {testimonialList.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.9 }}
              className="group relative"
            >
              {/* Card - responsive height */}
              <div className="relative h-[380px] md:h-[420px] rounded-3xl md:rounded-[2.5rem] overflow-hidden border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-700 shadow-[0_15px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_70px_rgba(212,175,55,0.35)]">
                {/* Background Image - Export themed */}
                <div className="absolute inset-0">
                  <img
                    src={item.bgImage}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2500ms]"
                  />
                  {/* Overlay plus léger pour meilleure visibilité de l'image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/55 to-black/70"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/15 via-transparent to-transparent"></div>
                </div>

                {/* Floating Quote Icon */}
                <div className="absolute top-6 right-6 md:top-8 md:right-8 opacity-8 group-hover:opacity-15 transition-opacity duration-700">
                  <Quote size={120} className="text-[#D4AF37] w-20 h-20 md:w-[120px] md:h-[120px]" />
                </div>

                {/* Content */}
                <div className="relative h-full p-6 md:p-10 flex flex-col justify-between">
                  {/* Stars */}
                  <div className="flex items-center gap-2">
                    {[...Array(item.rating)].map((_, starIdx) => (
                      <motion.div
                        key={starIdx}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + (starIdx * 0.08) }}
                        viewport={{ once: true }}
                      >
                        <Star size={18} fill="#D4AF37" className="text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-base sm:text-lg lg:text-xl text-white leading-relaxed font-light my-4 md:my-6 line-clamp-4">
                    <span className="text-[#D4AF37] text-3xl md:text-5xl font-serif leading-none">"</span>
                    {t(`home.testimonials.items.${item.id}.quote`)}
                    <span className="text-[#D4AF37] text-3xl md:text-5xl font-serif leading-none">"</span>
                  </blockquote>

                  {/* Author Section */}
                  <div className="flex items-center gap-4 md:gap-6 pt-4 md:pt-6 border-t-2 border-[#D4AF37]/25">
                    <div className="relative group-hover:scale-105 transition-transform duration-700 shrink-0">
                      {/* Golden animated frame */}
                      <div className="absolute -inset-1.5 bg-gradient-to-br from-[#D4AF37] via-[#F4D03F] to-[#B85C38] rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity blur-sm animate-pulse"></div>
                      <img
                        src={item.photo}
                        alt={t(`home.testimonials.items.${item.id}.name`)}
                        className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover shadow-xl border-2 border-[#D4AF37]"
                      />
                      {/* Quote badge */}
                      <div
                        className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-xl border-2 border-black"
                        style={{ background: `linear-gradient(135deg, ${item.accent}, ${item.accent}DD)` }}
                      >
                        <Quote size={16} className="text-white" strokeWidth={3} />
                      </div>
                    </div>

                    <div className="space-y-1 flex-1">
                      <h4 className="text-xl font-black text-white uppercase tracking-tight">
                        {t(`home.testimonials.items.${item.id}.name`)}
                      </h4>
                      <p className="text-[9px] text-[#D4AF37] font-black uppercase tracking-[0.4em]">
                        {t(`home.testimonials.items.${item.id}.role`)}
                      </p>
                      <div className="flex items-center gap-2 text-gray-400 font-light text-sm">
                        <Globe size={14} className="text-[#D4AF37]" />
                        {t(`home.testimonials.items.${item.id}.country`)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Number Badge */}
                <div className="absolute top-6 left-6 md:top-8 md:left-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B85C38] border-2 border-white/20 flex items-center justify-center text-white font-black text-base md:text-lg shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 z-10">
                  {i === 0 ? "01" : "02"}
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
