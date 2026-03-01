import React, { useState, useEffect } from 'react';
import { FileText, Download, Clock, Search, Loader, AlertCircle } from 'lucide-react';
import { getEstimates } from '../../api/estimates';
import { useTranslation } from 'react-i18next';

const ClientDocuments = () => {
    const { t } = useTranslation();
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDocuments = async () => {
            setIsLoading(true);
            try {
                const data = await getEstimates();
                if (Array.isArray(data)) {
                    // Filter estimates that have a response_file
                    const docs = data
                        .filter(est => est.response_file)
                        .map(est => ({
                            id: est.id,
                            name: est.response_file.split('/').pop(),
                            url: est.response_file,
                            size: "PDF", // Placeholder as size isn't in API yet
                            type: "PDF",
                            date: est.created_at,
                            source: est.producer_company_name || t('client_dashboard.documents.unknownProducer', "Producteur Inconnu")
                        }));
                    setDocuments(docs);
                }
            } catch (error) {
                console.error("Failed to fetch documents", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDocuments();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
    };

    const filteredDocuments = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.source.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{t('client_dashboard.documents.title', 'Documents Reçus')}</h1>
                    <p className="text-gray-500">{t('client_dashboard.documents.subtitle', 'Accédez à tous vos devis, factures et certificats envoyés par les producteurs.')}</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder={t('client_dashboard.documents.searchPlaceholder', 'Rechercher un document...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all shadow-sm font-medium"
                        />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader className="animate-spin text-blue-600" size={40} />
                </div>
            ) : filteredDocuments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocuments.map((doc) => (
                        <div key={doc.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                                    <FileText size={24} />
                                </div>
                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{doc.type}</span>
                            </div>

                            <h3 className="font-bold text-gray-900 mb-1 truncate" title={doc.name}>{doc.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{doc.source}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                    <Clock size={12} /> {formatDate(doc.date)}
                                </span>
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm font-bold text-black hover:text-blue-600 transition-colors"
                                >
                                    {t('client_dashboard.documents.actions.download', 'Télécharger')} <Download size={14} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="inline-flex p-4 bg-gray-50 text-gray-400 rounded-full mb-4">
                        <AlertCircle size={32} />
                    </div>
                    <p className="text-gray-500 font-medium">{t('client_dashboard.documents.emptyState', 'Aucun document reçu pour le moment.')}</p>
                </div>
            )}
        </div>
    );
};

export default ClientDocuments;
