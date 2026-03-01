import React from "react";
import signup from "../assets/signup.jpg";
import { ArrowRight, Globe, Building2, Gem, ShieldCheck, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CTASection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[600px] md:min-h-[800px] py-16 md:py-24 flex items-center overflow-hidden">
      {/* Parallax-style Background */}
      <div
        className="absolute inset-0 z-0 bg-fixed"
        style={{
          backgroundImage: `url(${signup})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Luxury Gradient Overlay - Radial focus */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.6)_0%,_rgba(0,0,0,0.9)_100%)] mix-blend-multiply"></div>
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/80 to-transparent opacity-90"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-20 w-full">
        <div className="max-w-3xl space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-[1px] bg-gradient-to-r from-[#FF6600] to-[#FF6600]"></div>
              <span className="text-[#D4AF37] font-bold uppercase tracking-[0.6em] text-[10px] font-cinzel glow-text">
                {t("home.cta.ready")}
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-white font-display-luxury leading-[1.05] drop-shadow-2xl">
              {t("home.cta.title")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FF6600] to-[#D4AF37] italic font-serif-luxury font-light">
                {t("home.cta.vision")}
              </span>
            </h2>
          </div>

          <p className="text-lg md:text-xl text-gray-200/90 font-light font-sans leading-relaxed max-w-2xl border-l-[3px] border-[#FF6600]/50 pl-6">
            {t("home.cta.desc")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-8">
            <button
              onClick={() => navigate('/producer-inscription')}
              className="relative overflow-hidden group bg-gradient-to-r from-[#FF6600] to-[#FF6600] px-8 py-5 md:px-12 md:py-6 rounded-full shadow-[0_10px_30px_rgba(243,112,33,0.3)] hover:shadow-[0_20px_40px_rgba(243,112,33,0.5)] transition-all duration-500 w-full sm:w-auto flex justify-center"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              <span className="relative flex items-center gap-4 text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">
                {t("home.cta.register")}
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>

            <button
              onClick={() => navigate('/categories')}
              className="group relative px-8 py-5 md:px-10 md:py-6 bg-transparent border border-[#D4AF37]/30 rounded-full overflow-hidden transition-all duration-500 hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] w-full sm:w-auto flex justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FF6600] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              <div className="relative flex items-center gap-3">
                <span className="text-[10px] md:text-xs font-bold text-[#D4AF37] group-hover:text-white uppercase tracking-[0.4em] transition-colors duration-500">
                  {t("home.cta.explore")}
                </span>
                <ArrowUpRight size={18} className="text-[#D4AF37] group-hover:text-white transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </button>
          </div>

          {/* Strategic Partners Section */}
          <div className="pt-10 md:pt-16 mt-8 border-t border-white/10">
            <p className="text-[#D4AF37] font-cinzel text-[10px] tracking-[0.4em] mb-6 uppercase text-center md:text-left">
              {t("home.cta.partners_title")}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 md:gap-12 opacity-70">
              {/* Partner 1: Alibaba */}
              <div className="group flex items-center gap-2 md:gap-3 hover:opacity-100 transition-opacity duration-300 cursor-default">
                <Globe size={20} className="md:w-6 md:h-6 text-white group-hover:text-[#FF6600] transition-colors" />
                <span className="text-lg md:text-xl font-bold text-white tracking-tight">Alibaba<span className="font-light">.com</span></span>
              </div>

              {/* Partner 2: Kompass */}
              <div className="group flex items-center gap-2 md:gap-3 hover:opacity-100 transition-opacity duration-300 cursor-default">
                <Building2 size={20} className="md:w-6 md:h-6 text-white group-hover:text-[#FF6600] transition-colors" />
                <span className="text-lg md:text-xl font-bold text-white tracking-wider">KOMPASS</span>
              </div>

              {/* Partner 3: Behance */}
              <div className="group flex items-center gap-2 md:gap-3 hover:opacity-100 transition-opacity duration-300 cursor-default">
                <Gem size={20} className="md:w-6 md:h-6 text-white group-hover:text-[#FF6600] transition-colors" />
                <span className="text-lg md:text-xl font-bold text-white tracking-tight">Behance</span>
              </div>

              {/* Partner 4: ICC/CCI */}
              <div className="group flex items-center gap-2 md:gap-3 hover:opacity-100 transition-opacity duration-300 cursor-default md:pl-4 border-l-0 md:border-l border-white/20">
                <ShieldCheck size={20} className="md:w-6 md:h-6 text-[#D4AF37]" />
                <div className="flex flex-col leading-none">
                  <span className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest">{t("home.cta.chamber_part1")}</span>
                  <span className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest">{t("home.cta.chamber_part2")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#FF6600] via-[#FF6600] to-transparent opacity-60"></div>
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF6600] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
    </section>
  );
}
