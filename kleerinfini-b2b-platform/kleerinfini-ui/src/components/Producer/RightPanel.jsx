import React from 'react';
import { Map, TrendingUp, Users, Activity, ChevronRight, Globe, Box, FileCheck, ShieldCheck, Zap } from 'lucide-react';

import exportBg from '../../assets/export_port_background.png';

const RightPanel = () => {
    return (
        <aside className="w-72 hidden xl:flex flex-col border-l border-slate-100 bg-white h-fit shadow-2xl rounded-bl-[3.5rem] sticky top-30 z-20 m-4 ml-0 overflow-hidden transition-all duration-500">
            {/* Top Color Section: Thematic Background (Lightened) */}
            <div
                className="relative text-white p-6 space-y-8 overflow-hidden"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(11, 18, 33, 0.3), rgba(11, 18, 33, 0.5)), url(${exportBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Top Locations / Map Widget */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Top Locations</h3>
                        <Map size={16} className="text-red-500" />
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-4 aspect-video flex items-center justify-center relative overflow-hidden group border border-white/40 shadow-2xl ring-1 ring-white/20">
                        {/* Mock Map with white landmasses (opacity 30%) */}
                        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                            <Globe size={180} className="text-red-500" strokeWidth={0.5} />
                        </div>
                        {/* Pins */}
                        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,1)] animate-pulse"></div>
                        <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-white rounded-full shadow-[0_0_20px_white]"></div>
                        <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_20px_rgba(96,165,250,1)]"></div>

                        <div className="absolute bottom-6 right-6 bg-white/20 p-3 rounded-2xl backdrop-blur-md cursor-pointer hover:bg-white/30 transition-all border border-white/20">
                            <ChevronRight size={16} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-6 mt-8">
                        {[
                            { city: 'Alger', percentage: '45%', color: 'bg-red-600' },
                            { city: 'Oran', percentage: '28%', color: 'bg-blue-500' },
                            { city: 'Constantine', percentage: '12%', color: 'bg-blue-400' }
                        ].map((loc, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">{loc.city}</span>
                                <div className="flex items-center gap-4 flex-1 px-4">
                                    <div className="h-1 bg-white/10 rounded-full flex-1 overflow-hidden">
                                        <div className={`h-full ${loc.color} rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]`} style={{ width: loc.percentage }}></div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black tabular-nums text-white">{loc.percentage}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Performance Chart */}
                <div className="pt-8 border-t border-white/10">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Monthly Performance</h3>
                        <TrendingUp size={16} className="text-red-500" />
                    </div>
                    <div className="h-32 flex items-end gap-2 px-2">
                        {[30, 45, 25, 60, 40, 80, 55, 70, 90, 65, 85, 75].map((h, i) => (
                            <div
                                key={i}
                                className={`rounded-t-lg w-full transition-all duration-700 cursor-pointer ${i === 8 ? 'bg-red-600 h-full shadow-[0_0_30px_rgba(220,38,38,0.6)]' : 'bg-white/10 hover:bg-white/30'}`}
                                style={{ height: i === 8 ? '100%' : `${h}%` }}
                            ></div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 text-[9px] font-black text-white uppercase tracking-[0.3em]">
                        <span>Jan</span>
                        <span>May</span>
                        <span>Dec</span>
                    </div>
                </div>
            </div>

            {/* Bottom Color Section: White */}
            <div className="flex-1 text-black p-6 space-y-8">
                {/* Biggest Fans / Top Clients */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">Strategic Partners</h3>
                        <Users size={18} className="text-gray-400" />
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: 'EuroFood GmbH', slug: 'EF', status: 'online', followed: true },
                            { name: 'Organic Plus', slug: 'OP', status: 'away', followed: false },
                            { name: 'Global Trade Co', slug: 'GT', status: 'offline', followed: false }
                        ].map((fan, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shadow-sm flex items-center justify-center text-[10px] font-black text-black group-hover:border-blue-500 transition-all">
                                            {fan.slug}
                                        </div>
                                        <div className={`absolute -right-1.5 -bottom-0.5 w-3 h-3 rounded-full border-[3px] border-white shadow-sm ${fan.status === 'online' ? 'bg-emerald-500' : fan.status === 'away' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                                    </div>
                                    <span className="text-xs font-black text-gray-900 tracking-tight uppercase">{fan.name}</span>
                                </div>

                                {fan.followed ? (
                                    <button className="bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-xl shadow-red-900/10 hover:bg-red-700 transition-all">
                                        Active
                                    </button>
                                ) : (
                                    <button className="bg-white border border-slate-200 text-black text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:border-blue-500 transition-all">
                                        Partner
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Stream */}
                <div className="pt-8 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">Activity Ledger</h3>
                        <Activity size={18} className="text-gray-400" />
                    </div>
                    <div className="space-y-10 relative before:absolute before:left-[21px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
                        {[
                            { type: 'Global Dispatch', time: '2h ago', color: 'bg-emerald-500', icon: <Box size={16} className="text-white" /> },
                            { type: 'Quote Finalized', time: '5h ago', color: 'bg-red-600', icon: <FileCheck size={16} className="text-white" /> },
                            { type: 'KYC Verified', time: '1d ago', color: 'bg-[#050B18]', icon: <ShieldCheck size={16} className="text-white" /> }
                        ].map((act, i) => (
                            <div key={i} className="flex items-start gap-6 relative group cursor-pointer">
                                <div className={`w-9 h-9 rounded-2xl ${act.color} flex items-center justify-center shadow-2xl shadow-black/5 relative z-10 shrink-0 border-[4px] border-white group-hover:scale-110 transition-transform`}>
                                    {act.icon}
                                </div>
                                <div className="pt-1.5">
                                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">{act.type}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                            {act.time}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default RightPanel;
