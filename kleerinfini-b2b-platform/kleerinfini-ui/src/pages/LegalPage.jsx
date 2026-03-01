import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Gavel, Cookie, FileText, ArrowLeft, Globe } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LegalPage = () => {
    const { type } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const legalTypes = {
        privacy: {
            title: t("legal.privacy.title"),
            icon: <Shield className="text-blue-500" size={32} />,
            contentKey: "legal.privacy.content"
        },
        terms: {
            title: t("legal.terms.title"),
            icon: <Gavel className="text-orange-500" size={32} />,
            contentKey: "legal.terms.content"
        },
        cookies: {
            title: t("legal.cookies.title"),
            icon: <Cookie className="text-amber-600" size={32} />,
            contentKey: "legal.cookies.content"
        },
        mentions: {
            title: t("legal.mentions.title"),
            icon: <FileText className="text-emerald-500" size={32} />,
            contentKey: "legal.mentions.content"
        }
    };

    const currentType = legalTypes[type] || legalTypes.privacy;

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!legalTypes[type] && type) {
            navigate("/privacy", { replace: true });
        }
    }, [type, navigate]);

    return (
        <div className="bg-[#FFFAFA] min-h-screen font-sans selection:bg-[#FF6600] selection:text-white">
            <Header />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 bg-[#0A0A0A] overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500 rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500 rounded-full blur-[150px]"></div>
                </div>

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl mb-8"
                    >
                        {currentType.icon}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 uppercase tracking-tight"
                    >
                        {currentType.title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-center gap-2 text-neutral-400 font-light"
                    >
                        <Globe size={16} />
                        <span className="text-sm tracking-widest uppercase">{t("legal.last_update")} : {new Date().toLocaleDateString()}</span>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <main className="max-w-4xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-[40px] p-8 md:p-16 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.05)] border border-neutral-100"
                >
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-[#FF6600] text-sm font-bold uppercase tracking-widest mb-12 hover:gap-4 transition-all"
                    >
                        <ArrowLeft size={18} /> {t("legal.back_home")}
                    </button>

                    <div className="prose prose-orange lg:prose-xl max-w-none text-neutral-600 font-light leading-relaxed">
                        {/* Split content by newlines to render paragraphs */}
                        {t(currentType.contentKey, { defaultValue: "" }).split('\n').map((paragraph, index) => (
                            paragraph.trim() ? <p key={index} className="mb-6">{paragraph}</p> : <br key={index} />
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-sm text-neutral-400 italic">
                            {t("legal.disclaimer")}
                        </p>
                        <div className="flex gap-4">
                            {Object.keys(legalTypes).filter(k => k !== type).map(k => (
                                <button
                                    key={k}
                                    onClick={() => navigate(`/${k}`)}
                                    className="text-xs font-black uppercase tracking-wider text-neutral-400 hover:text-[#FF6600] transition-colors"
                                >
                                    {legalTypes[k].title}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default LegalPage;
