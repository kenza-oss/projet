// SidebarProducer.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import {
  LayoutGrid,
  Box,
  ClipboardCheck,
  MessageCircle,
  FolderOpen,
  LineChart,
  Wallet,
  User,
  LogOut,
  Globe,
  ExternalLink
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.png';

const navItems = (t) => [
  { id: 'dashboard', icon: <LayoutGrid size={20} />, label: t('producer_dashboard.sidebar.dashboard', 'Tableau de bord') },
  { id: 'products', icon: <Box size={20} />, label: t('producer_dashboard.sidebar.products', 'Mes produits') },
  { id: 'demands', icon: <ClipboardCheck size={20} />, label: t('producer_dashboard.sidebar.demands', 'Demandes reçues') },
  { id: 'messages', icon: <MessageCircle size={20} />, label: t('producer_dashboard.sidebar.messages', 'Messages') },
  { id: 'documents', icon: <FolderOpen size={20} />, label: t('producer_dashboard.sidebar.documents', 'Mes documents') },
  { id: 'statistics', icon: <LineChart size={20} />, label: t('producer_dashboard.sidebar.statistics', 'Statistiques') },
  { id: 'payments', icon: <Wallet size={20} />, label: t('producer_dashboard.sidebar.payments', 'Licence annuelle') },
  { id: 'hub', icon: <Globe size={20} />, label: t('producer_dashboard.sidebar.hub', 'HUB STRATÉGIQUE EXPORT') },
  { id: 'profile', icon: <User size={20} />, label: t('producer_dashboard.sidebar.profile', 'Mon profil') },
];

export default function SidebarProducer({ unreadCount = 0 }) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = location.pathname.split('/').pop() || 'home';

  return (
    <div className="w-52 h-full overflow-hidden flex flex-col font-sans bg-white text-gray-900 border-r border-gray-100 shadow-[10px_0_30px_rgba(0,0,0,0.02)]">
      {/* Brand Section */}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10 group cursor-pointer" onClick={() => navigate('/producer-dashboard')}>
          <img src={logo} alt="Kleer Infini" className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
        </div>

        <p className="text-[10px] text-gray-400 font-black uppercase mb-6 tracking-[0.2em]">{t('producer_dashboard.sidebar.account', 'Mon Compte')}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar px-4">
        {navItems(t).map((item, index) => (
          <React.Fragment key={item.id}>
            {index === 4 && (
              <p className="px-4 mt-8 text-[10px] text-gray-400 font-black uppercase mb-4 tracking-[0.2em]">{t('producer_dashboard.sidebar.management', 'Management')}</p>
            )}
            <button
              onClick={() => navigate(`/producer-dashboard/${item.id}`)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative ${activeTab === item.id
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <div className={`transition-all duration-300 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600 group-hover:scale-110'} `}>
                {React.cloneElement(item.icon, { size: 18, strokeWidth: activeTab === item.id ? 2.5 : 2 })}
              </div>
              <span className={`text-[13px] font-bold tracking-tight ${activeTab === item.id ? 'text-blue-600' : 'text-gray-700 group-hover:text-gray-900'}`}>
                {item.label}
              </span>
              {item.id === 'messages' && unreadCount > 0 && (
                <span className="ml-auto bg-blue-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>
          </React.Fragment>
        ))}

        {/* View Public Profile Link */}
        <div className="px-4 mt-6 mb-10">
          <button
            onClick={() => navigate('/producer/me')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all duration-300 group"
          >
            <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{t('producer_dashboard.sidebar.publicProfile', 'Profil Public')}</span>
          </button>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-6 mt-auto border-t border-gray-50">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-all py-2 group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t('producer_dashboard.sidebar.logout', 'Déconnexion')}
        </button>
      </div>
    </div>
  );
}
