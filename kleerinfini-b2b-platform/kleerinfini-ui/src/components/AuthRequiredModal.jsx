import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png'; // Make sure this path is correct relative to the new component
import securityBg from '../assets/auth-security-bg.jpg';

const AuthRequiredModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ isolation: 'isolate' }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Modal Apparition */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                            duration: 0.4
                        }}
                        className="relative w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors z-10"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>

                        {/* Header Area with Premium Image Background & Logo */}
                        <div className="relative pt-12 pb-8 px-8 overflow-hidden flex flex-col items-center border-b border-white/10">
                            {/* Decorative Background Image */}
                            <div className="absolute inset-0 w-full h-full">
                                <img src={securityBg} alt="Security Background" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>
                            </div>

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-2xl bg-white shadow-xl border border-white/20 flex items-center justify-center mb-6 overflow-hidden p-3 transition-transform hover:scale-105 duration-500">
                                    <img src={logo} alt="KleerInfini" className="w-full h-full object-contain" />
                                </div>

                                <div className="flex items-center gap-2 mb-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                                    <Lock size={14} className="text-white" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Accès Réservé</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="px-10 py-10 text-center bg-white flex-1">
                            <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                Rejoignez le réseau KleerInfini
                            </h3>

                            <p className="text-base font-medium text-slate-600 leading-relaxed mb-10 max-w-sm mx-auto">
                                <span className="font-bold text-slate-900">KleerInfini Export</span> vous invite à créer un compte pour contacter nos <span className="text-red-600 font-bold">producteurs vérifiés</span> et <span className="text-red-600 font-bold">exportateurs agréés</span>.
                            </p>

                            {/* Feature Highlights */}
                            <div className="flex flex-col gap-4 mb-10 text-left max-w-[260px] mx-auto">
                                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                        <Mail size={14} className="text-red-600" />
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-800">Messagerie directe B2B</span>
                                </div>
                                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                        <ShieldCheck size={14} className="text-emerald-600" />
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-800">Transactions sécurisées</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-4 w-full">
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate('/login');
                                    }}
                                    className="w-full py-5 bg-slate-900 text-white rounded-xl text-sm font-black uppercase tracking-[0.1em] hover:bg-red-600 transition-all shadow-lg active:scale-[0.98]"
                                >
                                    Se Connecter
                                </button>

                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate('/register');
                                    }}
                                    className="w-full py-5 bg-white border-2 border-slate-200 text-slate-800 rounded-xl text-sm font-bold tracking-[0.05em] hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-[0.98]"
                                >
                                    Créer un compte gratuit
                                </button>
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default AuthRequiredModal;
