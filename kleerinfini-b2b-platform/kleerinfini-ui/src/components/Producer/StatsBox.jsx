import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  Package,
  ClipboardList,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Star,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const StatsBox = ({ products, messages, demands, producerProfile, setActiveTab }) => {
  const navigate = useNavigate();
  const views = producerProfile?.stats?.views || producerProfile?.views || 12;
  const likes = producerProfile?.stats?.likes || producerProfile?.likes || 4;
  const quotes = demands?.length || 0;

  const stats = [
    {
      title: 'Vues du profil',
      value: views.toLocaleString(),
      trend: views > 37 ? "Activité croissante" : "Lancement",
      trendUp: true,
      icon: <Eye size={20} />,
      accent: 'bg-indigo-600',
      textAccent: 'text-indigo-600',
      targetTab: 'statistics'
    },
    {
      title: 'Appréciations',
      value: likes.toLocaleString(),
      trend: likes > 37 ? "Nouveaux likes" : "Visibilité active",
      trendUp: true,
      icon: <Star size={20} />,
      accent: 'bg-amber-500',
      textAccent: 'text-amber-500',
      targetTab: 'statistics'
    },
    {
      title: 'Demandes de devis',
      value: quotes.toLocaleString(),
      trend: demands.filter(d => d.status === 'pending').length > 0
        ? `${demands.filter(d => d.status === 'pending').length} en attente`
        : 'À jour',
      trendUp: demands.filter(d => d.status === 'pending').length > 0,
      icon: <ClipboardList size={20} />,
      accent: 'bg-slate-900',
      textAccent: 'text-slate-900',
      targetTab: 'demands'
    },
    {
      title: 'Produits Actifs',
      value: products.filter(p => !p.archived).length.toString(),
      trend: `${products.length} au total`,
      trendUp: true,
      icon: <Package size={20} />,
      accent: 'bg-blue-600',
      textAccent: 'text-blue-600',
      targetTab: 'products'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(stat.targetTab)}
            className="group relative bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:border-blue-100 transition-all duration-500 cursor-pointer"
          >
            {/* Hover Accent Bar */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${stat.accent} opacity-0 group-hover:opacity-100 transition-opacity rounded-full`}></div>

            <div className="flex flex-col h-full justify-between gap-6">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ${stat.accent}/10 rounded-2xl flex items-center justify-center ${stat.textAccent}`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'
                  }`}>
                  {stat.trend}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{stat.title}</p>
                <h2 className="text-4xl font-extrabold text-[#050B18] tracking-tighter tabular-nums flex items-baseline gap-2">
                  {stat.value}
                </h2>
              </div>
            </div>

            {/* Subtle background icon */}
            <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              {React.cloneElement(stat.icon, { size: 100 })}
            </div>
          </div>
        ))}
      </div>

      {/* Strategic Export Tools */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 px-2">
          <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
          <h3 className="text-2xl font-black text-[#050B18] tracking-tight uppercase">Raccourcis Stratégiques</h3>
          <div className="h-px flex-1 bg-gray-100 ml-4 hidden md:block"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Marchés Mondiaux",
              desc: "Indicateurs & Opportunités",
              icon: <Zap size={20} />,
              link: "/producer-dashboard/hub",
              color: "bg-blue-600",
              lightColor: "bg-blue-50",
              textColor: "text-blue-600"
            },
            {
              title: "Calcul des Aides (FSPE)",
              desc: "Simulateur de subventions",
              icon: <TrendingUp size={20} />,
              link: "/producer-dashboard/calculator",
              color: "bg-red-600",
              lightColor: "bg-red-50",
              textColor: "text-red-600"
            },
            {
              title: "Réglementation Export",
              desc: "Textes officiels & JORADP",
              icon: <ClipboardList size={20} />,
              link: "/producer-dashboard/legal-watch",
              color: "bg-slate-900",
              lightColor: "bg-slate-50",
              textColor: "text-slate-900"
            },
            {
              title: "Normes & Qualité (ISO)",
              desc: "Certifications & Conformité",
              icon: <ShieldCheck size={20} />,
              link: "/producer-dashboard/iso-norms",
              color: "bg-emerald-600",
              lightColor: "bg-emerald-50",
              textColor: "text-emerald-600"
            }
          ].map((tool, i) => (
            <div
              key={i}
              onClick={() => navigate(tool.link)}
              className="group cursor-pointer bg-white rounded-[2rem] p-6 border border-gray-100 shadow-lg shadow-blue-900/5 hover:shadow-2xl hover:translate-y-[-6px] transition-all duration-300 flex items-center gap-5 min-h-[100px]"
            >
              <div className={`w-14 h-14 shrink-0 ${tool.lightColor} ${tool.textColor} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                {tool.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-black text-sm text-[#050B18] tracking-tight leading-snug">{tool.title}</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight leading-tight mt-1">{tool.desc}</p>
              </div>
              <div className="w-8 h-8 shrink-0 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <ChevronRight size={14} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsBox;
