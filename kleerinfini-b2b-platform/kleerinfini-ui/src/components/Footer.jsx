import React, { useState, useEffect } from "react";
import { Facebook, Twitter, Linkedin, Instagram, Globe, ChevronDown, ShieldCheck, MapPin, Phone, CreditCard, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import wiseLogo from "../assets/images/wise-logo.svg";
import visaBrand from "../assets/images/visa_brand.png";
import paymentExtra from "../assets/images/payment_extra.png";
import mastercardLogo from "../assets/images/mastercard-logo.svg";
import brandLogo from "../assets/logo.png";


export default function Footer() {
  const { t, i18n } = useTranslation();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [algiersTime, setAlgiersTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Algiers is GMT+1. 
      // We can use Intl.DateTimeFormat for a robust timezone handling
      const options = {
        timeZone: 'Africa/Algiers',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const timeString = new Intl.DateTimeFormat('fr-FR', options).format(now);
      setAlgiersTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const languages = [
    { code: "fr", name: "FRANÇAIS", flag: "https://flagcdn.com/w40/fr.png" },
    { code: "en", name: "ENGLISH", flag: "https://flagcdn.com/w40/us.png" },
    { code: "ar", name: "العربية", flag: "https://flagcdn.com/w40/dz.png" },
    { code: "es", name: "ESPAÑOL", flag: "https://flagcdn.com/w40/es.png" },
    { code: "tr", name: "TÜRKÇE", flag: "https://flagcdn.com/w40/tr.png" },
    { code: "it", name: "ITALIANO", flag: "https://flagcdn.com/w40/it.png" },
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setLanguageOpen(false);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] text-white pt-16 md:pt-24 pb-8 md:pb-12 px-4 sm:px-6 md:px-12 lg:px-20 border-t border-orange-500/10 relative">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* SEO CATEGORIES HUB (Alibaba/Amazon Style) */}
        <div className="border-b border-white/5 pb-12 md:pb-16 mb-12 md:mb-20">
          <h4 className="text-[10px] md:text-xs font-black mb-8 md:mb-12 uppercase tracking-[0.2em] text-[#FF6600] opacity-80 flex items-center justify-center md:justify-start gap-4">
            <span className="w-8 md:w-12 h-px bg-[#FF6600]/30 hidden md:block"></span>
            {t("home.footer.categories_title")}
            <span className="w-8 md:w-12 h-px bg-[#FF6600]/30 hidden md:block"></span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-x-12 md:gap-y-16">
            {/* Column 1: Agroalimentaire & Terroir */}
            <div className="space-y-4 md:space-y-6">
              <h5 className="text-[11px] md:text-sm font-bold text-white uppercase tracking-wider border-l-2 border-[#FF6600] pl-3">{t("home.footer.categories.agro_terroir")}</h5>
              <ul className="space-y-3">
                {[
                  { id: 1, name: t("home.events.category_names.cat1") },
                  { id: 25, name: t("home.events.category_names.cat25") },
                  { id: 26, name: t("home.events.category_names.cat26") },
                  { id: 27, name: t("home.events.category_names.cat27") },
                  { id: 49, name: t("home.events.category_names.cat49") },
                  { id: 50, name: t("home.events.category_names.cat50") },
                  { id: 52, name: t("home.events.category_names.cat52") },
                  { id: 55, name: t("home.events.category_names.cat55") },
                  { id: 4, name: t("home.events.category_names.cat4") },
                  { id: 48, name: t("home.events.category_names.cat48") }
                ].map((cat) => (
                  <li key={cat.id}>
                    <a href={`/category/${cat.id}`} className="text-white hover:text-[#FF6600] transition-colors text-sm font-normal hover:underline decoration-[#FF6600]/50 underline-offset-4">{cat.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Industrie & Énergie */}
            <div className="space-y-4 md:space-y-6">
              <h5 className="text-[11px] md:text-sm font-bold text-white uppercase tracking-wider border-l-2 border-[#FF6600] pl-3">{t("home.footer.categories.indus_energy")}</h5>
              <ul className="space-y-3">
                {[
                  { id: 36, name: t("home.events.category_names.cat36") },
                  { id: 6, name: t("home.events.category_names.cat6") },
                  { id: 3, name: t("home.events.category_names.cat3") },
                  { id: 47, name: t("home.events.category_names.cat47") },
                  { id: 29, name: t("home.events.category_names.cat29") },
                  { id: 30, name: t("home.events.category_names.cat30") },
                  { id: 43, name: t("home.events.category_names.cat43") },
                  { id: 44, name: t("home.events.category_names.cat44") },
                  { id: 7, name: t("home.events.category_names.cat7") },
                  { id: 2, name: t("home.events.category_names.cat2") },
                  { id: 53, name: t("home.events.category_names.cat53") }
                ].map((cat) => (
                  <li key={cat.id}>
                    <a href={`/category/${cat.id}`} className="text-white hover:text-[#FF6600] transition-colors text-sm font-normal hover:underline decoration-[#FF6600]/50 underline-offset-4">{cat.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Construction & Habitat */}
            <div className="space-y-4 md:space-y-6">
              <h5 className="text-[11px] md:text-sm font-bold text-white uppercase tracking-wider border-l-2 border-[#FF6600] pl-3">{t("home.footer.categories.construction_habitat")}</h5>
              <ul className="space-y-3">
                {[
                  { id: 31, name: t("home.events.category_names.cat31") },
                  { id: 51, name: t("home.events.category_names.cat51") },
                  { id: 54, name: t("home.events.category_names.cat54") },
                  { id: 56, name: t("home.events.category_names.cat56") },
                  { id: 57, name: t("home.events.category_names.cat57") },
                  { id: 34, name: t("home.events.category_names.cat34") },
                  { id: 35, name: t("home.events.category_names.cat35") },
                  { id: 39, name: t("home.events.category_names.cat39") },
                  { id: 46, name: t("home.events.category_names.cat46") },
                  { id: 5, name: t("home.events.category_names.cat5") },
                  { id: 42, name: t("home.events.category_names.cat42") }
                ].map((cat) => (
                  <li key={cat.id}>
                    <a href={`/category/${cat.id}`} className="text-white hover:text-[#FF6600] transition-colors text-sm font-normal hover:underline decoration-[#FF6600]/50 underline-offset-4">{cat.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Santé, Beauté & Services */}
            <div className="space-y-4 md:space-y-6">
              <h5 className="text-[11px] md:text-sm font-bold text-white uppercase tracking-wider border-l-2 border-[#FF6600] pl-3">{t("home.footer.categories.sante_beaute")}</h5>
              <ul className="space-y-3">
                {[
                  { id: 8, name: t("home.events.category_names.cat8") },
                  { id: 40, name: t("home.events.category_names.cat40") },
                  { id: 41, name: t("home.events.category_names.cat41") },
                  { id: 33, name: t("home.events.category_names.cat33") },
                  { id: 61, name: t("home.events.category_names.cat61") },
                  { id: 45, name: t("home.events.category_names.cat45") },
                  { id: 58, name: t("home.events.category_names.cat58") },
                  { id: 59, name: t("home.events.category_names.cat59") },
                  { id: 60, name: t("home.events.category_names.cat60") },
                  { id: 62, name: t("home.events.category_names.cat62") },
                  { id: 19, name: t("home.events.category_names.cat19") },
                  { id: 64, name: t("home.events.category_names.cat64") }
                ].map((cat) => (
                  <li key={cat.id}>
                    <a href={`/category/${cat.id}`} className="text-white hover:text-[#FF6600] transition-colors text-sm font-normal hover:underline decoration-[#FF6600]/50 underline-offset-4">{cat.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-16 mb-12 md:mb-20">

          {/* Brand Identity */}
          <div className="space-y-6">
            <div className="flex flex-row items-center gap-4 -ml-4 md:-ml-8">
              <img src={brandLogo} alt="Kleer Infini" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
              <div className="space-y-2 md:space-y-3">
                <h3 className="text-2xl md:text-3xl font-bold font-display tracking-[0.15em] text-white whitespace-nowrap">
                  KLEER<span className="text-[#FF6600]" style={{ textShadow: "0 0 20px rgba(255, 102, 0, 0.8)" }}> INFINI</span>
                </h3>
                <div className="h-1 w-8 md:w-10 bg-[#FF6600] rounded-full shadow-[0_0_20px_rgba(255,102,0,0.8)]"></div>
              </div>
            </div>
            <p className="text-white leading-relaxed text-xs md:text-sm font-light max-w-xs pt-4">
              {t("home.footer.desc")}
            </p>
            {/* Payments Section */}
            <div className="pt-6 border-t border-white/5">
              <p className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4">{t("home.footer.payments.title")}</p>
              <div className="flex flex-col gap-3">
                {/* Bank Transfer */}
                <div className="flex items-center gap-4 px-4 py-3 bg-white/5 rounded-2xl border border-white/10 group cursor-default hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/10 group-hover:bg-white/[0.07] transition-all">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M2 10l10-7 10 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-white uppercase tracking-wider leading-none">{t("home.footer.payments.bank_transfer")}</p>
                    <p className="text-[9px] text-white uppercase tracking-tighter font-medium">{t("home.footer.payments.bank_transfer_subtitle")}</p>
                  </div>
                </div>
                {/* Visa & Mastercard - Official Standard */}
                <div className="flex items-center gap-4 px-4 py-3 bg-white/5 rounded-2xl border border-white/10 group cursor-default hover:border-orange-500/30 transition-all duration-300 backdrop-blur-sm">
                  <div className="flex items-center gap-2 h-8">
                    <img src={visaBrand} alt="Visa & Mastercard" className="h-8 w-auto object-contain rounded-lg" />
                    <img src={paymentExtra} alt="Payment Method" className="h-8 w-auto object-contain rounded-lg border border-white/10" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-white uppercase tracking-wider leading-none">{t("home.footer.payments.cards")}</p>
                    <p className="text-[11px] text-white uppercase tracking-tighter font-medium">Visa & Mastercard</p>
                  </div>
                </div>
                {/* PayPal & Wise - Official Standard */}
                <div className="flex items-center gap-4 px-4 py-3 bg-white/5 rounded-2xl border border-white/10 group cursor-default hover:border-[#FF6600]/30 transition-all duration-300 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    {/* PayPal Official */}
                    <div className="w-12 h-8 rounded bg-white flex items-center justify-center border border-white/10 shadow-sm p-1">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="w-full h-full object-contain" />
                    </div>
                    {/* Wise Official */}
                    <div className="w-12 h-8 rounded bg-white flex items-center justify-center border border-white/10 shadow-sm p-1">
                      <img src={wiseLogo} alt="Wise" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-white uppercase tracking-wider leading-none">{t("home.footer.payments.digital_solutions")}</p>
                    <p className="text-[9px] text-white uppercase tracking-tighter font-medium">{t("home.footer.payments.digital_solutions_subtitle")}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Navigation Links */}
          <div className="mt-8 md:mt-0">
            <h4 className="text-[10px] md:text-xs font-black mb-6 md:mb-8 uppercase tracking-[0.2em] text-white">
              {t("home.footer.navigation")}
            </h4>
            <ul className="space-y-3 md:space-y-4">
              {[
                { key: "univers", link: "#" },
                { key: "showroom", link: "/products" },
                { key: "carte", link: "/producers" },
                { key: "partenaire", link: "/producer-inscription" },
                { key: "producerLogin", link: "/producer-login", isSpecial: true },
                { key: "sitemap", link: "#" },
                { key: "faq", link: "#" }
              ].map((item) => (
                <li key={item.key}>
                  <a href={item.link} className={`text-white hover:text-white transition-all text-sm font-light tracking-wide flex items-center group ${item.isSpecial ? 'text-sky-400 font-medium' : ''}`}>
                    <span className={`w-0 group-hover:w-4 h-px bg-[#FF6600] mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100`}></span>
                    {t(`home.footer.${item.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Excellence Links */}
          <div className="mt-8 md:mt-0">
            <h4 className="text-[10px] md:text-[11px] font-black mb-6 md:mb-8 uppercase tracking-[0.3em] text-white">
              {t("home.footer.excellence")}
            </h4>
            <ul className="space-y-3 md:space-y-4">
              {[
                { key: "savoirFaire", link: "#" },
                { key: "conciergerie", link: "#" },
                { key: "buyerLogin", link: "/login", isSpecial: true },
                { key: "mentions", link: "/mentions" },
                { key: "contact", link: "#" }
              ].map((item) => (
                <li key={item.key}>
                  <a href={item.link} className={`text-white hover:text-white transition-all text-[13px] font-light tracking-wide flex items-center group ${item.isSpecial ? 'text-sky-400 font-medium' : ''}`}>
                    <span className={`w-0 group-hover:w-4 h-px bg-[#FF6600] mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100`}></span>
                    {t(`home.footer.${item.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Global Presence & Language Selector */}
          <div className="space-y-6 md:space-y-8 mt-8 md:mt-0">
            <div className="space-y-4 md:space-y-6">
              <p className="text-[10px] md:text-xs font-black text-[#FF6600] uppercase tracking-wider opacity-80">{t("home.footer.contact_title")}</p>
              <div className="flex flex-col gap-2 md:gap-2.5">
                <a href="mailto:contact@kleerinfini-export.com" className="text-white hover:text-white transition-colors text-sm font-light flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#FF6600]/30">@</span>
                  contact@kleerinfini-export.com
                </a>
                <a href="mailto:commercial@kleerinfini-export.com" className="text-white hover:text-white transition-colors text-sm font-light flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#FF6600]/30">@</span>
                  commercial@kleerinfini-export.com
                </a>
                <a href="mailto:direction@kleerinfini-export.com" className="text-white hover:text-white transition-colors text-sm font-light flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#FF6600]/30">@</span>
                  direction@kleerinfini-export.com
                </a>
                <div className="pt-2 flex flex-col gap-2">
                  <div className="text-white text-xs font-light flex items-start gap-2">
                    <MapPin size={14} className="text-[#FF6600] mt-0.5" />
                    <span>{t("home.footer.address")}</span>
                  </div>
                  <a href="tel:+213540836321" className="text-white hover:text-white transition-colors text-xs font-light flex items-center gap-2">
                    <Phone size={14} className="text-[#FF6600]" />
                    +213 540 836 321
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4 pb-4">
              {[
                { Icon: Linkedin, href: "#", color: "#0077B5", bg: "rgba(0, 119, 181, 0.1)" },
                { Icon: Facebook, href: "#", color: "#1877F2", bg: "rgba(24, 119, 242, 0.1)" },
                { Icon: Instagram, href: "#", color: "#833AB4", bg: "rgba(131, 58, 180, 0.1)" },
                { Icon: Twitter, href: "#", color: "#1DA1F2", bg: "rgba(29, 161, 242, 0.1)" }
              ].map(({ Icon, href, color, bg }, idx) => (
                <motion.a
                  key={idx}
                  href={href}
                  whileHover={{ y: -4 }}
                  style={{ backgroundColor: bg, borderColor: color }}
                  className="p-2.5 rounded-xl border transition-all duration-300 group"
                >
                  <Icon
                    size={18}
                    className="transition-colors duration-300"
                    color={color}
                  />
                </motion.a>
              ))}
            </div>

            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white pt-8 border-t border-white/5">
              {t("home.footer.presence")}
            </h4>
            <div className="relative">
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="w-full bg-white/5 border border-white/10 px-6 py-3.5 rounded-2xl flex items-center justify-between hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 group backdrop-blur-md shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <img src={currentLang.flag} alt={currentLang.name} className="w-5 h-3.5 object-cover rounded-sm shadow-sm" />
                  <span className="text-white font-medium tracking-[0.1em] text-xs uppercase">{currentLang.name}</span>
                </div>
                <ChevronDown size={14} className={`text-white transition-transform duration-500 ${languageOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {languageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    className="absolute bottom-full left-0 right-0 mb-3 bg-[#121212] backdrop-blur-2xl rounded-2xl shadow-2xl z-50 border border-white/10 overflow-hidden ring-1 ring-black/50"
                  >
                    <div className="py-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className="w-full px-5 py-3.5 text-left hover:bg-white/5 flex items-center gap-4 transition-all group"
                        >
                          <img
                            src={lang.flag}
                            alt={lang.name}
                            className={`w-5 h-3.5 object-cover rounded-sm shadow-sm transition-transform group-hover:scale-110 ${i18n.language === lang.code ? 'ring-1 ring-orange-500/50' : 'opacity-70 group-hover:opacity-100'}`}
                          />
                          <span className={`text-[11px] tracking-widest uppercase flex-1 ${i18n.language === lang.code ? 'text-[#FF6600] font-bold' : 'text-white group-hover:text-white'}`}>
                            {lang.name}
                          </span>
                          {i18n.language === lang.code && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6600] shadow-[0_0_8px_rgba(242,92,5,0.6)]"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="text-white text-sm font-normal leading-relaxed tracking-wide italic border-l border-orange-500/20 pl-4">
              {t("home.footer.mission_statement")}
            </p>
          </div>
        </div>

        {/* Security Bar */}
        <div className="py-6 md:py-8 border-y border-white/5 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 group">
          <div className="flex items-center gap-2 md:gap-2.5 px-4 md:px-6 py-2 md:py-2.5 bg-white/5 rounded-full border border-white/5 group-hover:border-orange-500/20 transition-all duration-500 shadow-inner">
            <ShieldCheck size={14} className="text-[#FF6600] md:w-4 md:h-4" />
            <p className="text-[10px] md:text-xs text-white font-bold uppercase tracking-[0.1em] whitespace-nowrap">
              {t("home.footer.security_secure")}
            </p>
          </div>
          <span className="hidden md:inline text-white">•</span>
          <p className="text-[10px] md:text-xs text-white font-medium uppercase tracking-[0.1em]">
            {t("home.footer.security_confidential")}
          </p>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 md:pt-12 flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] rounded-xl border border-white/5 backdrop-blur-sm group hover:border-[#FF6600]/30 transition-all duration-500">
              <div className="relative">
                <Clock size={14} className="text-[#FF6600]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF6600] rounded-full animate-ping opacity-75"></span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF6600] rounded-full opacity-75"></span>
              </div>
              <p className="text-xs tracking-[0.15em] font-bold uppercase text-white">
                {t("home.footer.alger_time")} <span className="text-white font-black ml-1 tabular-nums">{algiersTime}</span>
              </p>
            </div>
            <p className="text-white text-[11px] tracking-[0.2em] uppercase font-medium">
              © {currentYear} <a href="/privacy" className="text-white hover:text-[#FF6600] transition-colors">KLEER INFINI EXPORT</a>. {t("home.footer.rights")}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 lg:gap-12 w-full lg:w-auto">
            {["privacy", "terms", "cookies"].map((key) => (
              <a key={key} href={`/${key}`} className="text-white hover:text-[#FF6600] text-[10px] md:text-xs uppercase tracking-[0.1em] transition-colors font-medium relative group text-center">
                {t(`home.footer.${key}`)}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#FF6600] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
