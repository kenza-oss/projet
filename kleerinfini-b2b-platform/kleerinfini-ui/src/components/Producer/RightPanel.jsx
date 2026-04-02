import React from 'react';
import { Map, TrendingUp as TrendingUpIcon, Users, Activity, ChevronRight, Globe, Box, FileCheck, ShieldCheck, Zap } from 'lucide-react';
import {
    PieChart as RePieChart, Pie, Cell, ResponsiveContainer,
    AreaChart, Area, Tooltip as ReTooltip
} from 'recharts';

import exportBg from '../../assets/export_port_background.png';

const RightPanel = () => {
    const topLocations = [
        { name: 'Alger', value: 45, color: '#ef4444' },
        { name: 'Oran', value: 28, color: '#3b82f6' },
        { name: 'Const.', value: 12, color: '#60a5fa' }
    ];

    const performanceData = [
        { name: 'J', val: 30 }, { name: 'F', val: 45 }, { name: 'M', val: 25 },
        { name: 'A', val: 60 }, { name: 'M', val: 40 }, { name: 'J', val: 80 },
        { name: 'J', val: 55 }, { name: 'A', val: 70 }, { name: 'S', val: 90 },
        { name: 'O', val: 65 }, { name: 'N', val: 85 }, { name: 'D', val: 75 }
    ];

    return (
        <aside className="w-80 shrink-0 hidden xl:flex flex-col border-l border-slate-100 bg-white h-[calc(100vh-2rem)] overflow-y-auto scrollbar-hide shadow-2xl rounded-bl-[3.5rem] sticky top-4 z-20 m-4 ml-0 transition-all duration-500">
            {/* Top Color Section: Thematic Background (Lightened) */}
            <div
                className="relative text-white p-8 space-y-10 overflow-hidden shrink-0"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(11, 18, 33, 0.8), rgba(11, 18, 33, 0.95)), url(${exportBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Top Locations / Map Widget */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Top Locations</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Live Map</span>
                            <Map size={14} className="text-red-500" />
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-6 aspect-[4/3] flex flex-col items-center justify-center relative overflow-hidden group border border-white/10 shadow-2xl">
                        <div className="h-full w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={topLocations}
                                        innerRadius={45}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        cornerRadius={6}
                                    >
                                        {topLocations.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </RePieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <Globe size={32} className="text-white/20 mb-1" />
                                <span className="text-xs font-black text-white uppercase tracking-tighter">Algeria</span>
                            </div>
                        </div>

                        <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
                            <ChevronRight size={14} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-4 mt-8">
                        {topLocations.map((loc, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-red-500' : 'bg-blue-400'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">{loc.name}</span>
                                </div>
                                <span className="text-[10px] font-black tabular-nums text-white">{loc.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Performance Chart */}
                <div className="pt-8 border-t border-white/10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Performance</h3>
                            <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1">Monthly Export Growth</p>
                        </div>
                        <TrendingUpIcon size={16} className="text-red-500" />
                    </div>

                    <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="val"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorPerf)"
                                    dot={false}
                                />
                                <ReTooltip
                                    contentStyle={{ display: 'none' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex justify-between mt-6 text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">
                        <span>Jan</span>
                        <span>Jun</span>
                        <span>Dec</span>
                    </div>
                </div>
            </div>

            {/* Bottom Color Section: White */}
            <div className="flex-1 text-black p-8 space-y-10 shrink-0">
                {/* Biggest Fans / Top Clients */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Strategic Partners</h3>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified B2B Networks</p>
                        </div>
                        <Users size={18} className="text-slate-300" />
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: 'EuroFood GmbH', slug: 'EF', status: 'online', followed: true },
                            { name: 'Organic Plus', slug: 'OP', status: 'away', followed: false },
                            { name: 'Global Trade Co', slug: 'GT', status: 'offline', followed: false }
                        ].map((fan, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shadow-sm flex items-center justify-center text-[10px] font-black text-black group-hover:bg-slate-900 group-hover:text-white transition-all">
                                            {fan.slug}
                                        </div>
                                        <div className={`absolute -right-1 -bottom-0.5 w-3 h-3 rounded-full border-[3px] border-white shadow-sm ${fan.status === 'online' ? 'bg-emerald-500' : fan.status === 'away' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-black text-slate-900 tracking-tight uppercase block">{fan.name}</span>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Tier 1 Buyer</span>
                                    </div>
                                </div>
                                <button className={`p-2 rounded-xl border border-slate-100 group-hover:bg-slate-50 transition-all`}>
                                    <ChevronRight size={14} className="text-slate-300" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Stream */}
                <div className="pt-8 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Activity Ledger</h3>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Operations</p>
                        </div>
                        <Activity size={18} className="text-slate-300" />
                    </div>
                    <div className="space-y-10 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
                        {[
                            { type: 'Global Dispatch', time: '2h ago', color: 'bg-emerald-500', icon: <Box size={14} className="text-white" /> },
                            { type: 'Quote Finalized', time: '5h ago', color: 'bg-red-600', icon: <FileCheck size={14} className="text-white" /> },
                            { type: 'KYC Verified', time: '1d ago', color: 'bg-[#050B18]', icon: <ShieldCheck size={14} className="text-white" /> }
                        ].map((act, i) => (
                            <div key={i} className="flex items-start gap-4 relative group cursor-pointer">
                                <div className={`w-9 h-9 rounded-2xl ${act.color} flex items-center justify-center shadow-xl shadow-black/5 relative z-10 shrink-0 border-[4px] border-white group-hover:scale-110 transition-transform`}>
                                    {act.icon}
                                </div>
                                <div className="pt-1">
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">{act.type}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
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
