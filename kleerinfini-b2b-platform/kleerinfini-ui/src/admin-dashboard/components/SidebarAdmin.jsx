import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Settings,
    HelpCircle,
    LogOut,
    Building2,
    Calendar,
    ClipboardList,
    MessageSquare,
    Mail
} from 'lucide-react';

const SidebarAdmin = () => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin-dashboard' },
        { icon: BarChart3, label: 'Statistiques', path: '/admin-dashboard/statistics' },
        { icon: Users, label: 'Clients', path: '/admin-dashboard/clients' },
        { icon: Building2, label: 'Producteurs', path: '/admin-dashboard/producers' },
        { icon: Mail, label: 'Invitations', path: '/admin-dashboard/invitations' },
        { icon: MessageSquare, label: 'Messages', path: '/admin-dashboard/messages' },
        { icon: Settings, label: 'Paramètres', path: '/admin-dashboard/payment-settings' },
        { icon: ClipboardList, label: 'Rapports', path: '/admin-dashboard/reports' },
    ];

    return (
        <div className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 flex flex-col z-50">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-[#26B99A] rounded-xl flex items-center justify-center text-white">
                        <Building2 size={24} />
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">K-Infini <span className="text-[#26B99A]">Admin</span></span>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                ${isActive
                                    ? 'bg-[#26B99A] text-white shadow-lg shadow-[#26B99A]/20'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              `}
                        >
                            <item.icon size={20} className="transition-colors" />
                            <span className="font-semibold text-sm">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-8 space-y-2">
                <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all">
                    <LogOut size={20} />
                    <span className="font-semibold text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default SidebarAdmin;
