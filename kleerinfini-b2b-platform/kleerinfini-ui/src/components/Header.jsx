import React, { useState } from "react";
import { Menu, X, User, ArrowRight, Globe, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";

export default function Header({ theme = "dark" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isLight = theme === "light";
  const textColor = isLight ? "text-gray-900" : "text-white";
  const hoverColor = isLight ? "text-black" : "text-white";
  const borderColor = isLight ? "border-gray-200" : "border-white/10";
  const bgColor = isLight ? "bg-white/80" : "bg-white/5";

  const navLinks = [
    { name: t("home.nav.univers"), path: "/" },
    { name: t("home.nav.producers"), path: "/producers" },
    { name: t("home.nav.products"), path: "/products" },
  ];

  const languages = [
    { code: "fr", name: "Français", flag: "https://flagcdn.com/w40/fr.png" },
    { code: "en", name: "English", flag: "https://flagcdn.com/w40/us.png" },
    { code: "ar", name: "العربية", flag: "https://flagcdn.com/w40/dz.png" },
    { code: "es", name: "Español", flag: "https://flagcdn.com/w40/es.png" },
    { code: "tr", name: "Türkçe", flag: "https://flagcdn.com/w40/tr.png" },
    { code: "it", name: "Italiano", flag: "https://flagcdn.com/w40/it.png" },
  ];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
    setIsOpen(false);
  };

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <header className="absolute top-0 left-0 w-full z-50 px-6 py-1">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/" className="group">
            <img
              src={logo}
              alt="Kleer Infini"
              className={`h-8 w-auto object-contain transition-all ${isLight ? '' : 'brightness-0 invert'}`}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className={`hidden lg:flex items-center gap-10 ${bgColor} backdrop-blur-md px-8 py-1 rounded-full border ${borderColor} shadow-sm`}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`${textColor} hover:${hoverColor} text-[12px] font-bold tracking-[0.2em] uppercase transition-all flex items-center gap-1 group`}
            >
              {link.name}
              <div className="w-0 h-px bg-[#D4AF37] group-hover:w-full transition-all duration-300"></div>
            </Link>
          ))}

          {/* Language Selector Desktop */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={`flex items-center gap-3 ${textColor} hover:${hoverColor} text-[12px] font-bold tracking-[0.15em] uppercase transition-all bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-white/10`}
            >
              <img src={currentLang.flag} alt={currentLang.name} className="w-4 h-3 object-cover rounded-[1px]" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FF6600] to-[#D4AF37]">
                {currentLang.code}
              </span>
              <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            {langOpen && (
              <div className={`absolute top-full right-0 mt-4 w-44 ${isLight ? 'bg-white' : 'bg-[#121212]'} border ${borderColor} rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-xl`}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full flex items-center gap-4 px-4 py-3 ${isLight ? 'hover:bg-gray-50' : 'hover:bg-white/5'} rounded-xl transition-all group`}
                  >
                    <img src={lang.flag} alt={lang.name} className="w-4 h-3 object-cover rounded-[1px] shadow-sm transform group-hover:scale-110 transition-transform" />
                    <span className={`text-[12px] tracking-widest uppercase flex-1 text-left ${i18n.language === lang.code ? 'text-[#D4AF37] font-bold' : (isLight ? 'text-gray-600' : 'text-white group-hover:text-white')}`}>
                      {lang.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-6">
          <button
            onClick={() => navigate('/login')}
            className={`flex items-center gap-2 text-[12px] font-bold tracking-[0.2em] transition-all group px-5 py-2 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] ${isLight ? 'text-gray-900 border-gray-200' : 'text-white'}`}
          >
            <User size={16} className="text-[#D4AF37]" />
            {t("home.nav.accessVip")}
          </button>

          <button
            onClick={() => navigate('/producer-inscription')}
            className="px-6 py-3 text-[10px] tracking-[0.25em] font-bold rounded-xl bg-[#FF0000] text-white hover:bg-[#CC0000] hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] transition-all shadow-lg uppercase border border-white/10"
          >
            {t("home.nav.becomePartner")}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center gap-4">
          {/* Mobile Language Icon */}
          <button
            onClick={() => setIsOpen(true)}
            className={`p-3 ${bgColor} backdrop-blur-lg rounded-full ${isLight ? 'text-gray-900 border-gray-200' : 'text-white border-white/20'} border`}
          >
            <Globe size={20} />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-3 ${bgColor} backdrop-blur-lg rounded-full ${isLight ? 'text-gray-900 border-gray-200' : 'text-white border-white/20'} border`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className={`fixed inset-0 ${isLight ? 'bg-white' : 'bg-[#000]'} bg-opacity-98 z-[100] lg:hidden flex flex-col p-10 overflow-y-auto`}>
          <div className="flex justify-between items-center mb-16">
            <img
              src={logo}
              alt="Kleer Infini"
              className={`h-10 w-auto ${isLight ? '' : 'brightness-0 invert'}`}
            />
            <button onClick={() => setIsOpen(false)} className={`${isLight ? 'text-gray-500 hover:text-black' : 'text-white hover:text-white'}`}>
              <X size={32} />
            </button>
          </div>

          <nav className="flex flex-col gap-6 mb-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`${isLight ? 'text-gray-900' : 'text-white'} text-3xl font-bold font-display flex items-center gap-4 group`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
                <ArrowRight className="text-[#FF6600]" />
              </Link>
            ))}
          </nav>

          {/* Mobile Language Selector */}
          <div className="mb-12">
            <p className="text-[#D4AF37] text-[11px] font-bold tracking-[0.3em] uppercase mb-6">{t("language")}</p>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex items-center justify-between px-5 py-4 rounded-2xl border transition-all ${i18n.language === lang.code ? 'border-[#FF6600] bg-[#FF6600]/10 ' + (isLight ? 'text-black' : 'text-white') : (isLight ? 'border-gray-200 text-gray-500' : 'border-white/20 text-white')}`}
                >
                  <span className="text-sm font-medium">{lang.name}</span>
                  <img src={lang.flag} alt={lang.name} className="w-5 h-3.5 object-cover rounded-[1px]" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-4 pt-10">
            <button
              onClick={() => { navigate('/login'); setIsOpen(false); }}
              className={`w-full py-5 ${isLight ? 'text-gray-500 border-gray-200 bg-white/50' : 'text-white border-white/20 bg-white/5'} border rounded-2xl text-sm font-bold tracking-widest hover:border-white/40 backdrop-blur-md transition-all shadow-[0_4px_30px_rgba(0,0,0,0.1)]`}
            >
              {t("home.nav.accessVip")}
            </button>
            <button
              onClick={() => { navigate('/producer-inscription'); setIsOpen(false); }}
              className="w-full py-5 text-sm rounded-2xl font-bold tracking-widest uppercase bg-[#FF0000] text-white hover:bg-[#CC0000] transition-colors shadow-lg"
            >
              {t("home.nav.becomePartner")}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
