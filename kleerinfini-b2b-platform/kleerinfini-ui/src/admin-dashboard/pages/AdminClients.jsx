import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Users, Search, Filter, MoreHorizontal, UserCheck, UserX, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                // Fetching from a likely endpoint or user-admin if generic
                const res = await axios.get('users/?role=client');
                setClients(res.data);
            } catch (err) {
                console.error("Failed to fetch clients", err);
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestion des Clients</h1>
                    <p className="text-gray-500 font-medium mt-1">Liste des entreprises et acheteurs inscrits.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher un client..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-bold transition-all">
                            <Filter size={18} /> Filtrer
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Société / Secteur</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-20 text-gray-400 font-medium">Chargement des clients...</td></tr>
                            ) : clients.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-20 text-gray-400 font-medium">Aucun client trouvé.</td></tr>
                            ) : clients.map((client) => (
                                <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {client.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{client.first_name} {client.last_name}</p>
                                                <p className="text-xs text-gray-400 font-bold">{client.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6">
                                        <p className="font-bold text-gray-900 text-sm">{client.client_profile?.company_name || 'N/A'}</p>
                                        <p className="text-xs text-blue-500 font-bold uppercase tracking-widest">{client.client_profile?.sector || 'Secteur Inconnu'}</p>
                                    </td>
                                    <td className="px-4 py-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${client.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {client.is_active ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-6 text-right pr-8">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-lg transition-all">
                                                <UserCheck size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all">
                                                <Trash2 size={18} />
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
    );
};

export default AdminClients;
