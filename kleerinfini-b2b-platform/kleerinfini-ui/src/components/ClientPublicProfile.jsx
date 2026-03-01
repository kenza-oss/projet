import React from 'react';
import { Building2, MapPin, Anchor, ShieldCheck, Globe, Briefcase, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ClientPublicProfile = ({ profile, isOpen, onClose }) => {
    if (!profile) return null;

    const infoFields = [
        { label: 'Secteur', value: profile.sector, icon: Briefcase },
        { label: 'Pays', value: profile.country, icon: Globe },
        { label: 'Ville', value: profile.city, icon: MapPin },
        { label: 'Port Préféré', value: profile.preferred_port, icon: Anchor },
        { label: 'ID Fiscale / RC', value: profile.rc_number, icon: Info },
        { label: 'Adresse', value: profile.address, icon: MapPin },
        { label: 'Site Web', value: profile.website, icon: Globe, isLink: true },
    ].filter(field => field.value && field.value.toString().trim() !== '');

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Card Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100"
                    >
                        {/* Header Image / Pattern Area */}
                        <div className="h-32 bg-gradient-to-br from-[#050B18] to-[#1E3A8A] relative">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            {/* Decorative Seal Background */}
                            <div className="absolute -bottom-10 -right-10 opacity-5 rotate-12">
                                <ShieldCheck size={200} className="text-white" />
                            </div>
                        </div>

                        {/* Profile Info Overlay Area */}
                        <div className="px-10 pb-12 -mt-16 relative">
                            {/* Logo Area */}
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 bg-white rounded-3xl p-1 shadow-xl border border-gray-100">
                                    <div className="w-full h-full rounded-[1.25rem] bg-gray-50 flex items-center justify-center overflow-hidden">
                                        {profile.logo_url || profile.logo ? (
                                            <img
                                                src={profile.logo_url || profile.logo}
                                                alt={profile.company_name}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        ) : (
                                            <Building2 size={48} className="text-gray-200" />
                                        )}
                                    </div>
                                </div>

                                {profile.is_verified && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3, type: "spring" }}
                                        className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-2xl shadow-lg border border-amber-50"
                                    >
                                        <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-xl text-white shadow-inner">
                                            <ShieldCheck size={20} fill="currentColor" strokeWidth={2.5} className="text-white" />
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Company Name & Tagline */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                                        {profile.company_name}
                                    </h2>
                                    {profile.is_verified && (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-full border border-amber-100/50">
                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">
                                                Certifié Kleer
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                    <span className="w-6 h-px bg-gray-200" />
                                    Identité Business Vérifiée
                                </p>
                            </div>

                            {/* Detail Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                                {infoFields.map((field, idx) => {
                                    const Icon = field.icon;
                                    return (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                <Icon size={12} className="text-amber-500/80" />
                                                {field.label}
                                            </div>
                                            {field.isLink ? (
                                                <a
                                                    href={field.value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors truncate"
                                                >
                                                    {field.value.replace(/^https?:\/\//, '')}
                                                </a>
                                            ) : (
                                                <div className="text-sm font-bold text-gray-800 leading-tight">
                                                    {field.value}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Footer CTA / Branding */}
                            <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
                                <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                                    Digital Business Card
                                </div>
                                <div className="flex items-center gap-2 opacity-20 grayscale">
                                    <span className="text-[12px] font-black text-gray-900">KLEER</span>
                                    <div className="w-1 h-1 bg-rose-500 rounded-full" />
                                    <span className="text-[12px] font-black text-gray-900 italic">INFINI</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ClientPublicProfile;
