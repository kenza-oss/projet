import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Building2, Lock, Mail, ChevronRight, Rocket, PlusIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import LanguageSelector from '../components/LanguageSelector';
import registrationBg from '../assets/register_bg_1.png';
import algeriaFlag from '../assets/algeria_flag_sphere.png';

const ProducerLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            await login(data.email, data.password);
            const loggedUser = JSON.parse(localStorage.getItem('user'));

            if (loggedUser?.role !== 'producer') {
                setError(t('producerLogin.errors.notProducer'));
                localStorage.clear();
                return;
            }

            if (loggedUser?.is_approved === false) {
                setError(t('producerLogin.errors.waitingValidation'));
                localStorage.clear();
                return;
            }

            navigate('/producer-dashboard');
        } catch (err) {
            setError(t('producerLogin.errors.invalidCredentials'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-inter relative selection:bg-[#FF6600] selection:text-white flex overflow-hidden">
            {/* Left Panel - Video with Overlay */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#1a1410] overflow-hidden">
                <img
                    src={registrationBg}
                    alt="Producer Login Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF6600]/90 via-[#2d1f17]/80 to-transparent"></div>

                <div className="relative z-10 flex flex-col justify-end p-20 w-full">
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                            <Rocket className="text-white" size={32} />
                        </div>
                        <h1 className="text-5xl font-black text-white leading-none mb-4 uppercase tracking-tighter">
                            KLEER <br /><span className="text-amber-400">INFINI</span>
                        </h1>
                        <p className="text-xl text-amber-50 font-medium max-w-md leading-relaxed opacity-90">
                            {t('producerLogin.leftSubtitle')}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 pt-10 border-t border-white/20">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1a1410] bg-slate-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <img src={algeriaFlag} alt="Algerie" className="w-6 h-6 object-contain shadow-sm rounded-full" />
                            <p className="text-sm font-bold text-white tracking-wide uppercase">
                                {t('producerLogin.activeProducers')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 overflow-y-auto bg-slate-50 flex items-center justify-center p-8 pt-24 md:p-20 relative">
                {/* Language Selector placed at absolute top right */}
                <div className="absolute top-6 right-6 md:top-10 md:right-10 z-20">
                    <LanguageSelector />
                </div>

                <div className="w-full max-w-md space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-[#1a1410] tracking-tight">{t('producerLogin.title')}</h2>
                        <p className="text-slate-500 font-medium italic">{t('producerLogin.subtitle')}</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-sm font-bold flex items-center gap-3">
                            <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">!</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#FF6600]">
                                {t('producerLogin.emailLabel')}
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6600] transition-colors" size={20} />
                                <input
                                    type="email"
                                    {...register('email', { required: t('producerLogin.emailRequired') })}
                                    className="w-full bg-white border-2 border-slate-100 px-12 py-4 rounded-2xl focus:border-[#FF6600] focus:ring-4 focus:ring-[#FF6600]/10 outline-none transition-all font-medium text-[#1a1410] placeholder:text-slate-300"
                                    placeholder={t('producerLogin.emailPlaceholder')}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide">{errors.email.message}</p>}
                        </div>

                        {/* Password or Forgot Link */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#FF6600]">
                                    {t('producerLogin.passwordLabel')}
                                </label>
                                <Link to="/forgot-password" size={14} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#FF6600] transition-colors">
                                    {t('producerLogin.forgotPassword')}
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6600] transition-colors" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', { required: t('producerLogin.passwordRequired') })}
                                    className="w-full bg-white border-2 border-slate-100 px-12 py-4 rounded-2xl focus:border-[#FF6600] focus:ring-4 focus:ring-[#FF6600]/10 outline-none transition-all font-medium text-[#1a1410] placeholder:text-slate-300"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#FF6600] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide">{errors.password.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl text-white font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#FF6600]/20 flex items-center justify-center gap-3 ${loading
                                ? 'bg-slate-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#FF6600] to-[#92400e] hover:shadow-[#FF6600]/40 hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                        >
                            {loading ? t('producerLogin.loading') : <>{t('producerLogin.submit')} <ChevronRight size={18} /></>}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="pt-10 border-t border-slate-200">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-center sm:text-left">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('producerLogin.newToKleer')}</p>
                                <button
                                    onClick={() => navigate('/producer-inscription')}
                                    className="text-sm font-black text-[#FF6600] hover:text-[#92400e] transition-colors flex items-center gap-1 mx-auto sm:mx-0"
                                >
                                    {t('producerLogin.createAccess')}
                                </button>
                            </div>

                            <button
                                onClick={() => navigate('/login')}
                                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest transition-colors"
                            >
                                {t('producerLogin.clientAccess')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProducerLogin;
