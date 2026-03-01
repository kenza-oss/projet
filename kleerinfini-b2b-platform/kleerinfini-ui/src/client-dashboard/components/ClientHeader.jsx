import React, { useState } from 'react';
import { Bell, Search, Settings, HelpCircle, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
// Using standard imports for consistency or preserving user's paths
import LanguageSelector from '../../components/LanguageSelector';

const ClientHeader = ({ onMenuClick }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-20 lg:h-24 px-4 md:px-10 flex justify-between items-center bg-white/70 backdrop-blur-xl border-b border-gray-100/50 relative z-40 gap-4">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-700 hover:text-blue-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>

      {/* Left Search Bar - Premium Style */}
      <div className="flex-1 max-w-md hidden md:block">
        <form onSubmit={handleSearch} className="relative group">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('client_dashboard.sidebar.search', 'Rechercher un producteur, produit, catégorie...')}
            className="w-full bg-gray-100/50 border border-transparent focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50/50 pl-12 pr-4 py-3 rounded-2xl text-sm font-medium transition-all outline-none"
          />
        </form>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-6 ml-auto">

        {/* Support Link */}
        <button className="hidden lg:flex items-center gap-2 text-xs font-black text-gray-400 hover:text-blue-600 tracking-widest transition-colors">
          <HelpCircle size={16} /> SUPPORT
        </button>

        <div className="w-[1px] h-6 bg-gray-200 hidden lg:block mx-2"></div>

        {/* Global Selectors */}
        <div className="flex items-center gap-4">
          <LanguageSelector />

          {/* Notification Center */}
          <button className="relative p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <Bell size={20} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>

          <button className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <Settings size={20} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>

        {/* User Quick Profile */}
        <div className="flex items-center gap-3 md:gap-4 pl-3 md:pl-6 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-[#050B18] leading-none mb-1 uppercase tracking-tighter">
              {t('client_dashboard.header.admin', 'Atef M.')}
            </p>
            <p className="text-[10px] text-blue-500 font-bold tracking-widest uppercase">
              {t('client_dashboard.header.role', 'Admin')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-900 shadow-lg shadow-blue-500/30 flex items-center justify-center text-white overflow-hidden p-0.5 group cursor-pointer">
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
              <img
                src="https://i.pravatar.cc/150?u=mybiz"
                alt="Profile"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;