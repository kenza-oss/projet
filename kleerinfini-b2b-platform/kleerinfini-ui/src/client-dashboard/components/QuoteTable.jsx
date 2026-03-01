import React, { useEffect, useState } from 'react';
import { getEstimates } from '../../api/estimates';

const QuoteTable = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const data = await getEstimates();
                setQuotes(data || []);
            } catch (error) {
                console.error("Failed to fetch quotes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuotes();
    }, []);

    if (loading) return <div className="p-4 text-center">Chargement des devis...</div>;
    if (quotes.length === 0) return <div className="p-4 text-center text-gray-500">Aucune demande de devis envoyée.</div>;

    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-gray-700">
                        <th className="p-4 font-semibold">Produit</th>
                        <th className="p-4 font-semibold">Quantité</th>
                        <th className="p-4 font-semibold">Date</th>
                        <th className="p-4 font-semibold">Statut</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {quotes.map((quote) => (
                        <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium text-gray-900">{quote.product_name || `Produit #${quote.product}`}</td>
                            <td className="p-4 text-gray-600">{quote.quantity}</td>
                            <td className="p-4 text-gray-500">
                                {quote.created_at ? new Date(quote.created_at).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                            </td>
                            <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${quote.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                    quote.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {quote.status === 'pending' ? 'En attente' : quote.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default QuoteTable;
