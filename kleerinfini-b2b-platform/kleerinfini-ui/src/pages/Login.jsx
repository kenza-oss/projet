import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import clientAuthBanner from '../assets/client_auth_banner.jpg';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            await login(data.email, data.password);

            // Get the logged-in user from context
            const loggedUser = JSON.parse(localStorage.getItem('user'));

            // Redirect based on user role
            if (loggedUser?.role === 'producer') {
                navigate('/producer-dashboard');
            } else if (loggedUser?.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                // Default to client dashboard
                const redirect = searchParams.get('redirect');
                if (redirect === 'import-request') {
                    navigate('/dashboard/requests/new');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            console.error(err);
            setError(t('clientLogin.errorCredentials', 'Identifiants incorrects ou erreur de connexion.'));
        } finally {
            setLoading(false);
        }
    };

    // Matching styles from Registration2.jsx
    const labelClass = "block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2 font-inter";
    const inputWrapperClass = "relative flex items-center";
    const inputClass = "w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3.5 pl-11 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black transition-all duration-300 outline-none font-inter text-sm";
    const iconClass = "absolute left-4 text-gray-400";

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">

            {/* 🖼️ LEFT BRAND PANEL (45%) WITH IMAGE */}
            <div className="w-full h-64 md:h-[40vh] lg:h-auto lg:w-[45%] relative flex flex-col justify-between p-8 md:p-12 lg:p-16 overflow-hidden bg-black shrink-0">
                <div className="absolute inset-0 z-0">
                    <img
                        className="w-full h-full object-cover opacity-70"
                        src={clientAuthBanner}
                        alt="Client Login Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                </div>

                <div className="relative z-10 flex h-full flex-col justify-end lg:justify-start lg:pt-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 md:mb-10 border border-white/20"
                    >
                        <span className="text-white font-heavy text-xl md:text-2xl tracking-tighter">K.</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4 md:space-y-6"
                    >
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight font-inter">
                            {t('clientLogin.welcomeBack', 'Bon Retour')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">{t('clientLogin.partner', 'Partenaire.')}</span>
                        </h2>
                        <p className="text-gray-300 text-sm md:text-lg leading-relaxed max-w-md font-light hidden sm:block">
                            {t('clientLogin.subtitle', 'Connectez-vous pour accéder à votre dashboard et gérer vos demandes d\'exportation.')}
                        </p>
                    </motion.div>
                </div>

                <div className="relative z-10 pt-6 md:pt-10 hidden sm:block">
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 md:w-12 bg-white/30" />
                        <span className="text-white/60 text-[10px] md:text-xs uppercase tracking-widest font-medium">{t('clientLogin.network', 'Kleer Infini Global Network')}</span>
                    </div>
                </div>
            </div>

            {/* 📝 RIGHT FORM PANEL (55%) - Matching Registration2.jsx */}
            <div className="flex-1 flex flex-col relative bg-white overflow-y-auto">

                {/* Top Navigation */}
                <div className="flex justify-between items-center p-5 md:p-8 md:pb-4">
                    <LanguageSelector />
                    <p className="text-sm font-medium text-gray-500">
                        {t('clientLogin.noAccount', 'Pas encore de compte ?')} <button onClick={() => navigate('/register')} className="text-black font-bold hover:underline whitespace-nowrap">{t('clientLogin.register', 'S\'inscrire')}</button>
                    </p>
                </div>

                <div className="flex-1 flex items-center justify-center px-5 py-6 md:p-12 lg:p-20 overflow-y-auto">
                    <div className="w-full max-w-md md:max-w-2xl">

                        {/* Header */}
                        <div className="mb-8 md:mb-12">
                            <h1 className="text-2xl md:text-4xl font-black text-black tracking-tight mb-2">{t('clientLogin.title', 'Connexion')}</h1>
                            <p className="text-gray-500 text-sm md:text-base">{t('clientLogin.accessSpace', 'Accédez à votre espace client')}</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Email */}
                            <div className="space-y-1">
                                <label className={labelClass}>{t('clientLogin.emailLabel', 'Email Professionnel')}</label>
                                <div className={inputWrapperClass}>
                                    <Mail size={16} className={iconClass} />
                                    <input
                                        type="email"
                                        {...register('email', { required: t('clientLogin.emailRequired', 'Email requis') })}
                                        className={inputClass}
                                        placeholder={t('clientLogin.emailPlaceholder', 'contact@entreprise.com')}
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.email.message}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <label className={labelClass}>{t('clientLogin.passwordLabel', 'Mot de passe')}</label>
                                <div className={inputWrapperClass}>
                                    <Lock size={16} className={iconClass} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password', { required: t('clientLogin.passwordRequired', 'Mot de passe requis') })}
                                        className={inputClass}
                                        placeholder={t('clientLogin.passwordPlaceholder', '••••••••')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.password.message}</p>}
                            </div>

                            {/* Forgot Password Link moved above submit for better UX or keep as requested */}
                            <div className="flex justify-end">
                                <Link
                                    to="/forgot-password"
                                    className="text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest"
                                >
                                    {t('clientLogin.forgotPassword', 'Mot de passe oublié ?')}
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#3B82F6] text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-[#3B82F6]/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {loading ? t('clientLogin.loading', 'CONNEXION EN COURS...') : t('clientLogin.submit', 'SE CONNECTER')}
                                {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        {/* Bottom Text */}
                        <div className="mt-8 text-center text-sm text-gray-500 mx-auto max-w-sm">
                            {t('clientLogin.terms', 'En vous connectant, vous acceptez nos conditions d\'utilisation.')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
