import React from 'react';
import { Bell, Search, Settings, HelpCircle, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageSelector from '../LanguageSelector';

const ProducerTopBar = ({ onMenuClick }) => {
    const { t } = useTranslation();
    const { user } = useAuth();

    return (
        <header className="h-20 px-4 md:px-10 flex justify-between items-center bg-transparent relative z-40 gap-4">
            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="md:hidden p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-700 hover:text-[#E31E24]"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>

            {/* Search Bar - PhotoLytics Style */}
            <div className="flex-1 max-w-md hidden md:block">
                <div className="relative group">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E31E24] transition-colors"
                    />
                    <input
                        type="text"
                        placeholder={t('producer_dashboard.topbar.search', 'Rechercher dans la plateforme...')}
                        className="w-full bg-white/50 border border-black/5 focus:border-[#E31E24]/20 focus:bg-white focus:ring-4 focus:ring-[#E31E24]/5 pl-12 pr-4 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-tight transition-all outline-none shadow-sm placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 md:gap-6 ml-auto">

                {/* Support Link */}
                <button className="hidden lg:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-[#E31E24] transition-colors">
                    <HelpCircle size={16} /> {t('producer_dashboard.topbar.support', 'Support')}
                </button>

                <div className="w-[1px] h-4 bg-black/5 hidden lg:block mx-2"></div>

                {/* Global Selectors */}
                <div className="flex items-center gap-4">
                    {/* Notification Center */}
                    <button className="relative p-2.5 bg-white rounded-xl border border-black/5 shadow-sm hover:shadow-md transition-all group">
                        <Bell size={20} className="text-gray-700 group-hover:text-[#E31E24] transition-colors" />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <button className="p-2.5 bg-white rounded-xl border border-black/5 shadow-sm hover:shadow-md transition-all group">
                        <Settings size={20} className="text-gray-700 group-hover:text-[#E31E24] transition-colors" />
                    </button>
                </div>

                {/* User Quick Profile */}
                <div className="flex items-center gap-4 pl-6 border-l border-black/5">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-[#33394C] uppercase tracking-tight leading-none mb-1">
                            {user?.first_name && user?.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : (user?.name || t('producer_dashboard.topbar.producer', 'Producteur'))}
                        </p>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                            {user?.company_name || user?.companyName || t('producer_dashboard.topbar.premiumMember', 'Membre Premium')}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#33394C] shadow-lg shadow-black/10 flex items-center justify-center text-white overflow-hidden p-0.5 group cursor-pointer hover:bg-[#E31E24] transition-colors">
                        <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center overflow-hidden">
                            {user?.image ? (
                                <img
                                    src={user.image}
                                    alt="Profile"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <User className="text-[#33394C]" size={22} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ProducerTopBar;
