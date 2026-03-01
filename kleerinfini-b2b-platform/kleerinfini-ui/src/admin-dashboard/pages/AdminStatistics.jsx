import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
    Download,
    ChevronDown,
    MoreHorizontal,
    Plus,
    Activity,
    User,
    Users,
    Eye,
    Edit2,
    Trash2,
    Search,
    Building2,
    ClipboardList
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data for Charts
const statisticsReportData = [
    { name: 'Lun', client: 30, producer: 40 },
    { name: 'Mar', client: 55, producer: 35 },
    { name: 'Mer', client: 45, producer: 60 },
    { name: 'Jeu', client: 70, producer: 45 },
    { name: 'Ven', client: 50, producer: 65 },
    { name: 'Sam', client: 85, producer: 55 },
    { name: 'Dim', client: 60, producer: 80 },
];

const totalDepartmentData = [
    { name: 'Clients', value: 400, color: '#4F46E5' },
    { name: 'Producteurs', value: 300, color: '#3B82F6' },
    { name: 'Partenaires', value: 200, color: '#06B6D4' },
    { name: 'Logistique', value: 150, color: '#10B981' },
    { name: 'Inspecteurs', value: 100, color: '#FACC15' },
    { name: 'Autres', value: 50, color: '#F59E0B' },
];

const regionAnalytics = [
    { name: 'Maghreb', value: '35.01%', trend: 'VS 51.18% (Prév)', color: '#3B82F6' },
    { name: 'Afrique de l\'Ouest', value: '15.31%', trend: 'VS 11.18% (Prév)', color: '#10B981' },
    { name: 'Afrique Centrale', value: '25.53%', trend: 'VS 16.11% (Prév)', color: '#F59E0B' },
    { name: 'Europe', value: '32.68%', trend: 'VS 28.18% (Prév)', color: '#F43F5E' },
];

const productData = [
    { id: '01', code: '#FUP121312424', product: 'Huile d\'Olive', stock: '23456' },
    { id: '02', code: '#ECG121312424', product: 'Dattes Deglet Nour', stock: '12800' },
    { id: '03', code: '#FUPECG312424', product: 'Couscous Premium', stock: '45000' },
    { id: '04', code: '#FUPECG312424', product: 'Thon en conserve', stock: '23456' },
    { id: '05', code: '#FUPECG312424', product: 'Pâtes Alimentaires', stock: '23456' },
    { id: '06', code: '#FUPECG312424', product: 'Farine de Blé', stock: '23456' },
    { id: '07', code: '#FUPECG312424', product: 'Épices Traditionnelles', stock: '23456' },
];

const AdminStatistics = () => {
    const [data, setData] = useState({ stats: {}, recent_invitations: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('admin/stats/');
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Helper to replace mock values in arrays if needed or handle them directly in JSX
    const departments = [
        { name: 'Clients', value: data.stats.total_clients || 0, color: '#4F46E5' },
        { name: 'Producteurs', value: data.stats.total_producers || 0, color: '#3B82F6' },
        { name: 'Invitations', value: data.stats.total_invitations || 0, color: '#06B6D4' },
        { name: 'Logistique', value: 0, color: '#10B981' },
        { name: 'Inspecteurs', value: 0, color: '#FACC15' },
    ];
    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Statistics</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">This is data statistics for the last 7 days</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-all">
                        <span className="text-sm font-bold text-gray-700">Week</span>
                        <ChevronDown size={16} className="text-gray-400" />
                    </div>
                    <button className="flex items-center gap-2 bg-[#26B99A] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-[#26B99A]/20 hover:bg-[#1f967d] transition-all">
                        <Download size={18} />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Top Row: Statistics Report & Regions Analytics */}
            <div className="grid grid-cols-12 gap-8">
                {/* Statistics Report */}
                <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#26B99A]/10 text-[#26B99A] rounded-lg">
                                <Activity size={18} />
                            </div>
                            <h3 className="font-bold text-gray-900">Rapport d'Activité</h3>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                <span className="text-xs font-bold text-gray-500">Clients</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                                <span className="text-xs font-bold text-gray-500">Producteurs</span>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <div className="p-1 px-2 border rounded-md cursor-pointer hover:bg-gray-50">
                                    <ChevronDown size={14} className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 mb-10">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Demandes Devis</p>
                            <h2 className="text-3xl font-black text-gray-900 mt-1">210</h2>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inscriptions</p>
                            <h2 className="text-3xl font-black text-gray-900 mt-1">320</h2>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Visites</p>
                            <h2 className="text-3xl font-black text-gray-900 mt-1">1.2k</h2>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={statisticsReportData}>
                                <defs>
                                    <linearGradient id="colorClient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F87171" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProducer" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="client"
                                    stroke="#F87171"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorClient)"
                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="producer"
                                    stroke="#60A5FA"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorProducer)"
                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Regions Analytics Sessions */}
                <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#26B99A]/10 text-[#26B99A] rounded-lg">
                                <Users size={18} />
                            </div>
                            <h3 className="font-bold text-gray-900">Zones Prioritaires</h3>
                        </div>
                        <button className="text-gray-400 hover:text-gray-900 transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {regionAnalytics.map((item) => (
                            <div key={item.name} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shadow-${item.color}/10`} style={{ backgroundColor: item.color }}>
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-semibold mt-1">Activité moyenne : {item.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-gray-900">{item.value}</p>
                                    <p className="text-[10px] text-gray-400 font-bold mt-1">{item.trend}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Middle Row: Ressources & Catalogue Produits */}
            <div className="grid grid-cols-12 gap-8">
                {/* Left Column: Total Department & Analytics Sessions */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    {/* Total Department */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#26B99A]/10 text-[#26B99A] rounded-lg">
                                    <Activity size={18} />
                                </div>
                                <h3 className="font-bold text-gray-900">Acteurs Plateforme</h3>
                            </div>
                            <button className="text-gray-400 hover:text-gray-900 transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <div className="relative h-[250px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={departments}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {departments.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</span>
                                <span className="text-3xl font-black text-gray-900 leading-none mt-1">
                                    {(data.stats.total_clients || 0) + (data.stats.total_producers || 0)}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            {totalDepartmentData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-[10px] font-bold text-gray-500">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sourcing Analytics Sessions */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#26B99A]/10 text-[#26B99A] rounded-lg">
                                    <Activity size={18} />
                                </div>
                                <h3 className="font-bold text-gray-900">Analytics Sourcing</h3>
                            </div>
                            <button className="text-gray-400 hover:text-gray-900 transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-gray-900">Devis Ouverts</span>
                                    <span className="text-sm font-bold text-gray-900">25%</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '25%' }}
                                        className="h-full bg-emerald-500 rounded-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-gray-900">Analyses de Marché</span>
                                    <span className="text-sm font-bold text-gray-900">50%</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '50%' }}
                                        className="h-full bg-[#1e293b] rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Catalogue Produits (Table) */}
                <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm h-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                                <ClipboardList size={18} />
                            </div>
                            <h3 className="font-bold text-gray-900">Catalogue Produits</h3>
                        </div>

                        <div className="relative group">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#26B99A] transition-colors" />
                            <input
                                type="text"
                                placeholder="Rechercher un produit..."
                                className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs w-full md:w-64 focus:ring-1 focus:ring-[#26B99A]/20 outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="w-10 pb-4">
                                        <input type="checkbox" className="rounded border-gray-300 text-[#26B99A] focus:ring-[#26B99A]" />
                                    </th>
                                    <th className="text-left pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">No</th>
                                    <th className="text-left pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Code Ref</th>
                                    <th className="text-left pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Nom du Produit</th>
                                    <th className="text-left pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Stock Total</th>
                                    <th className="text-center pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productData.map((row) => (
                                    <tr key={row.id} className="group border-b border-gray-50/50 hover:bg-gray-50/50 transition-all">
                                        <td className="py-4">
                                            <input type="checkbox" className="rounded border-gray-300 text-[#26B99A] focus:ring-[#26B99A]" />
                                        </td>
                                        <td className="py-4 pl-4 text-xs font-bold text-gray-900">{row.id}</td>
                                        <td className="py-4 pl-4 text-xs font-bold text-gray-600">{row.code}</td>
                                        <td className="py-4 pl-4 text-xs font-bold text-gray-900">{row.product}</td>
                                        <td className="py-4 pl-4 text-xs font-bold text-gray-600">{row.stock}</td>
                                        <td className="py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 bg-emerald-50 text-emerald-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:text-white">
                                                    <Eye size={14} />
                                                </button>
                                                <button className="p-2 bg-blue-50 text-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-500 hover:text-white">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button className="p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStatistics;
