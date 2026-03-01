import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ShieldCheck, Mail, ChevronRight } from 'lucide-react';
import registrationBg from '../assets/export_registration_bg.png';

const RegistrationPending = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-inter flex overflow-hidden">
            {/* Left Panel - Hero Background */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#1a1410]">
                <img
                    src={registrationBg}
                    alt="Success background"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF6600] via-[#2d1f17]/90 to-transparent"></div>

                <div className="relative z-10 flex flex-col justify-end p-20 w-full">
                    <h1 className="text-5xl font-black text-white leading-none mb-6 uppercase tracking-tighter">
                        ÉLITE <br /><span className="text-amber-400">PRODUCTEURS</span>
                    </h1>
                    <p className="text-xl text-amber-50 font-medium max-w-md leading-relaxed opacity-90">
                        Votre demande d'accréditation a été transmise avec succès à nos services de conformité.
                    </p>
                </div>
            </div>

            {/* Right Panel - Confirmation Message */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-20 bg-slate-50">
                <div className="w-full max-w-md text-center space-y-10 font-inter">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-50 rounded-full mb-4">
                        <Clock size={48} className="text-[#FF6600] animate-pulse" />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-[#1a1410] tracking-tight">Candidature en cours de révision</h2>
                        <p className="text-slate-500 font-medium italic">
                            Nous examinons vos documents et certifications. Ce processus prend généralement moins de 48h ouvrées.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                        <div className="flex items-start gap-4 text-left">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                <ShieldCheck size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#1a1410]">Étape de Conformité</h4>
                                <p className="text-xs text-slate-400 font-medium">Vérification de votre RC, NIF et fiches techniques.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 text-left border-t border-slate-50 pt-6">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                                <Mail size={20} className="text-amber-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#1a1410]">Notification Email</h4>
                                <p className="text-xs text-slate-400 font-medium">Vous recevrez un email dès que votre accès Dashboard sera activé.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-5 bg-[#1a1410] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
                        >
                            Retour à l'accueil <ChevronRight size={18} />
                        </button>
                    </div>

                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest pt-10">
                        KLEER INFINI • ACCRÉDITATION INTERNATIONALE
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPending;
