import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const AdminTopBar = () => {
    return (
        <div className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 px-10 flex items-center justify-between">
            <div className="relative w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search anything here"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#26B99A]/20 transition-all outline-none"
                />
            </div>

            <div className="flex items-center gap-8">
                <button className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors">
                    <Bell size={22} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-8 border-l border-gray-100 cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandro"
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 leading-none">Alexandro</span>
                        <span className="text-[10px] text-gray-400 font-semibold mt-1">Super Admin</span>
                    </div>
                    <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                </div>
            </div>
        </div>
    );
};

export default AdminTopBar;
