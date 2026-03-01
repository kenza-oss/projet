import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Mail, Plus, Copy, Check, Trash2, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminInvitations = () => {
    const [invitations, setInvitations] = useState([]);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const fetchInvitations = async () => {
        try {
            const res = await axios.get('admin/invite-client/');
            setInvitations(res.data);
        } catch (err) {
            console.error("Failed to fetch invitations", err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchInvitations();
    }, []);

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
            const res = await axios.post('admin/invite-client/', { email });
            toast.success("Invitation générée !");
            setEmail('');
            fetchInvitations();
        } catch (err) {
            toast.error("Erreur lors de la génération de l'invitation.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (token) => {
        const link = `${window.location.origin}/register?token=${token}`;
        navigator.clipboard.writeText(link);
        toast.success("Lien copié !");
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestion des Invitations</h1>
                    <p className="text-gray-500 font-medium mt-1">Invitez de nouveaux clients à rejoindre la plateforme.</p>
                </div>
            </div>

            {/* Create Invitation Card */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Plus className="text-blue-600" size={20} /> Nouvelle Invitation
                </h3>
                <form onSubmit={handleInvite} className="flex gap-4 max-w-2xl">
                    <div className="flex-1 relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email du client..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm font-medium"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-gray-900 transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                    >
                        {loading ? 'Génération...' : 'Générer le lien'}
                    </button>
                </form>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900">Historique des Invitations</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center w-16">Status</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client Email</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Date d'Expiration</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {fetching ? (
                                <tr><td colSpan="4" className="text-center py-20 text-gray-400 font-medium">Chargement des invitations...</td></tr>
                            ) : invitations.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-20 text-gray-400 font-medium">Aucune invitation générée.</td></tr>
                            ) : invitations.map((inv) => {
                                const isValid = !inv.used && new Date(inv.expires_at) > new Date();
                                return (
                                    <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6 text-center">
                                            {inv.used ? (
                                                <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto" title="Utilisée">
                                                    <ShieldCheck size={18} />
                                                </div>
                                            ) : isValid ? (
                                                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto animate-pulse" title="Active">
                                                    <Clock size={18} />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto" title="Expirée">
                                                    <ShieldAlert size={18} />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-6">
                                            <span className="font-bold text-gray-900">{inv.email}</span>
                                        </td>
                                        <td className="px-4 py-6 text-center">
                                            <span className="text-xs font-medium text-gray-500">
                                                {new Date(inv.expires_at).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-6 text-right pr-8">
                                            <div className="flex items-center justify-end gap-2">
                                                {!inv.used && isValid && (
                                                    <button
                                                        onClick={() => copyToClipboard(inv.token)}
                                                        className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-all"
                                                        title="Copier le lien"
                                                    >
                                                        <Copy size={18} />
                                                    </button>
                                                )}
                                                <button className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminInvitations;
