import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  FileText,
  MessageSquare,
  FolderOpen,
  UserCircle,
  LogOut,
  ChevronRight,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const SidebarClient = ({ unreadCount = 0 }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const profile = user?.client_profile || {};

  const menuItems = [
    { label: t('client_dashboard.sidebar.dashboard', "Tableau de bord"), icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { label: t('client_dashboard.sidebar.catalog', "Catalogue B2B"), icon: <ShoppingBag size={20} />, path: '/products' },
    { label: t('client_dashboard.sidebar.search', "Recherche Producteurs"), icon: <Search size={20} />, path: '/dashboard/search' },
    { label: t('client_dashboard.sidebar.requests', "Mes Demandes"), icon: <FileText size={20} />, path: '/dashboard/requests' },
    { label: t('client_dashboard.sidebar.messages', "Messagerie"), icon: <MessageSquare size={20} />, path: '/dashboard/messages', badge: unreadCount },
    { label: t('client_dashboard.sidebar.documents', "Documents Reçus"), icon: <FolderOpen size={20} />, path: '/dashboard/documents' },
    { label: t('client_dashboard.sidebar.profile', "Mon Profil"), icon: <UserCircle size={20} />, path: '/dashboard/profile' },
  ];

  return (
    <aside className="w-56 h-full bg-[#050B18] text-white flex flex-col justify-between border-r border-white/5 font-sans">

      {/* Brand Section */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-10 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40 group-hover:scale-105 transition-transform duration-300">
            <span className="text-white font-black text-2xl">K.</span>
          </div>
          <div>
            <span className="text-xl font-black block leading-none">KLEER INFINI</span>
            <span className="text-[10px] text-blue-400 font-bold uppercase">Global B2B</span>
          </div>
        </div>
        <div className="h-[1px] w-full bg-gradient-to-r from-blue-500/20 to-transparent mb-8" />
        <p className="text-[10px] text-gray-500 uppercase font-black mb-6 px-1">Navigation principale</p>
      </div>

      {/* Navigation Layer */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-500 group relative overflow-hidden
              ${isActive
                ? 'bg-gradient-to-r from-blue-600/10 to-transparent text-white font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
          >
            {/* Active Indicator Bar */}
            <span className={({ isActive }) => `
                absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full transition-all duration-500
                ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
            `}></span>

            <span className={`transition-all duration-300 group-hover:scale-110 group-hover:text-blue-400`}>
              {item.icon}
            </span>
            <span className="text-sm font-medium">{item.label}</span>

            {item.badge > 0 && (
              <span className="ml-auto bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-blue-900/40">
                {item.badge}
              </span>
            )}

            <ChevronRight size={14} className={`${item.badge > 0 ? 'hidden' : 'ml-auto'} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-400`} />
          </NavLink>
        ))}
      </nav>

      {/* Premium Footer */}
      <div className="p-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900/40 to-indigo-900/20 border border-blue-500/20 shadow-inner mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500/30 p-0.5 bg-blue-500/10 flex items-center justify-center">
              <span className="text-blue-400 font-black text-sm">
                {(profile.company_name || user?.email || 'K').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate text-white">
                {profile.company_name || "Vôtre Entreprise"}
              </p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-[9px] text-blue-400 font-bold uppercase truncate">
                  {user?.email || "Connecté"}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full bg-blue-900/30 h-1.5 rounded-full overflow-hidden">
            <div className="w-full h-full bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-[9px] text-gray-400 mt-2 text-center uppercase font-bold tracking-tighter">Compte Client Actif</p>
        </div>

        <button
          onClick={() => window.location.href = '/login'}
          className="w-full flex items-center justify-center gap-3 text-[10px] font-black text-gray-500 hover:text-white transition-all uppercase py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default SidebarClient;
