import React from 'react';
import { ChevronRight, Award, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import exportPort from '../assets/export_port_background.png';

export default function AboutPreview() {
  const { t } = useTranslation();
  // Using reliable local asset for Export Port
  const powerfulVisual = exportPort;

  return (
    <section className="bg-[#FFFAFA] overflow-hidden relative py-16 md:py-28">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch min-h-auto md:min-h-[650px] relative z-10 px-4 md:px-8 gap-0">
        {/* Visual Content */}
        <div className="w-full lg:w-1/2 relative h-[350px] md:h-[450px] lg:h-auto overflow-hidden rounded-[2rem] md:rounded-[3rem] lg:rounded-none lg:rounded-l-[3rem] shadow-2xl bg-[#050B18]">
          {/* Main Image */}
          <motion.div
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 opacity-90"
          >
            <img
              src={powerfulVisual}
              alt={t("home.aboutShort.img_alt")}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#DC2626]/10 via-transparent to-transparent"></div>
          </motion.div>

          {/* Floating Industrial Badge */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9 }}
            className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 bg-white/5 backdrop-blur-2xl p-4 md:p-8 rounded-2xl md:rounded-[2rem] shadow-[0_15px_60px_rgba(0,0,0,0.8)] border border-white/10"
          >
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-[#DC2626] rounded-xl flex items-center justify-center text-white shadow-xl shrink-0">
                <Award className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h4 className="font-black text-white mb-1 uppercase tracking-[0.3em] text-[9px] md:text-[10px]">{t("home.aboutShort.badge_title")}</h4>
                <p className="text-xs md:text-sm text-neutral-300 font-light leading-relaxed">
                  {t("home.aboutShort.badge_desc")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Textual Content */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-8 md:space-y-10 bg-white shadow-2xl rounded-[2rem] md:rounded-[3rem] lg:rounded-none lg:rounded-r-[3rem] border border-neutral-100 mt-4 lg:mt-0">
          <div className="space-y-4 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              <div className="w-12 md:w-16 h-1 md:h-2 bg-[#DC2626]"></div>
              <p className="text-[#DC2626] font-black uppercase tracking-[0.5em] text-[9px] md:text-[10px] flex items-center gap-2">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#DC2626] animate-pulse"></span>
                {t("home.aboutShort.ambition")}
              </p>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-neutral-900 leading-[1.1]"
            >
              {t("home.aboutShort.title")} <br />
              <span className="text-[#FF6600] font-serif italic font-light">
                {t("home.aboutShort.subtitle")}
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-neutral-500 font-light leading-relaxed border-l-4 border-[#FF6600] pl-6 md:pl-8"
          >
            {t("home.aboutShort.desc")}
          </motion.p>

          <div className="space-y-4">
            {[
              { icon: ShieldCheck, title: "home.aboutShort.points.trust.title", desc: "home.aboutShort.points.trust.desc", color: "#DC2626" },
              { icon: Zap, title: "home.aboutShort.points.efficiency.title", desc: "home.aboutShort.points.efficiency.desc", color: "#FF6600" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className="group flex gap-6 p-6 rounded-2xl bg-neutral-50 hover:bg-white border-2 border-transparent hover:border-neutral-100 transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-[#DC2626] group-hover:text-white"
                  style={{
                    backgroundColor: `${item.color}10`,
                    color: item.color
                  }}
                >
                  <item.icon size={22} />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-neutral-800 uppercase tracking-[0.2em] text-[10px] mb-1 group-hover:text-[#DC2626] transition-colors">
                    {t(item.title)}
                  </h4>
                  <p className="text-sm text-neutral-500 font-light leading-relaxed">
                    {t(item.desc)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="pt-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 md:px-10 md:py-5 bg-[#DC2626] text-white font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px] rounded-full transition-all duration-500 shadow-[0_10px_40px_rgba(220,38,38,0.3)] flex items-center justify-center gap-4 w-full md:w-auto"
            >
              {t("home.aboutShort.button")}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform shrink-0" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
