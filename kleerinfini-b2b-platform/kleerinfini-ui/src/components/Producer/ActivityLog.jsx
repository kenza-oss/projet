import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Clock, CheckCircle, AlertTriangle, Shield, User, Package, Mail } from "lucide-react";

const ActivityLog = () => {
    const { t } = useTranslation();

    // Mock data for activities (to be replaced with real backend data later)
    const activities = [
        {
            id: 1,
            type: "login",
            icon: <Shield size={18} className="text-blue-500" />,
            title: "Connexion réussie",
            time: "Il y a 10 minutes",
            location: "Paris, France (IP: 192.168.1.1)",
            status: "success"
        },
        {
            id: 2,
            type: "product_update",
            icon: <Package size={18} className="text-orange-500" />,
            title: "Mise à jour du produit : Huile de Figue de Barbarie",
            time: "Il y a 2 heures",
            status: "success"
        },
        {
            id: 3,
            type: "message",
            icon: <Mail size={18} className="text-emerald-500" />,
            title: "Nouveau message reçu de Buyer123",
            time: "Il y a 5 heures",
            status: "info"
        },
        {
            id: 4,
            type: "security",
            icon: <AlertTriangle size={18} className="text-amber-500" />,
            title: "Tentative de connexion bloquée (IP inconnue)",
            time: "Hier à 14:30",
            location: "Unknown (IP: 45.12.33.1)",
            status: "warning"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-4xl font-black text-[#1A1D23] tracking-tighter uppercase mb-2">
                    {t('producer_dashboard.activity.title', 'Journal d\'Activité')}
                </h1>
                <p className="text-gray-500 font-bold text-sm tracking-tight uppercase">
                    {t('producer_dashboard.activity.subtitle', "Suivi de sécurité et des actions sur votre compte")}
                </p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-3">
                        <Clock size={20} className="text-slate-400" />
                        <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Activités Récentes</span>
                    </div>
                    <button className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
                        Exporter le log (PDF)
                    </button>
                </div>

                <div className="divide-y divide-slate-50">
                    {activities.map((activity, idx) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 hover:bg-slate-50/50 transition-colors flex items-start gap-6"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0">
                                {activity.icon}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-base font-bold text-slate-900">{activity.title}</h3>
                                    <span className="text-xs font-medium text-slate-400">{activity.time}</span>
                                </div>
                                {activity.location && (
                                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                                        <Globe size={12} /> {activity.location}
                                    </p>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' :
                                            activity.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                                        }`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {activity.status === 'success' ? 'Vérifié' :
                                            activity.status === 'warning' ? 'À surveiller' : 'Info'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 2FA Card (Bonus Security) */}
            <div className="bg-black text-white rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-lg">
                    <h3 className="text-2xl font-black uppercase tracking-tight">Sécurisez votre compte avec la 2FA</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Ajoutez une couche de protection supplémentaire. En activant l'authentification à deux facteurs, vous protégez vos données d'exportation contre tout accès non autorisé.
                    </p>
                </div>
                <button className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all whitespace-nowrap">
                    Activer maintenant
                </button>
            </div>
        </div>
    );
};

export default ActivityLog;
