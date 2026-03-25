import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
    Zap, ArrowUpRight, CheckCircle, Globe, ShieldCheck,
    BarChart3, Truck, Gavel, Cpu, Network
} from 'lucide-react';
import { FaRobot, FaBrain, FaBuilding, FaHandshake } from 'react-icons/fa';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Helmet } from "react-helmet-async";
import IMAGE_HERO_OLD from "../../assets/essence_1.png";
import IMAGE_HERO_NEW from "../../assets/images/hero-about-bg.jpg";

export default function AboutPage() {
    const { t } = useTranslation();

    const azServices = [
        { l: "A", s: t("about_page.services.a"), icon: <Zap size={20} /> },
        { l: "B", s: t("about_page.services.b"), icon: <Network size={20} /> },
        { l: "C", s: t("about_page.services.c"), icon: <CheckCircle size={20} /> },
        { l: "D", s: t("about_page.services.d"), icon: <Truck size={20} /> },
        { l: "E", s: t("about_page.services.e"), icon: <BarChart3 size={20} /> },
        { l: "F", s: t("about_page.services.f"), icon: <Globe size={20} /> },
        { l: "G", s: t("about_page.services.g"), icon: <ShieldCheck size={20} /> },
        { l: "H", s: t("about_page.services.h"), icon: <Cpu size={20} /> },
        { l: "I", s: t("about_page.services.i"), icon: <FaBrain size={20} /> },
        { l: "J", s: t("about_page.services.j"), icon: <Gavel size={20} /> },
        { l: "L", s: t("about_page.services.l"), icon: <Truck size={20} /> },
        { l: "M", s: t("about_page.services.m"), icon: <FaHandshake size={20} /> },
        { l: "N", s: t("about_page.services.n"), icon: <FaRobot size={20} /> },
        { l: "O", s: t("about_page.services.o"), icon: <BarChart3 size={20} /> },
        { l: "P", s: t("about_page.services.p"), icon: <FaBuilding size={20} /> },
        { l: "S", s: t("about_page.services.s"), icon: <ShieldCheck size={20} /> },
        { l: "T", s: t("about_page.services.t"), icon: <BarChart3 size={20} /> },
        { l: "X", s: t("about_page.services.x"), icon: <Zap size={20} /> }
    ];

    return (
        <div className="bg-[#FFFAFA] min-h-screen font-sans text-neutral-900 selection:bg-[#DC2626] selection:text-white">
            <Helmet>
                <title>{t("about.title")} | Kleer Infini</title>
                <meta name="description" content={t("about.description")} />
            </Helmet>
            <Header />

            {/* INDUSTRIAL HERO SECTION */}
            <div className="relative h-[60vh] md:h-[75vh] min-h-[500px] flex items-center overflow-hidden bg-[#0a0a0a]">
                {/* Background Image - Sharp and Vivid with Professional Filters */}
                <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
                    <img
                        src={IMAGE_HERO_NEW}
                        onError={(e) => { e.target.src = IMAGE_HERO_OLD }}
                        alt="Kleer Infini Excellence"
                        className="w-full h-full object-cover saturate-[1.15] contrast-[1.05] brightness-[0.85] transition-transform duration-[20s] hover:scale-105"
                    />
                    {/* Premium dark gradient overlay for optimal text contrast and sleek aesthetics */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/30 z-10"></div>
                </div>

                <div className="relative z-20 px-6 sm:px-12 max-w-7xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#DC2626] text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm mb-6 border-l-4 border-white/30 backdrop-blur-md">
                            {t("about_page.hero.badge")}
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif font-bold mb-6 tracking-tight leading-[1.1] text-white">
                            Kleer <span className="text-[#FF6600] italic">Infini</span>
                        </h1>

                        <div className="w-16 md:w-24 h-1 md:h-1.5 bg-[#DC2626] mb-6 md:mb-8"></div>

                        <h2 className="text-xl sm:text-2xl md:text-4xl font-light text-neutral-200 tracking-wide max-w-2xl leading-relaxed">
                            {t("about_page.hero.subtitle_start")}
                            <span className="font-bold text-white italic underline decoration-[#DC2626]">
                                {t("about_page.hero.az")}
                            </span>
                            {t("about_page.hero.subtitle_end")}
                        </h2>
                    </motion.div>
                </div>
            </div>

            {/* A-Z SERVICES GRID */}
            <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start mb-16 md:mb-24">
                    <div className="lg:w-1/3">
                        <div className="lg:sticky lg:top-32 space-y-4 md:space-y-6">
                            <span className="text-[#DC2626] font-black tracking-[0.4em] text-xs uppercase">
                                {t("about_page.ecosystem.badge")}
                            </span>
                            <h2 className="text-4xl md:text-6xl font-serif font-bold text-neutral-900 leading-tight">
                                {t("about_page.ecosystem.title_start")}
                                <span className="italic text-[#FF6600]">
                                    {t("about_page.ecosystem.title_italic")}
                                </span>
                            </h2>
                            <p className="text-neutral-500 text-lg leading-relaxed font-light">
                                {t("about_page.ecosystem.desc")}
                            </p>
                            <div className="p-6 bg-neutral-950 rounded-2xl border-l-4 border-[#DC2626] shadow-2xl">
                                <p className="text-neutral-400 text-sm italic font-light">
                                    "{t("about_page.ecosystem.quote")}"
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {azServices.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="group p-6 bg-white border border-neutral-100 rounded-xl hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] transition-all duration-300 flex items-center gap-6"
                            >
                                <div className="w-12 h-12 rounded-lg bg-neutral-50 flex items-center justify-center text-[#DC2626] group-hover:bg-[#DC2626] group-hover:text-white transition-colors duration-300 shrink-0">
                                    {item.icon}
                                </div>
                                <div className="min-w-0">
                                    <span className="text-sm font-black text-neutral-300 group-hover:text-[#FF6600] transition-colors">{item.l}</span>
                                    <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-800 break-words">{item.s}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PARTNERSHIPS SECTION (DJAZAGRO STYLE) */}
            <section className="bg-neutral-950 py-20 md:py-32 relative overflow-hidden text-white">
                <div className="absolute inset-0 bg-[#DC2626]/5 z-0" />
                <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full z-0 opacity-10 lg:opacity-20">
                    <img src="https://images.unsplash.com/photo-1540575861501-7ad058df3283?auto=format&fit=crop&q=80&w=1920" alt="Networking" className="w-full h-full object-cover" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="lg:w-1/2 space-y-8 md:space-y-10">
                            <div className="space-y-4">
                                <span className="text-[#FF6600] font-black tracking-[0.4em] text-xs uppercase">
                                    {t("about_page.expansion.badge")}
                                </span>
                                <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
                                    {t("about_page.expansion.title")} <br className="hidden md:block" />
                                    <span className="text-neutral-500 italic">
                                        {t("about_page.expansion.title_italic")}
                                    </span>
                                </h2>
                            </div>

                            <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed text-neutral-400">
                                <p>{t("about_page.expansion.p1")}</p>
                                <p>{t("about_page.expansion.p2")}</p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative w-full sm:w-auto px-12 py-5 bg-[#DC2626] text-white rounded-full transition-all duration-500 overflow-hidden shadow-[0_10px_40px_rgba(220,38,38,0.4)]"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                <span className="relative flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.2em]">
                                    {t("about_page.expansion.button")} <ArrowUpRight size={18} />
                                </span>
                            </motion.button>
                        </div>

                        <div className="lg:w-1/2 grid grid-cols-2 gap-4 w-full">
                            <div className="space-y-4">
                                <div className="h-48 md:h-64 rounded-3xl overflow-hidden transition-all duration-700 shadow-2xl border border-white/10">
                                    <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" alt="Logistics Hub" className="w-full h-full object-cover" />
                                </div>
                                <div className="h-32 md:h-48 rounded-3xl overflow-hidden bg-[#DC2626] flex items-center justify-center p-4 md:p-8 text-center shadow-xl">
                                    <p className="font-serif font-bold text-xl md:text-3xl italic">Global Source</p>
                                </div>
                            </div>
                            <div className="space-y-4 pt-8 md:pt-12">
                                <div className="h-32 md:h-48 rounded-3xl overflow-hidden bg-[#FF6600] flex items-center justify-center p-4 md:p-8 text-center text-black shadow-xl">
                                    <p className="font-serif font-bold text-xl md:text-3xl italic">B2B Excellence</p>
                                </div>
                                <div className="h-48 md:h-64 rounded-3xl overflow-hidden transition-all duration-700 shadow-2xl border border-white/10">
                                    <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=800" alt="Industrial Excellence" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST BANNER */}
            <div className="bg-[#DC2626] py-8 md:py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <span className="text-2xl md:text-3xl font-serif font-bold text-white italic">KleerInfini.com</span>
                    <div className="flex items-center gap-8 md:gap-12 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                        {[
                            t("about_page.trust.security"),
                            t("about_page.trust.traceability"),
                            t("about_page.trust.compliance"),
                            t("about_page.trust.excellence")
                        ].map((text, i) => (
                            <span key={i} className="text-white/30 text-[10px] font-black tracking-[0.4em] whitespace-nowrap">{text}</span>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
