import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ExternalLink, Search, Calculator, BadgeAlert } from 'lucide-react';

const LEGAL_DATA = [
    {
        id: 1,
        date: "2024-12-30T10:00:00",
        displayDate: "30 Déc 2024",
        title: "Loi de Finances 2025 : Nouveaux taux de rétrocession devises",
        tag: "Finance",
        url: "https://www.joradp.dz/FTP/JO-FRANCAIS/2024/F2024084.pdf"
    },
    {
        id: 2,
        date: "2024-08-15T14:30:00",
        displayDate: "15 Aoû 2024",
        title: "Arrêté interministériel fixant la liste des produits éligibles au FSPE (Huile, Ciment)",
        tag: "Subvention",
        url: "https://www.joradp.dz/FTP/JO-FRANCAIS/2024/F2024053.pdf"
    },
    {
        id: 3,
        date: "2024-12-10T09:00:00",
        displayDate: "10 Déc 2024",
        title: "Note des Douanes : Procédure simplifiée pour l'export produits frais",
        tag: "Douanes",
        url: "https://www.joradp.dz/FTP/JO-FRANCAIS/2024/F2024082.pdf"
    },
    {
        id: 4,
        date: "2024-11-05T11:00:00",
        displayDate: "05 Nov 2024",
        title: "Décret exécutif relatif aux modalités de transport des marchandises à l'export",
        tag: "Transport",
        url: "https://www.joradp.dz/FTP/JO-FRANCAIS/2024/F2024075.pdf"
    }
];

const LegalWatch = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const isNew = (dateString) => {
        const diff = new Date() - new Date(dateString);
        return diff < 48 * 60 * 60 * 1000; // 48 hours
    };

    const filteredData = LEGAL_DATA.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-10 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-4xl mx-auto mt-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Veille Juridique Export</h2>
                        <p className="text-gray-500">Derniers textes JORADP et réglementations</p>
                    </div>
                </div>

                <div className="relative group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Chercher un mot-clé (ex: Huile)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => window.open(item.url, '_blank')}
                            className="group p-6 bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 border border-transparent hover:border-emerald-100 rounded-2xl flex items-center justify-between transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-xs font-bold text-gray-400 uppercase">
                                        {item.displayDate} • <span className="text-emerald-600">{item.tag}</span>
                                    </span>
                                    {isNew(item.date) && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full animate-pulse">
                                            <BadgeAlert size={10} />
                                            NOUVEAU
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{item.title}</h3>

                                {item.tag === "Subvention" && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate('/producer-dashboard/calculator');
                                        }}
                                        className="mt-3 flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                                    >
                                        <Calculator size={14} />
                                        Calculer mon aide
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <ExternalLink size={20} className="text-gray-300 group-hover:text-emerald-500 transition-all translate-x-1 group-hover:translate-x-0" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                        <p className="text-gray-400 font-medium">Aucun résultat trouvé pour "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LegalWatch;

