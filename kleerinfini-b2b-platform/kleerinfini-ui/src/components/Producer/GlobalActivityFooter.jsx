import React from 'react';
import { Map, TrendingUp, Users, Activity, ChevronRight, Globe, Box, FileCheck, ShieldCheck, Zap } from 'lucide-react';
import exportBg from '../../assets/export_port_background.png';

const GlobalActivityFooter = () => {
    return (
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {/* 1. Top Locations */}
            <div className="bg-[#111827] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl border border-white/10 group h-full flex flex-col">
                <img
                    src={exportBg}
                    alt="Export Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Top Locations</h3>
                        <Map size={16} className="text-red-500" />
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 aspect-video flex items-center justify-center relative overflow-hidden border border-white/20 shadow-inner mb-6">
                        <Globe size={100} className="text-red-500 opacity-20" strokeWidth={0.5} />
                        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,1)] animate-pulse"></div>
                        <div className="absolute top-1/2 left-2/3 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="space-y-4 mt-auto">
                        {[
                            { city: 'Alger', percentage: '45%', color: 'bg-red-600' },
                            { city: 'Oran', percentage: '28%', color: 'bg-blue-500' },
                        ].map((loc, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{loc.city}</span>
                                <div className="flex items-center gap-4 flex-1 px-4">
                                    <div className="h-1 bg-white/10 rounded-full flex-1 overflow-hidden">
                                        <div className={`h-full ${loc.color} rounded-full transition-all duration-1000`} style={{ width: loc.percentage }}></div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black tabular-nums text-white">{loc.percentage}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. Monthly Performance */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Growth Performance</h3>
                    <TrendingUp size={16} className="text-blue-600" />
                </div>
                <div className="h-40 flex items-end gap-2 px-2">
                    {[30, 45, 25, 60, 40, 80, 55, 70, 90, 65, 85, 75].map((h, i) => (
                        <div
                            key={i}
                            className={`rounded-t-lg w-full transition-all duration-700 cursor-pointer ${i === 8 ? 'bg-blue-600 h-full shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-slate-100 hover:bg-slate-200'}`}
                            style={{ height: i === 8 ? '100%' : `${h}%` }}
                        ></div>
                    ))}
                </div>
                <div className="flex justify-between mt-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    <span>Jan</span>
                    <span>Jun</span>
                    <span>Dec</span>
                </div>
            </div>

            {/* 3. Strategic Partners */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050B18]">Strategic Partners</h3>
                    <Users size={16} className="text-slate-400" />
                </div>
                <div className="space-y-5 mt-auto">
                    {[
                        { name: 'EuroFood GmbH', slug: 'EF', status: 'online' },
                        { name: 'Organic Plus', slug: 'OP', status: 'away' },
                        { name: 'Global Trade', slug: 'GT', status: 'offline' }
                    ].map((partner, i) => (
                        <div key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-[#050B18]">
                                        {partner.slug}
                                    </div>
                                    <div className={`absolute -right-1 -bottom-0.5 w-3 h-3 rounded-full border-2 border-white ${partner.status === 'online' ? 'bg-emerald-500' : partner.status === 'away' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                                </div>
                                <span className="text-xs font-black text-[#050B18] tracking-tight truncate max-w-[100px]">{partner.name}</span>
                            </div>
                            <button className="text-[8px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-500 transition-colors">
                                View
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Activity Ledger */}
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200 shadow-inner h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050B18]">Activity Ledger</h3>
                    <Activity size={16} className="text-slate-400" />
                </div>
                <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white flex-1">
                    {[
                        { type: 'Global Dispatch', time: '2h ago', color: 'bg-emerald-500', icon: <Box size={12} className="text-white" /> },
                        { type: 'Quote Finalized', time: '5h ago', color: 'bg-red-600', icon: <FileCheck size={12} className="text-white" /> },
                        { type: 'KYC Verified', time: '1d ago', color: 'bg-[#111827]', icon: <ShieldCheck size={12} className="text-white" /> }
                    ].map((act, i) => (
                        <div key={i} className="flex items-start gap-4 relative z-10 group cursor-pointer">
                            <div className={`w-9 h-9 rounded-xl ${act.color} flex items-center justify-center border-4 border-white shadow-sm shrink-0 group-hover:scale-110 transition-transform`}>
                                {act.icon}
                            </div>
                            <div className="pt-1">
                                <p className="text-[9px] font-black text-[#050B18] uppercase tracking-wider mb-0.5">{act.type}</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                                    <p className="text-[8px] text-slate-500 font-bold uppercase">{act.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="mt-6 w-full py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#050B18] hover:bg-slate-100 transition-colors">
                    View All History
                </button>
            </div>
        </div>
    );
};

export default GlobalActivityFooter;
