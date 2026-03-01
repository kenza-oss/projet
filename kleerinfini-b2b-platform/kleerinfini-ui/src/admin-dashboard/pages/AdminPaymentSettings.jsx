import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDollarSign, FiCreditCard, FiSave, FiAlertCircle, FiCheckCircle, FiShield, FiEdit3 } from 'react-icons/fi';
import api from '../../api/axios';

const AdminPaymentSettings = () => {
    const [settings, setSettings] = useState({
        subscription_price: '',
        bank_name: '',
        account_holder: '',
        rib: '',
        ccp: '',
        rip: ''
    });
    const [ccpNumber, setCcpNumber] = useState('');
    const [ccpKey, setCcpKey] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        if (message.text) {
            const t = setTimeout(() => setMessage({ type: '', text: '' }), 4000);
            return () => clearTimeout(t);
        }
    }, [message]);

    const fetchSettings = async () => {
        try {
            const res = await api.get('subscriptions/settings/public/');
            setSettings(res.data);
            // Parse CCP into number and key parts (format: "number / key")
            if (res.data.ccp) {
                const parts = res.data.ccp.split('/');
                setCcpNumber((parts[0] || '').trim());
                setCcpKey((parts[1] || '').trim());
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Impossible de charger les paramètres.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        setShowConfirmModal(true);
    };

    const confirmSave = async () => {
        setSaving(true);
        setShowConfirmModal(false);
        // Combine CCP number and key into "number / key" format
        const combinedCcp = ccpKey ? `${ccpNumber} / ${ccpKey}` : ccpNumber;
        const payload = { ...settings, ccp: combinedCcp };
        try {
            await api.patch('subscriptions/settings/admin/', payload);
            setSettings(prev => ({ ...prev, ccp: combinedCcp }));
            setMessage({ type: 'success', text: '✅ Paramètres mis à jour avec succès !' });
        } catch (err) {
            const detail = err.response?.data?.error || err.response?.data?.detail || 'Erreur lors de la sauvegarde.';
            setMessage({ type: 'error', text: detail });
        } finally {
            setSaving(false);
        }
    };

    const Field = ({ label, value, field, type = 'text', span = '' }) => (
        <div className={`space-y-2 ${span}`}>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={e => setSettings({ ...settings, [field]: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 font-bold text-gray-900 focus:border-[#26B99A] focus:bg-white outline-none transition-all"
                />
                <FiEdit3 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
            </div>
        </div>
    );

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#26B99A] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-500 font-bold">Chargement des paramètres...</p>
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Paramètres Financiers</h1>
                    <p className="text-gray-500 font-medium mt-1">Gérez le prix d'abonnement et les coordonnées bancaires.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#26B99A] hover:bg-[#1f967d] text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-[#26B99A]/30 transition-all disabled:opacity-50"
                >
                    <FiSave size={16} />
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <main className="lg:col-span-2 space-y-6">
                    {/* Prix */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                <FiDollarSign className="text-emerald-600" size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900">Prix d'Abonnement</h3>
                                <p className="text-xs text-gray-400 font-medium">Affiché sur toutes les factures</p>
                            </div>
                        </div>
                        <div className="p-8">
                            <Field label="Prix Annuel (DA)" value={settings.subscription_price} field="subscription_price" type="number" />
                        </div>
                    </div>

                    {/* Coordonnées bancaires */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                                <FiCreditCard className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900">Coordonnées Bancaires</h3>
                                <p className="text-xs text-gray-400 font-medium">RIB, CCP et informations de paiement</p>
                            </div>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Nom de la Banque" value={settings.bank_name} field="bank_name" />
                            <Field label="Titulaire du Compte" value={settings.account_holder} field="account_holder" span="md:col-span-2" />
                            <Field label="RIB" value={settings.rib} field="rib" span="md:col-span-2" />
                            {/* CCP split into two fields */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Numéro CCP</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="ex: 00123456789"
                                        value={ccpNumber}
                                        onChange={e => setCcpNumber(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 font-bold text-gray-900 focus:border-[#26B99A] focus:bg-white outline-none transition-all"
                                    />
                                    <FiEdit3 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Clé CCP</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="ex: 99"
                                        value={ccpKey}
                                        onChange={e => setCcpKey(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 font-bold text-gray-900 focus:border-[#26B99A] focus:bg-white outline-none transition-all"
                                    />
                                    <FiEdit3 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium">Sera enregistré comme : <span className="font-black text-gray-600">{ccpNumber || '...'} / {ccpKey || '...'}</span></p>
                            </div>
                            <Field label="RIP BaridiMob" value={settings.rip} field="rip" span="md:col-span-2" />
                        </div>
                    </div>
                </main>

                {/* Sidebar Info */}
                <aside className="space-y-6">
                    <div className="bg-[#050B18] rounded-[2.5rem] p-8 text-white">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                            <FiShield className="text-[#26B99A]" size={24} />
                        </div>
                        <h3 className="text-xl font-black mb-3">Info Importante</h3>
                        <p className="text-white/50 text-sm font-medium leading-relaxed">
                            Ces informations apparaissent sur <strong className="text-white/80">toutes les factures</strong> générées automatiquement. Vérifiez l'exactitude avant d'enregistrer.
                        </p>
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                <span className="text-xs font-bold">Chiffrement SSL Actif</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                <span className="text-xs font-bold">Accès Administrateur Requis</span>
                            </div>
                        </div>
                    </div>

                    {/* Current values summary */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                        <h4 className="font-black text-gray-900 text-sm mb-4">Valeurs Actuelles</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Prix</span>
                                <span className="text-sm font-black text-gray-900">{settings.subscription_price} DA</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Banque</span>
                                <span className="text-sm font-black text-gray-900 text-right max-w-[140px] truncate">{settings.bank_name}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">CCP</span>
                                <span className="text-sm font-black text-gray-900">{ccpNumber} / {ccpKey}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">RIB</span>
                                <span className="text-xs font-black text-gray-900 truncate max-w-[140px]">{settings.rib}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Confirm Modal */}
            <AnimatePresence>
                {showConfirmModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-[#26B99A]" />
                            <div className="w-16 h-16 bg-[#26B99A]/10 rounded-3xl flex items-center justify-center mb-6">
                                <FiSave className="text-[#26B99A]" size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Confirmer la modification</h3>
                            <p className="text-gray-500 font-medium mb-4">
                                Vous êtes sur le point de mettre à jour les paramètres financiers de la plateforme :
                            </p>
                            <div className="bg-gray-50 rounded-2xl p-5 space-y-2 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-bold">Prix annuel</span>
                                    <span className="font-black text-gray-900">{settings.subscription_price} DA</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-bold">CCP complet</span>
                                    <span className="font-black text-gray-900">{ccpNumber} / {ccpKey}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-bold">RIB</span>
                                    <span className="font-black text-gray-900 text-right text-xs max-w-[200px] truncate">{settings.rib}</span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 transition-all text-sm"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={confirmSave}
                                    className="flex-1 bg-[#26B99A] text-white py-4 rounded-2xl font-black text-sm hover:bg-[#1f967d] shadow-xl shadow-[#26B99A]/30 transition-all"
                                >
                                    Confirmer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toast Message */}
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={`fixed bottom-8 right-8 p-5 rounded-2xl shadow-2xl flex items-center gap-3 z-50 ${message.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                            }`}
                    >
                        {message.type === 'success' ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
                        <span className="font-bold text-sm">{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPaymentSettings;
