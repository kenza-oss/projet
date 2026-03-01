import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Building2, Search, Filter, ShieldCheck, ShieldAlert, MoreHorizontal, UserCheck, Trash2 } from 'lucide-react';

const AdminProducers = () => {
    const [producers, setProducers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducers = async () => {
            try {
                // Fetching approved producers or all
                const res = await axios.get('producers/profiles/');
                setProducers(res.data);
            } catch (err) {
                console.error("Failed to fetch producers", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducers();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestion des Producteurs</h1>
                    <p className="text-gray-500 font-medium mt-1">Gérez le catalogue des producteurs et leurs certifications.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher une entreprise..."
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
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entreprise</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Activité / Pays</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Approbation</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-20 text-gray-400 font-medium">Chargement des producteurs...</td></tr>
                            ) : producers.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-20 text-gray-400 font-medium">Aucun producteur trouvé.</td></tr>
                            ) : producers.map((producer) => (
                                <tr key={producer.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {producer.company_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{producer.company_name}</p>
                                                <p className="text-xs text-gray-400 font-bold">{producer.user_email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6">
                                        <p className="font-bold text-gray-900 text-sm">{producer.activity || 'N/A'}</p>
                                        <p className="text-xs text-blue-500 font-bold uppercase tracking-widest">{producer.country || 'N/A'}</p>
                                    </td>
                                    <td className="px-4 py-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${producer.is_approved ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {producer.is_approved ? 'Vérifié' : 'En attente'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-6 text-right pr-8">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-all">
                                                <ShieldCheck size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-lg transition-all">
                                                <MoreHorizontal size={18} />
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

export default AdminProducers;
