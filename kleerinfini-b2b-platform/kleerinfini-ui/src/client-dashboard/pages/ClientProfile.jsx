import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, Building2, Globe, LogOut, Trash2, Camera, MapPin, Anchor, Info, Loader2, CheckCircle2, Eye } from 'lucide-react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ClientPublicProfile from '../../components/ClientPublicProfile';
import { uploadToCloudinary } from '../../api/cloudinary';

const ClientProfile = () => {
    const { t } = useTranslation();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/client-profiles/me/');
            setProfile(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError(t('client_dashboard.profile.errors.load', "Impossible de charger le profil."));
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        setError(null);

        // Filter out logo and logo_url if they are strings/read-only
        const payload = { ...profile };
        if (typeof payload.logo === 'string') delete payload.logo;
        delete payload.logo_url;

        try {
            const response = await api.patch('/client-profiles/me/', payload);
            setProfile(response.data);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Error saving profile:", err);
            const errorMsg = err.response?.data ? Object.values(err.response.data)[0] : t('client_dashboard.profile.errors.save', "Erreur lors de l'enregistrement.");
            setError(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSaving(true);
        try {
            // Upload directly to Cloudinary
            const result = await uploadToCloudinary(file, 'clients/logos');
            
            // Patch profile with direct URL
            const response = await api.patch('/client-profiles/me/', {
                logo: result.secure_url
            });
            setProfile(response.data);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Error uploading logo:", err);
            setError(t('client_dashboard.profile.errors.logo', "Erreur lors de l'upload du logo."));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <p className="text-gray-500 font-medium">{t('client_dashboard.profile.loading', 'Chargement de votre identité...')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            <div className="flex justify-end">
                <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 group"
                >
                    <Eye size={16} className="text-blue-500 group-hover:scale-110 transition-transform" />
                    {t('client_dashboard.profile.viewCard', 'Voir ma Carte de Visite')}
                </button>
            </div>
            <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gray-50 flex items-center justify-center">
                        {profile?.logo_url || profile?.logo ? (
                            <img src={profile.logo_url || profile.logo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <Building2 size={40} className="text-gray-300" />
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="absolute bottom-0 right-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors border-4 border-white shadow-lg"
                    >
                        <Camera size={16} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        className="hidden"
                        accept="image/*"
                    />
                </div>
                <div className="flex items-center justify-center gap-3 mb-2">
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{t('client_dashboard.profile.title', 'Mon Profil Business')}</h1>
                    {profile?.is_verified && (
                        <div className="bg-amber-100 text-amber-600 p-1 rounded-full" title="Profil Vérifié par Kleer Infini">
                            <CheckCircle2 size={24} fill="currentColor" className="text-amber-500" />
                        </div>
                    )}
                </div>
                <p className="text-gray-500 font-medium italic">{t('client_dashboard.profile.subtitle', 'Gérez votre carte de visite numérique pour les producteurs.')}</p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-sm space-y-12">
                <AnimatePresence>
                    {(success || error) && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`p-4 rounded-2xl flex items-center gap-3 ${success ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
                        >
                            {success ? <CheckCircle2 size={20} /> : <Info size={20} />}
                            <span className="font-bold text-sm tracking-wide">{success ? t('client_dashboard.profile.messages.success', "Profil mis à jour avec succès !") : error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Personal Info */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">{t('client_dashboard.profile.sections.personal.title', 'Informations Personnelles')}</h3>
                            <p className="text-xs font-medium text-gray-400">{t('client_dashboard.profile.sections.personal.subtitle', 'Vos informations de contact direct.')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('client_dashboard.profile.fields.firstName', 'Prénom')}</label>
                            <input
                                type="text"
                                name="first_name"
                                value={profile.first_name || ''}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-black outline-none transition-all font-bold text-gray-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('client_dashboard.profile.fields.lastName', 'Nom')}</label>
                            <input
                                type="text"
                                name="last_name"
                                value={profile.last_name || ''}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-black outline-none transition-all font-bold text-gray-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 opacity-50">{t('client_dashboard.profile.fields.emailReadonly', 'Email (Non modifiable)')}</label>
                            <div className="w-full p-4 bg-gray-100 rounded-2xl border-2 border-transparent font-bold text-gray-400 cursor-not-allowed">
                                {profile.email}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('client_dashboard.profile.fields.phone', 'Téléphone')}</label>
                            <input
                                type="tel"
                                name="phone"
                                value={profile.phone || ''}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-black outline-none transition-all font-bold text-gray-800"
                            />
                        </div>
                    </div>
                </section>

                {/* Company & Business Info */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">{t('client_dashboard.profile.sections.company.title', "Identité de l'Entreprise")}</h3>
                            <p className="text-xs font-medium text-gray-400">{t('client_dashboard.profile.sections.company.subtitle', 'Ces informations apparaissent sur votre "Carte de Visite".')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('client_dashboard.profile.fields.companyName', 'Nom de la société')}</label>
                            <input
                                type="text"
                                name="company_name"
                                value={profile.company_name || ''}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-black outline-none transition-all font-bold text-gray-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('client_dashboard.profile.fields.sector', "Secteur d'Activité")}</label>
                            <input
                                type="text"
                                name="sector"
                                placeholder="Ex: Grande Distribution, Importateur..."
                                value={profile.sector || ''}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-black outline-none transition-all font-bold text-gray-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('client_dashboard.profile.fields.rcNumber', 'Registre du Commerce / TVA')}</label>
                            <input
                                type="text"
                                name="rc_number"
                                placeholder="Numéro fiscal ou RC"
                                value={profile.rc_number || ''}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-black outline-none transition-all font-bold text-gray-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('client_dashboard.profile.fields.country', 'Pays')}</label>
                            <input
                                type="text"
                                name="country"
                                value={profile.country || ''}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-black outline-none transition-all font-bold text-gray-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('client_dashboard.profile.fields.preferredPort', 'Port de Destination Préféré')}</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="preferred_port"
                                    placeholder="Ex: Port de Marseille, Port de Dubaï"
                                    value={profile.preferred_port || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-black outline-none transition-all font-bold text-gray-800"
                                />
                                <Anchor size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('client_dashboard.profile.fields.address', 'Adresse Complète (Siège Social)')}</label>
                            <textarea
                                name="address"
                                rows="3"
                                value={profile.address || ''}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-black outline-none transition-all font-bold text-gray-800 resize-none"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('client_dashboard.profile.fields.website', 'Site Web')}</label>
                            <div className="relative">
                                <input
                                    type="url"
                                    name="website"
                                    value={profile.website || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-black outline-none transition-all font-bold text-gray-800"
                                />
                                <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-8 border-t border-gray-50">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-black text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-gray-900 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                {t('client_dashboard.profile.buttons.updating', 'Enregistrement...')}
                            </>
                        ) : t('client_dashboard.profile.buttons.update', 'Mettre à jour mon identité')}
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="p-8 rounded-[2rem] border-2 border-red-50 bg-red-50/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                        <Trash2 size={24} />
                    </div>
                    <div>
                        <h4 className="font-black text-red-600 uppercase tracking-widest text-sm">{t('client_dashboard.profile.danger.title', 'Zone de danger')}</h4>
                        <p className="text-xs font-medium text-red-400">{t('client_dashboard.profile.danger.subtitle', 'La suppression du compte est définitive.')}</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-8 py-3 bg-white text-red-600 font-black rounded-xl border-2 border-red-100 hover:bg-red-50 transition-all text-xs uppercase tracking-widest">
                    {t('client_dashboard.profile.danger.delete', 'Supprimer mon compte')}
                </button>
            </div>

            {/* Public Profile Preview Modal */}
            <ClientPublicProfile
                profile={profile}
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
            />
        </div>
    );
};

export default ClientProfile;
