
import React from "react";
import {
    ShieldCheck,
    Award,
    Leaf,
    Globe,
    CheckCircle,
    FileCheck,
    Factory,
    Star,
    CheckSquare,
    ArrowRight,
    ClipboardCheck
} from "lucide-react";
import premiumBg from "../assets/certifications_bg_new.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CertificationsSection() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const certifications = [
        { name: "ISO", icon: <ShieldCheck size={32} />, color: "#D4AF37", desc: t("home.certifications.items.iso") },
        { name: "CE", icon: <Award size={32} />, color: "#C0C0C0", desc: t("home.certifications.items.ce") },
        { name: "HACCP", icon: <CheckCircle size={32} />, color: "#FF6600", desc: t("home.certifications.items.haccp") },
        { name: "BIO", icon: <Leaf size={32} />, color: "#4CAF50", desc: t("home.certifications.items.bio") },
        { name: "SGS", icon: <CheckSquare size={32} />, color: "#D4AF37", desc: t("home.certifications.items.sgs") },
        { name: "ECOCERT", icon: <Leaf size={32} />, color: "#81C784", desc: t("home.certifications.items.ecocert") },
        { name: "FDA", icon: <FileCheck size={32} />, color: "#90CAF9", desc: t("home.certifications.items.fda") },
        { name: "HALAL", icon: <Star size={32} />, color: "#FFD700", desc: t("home.certifications.items.halal") },
        { name: "GMP", icon: <Factory size={32} />, color: "#B0BEC5", desc: t("home.certifications.items.gmp") },
        { name: "COC", icon: <ClipboardCheck size={32} />, color: "#E5BE01", desc: t("home.certifications.items.coc") }
    ];

    return (
        <section className="py-16 md:py-32 px-4 md:px-6 relative overflow-hidden bg-[#0A0A0A]">
            {/* Background Ambience */}
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full z-0">
                <img
                    src={premiumBg}
                    alt="Premium Background"
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.65) contrast(1.05)' }}
                />
                {/* Luxury gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/70 via-transparent to-[#0A0A0A]/70" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="text-center mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-4"
                    >
                        <div className="h-[1px] w-12 bg-[#D4AF37]/50"></div>
                        <span className="text-[#D4AF37] uppercase tracking-[0.2em] text-xs font-bold">{t("home.certifications.quality_standards")}</span>
                        <div className="h-[1px] w-12 bg-[#D4AF37]/50"></div>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl md:text-5xl font-luxury !text-white"
                    >
                        {t("home.certifications.title")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D03F]">{t("home.certifications.subtitle")}</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="!text-white font-medium text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed italic"
                    >
                        {t("home.certifications.desc_main")}
                    </motion.p>
                </div>

                {/* Certifications Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-8 justify-center mb-24">
                    {/* Note: grid-cols-5 for larger screens to center items nicely or wrap them */}
                    {certifications.map((cert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/10 transition-colors duration-300"
                        >
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg"
                                style={{ backgroundColor: `${cert.color}15`, color: cert.color, border: `1px solid ${cert.color}30` }}
                            >
                                {cert.icon}
                            </div>
                            <h3 className="text-white font-bold text-lg mb-1">{cert.name}</h3>
                            <p className="text-gray-400 text-xs uppercase tracking-wide">{cert.desc}</p>

                            {/* Hover Glow */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </motion.div>
                    ))}
                </div>

                {/* Info Block & CTA */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-gradient-to-br from-white/5 to-transparent p-6 sm:p-8 md:p-10 rounded-3xl md:rounded-[3rem] border border-white/10 relative overflow-hidden">
                    {/* Decorative blurred blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6600]/10 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="space-y-4 md:space-y-6 relative z-10 text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl !text-white font-luxury">
                            {t("home.certifications.transparency_title")}
                        </h3>
                        <p className="text-gray-300 leading-relaxed font-light text-sm md:text-base">
                            {t("home.certifications.transparency_desc")}
                        </p>
                    </div>

                    <div className="flex justify-center md:justify-end relative z-10 pt-4 md:pt-0">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/products')}
                            className="group relative px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-[#D4AF37] to-[#FF6600] text-white font-bold uppercase tracking-widest text-[10px] md:text-xs rounded-full overflow-hidden shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.5)] transition-shadow duration-300 w-full sm:w-auto"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {t("home.certifications.explore_btn")}
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        </motion.button>
                    </div>
                </div>
            </div>
        </section>
    );
}
