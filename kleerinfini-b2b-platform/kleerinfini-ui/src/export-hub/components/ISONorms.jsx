import React from 'react';
import { Award, CheckCircle } from 'lucide-react';

const ISONorms = () => {
    return (
        <div className="p-10 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-4xl mx-auto mt-10">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Award size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Normes & Certifications</h2>
                    <p className="text-gray-500">Exigences pour l'accès aux marchés internationaux</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-gray-200 rounded-2xl">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-500" /> Agroalimentaire
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-600 font-medium">
                        <li>• ISO 22000 (Sécurité des denrées)</li>
                        <li>• HACCP (Analyse des dangers)</li>
                        <li>• Label Halal (Export vers pays OCI)</li>
                    </ul>
                </div>
                <div className="p-6 border border-gray-200 rounded-2xl">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <CheckCircle size={18} className="text-blue-500" /> Industrie
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-600 font-medium">
                        <li>• ISO 9001 (Management Qualité)</li>
                        <li>• Marquage CE (Export vers UE)</li>
                        <li>• ISO 14001 (Environnement)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ISONorms;
