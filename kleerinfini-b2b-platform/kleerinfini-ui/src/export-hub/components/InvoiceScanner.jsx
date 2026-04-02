import React, { useState, useRef } from 'react';
import {
    FileSearch,
    UploadCloud,
    CheckCircle2,
    AlertTriangle,
    Calculator,
    ShieldCheck,
    RefreshCcw,
    Zap,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

const InvoiceScanner = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            performAnalysis(files[0]);
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            performAnalysis(files[0]);
        }
    };

    const performAnalysis = async (file) => {
        setIsProcessing(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('export-hub/analyze-invoice/', formData);
            setResult(response.data);

            // SAVE FOR FSPE CALCULATOR (Magic Feature)
            if (response.data.total_amount) {
                localStorage.setItem('last_invoice_amount', response.data.total_amount);
            }
        } catch (error) {
            console.error("OCR Error:", error);
            const errorMsg = error.response?.data?.error || error.message || "Erreur de connexion";
            
            // Render the backend error message securely in the Invoice UI
            setResult({
                filename: file.name,
                nif: "DOCUMENT-INVALIDE", 
                ai: "---------",
                incoterm: "---",
                total_amount: 0,
                currency: "ERR",
                retrocession_rate: 0,
                issues: [
                    { type: 'warning', text: 'Analyse Échouée / Document Rejeté' },
                    { type: 'warning', text: errorMsg }
                ]
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const reset = () => {
        setResult(null);
        setIsProcessing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_50px_-15px_rgba(0,0,0,0.04)] flex flex-col h-full overflow-hidden"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl shadow-sm shadow-indigo-100/50">
                        <FileSearch size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">Scanner de Conformité</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase mt-2">Vérification de factures B2B</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                    <ShieldCheck size={16} />
                    <span className="text-xs font-bold uppercase">Stateless / Sécurisé</span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!isProcessing && !result && (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
              flex-1 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-12 transition-all duration-500 cursor-pointer
              ${isDragging
                                ? 'border-indigo-500 bg-indigo-50/50 scale-[0.98]'
                                : 'border-gray-100 bg-gray-50/30 hover:bg-gray-50 hover:border-gray-200'}
            `}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <div className={`p-6 rounded-full transition-all duration-500 mb-6 ${isDragging ? 'bg-indigo-500 text-white scale-110 rotate-12' : 'bg-white text-indigo-400 shadow-xl shadow-indigo-500/5'}`}>
                            <UploadCloud size={40} strokeWidth={1.5} />
                        </div>
                        <p className="text-lg font-black text-[#050B18] mb-2">Glissez votre facture ici</p>
                        <p className="text-sm text-gray-500 font-medium text-center max-w-[240px]">Supporte PDF, JPG, PNG. Analyse instantanée sans stockage.</p>

                        <div className="mt-10 flex items-center gap-2 text-[10px] text-indigo-600/70 font-bold uppercase">
                            <Zap size={12} fill="currentColor" /> Premium AI Scanner v2.0
                        </div>
                    </motion.div>
                )}

                {isProcessing && (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center py-20"
                    >
                        <div className="relative mb-10">
                            <RefreshCcw size={60} className="text-indigo-600 animate-spin" strokeWidth={1} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-indigo-100 shadow-lg">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="w-4 h-4 bg-indigo-600 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                        <p className="text-xl font-bold text-[#050B18] mb-2">Analyse OCR en cours...</p>
                        <p className="text-sm text-gray-500 font-medium animate-pulse uppercase">Extraction du NIF, AI et Incoterms</p>
                    </motion.div>
                )}

                {result && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6 overflow-y-auto pr-2 custom-scrollbar"
                    >
                        {/* Main Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Montant Repatriable</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-indigo-600">{(result.total_amount * result.retrocession_rate / 100).toLocaleString()}</span>
                                    <span className="text-sm font-bold text-indigo-400">{result.currency}</span>
                                </div>
                                <div className="mt-2 flex items-center gap-1 text-xs text-gray-600 font-bold uppercase">
                                    <Calculator size={12} /> {result.retrocession_rate}% du total ({result.total_amount} {result.currency})
                                </div>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Incoterm Détecté</span>
                                <div className="text-2xl font-black text-[#050B18]">{result.incoterm}</div>
                                <div className="mt-2 flex items-center gap-1 text-xs text-gray-900 font-bold uppercase bg-white px-2 py-0.5 rounded-full border border-gray-100 w-fit">
                                    <Info size={12} /> Conforme ZLECAF
                                </div>
                            </div>
                        </div>

                        {/* Business ID section */}
                        <div className="p-6 bg-[#050B18] rounded-3xl text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldCheck size={80} />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Numéro d'Identification Fiscale</span>
                                    <p className="text-lg font-mono font-bold text-indigo-400">{result.nif}</p>
                                </div>
                                <div className="h-[1px] w-full bg-white/10" />
                                <div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Article d'Imposition</span>
                                    <p className="text-lg font-mono font-bold text-indigo-400">{result.ai}</p>
                                </div>
                            </div>
                        </div>

                        {/* Checklist items */}
                        <div className="space-y-3">
                            <span className="text-xs font-bold text-gray-500 uppercase px-1">Checklist Conformité Bancaire</span>
                            {result.issues.map((issue, idx) => (
                                <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border ${issue.type === 'success' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-amber-50/50 border-amber-100 text-amber-800'}`}>
                                    {issue.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-600 shrink-0" /> : <AlertTriangle size={18} className="text-amber-600 shrink-0" />}
                                    <span className="text-sm font-bold">{issue.text}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={reset}
                            className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mt-4"
                        >
                            <RefreshCcw size={16} /> Scanner un nouveau document
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-auto pt-6 border-t border-gray-50 text-center">
                <p className="text-[9px] text-gray-400 font-bold uppercase">
                    Traitement IA local & privé • Aucune donnée stockée • RGPD Algérie
                </p>
            </div>
        </motion.div>
    );
};

export default InvoiceScanner;
