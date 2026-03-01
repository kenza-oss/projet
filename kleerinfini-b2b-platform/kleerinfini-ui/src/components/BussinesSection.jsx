import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Factory, Globe, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import industryMain from "../assets/industry/main.png";
import industryRobots from "../assets/industry/robots.png";
import industryMachinery from "../assets/industry/machinery.png";

export default function EmpowerSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const images = [
    industryMain,
    industryRobots,
    industryMachinery
  ];

  return (
    <section className="section-spacing bg-gradient-to-br from-[#FAF8F3] via-[#F5F1E8] to-[#FDFBF7] py-16 md:py-32 overflow-hidden relative">
      {/* Decorative Auras - Subtle beige tones */}
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#FF6600]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-24">
          {/* Visual Showcase */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 md:gap-8 h-[400px] md:h-[650px] mb-8 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-[3rem] overflow-hidden group h-full border-2 border-[#D4AF37]/30 shadow-[0_8px_40px_rgba(212,175,55,0.15)]"
            >
              <img
                src={images[0]}
                alt={t("home.empower.img_industry")}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-[2000ms] brightness-95 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-10 left-10">
                <span className="text-white text-[10px] font-black uppercase tracking-[0.4em] bg-gradient-to-r from-[#D4AF37] to-[#FF6600] px-5 py-2 rounded-full shadow-2xl">{t("home.empower.excellence")}</span>
              </div>
            </motion.div>

            <div className="space-y-8 h-full">
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative rounded-[3rem] overflow-hidden group h-[calc(50%-16px)] border-2 border-[#D4AF37]/30 shadow-[0_8px_40px_rgba(212,175,55,0.15)]"
              >
                <img
                  src={images[1]}
                  alt={t("home.empower.img_partners")}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-[2000ms] brightness-95 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/15 to-transparent group-hover:opacity-0 transition-opacity duration-700"></div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative rounded-[3rem] overflow-hidden group h-[calc(50%-16px)] border-2 border-[#D4AF37]/30 shadow-[0_8px_40px_rgba(212,175,55,0.15)]"
              >
                <img
                  src={images[2]}
                  alt={t("home.empower.img_production")}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-[2000ms] brightness-95 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6600]/15 to-transparent group-hover:opacity-0 transition-opacity duration-700"></div>
              </motion.div>
            </div>
          </div>

          {/* Strategic Content */}
          <div className="w-full lg:w-1/2 space-y-8 md:space-y-12">
            <div className="space-y-6 md:space-y-8">
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#D4AF37] to-[#FF6600] origin-left"
              ></motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-7xl font-luxury text-[#1a1a1a] leading-[1.1]"
              >
                {t("home.empower.title")} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FF6600] to-[#D4AF37] font-serif-luxury italic font-light">{t("home.empower.subtitle")}</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-2xl text-[#4a4a4a] font-light leading-relaxed border-l-2 border-[#D4AF37]/60 pl-6 md:pl-10"
            >
              {t("home.empower.desc")}
            </motion.p>

            <div className="space-y-6 md:space-y-10 pt-4 md:pt-8">
              {[
                {
                  title: t("home.empower.features.industrial.title"),
                  desc: t("home.empower.features.industrial.desc"),
                  icon: Factory
                },
                {
                  title: t("home.empower.features.certified.title"),
                  desc: t("home.empower.features.certified.desc"),
                  icon: TrendingUp
                },
                {
                  title: t("home.empower.features.export.title"),
                  desc: t("home.empower.features.export.desc"),
                  icon: Globe
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="p-6 md:p-10 bg-white/80 backdrop-blur-sm rounded-[2rem] md:rounded-[2.5rem] border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all duration-500 group cursor-default shadow-[0_4px_30px_rgba(212,175,55,0.12)] hover:shadow-[0_8px_40px_rgba(212,175,55,0.2)] hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#FF6600]/20 flex items-center justify-center text-[#FF6600] group-hover:scale-110 transition-transform duration-500 border border-[#D4AF37]/40">
                      <item.icon className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg md:text-xl font-bold text-[#1a1a1a] mb-2 md:mb-3 group-hover:text-[#FF6600] transition-colors uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[#5a5a5a] font-light text-base md:text-lg leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="pt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/facilitation-export')}
                className="group relative px-8 py-5 md:px-12 md:py-6 bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-full overflow-hidden transition-all duration-500 shadow-[0_8px_30px_rgba(212,175,55,0.35)] hover:shadow-[0_12px_50px_rgba(212,175,55,0.5)] flex justify-center w-full md:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-4 w-full">
                  {t("home.empower.program_btn")}
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform shrink-0" />
                </span>
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
