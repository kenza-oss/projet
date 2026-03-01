import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Download, TrendingUp, Users, Package, DollarSign, FileText, Calendar } from 'lucide-react';
import axios from '../../api/axios';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-7 flex items-center gap-5"
    >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-2xl font-black text-gray-900">{value ?? '—'}</p>
        </div>
    </motion.div>
);

const AdminReports = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('admin/stats/');
                setStats(res.data?.stats || res.data || {});
            } catch (err) {
                console.error('Error loading stats:', err);
                setStats({});
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleExportCSV = () => {
        const rows = [
            ['Indicateur', 'Valeur'],
            ['Total Clients', stats.total_clients ?? 0],
            ['Total Producteurs', stats.total_producers ?? 0],
            ['Total Invitations', stats.total_invitations ?? 0],
            ['Abonnements Actifs', stats.active_subscriptions ?? 0],
            ['Abonnements En Attente', stats.pending_subscriptions ?? 0],
            ['Date du rapport', new Date().toLocaleDateString('fr-FR')],
        ];
        const csv = rows.map(r => r.join(';')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport_kleerinfini_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Rapports</h1>
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mt-1">
                        <Calendar size={14} />
                        <span className="capitalize">{dateStr}</span>
                    </div>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 bg-[#26B99A] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-[#26B99A]/20 hover:bg-[#1f967d] transition-all"
                >
                    <Download size={16} />
                    Exporter CSV
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#26B99A] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* KPI Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        <StatCard icon={Users} label="Total Clients" value={stats.total_clients} color="bg-blue-500" delay={0} />
                        <StatCard icon={Package} label="Total Producteurs" value={stats.total_producers} color="bg-[#26B99A]" delay={0.05} />
                        <StatCard icon={FileText} label="Total Invitations" value={stats.total_invitations} color="bg-violet-500" delay={0.1} />
                        <StatCard icon={TrendingUp} label="Abonnements Actifs" value={stats.active_subscriptions} color="bg-emerald-500" delay={0.15} />
                    </div>

                    {/* Summary Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden"
                    >
                        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#26B99A]/10 rounded-2xl flex items-center justify-center">
                                <ClipboardList size={18} className="text-[#26B99A]" />
                            </div>
                            <h3 className="font-black text-gray-900">Rapport Détaillé de la Plateforme</h3>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {[
                                { label: 'Nombre total de clients inscrits', value: stats.total_clients ?? 0, badge: 'Clients', color: 'bg-blue-50 text-blue-600' },
                                { label: 'Nombre total de producteurs inscrits', value: stats.total_producers ?? 0, badge: 'Producteurs', color: 'bg-[#26B99A]/10 text-[#26B99A]' },
                                { label: 'Total invitations envoyées', value: stats.total_invitations ?? 0, badge: 'Invitations', color: 'bg-violet-50 text-violet-600' },
                                { label: 'Abonnements actifs', value: stats.active_subscriptions ?? 0, badge: 'Actifs', color: 'bg-emerald-50 text-emerald-600' },
                                { label: 'Abonnements en attente de validation', value: stats.pending_subscriptions ?? 0, badge: 'En attente', color: 'bg-amber-50 text-amber-600' },
                                { label: 'Abonnements expirés', value: stats.expired_subscriptions ?? 0, badge: 'Expirés', color: 'bg-red-50 text-red-600' },
                            ].map((row, idx) => (
                                <div key={idx} className="flex items-center justify-between px-8 py-5 hover:bg-gray-50/50 transition-all">
                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs font-black px-3 py-1 rounded-xl ${row.color}`}>{row.badge}</span>
                                        <span className="font-semibold text-gray-700 text-sm">{row.label}</span>
                                    </div>
                                    <span className="text-2xl font-black text-gray-900">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Footer note */}
                    <p className="text-center text-xs text-gray-400 font-medium pb-4">
                        Données en temps réel — Dernière mise à jour : {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </>
            )}
        </div>
    );
};

export default AdminReports;
