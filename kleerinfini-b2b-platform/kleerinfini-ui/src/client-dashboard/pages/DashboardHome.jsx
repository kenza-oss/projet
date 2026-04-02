import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Send,
  MessageSquare,
  FileText,
  Users,
  Inbox,
  ArrowUpRight,
  Sparkles,
  TrendingUp as TrendingUpIcon,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ label, value, icon: Icon, color, trend }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    className="relative group bg-white p-7 rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-12px_rgba(30,58,138,0.15)] transition-all duration-500 overflow-hidden"
  >
    {/* Subtle Background Glow */}
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${color}`} />

    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-[0.08] text-opacity-100 group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={26} className={color.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <div className="flex flex-col items-end">
          <span className="flex items-center gap-1 text-[11px] font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 shadow-sm">
            +{trend}% <TrendingUpIcon size={12} />
          </span>
        </div>
      )}
    </div>

    <div className="relative z-10">
      <h3 className="text-4xl font-black text-[#050B18] mb-1 font-inter tracking-tighter">{value}</h3>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">{label}</p>
    </div>

    {/* Bottom Progress Bar Decoration */}
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-50 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`h-full opacity-20 ${color}`}
      />
    </div>
  </motion.div>
);

const DashboardHome = () => {
  const { t } = useTranslation();
  const { user } = useAuth(); // Get authenticated user
  const navigate = useNavigate();
  const [data, setData] = useState({ stats: {}, recent_activities: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('client/stats/');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { label: t('client_dashboard.home.sentRequests', "Demandes Envoyées"), value: data.stats.total_requests || "0", icon: Send, color: "bg-blue-600", trend: data.stats.total_requests > 5 ? 12 : 0 },
    { label: t('client_dashboard.home.receivedResponses', "Réponses Reçues"), value: data.stats.received_responses || "0", icon: Inbox, color: "bg-indigo-600", trend: data.stats.received_responses > 0 ? 8 : 0 },
    { label: t('client_dashboard.home.conversations', "Conversations"), value: data.stats.conversations || "0", icon: MessageSquare, color: "bg-blue-900", trend: data.stats.conversations > 2 ? 15 : 0 },
    { label: t('client_dashboard.home.documents', "Documents"), value: data.stats.documents || "0", icon: FileText, color: "bg-sky-600", trend: data.stats.documents > 0 ? 5 : 0 },
    { label: t('client_dashboard.home.contactedProducers', "Producteurs Contactés"), value: data.stats.producers_contacted || "0", icon: Users, color: "bg-blue-800", trend: data.stats.producers_contacted > 0 ? 10 : 0 },
  ];

  // Get user's first name for welcome message
  const firstName = user?.client_profile?.first_name || user?.first_name || user?.email?.split('@')[0] || 'Client';

  return (
    <div className="space-y-12">

      {/* Dynamic Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-blue-600/10 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-600/10 flex items-center gap-1">
              <Sparkles size={10} /> {t('client_dashboard.home.premiumAccount', 'Compte Premium')}
            </span>
          </div>
          <h1 className="text-4xl font-black text-[#050B18] tracking-tighter leading-none">
            {t('client_dashboard.home.welcome', 'Bonjour')}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-900 uppercase">{firstName}</span> 👋
          </h1>
          <p className="text-gray-500 font-medium text-lg lg:text-xl">
            {t('client_dashboard.home.readyToExplore', 'Prêt à explorer les meilleurs producteurs africains ?')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
            <Clock size={16} className="text-blue-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('client_dashboard.home.lastActivity', 'Dernière activité: 2m ago')}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(30,58,138,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard/requests')}
            className="bg-[#050B18] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-[#050B18]/10"
          >
            {t('client_dashboard.home.newRequest', '+ Nouvelle Demande')}
          </motion.button>
        </div>
      </div>

      {/* Stats Grid - Ultra Clean & Powerful */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-stretch">

        {/* Recent Activity - Professional Timeline */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_50px_-15px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-[#050B18] tracking-tight">{t('client_dashboard.home.recentActivities', 'Activités Récentes')}</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
              {t('client_dashboard.home.viewAll', 'VOIR TOUT')} <ExternalLink size={12} />
            </button>
          </div>

          <div className="space-y-8 relative before:absolute before:left-[23px] before:top-2 before:bottom-0 before:w-[1px] before:bg-gray-100">
            {data.recent_activities.length === 0 ? (
              <div className="py-10 text-center text-gray-400 font-medium">{t('client_dashboard.home.noRecentActivity', 'Aucune activité récente.')}</div>
            ) : data.recent_activities.map((item, i) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="flex items-start gap-6 relative group"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.has_file ? 'bg-blue-50' : 'bg-gray-50'} border border-white shadow-sm flex items-center justify-center text-xl relative z-10 group-hover:scale-110 transition-transform`}>
                  {item.has_file ? '📄' : '📬'}
                </div>
                <div className="flex-1 py-1">
                  <h4 className="font-bold text-[#050B18] text-base group-hover:text-blue-700 transition-colors uppercase">{item.title}</h4>
                  <p className="text-xs text-gray-400 font-medium">{item.time}</p>
                </div>
                <button className="self-center px-4 py-2 border border-blue-100 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                  {t('client_dashboard.home.details', 'Détails')}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sourcing Banner - From UI request image 1 */}
        <div className="lg:col-span-12 xl:col-span-5 relative group overflow-hidden rounded-[2.5rem] bg-[#050B18] shadow-2xl shadow-blue-900/20 flex flex-col justify-center p-6 md:p-12">

          {/* Gradient Overlay from User Images */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-[#050B18] to-indigo-950 opacity-90 group-hover:scale-110 transition-transform duration-1000"></div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600 rounded-full blur-[80px] opacity-10 translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 items-center text-center space-y-8">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="text-blue-400" size={32} />
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tighter">
                {t('client_dashboard.home.specificProduct', "Besoin d'un produit spécifique ?")}
              </h3>
              <p className="text-blue-100/70 text-lg leading-relaxed max-w-sm mx-auto font-medium">
                {t('client_dashboard.home.sourcingTeam', 'Notre équipe de sourcing dédiée vous accompagne pour trouver les meilleurs producteurs africains certifiés.')}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#050B18] px-10 py-5 rounded-[1.25rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-white/10 hover:shadow-white/20 transition-all border border-transparent"
            >
              {t('client_dashboard.home.contactSupport', 'Contacter le support')}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
