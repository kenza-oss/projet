import React, { useState, useEffect } from 'react';
import { Eye, MessageSquare, Clock, CheckCircle, XCircle, MoreHorizontal, Loader } from 'lucide-react';
import { getEstimates } from '../../api/estimates';
import { useNavigate } from 'react-router-dom';

const RequestsTable = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequests = async () => {
            setIsLoading(true);
            try {
                const data = await getEstimates();
                setRequests(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch estimates", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
            case 'sent': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'accepted': return 'bg-green-50 text-green-600 border-green-200';
            case 'refused': return 'bg-red-50 text-red-600 border-red-200';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'sent': return 'Répondu';
            case 'accepted': return 'Accepté';
            case 'refused': return 'Refusé';
            default: return status;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <Loader className="animate-spin text-blue-600" size={30} />
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
                <p className="text-gray-500 font-medium">Vous n'avez aucune demande de devis pour le moment.</p>
                <button onClick={() => navigate('/producers')} className="mt-4 px-6 py-2 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors">
                    Trouver un producteur
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-900">Mes Demandes de Devis</h2>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold transition-colors">Exporter CSV</button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ID & Date</th>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Producteur</th>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Produit / Service</th>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Statut</th>
                            <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {requests.map((req) => (
                            <tr key={req.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="font-bold text-gray-900 text-sm">#{req.id}</div>
                                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock size={10} /> {formatDate(req.created_at)}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs overflow-hidden">
                                            {req.producer_logo ? (
                                                <img src={req.producer_logo} alt={req.producer_company_name} className="w-full h-full object-cover" />
                                            ) : (
                                                (req.producer_company_name || '??').substring(0, 2).toUpperCase()
                                            )}
                                        </div>
                                        <span className="font-medium text-gray-700 text-sm">{req.producer_company_name || 'Producteur Inconnu'}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="font-bold text-gray-900 text-sm">
                                        {req.estimate_products && req.estimate_products.length > 0
                                            ? req.estimate_products[0].product_name
                                            : 'Produit non spécifié'}
                                        {req.estimate_products && req.estimate_products.length > 1 && ` +${req.estimate_products.length - 1} autres`}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        Qté: {req.estimate_products && req.estimate_products.length > 0 ? req.estimate_products[0].quantity : '-'}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(req.status)} inline-flex items-center gap-1`}>
                                        {req.status === 'sent' && <CheckCircle size={10} />}
                                        {req.status === 'pending' && <Clock size={10} />}
                                        {getStatusLabel(req.status)}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 tooltip" title="Voir les détails">
                                            <Eye size={18} />
                                        </button>
                                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg tooltip" title="Ouvrir la conversation">
                                            <MessageSquare size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-6 border-t border-gray-100 flex justify-center">
                <button className="text-xs font-bold text-gray-400 hover:text-black transition-colors">Voir tout l'historique</button>
            </div>
        </div>
    );
};

const ClientRequests = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Mes Demandes</h1>
                <p className="text-gray-500">Suivez l'état de vos demandes de devis et commandes.</p>
            </div>
            <RequestsTable />
        </div>
    );
};

export default ClientRequests;
