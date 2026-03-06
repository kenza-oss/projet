// src/pages/Registration2.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Lock,
    Phone,
    Building2,
    Globe,
    Briefcase,
    Languages,
    Link as LinkIcon,
    ChevronRight,
    ChevronLeft,
    ShieldCheck,
    CheckCircle2,
    Eye,
    EyeOff
} from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Select from 'react-select';
import countryList from 'country-list';
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSelector from '../components/LanguageSelector';
import clientAuthBanner from '../assets/client_auth_banner.jpg';
import "../App.css";



const createSchema = (t) => yup.object().shape({
    prenom: yup.string().required(t('clientRegister.firstNameRequired', 'Le prénom est requis')),
    nom: yup.string().required(t('clientRegister.lastNameRequired', 'Le nom est requis')),
    email: yup.string().email(t('clientRegister.emailInvalid', 'Email invalide')).required(t('clientRegister.emailRequired', "L'email est requis")),
    password: yup.string().min(8, t('clientRegister.passwordMin', 'Le mot de passe doit contenir au moins 8 caractères')).required(t('clientRegister.passwordRequired', 'Le mot de passe est requis')),
    telephone: yup.string().required(t('clientRegister.phoneRequired', 'Le numéro de téléphone est requis')),
    societe: yup.string().required(t('clientRegister.companyRequired', 'Le nom de la société est requis')),
    pays: yup.object().required(t('clientRegister.countryRequired', 'Le pays est requis')),
    secteur: yup.string().required(t('clientRegister.sectorRequired', "Le secteur d'activité est requis")),
    langue: yup.object().required(t('clientRegister.languageRequired', 'La langue est requise')),
    siteweb: yup.string().url(t('clientRegister.websiteInvalid', 'URL invalide')).nullable(),
});

const luxurySelectStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#F3F4F6', // Light gray background like Behance inputs
        borderColor: 'transparent',
        color: '#1a1a1a',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: state.isFocused ? '0 0 0 2px #000000' : 'none', // Black focus ring for high contrast
        '&:hover': { borderColor: '#e5e7eb' },
        fontSize: '0.95rem',
        fontFamily: 'Inter, sans-serif',
        fontWeight: '500',
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        zIndex: 9999,
        borderRadius: '12px',
        boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.1)',
        padding: '8px'
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#000000' : state.isFocused ? '#f3f4f6' : 'transparent',
        color: state.isSelected ? 'white' : '#1a1a1a',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '500',
        padding: '10px 16px',
        borderRadius: '8px',
        transition: 'all 0.2s'
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#9CA3AF'
    })
};

const Registration2 = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { registerClient } = useAuth();
    const { t } = useTranslation();
    const [invitationLoading, setInvitationLoading] = useState(!!token);
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const REGISTRATION_STEPS = [
        { key: 'identity', fallback: 'Identité' },
        { key: 'company', fallback: 'Entreprise' },
        { key: 'finalization', fallback: 'Finalisation' }
    ];

    const schema = createSchema(t);

    const {
        register,
        handleSubmit,
        control,
        trigger,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            langue: { value: 'fr', label: 'Français' }
        }
    });

    // Optional: Pre-fill email if invitation token is provided
    useEffect(() => {
        const verifyInvitation = async () => {
            if (token) {
                setInvitationLoading(true);
                try {
                    const res = await axios.get(`register/invite/${token}/`);
                    setValue('email', res.data.email);
                    toast.success(t('clientRegister.invitationValidated', 'Invitation validée pour {{email}}', { email: res.data.email }));
                } catch (err) {
                    console.error("Invalid token", err);
                    toast.info(t('clientRegister.registerFree', 'Vous pouvez vous inscrire librement sans invitation.'));
                } finally {
                    setInvitationLoading(false);
                }
            }
        };
        verifyInvitation();
    }, [token, setValue]);

    const countryOptions = countryList.getData()
        .map(country => ({ value: country.code, label: country.name }))
        .sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }));

    const languageOptions = [
        { value: 'fr', label: 'Français' },
        { value: 'en', label: 'English' },
        { value: 'ar', label: 'العربية' },
        { value: 'es', label: 'Español' },
    ];

    const calculatePasswordStrength = (password) => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const onSubmit = async (data) => {
        setSubmitting(true);
        const toastId = toast.loading(t('clientRegister.accountCreation', 'Création de votre compte partenaire...'));
        try {
            const payload = {
                role: 'client',
                first_name: data.prenom,
                last_name: data.nom,
                email: data.email,
                password: data.password,
                company_name: data.societe,
                phone: data.telephone,
                country: data.pays.label,
                sector: data.secteur,
                language: data.langue.value,
                website: data.siteweb,
                invitation_token: token
            };

            await registerClient(payload);
            toast.success(t('clientRegister.welcome', 'Bienvenue ! Accès immédiat à votre dashboard.'), { id: toastId });
            setTimeout(() => window.location.href = '/dashboard', 1500); // Redirect to dashboard directly
        } catch (err) {
            console.error(err);
            let errorMessage = t('clientRegister.errorGeneral', 'Une erreur est survenue lors de l\'inscription.');

            if (err.response && err.response.data) {
                if (err.response.data.error) {
                    errorMessage = err.response.data.error;
                } else if (err.response.data.details) {
                    // Handle field-specific errors
                    const firstError = Object.values(err.response.data.details)[0];
                    if (Array.isArray(firstError)) {
                        errorMessage = firstError[0];
                    } else {
                        errorMessage = String(firstError);
                    }
                }
            }

            toast.error(errorMessage, { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    const handleNext = async () => {
        let fields = [];
        if (step === 0) fields = ['prenom', 'nom', 'email', 'password', 'telephone'];
        else if (step === 1) fields = ['societe', 'pays', 'secteur', 'langue', 'siteweb'];

        const isValid = fields.length ? await trigger(fields) : true;
        if (isValid) setStep(s => Math.min(s + 1, REGISTRATION_STEPS.length - 1));
    };

    // Behance-style input classes
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
                        alt="Client Registration Background"
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
                            {t('clientRegister.leftTitle1', 'L\'Excellence')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">{t('clientRegister.leftTitle2', 'B2B.')}</span>
                        </h2>
                        <p className="text-gray-300 text-sm md:text-lg leading-relaxed max-w-md font-light hidden sm:block">
                            {t('clientRegister.leftSubtitle', 'Rejoignez une communauté d\'élite. Accédez aux meilleurs producteurs certifiés et transformez vos échanges commerciaux.')}
                        </p>
                    </motion.div>
                </div>

                <div className="relative z-10 pt-6 md:pt-10 hidden sm:block">
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 md:w-12 bg-white/30" />
                        <span className="text-white/60 text-[10px] md:text-xs uppercase tracking-widest font-medium">{t('clientRegister.network', 'Kleer Infini Global Network')}</span>
                    </div>
                </div>
            </div>

            {/* 📝 RIGHT FORM PANEL (55%) */}
            <div className="flex-1 flex flex-col relative bg-white overflow-y-auto">

                {/* Top Navigation */}
                <div className="flex justify-between items-center p-5 md:p-8 md:pb-4">
                    <LanguageSelector />
                    <p className="text-sm font-medium text-gray-500">
                        {t('clientRegister.alreadyMember', 'Déjà membre ?')} <a href="/login" className="text-black font-bold hover:underline whitespace-nowrap">{t('clientRegister.login', 'Connexion')}</a>
                    </p>
                </div>

                <div className="flex-1 flex items-center justify-center px-5 py-4 md:p-12 lg:p-20 overflow-y-auto">
                    <div className="w-full max-w-md md:max-w-2xl">

                        {/* Progress Header */}
                        <div className="mb-8 md:mb-12">
                            <h1 className="text-2xl md:text-4xl font-black text-black tracking-tight mb-3">{t('clientRegister.title', 'Créer un compte')}</h1>
                            <div className="flex items-center gap-2 mb-8">
                                {REGISTRATION_STEPS.map((step_item, idx) => (
                                    <div key={idx} className="flex items-center">
                                        <div className={`
                                            h-2 w-2 rounded-full mr-2 transition-all duration-300
                                            ${idx === step ? 'bg-black w-8' : idx < step ? 'bg-green-500' : 'bg-gray-200'}
                                        `} />
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${idx === step ? 'text-black' : 'text-gray-400'}`}>
                                            {t(`clientRegister.steps.${step_item.key}`, step_item.fallback)}
                                        </span>
                                        {idx < REGISTRATION_STEPS.length - 1 && <div className="w-4" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {step === 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="col-span-1 space-y-1">
                                                <label className={labelClass}>{t('clientRegister.firstNameLabel', 'Prénom')}</label>
                                                <div className={inputWrapperClass}>
                                                    <User size={16} className={iconClass} />
                                                    <input {...register('prenom')} placeholder={t('clientRegister.firstNamePlaceholder', 'Jean')} className={inputClass} />
                                                </div>
                                                {errors.prenom && <p className="text-red-500 text-[10px] mt-1 font-bold">{t('clientRegister.firstNameRequired', 'Le prénom est requis')}</p>}
                                            </div>

                                            <div className="col-span-1 space-y-1">
                                                <label className={labelClass}>{t('clientRegister.lastNameLabel', 'Nom')}</label>
                                                <div className={inputWrapperClass}>
                                                    <User size={16} className={iconClass} />
                                                    <input {...register('nom')} placeholder={t('clientRegister.lastNamePlaceholder', 'Dupont')} className={inputClass} />
                                                </div>
                                                {errors.nom && <p className="text-red-500 text-[10px] mt-1 font-bold">{t('clientRegister.lastNameRequired', 'Le nom est requis')}</p>}
                                            </div>

                                            <div className="md:col-span-2 space-y-1">
                                                <label className={labelClass}>{t('clientRegister.emailLabel', 'Email Professionnel')}</label>
                                                <div className={inputWrapperClass}>
                                                    <Mail size={16} className={iconClass} />
                                                    <input
                                                        type="email"
                                                        {...register('email')}
                                                        placeholder={t('clientRegister.emailPlaceholder', 'contact@entreprise.com')}
                                                        className={inputClass}
                                                    />
                                                </div>
                                                {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{t('clientRegister.emailRequired', 'L\'email est requis')}</p>}
                                            </div>

                                            <div className="col-span-1 space-y-1">
                                                <label className={labelClass}>{t('clientRegister.passwordLabel', 'Mot de passe')}</label>
                                                <div className={inputWrapperClass}>
                                                    <Lock size={16} className={iconClass} />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        {...register('password')}
                                                        placeholder={t('clientRegister.passwordPlaceholder', '••••••••')}
                                                        className={inputClass}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 text-gray-400 hover:text-black transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                                {/* Password Strength Indicator */}
                                                <div className="mt-2 flex gap-1 h-1">
                                                    {[1, 2, 3, 4].map((level) => {
                                                        const strength = calculatePasswordStrength(control._formValues.password);
                                                        const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
                                                        return (
                                                            <div
                                                                key={level}
                                                                className={`flex-1 rounded-full transition-all duration-500 ${level <= strength ? colors[strength - 1] : "bg-gray-200"}`}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                                <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1 font-bold">
                                                    {calculatePasswordStrength(control._formValues.password) < 2 && t('clientRegister.passwordWeak', 'Faible')}
                                                    {calculatePasswordStrength(control._formValues.password) === 2 && t('clientRegister.passwordMedium', 'Moyen')}
                                                    {calculatePasswordStrength(control._formValues.password) === 3 && t('clientRegister.passwordStrong', 'Fort')}
                                                    {calculatePasswordStrength(control._formValues.password) === 4 && t('clientRegister.passwordExcellent', 'Excellent')}
                                                </p>
                                                {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold">{t('clientRegister.passwordRequired', 'Le mot de passe est requis')}</p>}
                                            </div>

                                            <div className="col-span-1 space-y-1">
                                                <label className={labelClass}>{t('clientRegister.phoneLabel', 'Téléphone')}</label>
                                                <Controller
                                                    name="telephone"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <PhoneInput
                                                            {...field}
                                                            international
                                                            className="luxury-phone-input-simple"
                                                            placeholder="+33 6 12 34 56 78"
                                                        />
                                                    )}
                                                />
                                                {errors.telephone && <p className="text-red-500 text-[10px] mt-1 font-bold">{t('clientRegister.phoneRequired', 'Le numéro de téléphone est requis')}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {step === 1 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2 space-y-1">
                                                <label className={labelClass}>{t('clientRegister.companyLabel', 'Nom de la Société')}</label>
                                                <div className={inputWrapperClass}>
                                                    <Building2 size={16} className={iconClass} />
                                                    <input {...register('societe')} placeholder={t('clientRegister.companyPlaceholder', 'GLOBAL TRADING CO.')} className={inputClass} />
                                                </div>
                                                {errors.societe && <p className="text-red-500 text-[10px] mt-1 font-bold">{t('clientRegister.companyRequired', 'Le nom de la société est requis')}</p>}
                                            </div>

                                            <div className="col-span-1 space-y-1">
                                                <label className={labelClass}>{t('clientRegister.countryLabel', 'Pays')}</label>
                                                <Controller
                                                    name="pays"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            options={countryOptions}
                                                            styles={luxurySelectStyles}
                                                            placeholder={t('clientRegister.countryPlaceholder', 'Sélectionner...')}
                                                        />
                                                    )}
                                                />
                                                {errors.pays && <p className="text-red-500 text-[10px] mt-1 font-bold">{t('clientRegister.countryRequired', 'Le pays est requis')}</p>}
                                            </div>

                                            <div className="col-span-1 space-y-1">
                                                <label className={labelClass}>{t('clientRegister.sectorLabel', 'Secteur')}</label>
                                                <div className={inputWrapperClass}>
                                                    <Briefcase size={16} className={iconClass} />
                                                    <input {...register('secteur')} placeholder={t('clientRegister.sectorPlaceholder', 'Agro-alimentaire')} className={inputClass} />
                                                </div>
                                                {errors.secteur && <p className="text-red-500 text-[10px] mt-1 font-bold">{t('clientRegister.sectorRequired', 'Le secteur d\'activité est requis')}</p>}
                                            </div>

                                            <div className="col-span-1 space-y-1">
                                                <label className={labelClass}>{t('clientRegister.languageLabel', 'Langue préférée')}</label>
                                                <Controller
                                                    name="langue"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            options={languageOptions}
                                                            styles={luxurySelectStyles}
                                                        />
                                                    )}
                                                />
                                                {errors.langue && <p className="text-red-500 text-[10px] mt-1 font-bold">{t('clientRegister.languageRequired', 'La langue est requise')}</p>}
                                            </div>

                                            <div className="col-span-1 space-y-1">
                                                <label className={labelClass}>{t('clientRegister.websiteLabel', 'Site Web (Optionnel)')}</label>
                                                <div className={inputWrapperClass}>
                                                    <LinkIcon size={16} className={iconClass} />
                                                    <input {...register('siteweb')} placeholder={t('clientRegister.websitePlaceholder', 'www.example.com')} className={inputClass} />
                                                </div>
                                                {errors.siteweb && <p className="text-red-500 text-[10px] mt-1 font-bold">{t('clientRegister.websiteInvalid', 'URL invalide')}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mb-6 shadow-2xl">
                                                <ShieldCheck size={48} className="text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-black mb-3">{t('clientRegister.confirmationTitle', 'Confirmation')}</h3>
                                            <p className="text-gray-500 mb-8 max-w-sm">
                                                {t('clientRegister.confirmationSubtitle', 'Vous êtes sur le point de rejoindre Kleer Infini. Vérifiez vos informations et validez pour commencer.')}
                                            </p>

                                            <div className="bg-gray-50 p-6 rounded-2xl w-full max-w-md border border-gray-100 text-left space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 size={20} className="text-green-600" />
                                                    <span className="text-gray-900 font-medium">{t('clientRegister.freeRegistration', 'Inscription Gratuite')}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 size={20} className="text-green-600" />
                                                    <span className="text-gray-900 font-medium">{t('clientRegister.dashboardAccess', 'Accès Immédiat au Dashboard')}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 size={20} className="text-green-600" />
                                                    <span className="text-gray-900 font-medium">{t('clientRegister.dedicatedSupport', 'Support Dédié')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between pt-6 mt-6">
                                {step > 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => setStep(s => s - 1)}
                                        className="flex items-center gap-2 text-gray-500 hover:text-black font-bold text-sm transition-colors"
                                    >
                                        <ChevronLeft size={16} /> {t('clientRegister.previous', 'Précédent')}
                                    </button>
                                ) : <div />}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={step < 2 ? handleNext : handleSubmit(onSubmit)}
                                    className="bg-black text-white px-8 py-4 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-900 shadow-lg shadow-black/20 transition-all"
                                    disabled={submitting}
                                >
                                    {step < 2 ? t('clientRegister.continue', 'Continuer') : (submitting ? t('clientRegister.loading', 'Traitement...') : t('clientRegister.submit', 'Créer mon compte'))}
                                    <ChevronRight size={16} />
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration2;
