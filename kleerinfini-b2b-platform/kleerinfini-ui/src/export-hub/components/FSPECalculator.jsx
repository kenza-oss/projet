import React, { useState } from 'react';
import { Calculator, ArrowRight, FileText, Download, ShieldCheck, Scale, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../assets/logo.png';

const FSPE_CATEGORIES = {
    agri: {
        label: "Transport produits agricoles",
        rate: 0.50,
        source: "Arrêté Interministériel - Art. 12 (Subvention Transport)",
        note: "Remboursement de 50% pour les produits périssables.",
        docs: [
            "Facture de transport (détaillée)",
            "Certificat d'origine",
            "Certificat phytosanitaire",
            "Lettre de voiture internationale"
        ]
    },
    transport: {
        label: "Transport international (Marchandises)",
        rate: 0.80,
        source: "Décret Exécutif n°24-112",
        note: "Jusqu'à 80% des frais de fret. Attention : Plafond applicable selon la destination.",
        docs: [
            "Facture de fret maritime/aérien",
            "Connaissement (Bill of Lading / LTA)",
            "Déclaration en Douane (D10)",
            "Preuve de paiement (Avis de débit)"
        ]
    },
    fairs: {
        label: "Participation Foires & Salons",
        rate: 1.00,
        source: "Programme Officiel Ministère du Commerce",
        note: "100% pris en charge pour les foires agréées (Liste officielle).",
        docs: [
            "Facture de location de stand",
            "Attestation de présence (Consulat/Organisateur)",
            "Photos du stand (Preuve visuelle)",
            "Rapport de mission"
        ]
    }
};

const FSPECalculator = () => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('agri');
    const [isCertified, setIsCertified] = useState(false);
    const [result, setResult] = useState(null);
    const [autoFilled, setAutoFilled] = useState(false);

    // MAGIC: Auto-fill from Scanner
    React.useEffect(() => {
        const lastAmount = localStorage.getItem('last_invoice_amount');
        if (lastAmount) {
            setAmount(lastAmount);
            setAutoFilled(true);
        }
    }, []);

    const calculate = () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return;

        if (!isCertified) {
            alert("Attention : Seuls les produits certifiés d'origine algérienne sont éligibles au FSPE.");
            return;
        }

        const catData = FSPE_CATEGORIES[category];
        const stateShare = val * catData.rate;
        const enterpriseShare = val - stateShare;

        setResult({
            total: val,
            state: stateShare,
            enterprise: enterpriseShare,
            ...catData
        });
    };

    const handleDownloadEstimation = () => {
        if (!result) return;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const today = new Date().toLocaleDateString('fr-FR');

        // Helper for currency formatting
        const formatDA = (num) => {
            return num.toLocaleString('fr-FR').replace(/\s/g, ' ') + ' DA';
        };

        // Header
        try {
            doc.addImage(logo, 'PNG', 14, 10, 30, 15);
        } catch (e) {
            console.error("Logo could not be loaded", e);
        }

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Date : ${today}`, pageWidth - 40, 20);

        doc.setFontSize(18);
        doc.setTextColor(5, 11, 24); // #050B18
        doc.setFont("helvetica", "bold");
        doc.text("Estimation de subvention FSPE", 14, 40);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Générée par Kleer Infini - Hub de l'Exportateur", 14, 46);

        // Result Table
        autoTable(doc, {
            startY: 55,
            head: [['Description', 'Montant']],
            body: [
                ['Type de Subvention', result.label],
                ['Dépense Totale déclarée', formatDA(result.total)],
                ['Quote-part État (Estimation Remboursement)', formatDA(result.state)],
                ['Reste à Charge Entreprise', formatDA(result.enterprise)]
            ],
            theme: 'grid',
            headStyles: { fillStyle: [5, 11, 24] },
            styles: { fontSize: 10, cellPadding: 5 }
        });

        // Required Documents
        const finalY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Liste des pièces justificatives à fournir :", 14, finalY);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        result.docs.forEach((docName, index) => {
            doc.text(`- ${docName}`, 14, finalY + 10 + (index * 7));
        });

        // Legal Footer
        const footerY = doc.internal.pageSize.getHeight() - 20;
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("Ce document est une estimation basée sur les textes en vigueur et ne remplace pas la décision finale des organismes officiels.", pageWidth / 2, footerY, { align: 'center' });

        doc.save(`Estimation_FSPE_${today.replace(/\//g, '-')}.pdf`);
    };

    const handleGeneratePreRequest = () => {
        if (!result) return;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const today = new Date().toLocaleDateString('fr-FR');

        // Helper for currency formatting
        const formatDA = (num) => {
            return num.toLocaleString('fr-FR').replace(/\s/g, ' ') + ' DA';
        };

        // Header
        try {
            doc.addImage(logo, 'PNG', 14, 10, 30, 15);
        } catch (e) {
            console.error("Logo could not be loaded", e);
        }

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Le : ${today}`, pageWidth - 40, 20);

        // Address
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("À l'attention de Monsieur le Directeur du Commerce", 100, 45);
        doc.text("de la Wilaya de ................................................", 100, 52);

        // Subject
        doc.setFontSize(13);
        doc.text(`Objet : Demande de prise en charge FSPE - ${result.label}`, 14, 75);

        // Body
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40);

        const intro = `Monsieur le Directeur,\n\nPar la présente, nous avons l'honneur de vous solliciter pour l'examen de notre dossier d'éligibilité au Fonds Spécial de Promotion des Exportations (FSPE) concernant une dépense liée à nos opérations d'exportation.`;

        const details = `Le montant total de la dépense s'élève à ${formatDA(result.total)}, pour laquelle le taux de subvention applicable est de ${result.rate * 100}% selon les dispositions de l'arrêté en vigueur (${result.source}).`;

        const outro = `Vous trouverez ci-joint les pièces justificatives requises pour le traitement de cette demande.\n\nDans l'attente d'une suite favorable, nous vous prions d'agréer, Monsieur le Directeur, l'expression de nos salutations distinguées.`;

        let currentY = 90;
        const margin = 14;
        const textWidth = pageWidth - (margin * 2);

        const introLines = doc.splitTextToSize(intro, textWidth);
        doc.text(introLines, margin, currentY);
        currentY += (introLines.length * 6) + 10;

        const detailsLines = doc.splitTextToSize(details, textWidth);
        doc.text(detailsLines, margin, currentY);
        currentY += (detailsLines.length * 6) + 10;

        const outroLines = doc.splitTextToSize(outro, textWidth);
        doc.text(outroLines, margin, currentY);

        // Signature
        doc.setFont("helvetica", "bold");
        doc.text("Cachet et signature de l'entreprise :", 110, 200);
        doc.setLineWidth(0.5);
        doc.rect(110, 205, 80, 45); // Box for signature

        // Branding
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.setFont("helvetica", "normal");
        doc.text("Formulaire pré-rempli via Kleer Infini - Centre Stratégique Export", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

        doc.save(`Pre_Demande_FSPE_${today.replace(/\//g, '-')}.pdf`);
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">

            {/* Formulaire de Calcul */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-600/10 text-blue-600 rounded-xl">
                            <Scale size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Simulateur FSPE</h2>
                            <p className="text-sm text-gray-500">Conformité JORADP & Ministère du Commerce</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {/* Montant */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Montant de la dépense (DZD)
                                </label>
                                {autoFilled && (
                                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold animate-pulse">
                                        ⚡ Importé du Scanner
                                    </span>
                                )}
                            </div>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => { setAmount(e.target.value); setAutoFilled(false); }}
                                className={`w-full p-4 bg-gray-50 rounded-xl border-2 font-bold text-lg text-gray-900 outline-none transition-all ${autoFilled ? 'border-indigo-200 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'border-transparent focus:border-blue-500'}`}
                                placeholder="ex: 250000"
                            />
                        </div>

                        {/* Type de dépense */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Type de Subvention
                            </label>
                            <div className="relative">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-4 bg-gray-50 rounded-xl border-none font-medium text-gray-900 appearance-none focus:ring-2 focus:ring-blue-600 outline-none pr-10"
                                >
                                    {Object.entries(FSPE_CATEGORIES).map(([key, data]) => (
                                        <option key={key} value={key}>
                                            {data.label} (Taux: {data.rate * 100}%)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                                <Info size={12} />
                                {FSPE_CATEGORIES[category].source}
                            </p>
                        </div>

                        {/* Certification Checkbox */}
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="cert"
                                checked={isCertified}
                                onChange={(e) => setIsCertified(e.target.checked)}
                                className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="cert" className="text-sm text-gray-700 cursor-pointer">
                                <strong>Condition Obligatoire :</strong> Je certifie que les produits exportés sont d'origine algérienne.
                            </label>
                        </div>

                        {/* Note dynamique */}
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
                            <AlertTriangle size={18} className="text-yellow-600 shrink-0 mt-0.5" />
                            <p>{FSPE_CATEGORIES[category].note}</p>
                        </div>

                        <button
                            onClick={calculate}
                            className="w-full py-4 bg-[#050B18] hover:bg-gray-900 text-white rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-lg shadow-gray-200"
                        >
                            Calculer l'Éligibilité <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Résultat Détaillé */}
                {result && (
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                            <h3 className="font-bold text-gray-900">Estimation de Remboursement</h3>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                Éligible FSPE
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center mb-6">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-500 mb-1">Dépense Totale</p>
                                <p className="font-bold text-gray-900">{result.total.toLocaleString()} DA</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-xs text-blue-600 mb-1 font-bold">Quote-part État</p>
                                <p className="font-bold text-blue-700 text-xl">{result.state.toLocaleString()} DA</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-500 mb-1">Reste à Charge</p>
                                <p className="font-bold text-gray-900">{result.enterprise.toLocaleString()} DA</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-xs text-center text-gray-400 italic">
                                * Calcul basé sur l'Article 3 de l'Arrêté interministériel n°24. Sous réserve de validation du dossier complet.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleDownloadEstimation}
                                className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                <Download size={16} /> Télécharger l'Estimation
                            </button>
                            <button
                                onClick={handleGeneratePreRequest}
                                className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                <FileText size={16} /> Générer Pré-demande
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar : Dossier à fournir */}
            <div className="space-y-6">
                <div className="bg-[#050B18] text-white rounded-3xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <ShieldCheck size={20} className="text-blue-400" />
                        </div>
                        <h3 className="font-bold">Dossier Requis</h3>
                    </div>

                    <p className="text-sm text-gray-400 mb-4">
                        Pour bénéficier du remboursement {result?.label || "FSPE"}, veuillez préparer :
                    </p>

                    <ul className="space-y-3">
                        {(result ? result.docs : FSPE_CATEGORIES[category].docs).map((doc, index) => (
                            <li key={index} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                <CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-gray-300">{doc}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-xs text-gray-500 text-center leading-relaxed">
                            Le dossier doit être déposé au niveau de la Direction du Commerce de votre Wilaya.
                        </p>
                    </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                    <h4 className="text-blue-900 font-bold mb-2 text-sm">Conseil Expert</h4>
                    <p className="text-blue-700 text-xs leading-relaxed">
                        Pour le transport maritime, assurez-vous que la compagnie de navigation est agréée en Algérie pour éviter tout rejet du dossier.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default FSPECalculator;
