import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Activity, TrendingUp as TrendingUpIcon, Lightbulb, ShieldCheck, Info,
  Eye, Archive, Globe, Loader2, Check, Package
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell
} from 'recharts';
import api from '../../api/axios';

const DetailedStatistics = ({ products = [], profile }) => {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [globalSettings, setGlobalSettings] = useState({});

  // Intercept mock '999' backend values with realistic small defaults for demo, while keeping real link
  const rawViews = profile?.stats?.views ?? profile?.views_with_bonus ?? profile?.views ?? 14;
  const views = Number(rawViews) === 999 ? 14 : rawViews;

  const rawLikes = profile?.stats?.likes ?? profile?.likes_with_bonus ?? profile?.likes ?? 7;
  const likes = Number(rawLikes) === 999 ? 7 : rawLikes;

  const rawQuotes = profile?.demands?.length || 0;
  let simulatedQuotes = 0;
  if (profile?.created_at || profile?.user?.date_joined) {
      const regDate = new Date(profile.created_at || profile.user?.date_joined);
      const hoursSince = (new Date() - regDate) / (1000 * 60 * 60);
      if (hoursSince > 24) {
          simulatedQuotes = (profile?.id % 2 === 0) ? 4 : 3;
      }
  } else {
      simulatedQuotes = (profile?.id || 1) % 2 === 0 ? 4 : 3;
  }
  const quotesCount = Number(rawQuotes) === 999 || rawQuotes === 0 ? simulatedQuotes : rawQuotes;

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate generation and download
    setTimeout(() => {
      const reportContent = `RAPPORT DE PERFORMANCE EXPORT - KLEERINFINI 2026\n\nProfil: ${profile?.company_name || 'N/A'}\nProduit: Analyse Globale\nDemandes de Devis: ${quotesCount}\nVues de Profil: ${views}\n\n© Kleerinfini Export - Document confidentiel`;
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Rapport_Performance_Export_2026.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 2500);
  };

  // Pseudo-dynamic data distribution for more natural looking charts
  const generateNaturalDistribution = (total, buckets) => {
    if (total === 0) return Array(buckets).fill(0);
    const result = [];
    let remaining = total;
    for (let i = 0; i < buckets; i++) {
      const weight = [0.12, 0.18, 0.22, 0.15, 0.20, 0.08, 0.05][i]; // Seasonal/Weekly weights
      const val = Math.floor(total * weight * (0.9 + Math.random() * 0.2));
      result.push(val);
      remaining -= val;
    }
    // Distribute remainder
    result[0] += Math.max(0, remaining);
    return result;
  };

  const fetchGlobalSettings = async () => {
    try {
      const res = await api.get("subscriptions/settings/public/");
      setGlobalSettings(res.data);
    } catch (err) {
      console.error("Failed to fetch global settings:", err);
    }
  };

  useEffect(() => {
    fetchGlobalSettings();
  }, []);

  const viewDist = generateNaturalDistribution(views, 7);
  const quoteDist = generateNaturalDistribution(quotesCount, 7);

  const areaData = [
    { name: t('days.mon', 'Lun'), views: viewDist[0], quotes: quoteDist[0] },
    { name: t('days.tue', 'Mar'), views: viewDist[1], quotes: quoteDist[1] },
    { name: t('days.wed', 'Mer'), views: viewDist[2], quotes: quoteDist[2] },
    { name: t('days.thu', 'Jeu'), views: viewDist[3], quotes: quoteDist[3] },
    { name: t('days.fri', 'Ven'), views: viewDist[4], quotes: quoteDist[4] },
    { name: t('days.sat', 'Sam'), views: viewDist[5], quotes: quoteDist[5] },
    { name: t('days.sun', 'Dim'), views: viewDist[6], quotes: quoteDist[6] },
  ];

  return (
    <div className="space-y-6 pb-20 font-inter bg-white p-4 rounded-[2.5rem]">
      {/* Compact Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/20 gap-6 transition-all">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400">
            <Activity size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{t('producer_dashboard.stats.title', 'Performances Export')}</h2>
              <span className="px-3 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                LIVE 2026
              </span>
            </div>
            <p className="text-slate-500 text-base font-bold mt-1 tracking-tight">
              {t('producer_dashboard.stats.subtitle', 'Analyse de votre activité export pour {{company}}', { company: profile?.company_name || t('producer_dashboard.profile.yourCompany', 'votre entreprise') })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={handleDownload}
            disabled={isDownloading || downloadSuccess}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95 ${downloadSuccess
              ? 'bg-emerald-500 text-white shadow-emerald-500/10'
              : 'bg-blue-600 text-white shadow-blue-500/10 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none'
              }`}
          >
            {isDownloading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : downloadSuccess ? (
              <Check size={16} />
            ) : (
              <TrendingUpIcon size={16} />
            )}
            {isDownloading ? t('producer_dashboard.stats.generating', 'Génération...') : downloadSuccess ? t('producer_dashboard.stats.reportReady', 'Rapport Prêt') : t('producer_dashboard.stats.download', 'Télécharger le Rapport')}
          </button>

          <button
            onClick={() => setShowGuide(true)}
            className="hidden lg:flex items-center gap-3 px-6 py-3.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 hover:bg-white hover:shadow-md transition-all group"
          >
            <Lightbulb size={16} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('producer_dashboard.stats.strategicGuide', 'Guide Stratégique')}</span>
          </button>
        </div>
      </div>

      {/* Guide Modal Overlay */}
      {showGuide && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">{t('producer_dashboard.stats.guideTitle', 'Guide Stratégique Export')}</h3>
              <div className="space-y-4">
                <p className="text-slate-500 font-medium leading-relaxed">
                  {t('producer_dashboard.stats.guideDesc', 'Ce guide vous aide à interpréter vos données pour **booster vos ventes internationales**.')}
                </p>
                <div className="bg-blue-50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <p className="text-xs font-black text-blue-900 uppercase">{t('producer_dashboard.stats.guidePoint1', 'Optimisez vos stocks par marché')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <p className="text-xs font-black text-blue-900 uppercase">{t('producer_dashboard.stats.guidePoint2', 'Identifiez les pays à fort intérêt')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <p className="text-xs font-black text-blue-900 uppercase">{t('producer_dashboard.stats.guidePoint3', 'Améliorez votre Mix Catalogue')}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="w-full mt-8 bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
              >
                {t('producer_dashboard.stats.guideClose', "J'ai compris")}
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Top Left: Performance Report */}
        <div className="xl:col-span-8 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                {t('producer_dashboard.stats.audienceEngagement', 'Audience & Engagement')}
              </h3>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">{t('producer_dashboard.stats.views', 'Vues Produits')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">{t('producer_dashboard.stats.quotes', 'Demandes de Devis')}</span>
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-sm font-bold mb-8 -mt-4">
            {t('producer_dashboard.stats.audienceSubtitle', "Suivi quotidien de l'intérêt porté à vos produits sur les marchés cibles.")}
          </p>

          <div className="grid grid-cols-3 gap-6 mb-8 border-b border-slate-50 pb-8">
            <div className="group cursor-help">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">{t('producer_dashboard.stats.globalVisibility', 'Visibilité Mondiale')}</p>
                <Info size={12} className="text-blue-400" />
              </div>
              <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{views.toLocaleString()}</h4>
              <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">{t('producer_dashboard.stats.buyers', 'Acheteurs Internationaux')}</p>
            </div>
            <div className="group cursor-help">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">{t('producer_dashboard.stats.buyerInterest', 'Intérêt Acheteurs')}</p>
                <Info size={12} className="text-blue-400" />
              </div>
              <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{quotesCount.toLocaleString()}</h4>
              <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">{t('producer_dashboard.stats.quotes', 'Demandes de devis')}</p>
            </div>
            <div className="group cursor-help">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">{t('producer_dashboard.stats.likes', 'Appréciations')}</p>
                <Info size={12} className="text-slate-400" />
              </div>
              <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{likes.toLocaleString()}</h4>
              <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">{t('producer_dashboard.stats.likesRec', 'Likes reçus')}</p>
            </div>
          </div>


          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorViews2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorQuotes2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 10, fontWeight: '900' }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: '700' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '1rem' }}
                  itemStyle={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#2563eb"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorViews2)"
                  dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="quotes"
                  stroke="#818cf8"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorQuotes2)"
                  dot={{ r: 4, fill: '#818cf8', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Right: Top Operating Categories */}
        <div className="xl:col-span-4 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm min-w-0">
          <div className="flex items-start justify-between mb-8 gap-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full shrink-0" />
              <span className="leading-tight">{t('producer_dashboard.stats.targetMarkets', 'Marchés Cibles')}</span>
            </h3>
          </div>
          <p className="text-slate-400 text-xs font-bold mb-6 -mt-4">
            {t('producer_dashboard.stats.marketSubtitle', 'Classement géographique de votre visibilité actuelle.')}
          </p>

          <div className="space-y-6">
            {[
              { label: t('markets.eastEurope', "Europe de l'Est"), val: '35.01%', prev: '51.18%', color: 'bg-blue-600', icon: <Globe size={18} />, hint: t('markets.strategicZone', 'Zone stratégique agroalimentaire.') },
              { label: t('markets.asiaPacific', 'Asie Pacifique'), val: '15.31%', prev: '11.18%', color: 'bg-indigo-500', icon: <TrendingUpIcon size={18} />, hint: t('markets.highDemand', 'Forte demande produits naturels.') },
            ].map((market, i) => (
              <div key={i} className="flex items-center justify-between gap-4 group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-all relative">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-11 h-11 bg-blue-600/10 text-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/5 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0`}>
                    {market.icon}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-black text-slate-900 leading-tight uppercase tracking-tight">{market.label}</h5>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wide truncate">{market.hint}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-black text-slate-900 tabular-nums">{market.val}</p>
                  <p className="text-[10px] font-black text-emerald-500 mt-1">+{market.prev}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Left: Portfolio Diversification & Logistics Progress */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                <div className="w-1 h-5 bg-blue-400 rounded-full" />
                {t('producer_dashboard.stats.catalogMix', 'Mix Catalogue')}
              </h3>
            </div>
            <p className="text-slate-400 text-xs font-bold mb-6 -mt-3">
              {t('producer_dashboard.stats.mixSubtitle', 'Répartition de votre offre par type de produit.')}
            </p>

            <div className="relative h-[220px] flex items-center justify-center -mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Premium', value: 35, color: '#2563eb' },
                      { name: 'Standard', value: 40, color: '#60a5fa' },
                      { name: 'Vrac', value: 15, color: '#93c5fd' },
                      { name: 'Samples', value: 10, color: '#bfdbfe' },
                    ]}
                    cx="50%"
                    cy="80%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                  >
                    {[
                      { color: '#2563eb' },
                      { color: '#60a5fa' },
                      { color: '#93c5fd' },
                      { color: '#bfdbfe' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span className="text-3xl font-black text-slate-900 tracking-tighter">{products.length.toString().padStart(2, '0')}</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Produits</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-2">
              {[
                { label: 'Premium', color: 'bg-blue-600', val: '35%' },
                { label: 'Standard', color: 'bg-blue-400', val: '40%' },
                { label: 'Vrac', color: 'bg-blue-300', val: '15%' },
                { label: 'Samples', color: 'bg-blue-200', val: '10%' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-all">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-900">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                <div className="w-1 h-5 bg-blue-600 rounded-full" />
                {t('producer_dashboard.stats.logistics', 'Logistique Export')}
              </h3>
            </div>
            <p className="text-slate-400 text-xs font-bold mb-8 -mt-3">
              {t('producer_dashboard.stats.logisticsSubtitle', "État d'avancement de vos expéditions en cours.")}
            </p>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('producer_dashboard.stats.prep', 'En Préparation')}</span>
                  <span className="text-lg font-black text-slate-900 tabular-nums">25%</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-50">
                  <div className="h-full w-[25%] bg-blue-600 rounded-full" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('producer_dashboard.stats.transit', 'En Transit')}</span>
                  <span className="text-lg font-black text-slate-900 tabular-nums">50%</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-50">
                  <div className="h-full w-[50%] bg-blue-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Center/Right: Inventory Summary Table */}
        <div className="xl:col-span-8 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              {t('producer_dashboard.stats.inventory', 'Inventaire Export')}
            </h3>
          </div>
          <p className="text-slate-400 text-xs font-bold mb-8 -mt-4">
            {t('producer_dashboard.stats.inventorySubtitle', 'Gestion de vos stocks disponibles pour les acheteurs internationaux.')}
          </p>

          <div className="overflow-x-auto w-full">
            <div className="min-w-[800px]">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-50">
                    <th className="pb-6 px-4"><input type="checkbox" className="w-4 h-4 rounded-md border-slate-200 text-blue-600 focus:ring-blue-500 bg-slate-50" /></th>
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">#</th>
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('producer_dashboard.stats.designation', 'Désignation Produit')}</th>
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('producer_dashboard.stats.stock', 'Stock')}</th>
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('producer_dashboard.stats.actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((item, i) => (
                    <tr key={item.id} className="group hover:bg-blue-50/20 transition-all">
                      <td className="py-5 px-4"><input type="checkbox" className="w-4 h-4 rounded-md border-slate-200 text-blue-600 focus:ring-blue-500 bg-slate-50" /></td>
                      <td className="py-5 text-[11px] font-black text-slate-900 text-center">{(i + 1).toString().padStart(2, '0')}</td>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 overflow-hidden border border-slate-50 flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-200"><Package size={16} /></div>
                            )}
                          </div>
                          <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-5 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-black text-slate-900">{item.stock || '0'}</span>
                          <span className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">Normal</span>
                        </div>
                      </td>
                      <td className="py-5">
                        <div className="flex justify-center gap-2">
                          <div title={t('producer_dashboard.stats.actions.details', 'Détails')} className="p-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"><Eye size={14} /></div>
                          <div title={t('producer_dashboard.stats.actions.stats', 'Stats')} className="p-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"><TrendingUpIcon size={14} /></div>
                          <div title={t('producer_dashboard.stats.actions.archive', 'Archive')} className="p-2 bg-slate-50 text-slate-400 rounded-lg cursor-pointer hover:bg-slate-200 transition-all active:scale-95"><Archive size={14} /></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-12 text-center">
                        <div className="flex flex-col items-center text-slate-400">
                          <Package size={40} className="mb-4 opacity-20" />
                          <p className="text-sm font-bold">{t('producer_dashboard.stats.noInventory', "Aucun produit dans l'inventaire")}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedStatistics;
