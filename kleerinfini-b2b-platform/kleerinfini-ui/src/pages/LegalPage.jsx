import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Shield, Gavel, Cookie, FileText, ArrowLeft, Globe,
    Building2, MessageCircle, Lock, Database, UserCheck,
    Phone, Mail, MapPin, Hash, Briefcase, CheckCircle2
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
const legalHeroBg = "/photorealistic-lawyer-environment.jpg";

/** ─── Reusable Info Card ─────────────────────────────────────── */
const InfoCard = ({ icon: Icon, iconColor, iconBg, title, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-4"
    >
        <div className={`inline-flex w-12 h-12 rounded-xl items-center justify-center ${iconBg}`}>
            <Icon size={22} className={iconColor} />
        </div>
        <h3 className="text-base font-bold text-neutral-900 tracking-tight">{title}</h3>
        <div className="text-sm text-neutral-600 leading-relaxed space-y-2">
            {children}
        </div>
    </motion.div>
);

/** ─── Reusable Row inside InfoCard ──────────────────────────── */
const Row = ({ icon: Icon, children }) => (
    <div className="flex items-start gap-2">
        <Icon size={14} className="text-[#FF6600] mt-0.5 shrink-0" />
        <span>{children}</span>
    </div>
);

/** ─── Privacy / Mentions content ───────────────────────────── */
const PrivacyContent = () => (
    <div className="space-y-10">
        {/* ── Company Identity Cards ── */}
        <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <span className="w-6 h-0.5 bg-[#FF6600] inline-block rounded-full"></span>
                Informations Légales & Identité de l'Éditeur
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1 — Identity */}
                <InfoCard icon={Building2} iconColor="text-orange-500" iconBg="bg-orange-50" title="Siège Social & RCN">
                    <Row icon={UserCheck}><strong>Responsable légal :</strong> Garoui Jugurtha</Row>
                    <Row icon={Building2}><strong>Dénomination :</strong> Kleer Infini Global Network</Row>
                    <Row icon={MapPin}><strong>Siège social :</strong> Local N°01, O-Yaich, Blida, Algérie</Row>
                    <Row icon={Hash}><strong>RCN :</strong> 09/01 – 5223198 A 19</Row>
                </InfoCard>

                {/* Card 2 — Export */}
                <InfoCard icon={Globe} iconColor="text-blue-500" iconBg="bg-blue-50" title="Domaine d'Exportation">
                    <Row icon={Briefcase}><strong>Exportation physique :</strong> Produits certifiés "Made in Algeria"</Row>
                    <Row icon={Globe}><strong>Exportation numérique :</strong> Services et solutions digitales B2B</Row>
                    <Row icon={CheckCircle2}><strong>Marché cible :</strong> Importateurs internationaux certifiés</Row>
                </InfoCard>

                {/* Card 3 — Contact */}
                <InfoCard icon={MessageCircle} iconColor="text-emerald-500" iconBg="bg-emerald-50" title="Support Direct">
                    <Row icon={Mail}><a href="mailto:direction@kleer-Infini.dz" className="text-[#FF6600] hover:underline">direction@kleer-Infini.dz</a></Row>
                    <Row icon={Mail}><a href="mailto:contact@kleer-Infini.dz" className="text-[#FF6600] hover:underline">contact@kleer-Infini.dz</a></Row>
                    <Row icon={Phone}><a href="https://wa.me/213540836321" target="_blank" rel="noreferrer" className="text-[#FF6600] hover:underline">WhatsApp : +213 540 836 321</a></Row>
                </InfoCard>
            </div>
        </section>

        {/* ── Privacy sections ── */}
        {[
            {
                num: "1", title: "Responsable du Traitement",
                icon: Shield, color: "text-blue-500",
                content: (
                    <p>Kleer Infini Global Network est l'unique responsable du traitement des données collectées sur cette plateforme. La protection des données de nos partenaires (Producteurs et Clients) est une priorité absolue. Tout traitement est effectué dans le respect du cadre légal algérien en vigueur.</p>
                )
            },
            {
                num: "2", title: "Données Collectées",
                icon: Database, color: "text-purple-500",
                content: (
                    <ul className="space-y-2 list-none">
                        <li className="flex gap-2 items-start"><CheckCircle2 size={15} className="text-[#FF6600] mt-0.5 shrink-0" /><span><strong>Données d'entreprise :</strong> Nom, Registre du commerce, adresse siège social.</span></li>
                        <li className="flex gap-2 items-start"><CheckCircle2 size={15} className="text-[#FF6600] mt-0.5 shrink-0" /><span><strong>Données de contact :</strong> Nom du responsable, email professionnel, numéro WhatsApp.</span></li>
                        <li className="flex gap-2 items-start"><CheckCircle2 size={15} className="text-[#FF6600] mt-0.5 shrink-0" /><span><strong>Données de transaction :</strong> Preuves de paiement, reçus de souscription.</span></li>
                    </ul>
                )
            },
            {
                num: "3", title: "Finalités du Traitement",
                icon: Briefcase, color: "text-orange-500",
                content: (
                    <ul className="space-y-2 list-none">
                        {[
                            "Gestion des comptes Producteurs et Clients.",
                            "Mise en relation via la carte interactive de producteurs.",
                            "Sécurisation des paiements et vérification des certifications.",
                            "Envoi de notifications sur les nouvelles opportunités d'export."
                        ].map((item, i) => (
                            <li key={i} className="flex gap-2 items-start">
                                <CheckCircle2 size={15} className="text-[#FF6600] mt-0.5 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                )
            },
            {
                num: "4", title: "Partage des Données",
                icon: Globe, color: "text-blue-500",
                content: (
                    <p>Les données de profil des producteurs sont visibles par les clients connectés pour faciliter le commerce B2B. <strong>Kleer Infini ne vend jamais de bases de données à des tiers.</strong> Aucune transmission commerciale de données personnelles n'est effectuée sans consentement explicite.</p>
                )
            },
            {
                num: "5", title: "Conservation & Sécurité",
                icon: Lock, color: "text-emerald-500",
                content: (
                    <div className="space-y-2">
                        <p><strong>Durée :</strong> Les données sont conservées tant que le compte est actif sur la plateforme.</p>
                        <p><strong>Sécurité :</strong> Protocoles HTTPS, stockage sur serveurs protégés (Render / Cloudinary), chiffrement des mots de passe via Django Auth.</p>
                    </div>
                )
            },
            {
                num: "6", title: "Vos Droits",
                icon: UserCheck, color: "text-orange-500",
                content: (
                    <ul className="space-y-2 list-none">
                        <li className="flex gap-2 items-start"><CheckCircle2 size={15} className="text-[#FF6600] mt-0.5 shrink-0" /><span>Accéder, modifier ou supprimer vos données depuis votre Dashboard.</span></li>
                        <li className="flex gap-2 items-start"><CheckCircle2 size={15} className="text-[#FF6600] mt-0.5 shrink-0" /><span>Retirer votre consentement pour les communications marketing.</span></li>
                        <li className="flex gap-2 items-start"><CheckCircle2 size={15} className="text-[#FF6600] mt-0.5 shrink-0" /><span>Contacter notre DPO à <a href="mailto:direction@kleer-Infini.dz" className="text-[#FF6600] hover:underline">direction@kleer-Infini.dz</a></span></li>
                    </ul>
                )
            },
        ].map(({ num, title, icon: Icon, color, content }) => (
            <section key={num} className="group">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center border border-neutral-100`}>
                        <Icon size={16} className={color} />
                    </div>
                    <h2 className="text-lg font-bold text-neutral-900">{num}. {title}</h2>
                </div>
                <div className="pl-11 text-neutral-700 text-sm leading-relaxed">
                    {content}
                </div>
            </section>
        ))}
    </div>
);

/** ─── Main Page ─────────────────────────────────────────────── */
const LegalPage = () => {
    const { type } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const legalTypes = {
        privacy: { title: "Politique de Confidentialité", icon: <Shield className="text-blue-500" size={32} />, contentKey: "legal.privacy.content" },
        terms: { title: "Conditions Générales", icon: <Gavel className="text-orange-500" size={32} />, contentKey: "legal.terms.content" },
        cookies: { title: "Politique Cookies", icon: <Cookie className="text-amber-600" size={32} />, contentKey: "legal.cookies.content" },
        mentions: { title: "Mentions Légales", icon: <FileText className="text-emerald-500" size={32} />, contentKey: "legal.mentions.content" },
    };

    const currentType = legalTypes[type] || legalTypes.privacy;

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!legalTypes[type] && type) navigate("/privacy", { replace: true });
    }, [type, navigate]);

    return (
        <div className="bg-[#F9F9F9] min-h-screen font-sans selection:bg-[#FF6600] selection:text-white">
            <Header />

            {/* ── Hero ── */}
            <div className="relative pt-32 pb-24 overflow-hidden" style={{ background: '#0A0A0A' }}>
                <img src={legalHeroBg} alt="" className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-90" />
                {/* very light overlay so image stays bright */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex p-4 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl mb-8"
                    >
                        {currentType.icon}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tight"
                    >
                        {currentType.title}
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white/80 text-xs font-medium uppercase tracking-widest"
                    >
                        <Globe size={14} />
                        Mis à jour le {new Date().toLocaleDateString("fr-FR")}
                    </motion.div>
                </div>
            </div>

            {/* ── Content ── */}
            <main className="max-w-5xl mx-auto px-4 md:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl p-8 md:p-14 shadow-sm border border-neutral-100"
                >
                    {/* Back button */}
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-[#FF6600] text-sm font-bold uppercase tracking-widest mb-12 hover:gap-4 transition-all"
                    >
                        <ArrowLeft size={18} /> {t("legal.back_home")}
                    </button>

                    {/* Page body */}
                    {type === 'privacy' || !type ? (
                        <PrivacyContent />
                    ) : (
                        <div className="prose prose-orange max-w-none text-neutral-800 leading-relaxed">
                            {t(currentType.contentKey, { defaultValue: "" }).split('\n').map((p, i) =>
                                p.trim() ? <p key={i} className="mb-6">{p}</p> : <br key={i} />
                            )}
                        </div>
                    )}

                    {/* Footer row */}
                    <div className="mt-16 pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-xs text-neutral-400 italic">
                            {t("legal.disclaimer")}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {Object.keys(legalTypes).filter(k => k !== (type || 'privacy')).map(k => (
                                <button
                                    key={k}
                                    onClick={() => navigate(`/${k}`)}
                                    className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-[#FF6600] transition-colors"
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
