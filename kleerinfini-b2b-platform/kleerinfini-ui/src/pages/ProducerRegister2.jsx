// src/pages/ProducerRegister2.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Globe, Award, ChevronRight, ChevronLeft, Building2, Factory, Mail, Phone, Lock, Rocket, FileText, Maximize2, Minimize2, CircleCheck } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Select from 'react-select';
import countryList from 'country-list';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import LocationMarker from '../components/Producer/LocationMarker';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from '../components/LanguageSelector';
import "../App.css";

// Dynamic Backgrounds
import producerBgVideo from '../assets/producer_bg_video.mp4';
import registrationBg1 from '../assets/register_bg_1.png';
import registrationBg2 from '../assets/register_bg_2.png';
import registrationBg3 from '../assets/register_bg_3.png';

const bgImages = [registrationBg1, registrationBg2, registrationBg3];

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const getSchema = (t) => yup.object().shape({
  companyName: yup.string().required(t('producerRegister.errors.required', 'Champ requis')),
  firstName: yup.string().required(t('producerRegister.errors.required', 'Champ requis')),
  lastName: yup.string().required(t('producerRegister.errors.required', 'Champ requis')),
  activity: yup.string().required(t('producerRegister.errors.required', 'Champ requis')),
  email: yup.string().email(t('producerRegister.errors.emailInvalid', 'Email invalide')).required(t('producerRegister.errors.required', 'Champ requis')),
  phone: yup.string().required(t('producerRegister.errors.required', 'Champ requis')),
  whatsapp: yup.string().required(t('producerRegister.errors.required', 'Champ requis')),
  country: yup.object().required(t('producerRegister.errors.required', 'Champ requis')),
  city: yup.string().required(t('producerRegister.errors.required', 'Champ requis')),
  address1: yup.string().required(t('producerRegister.errors.required', 'Champ requis')),
  address2: yup.string(),
  minExportQuantity: yup.string().required(t('producerRegister.errors.required', 'Champ requis')),
  monthlyCapacity: yup.string().required(t('producerRegister.errors.required', 'Champ requis')),
  yearlyCapacity: yup.string().required(t('producerRegister.errors.required', 'Champ requis')),
  exportCategories: yup.array().min(1, t('producerRegister.errors.categoryMin', 'Sélectionnez au menos une catégorie')),
  password: yup
    .string()
    .required(t('producerRegister.errors.required', 'Champ requis'))
    .matches(PASSWORD_REGEX, t('producerRegister.errors.passwordInvalid', 'Le mot de passe doit contenir au moins 12 caractères')),
  confirmPassword: yup
    .string()
    .required(t('producerRegister.errors.required', 'Champ requis'))
    .oneOf([yup.ref('password')], t('producerRegister.errors.passwordMatch', 'Les mots de passe ne correspondent pas')),
  description: yup.string()
});

// Light Luxury Select Styles
const luxurySelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'white',
    borderColor: state.isFocused ? '#FF6600' : '#e5e7eb',
    color: '#1a1a1a',
    padding: '4px',
    borderRadius: '8px',
    boxShadow: state.isFocused ? '0 0 0 1px #FF6600' : 'none',
    '&:hover': { borderColor: '#FF6600' },
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    zIndex: 9999,
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#1a1a1a'
  }),
  input: (provided) => ({
    ...provided,
    color: '#1a1a1a'
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af'
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#FF6600' : state.isFocused ? '#fef3c7' : 'transparent',
    color: state.isSelected ? 'white' : '#1a1a1a',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    padding: '12px 20px',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#fde68a',
    borderRadius: '4px',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#92400e',
    fontSize: '0.75rem',
    fontWeight: '600',
  }),
}

const ProducerRegister2 = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { t } = useTranslation();

  const steps = [
    t('producerRegister.steps.identity', 'Identité'),
    t('producerRegister.steps.documents', 'Documents'),
    t('producerRegister.steps.capacity', 'Capacité'),
    t('producerRegister.steps.security', 'Sécurité'),
    t('producerRegister.steps.validation', 'Validation')
  ];

  const [step, setStep] = useState(0);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [certFiles, setCertFiles] = useState([]);
  const [techFiles, setTechFiles] = useState([]);

  const schema = React.useMemo(() => getSchema(t), [t]);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) });

  const countryOptions = countryList.getData()
    .map(country => ({ value: country.code, label: country.name }))
    .sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }));

  const [categoriesOptions, setCategoriesOptions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('categories/');
        const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
        const options = data.map(cat => ({
          value: cat.name,
          label: cat.name
        })).sort((a, b) => a.label.localeCompare(b.label));
        setCategoriesOptions(options);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'cert') setCertFiles(prev => [...prev, ...files]);
    if (type === 'tech') setTechFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} fichier(s) ajouté(s)`);
  };

  const removeFile = (type, index) => {
    if (type === 'cert') setCertFiles(prev => prev.filter((_, i) => i !== index));
    if (type === 'tech') setTechFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (!markerPosition) {
      toast.error(t('producerRegister.locationError', "Veuillez sélectionner votre localisation exacte sur la carte."));
      return;
    }

    const formData = new FormData();
    const appendBoth = (camel, snake, value) => {
      if (value === undefined || value === null) return;
      formData.append(camel, typeof value === 'object' && !(value instanceof File) ? JSON.stringify(value) : value);
      formData.append(snake, typeof value === 'object' && !(value instanceof File) ? JSON.stringify(value) : value);
    };

    appendBoth('companyName', 'company_name', data.companyName);
    appendBoth('firstName', 'first_name', data.firstName);
    appendBoth('lastName', 'last_name', data.lastName);
    appendBoth('activity', 'activity', data.activity);
    appendBoth('email', 'email', data.email);
    appendBoth('email', 'user_email', data.email); // CRITICAL: Backend expects user_email for account creation
    appendBoth('phone', 'phone', data.phone);
    appendBoth('whatsapp', 'whatsapp', data.whatsapp);
    // Country is handled below as a JSON object
    appendBoth('city', 'city', data.city);
    appendBoth('address1', 'address1', data.address1);
    appendBoth('address2', 'address2', data.address2);
    appendBoth('minExportQuantity', 'min_export_quantity', data.minExportQuantity);
    appendBoth('monthlyCapacity', 'monthly_capacity', data.monthlyCapacity);
    appendBoth('yearlyCapacity', 'yearly_capacity', data.yearlyCapacity);
    appendBoth('description', 'description', data.description || '');

    if (data.exportCategories) {
      formData.append('export_categories', JSON.stringify(data.exportCategories.map(i => i.value || i)));
    }

    // Append Files
    certFiles.forEach(file => formData.append('cert_files', file));
    techFiles.forEach(file => formData.append('tech_files', file));

    // Add target markets (JSON)
    if (data.targetMarkets) {
      formData.append('target_markets', JSON.stringify(data.targetMarkets.map(m => m.value || m)));
    }

    // Force country as object for backend JSONField
    if (data.country) {
      const countryObj = { label: data.country.label, value: data.country.value };
      formData.append('country', JSON.stringify(countryObj));
    }

    formData.append('latitude', parseFloat(markerPosition.lat).toFixed(6));
    formData.append('longitude', parseFloat(markerPosition.lng).toFixed(6));
    formData.append('password', data.password);
    formData.append('password_confirmation', data.confirmPassword);
    formData.append('role', 'producer');

    // Link to existing user if logged in
    const finalUserId = authUser?.id || authUser?.pk;
    if (finalUserId) {
      formData.append('user', finalUserId);
    }

    try {
      setSubmitting(true);
      const toastId = toast.loading("Finalisation de l'accréditation...");

      // LOG DATA BEFORE SENDING
      console.log("DONNÉES ENVOYÉES:", Object.fromEntries(formData.entries()));

      const response = await axios.post('register/producer/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(t('producerRegister.submitSuccess', 'Votre candidature a été déposée avec succès.'), { id: toastId });
      setTimeout(() => window.location.href = '/registration-pending', 2000);
    } catch (err) {
      console.error("SUBMISSION ERROR:", err);
      // UNIQUE ALERT TO VERIFY VERSION
      console.error("SUBMISSION ERROR:", err);
      // Removed alert as requested
      // alert('DIAGNOSTIC FINAL - ERREUR SERVEUR: ' + JSON.stringify(err.response?.data || err.message));
      toast.error(t('producerRegister.submitError', 'Une erreur est survenue lors de votre demande.'));
    } finally {
      setSubmitting(false);
    }
  };

  const onValidationError = (errs) => {
    console.error("FORM VALIDATION FAILED:", errs);
    // ONLY SHOW ALERT IF ON FINAL STEP TO AVOID PREMATURE BLOCKING
    if (step === steps.length - 1) {
      console.warn("Validation failed on final step");
    }
    toast.error(t('producerRegister.validationError', "Veuillez remplir les champs obligatoires de cette étape."));
  };

  const handleNext = async () => {
    let fields = [];
    if (step === 0) fields = ['companyName', 'firstName', 'lastName', 'activity', 'email', 'phone', 'whatsapp', 'country', 'city', 'address1'];
    else if (step === 1) fields = []; // Documents step
    else if (step === 2) fields = ['minExportQuantity', 'monthlyCapacity', 'yearlyCapacity', 'exportCategories'];
    else if (step === 3) fields = ['password', 'confirmPassword'];
    else if (step === 4) fields = ['description'];

    const isValid = await trigger(fields);
    if (!isValid) {
      toast.error(t('producerRegister.validationError', "Veuillez remplir les champs obligatoires de cette étape."));
      return;
    }
    setStep(s => Math.min(s + 1, steps.length - 1));
  };

  const labelClass = "block text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 font-inter";
  const inputClass = "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[#1A1A1A] placeholder-gray-400 focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all duration-300 outline-none font-inter text-sm shadow-sm";

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col md:flex-row overflow-hidden selection:bg-[#FF6600]/20">

      {/* 🧭 LEFT BRAND PANEL (35%) */}
      <div className="hidden md:flex md:w-[35%] relative flex-col justify-between p-16 overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div
                key="video-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full absolute inset-0"
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={producerBgVideo} type="video/mp4" />
                </video>
              </motion.div>
            ) : (
              <motion.img
                key={`image-bg-${step}`}
                src={bgImages[step % bgImages.length]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full object-cover absolute inset-0"
                alt="B2B Premium"
              />
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        </div>

        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center mb-12 shadow-2xl">
            <span className="text-[#FF6600] font-black text-3xl">K</span>
          </div>
          <div className="space-y-6">
            <div className="w-12 h-1 bg-[#D4AF37] rounded-full"></div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight font-inter">
              {t('producerRegister.leftTitle1', "L'Excellence")} <br /> <span className="text-[#D4AF37]">{t('producerRegister.leftTitle2', "Naturelle.")}</span>
            </h2>
            <p className="text-white/90 font-medium text-lg opacity-80 max-w-xs leading-relaxed font-inter">
              {t('producerRegister.leftSubtitle', "Rejoignez le réseau leader de l'exportation internationale.")}
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-white/20 space-y-8">
          <div className="flex items-center gap-6 group">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-[#D4AF37] transition-all duration-500">
              <Globe size={18} className="text-white" />
            </div>
            <div>
              <span className="block text-white text-[11px] font-bold uppercase tracking-widest mb-1">Impact Global</span>
              <span className="text-white/60 text-[10px] uppercase font-inter">Accréditation Kleer Infini</span>
            </div>
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-medium font-inter">© 2024 Kleer Infini • Excellence Export</p>
        </div>
      </div>

      {/* 🧭 RIGHT FORM PANEL (65%) */}
      <div className="flex-1 flex items-center justify-center relative p-6 pt-28 md:p-20 overflow-y-auto bg-[#FBFBFB]">
        <div className="absolute top-4 right-4 md:top-10 md:right-10 z-20 flex flex-col sm:flex-row items-end sm:items-center gap-3 md:gap-4">
          <LanguageSelector />
          <button
            onClick={() => navigate('/producer-login')}
            className="text-[#15803d] font-bold text-xs md:text-lg bg-[#dcfce7] px-4 md:px-8 py-2 md:py-4 rounded-full shadow-sm border border-[#bbf7d0] hover:bg-[#bbf7d0] transition-all duration-300 whitespace-nowrap"
          >
            {t('producerRegister.alreadyAccount', "Déjà un compte ? Connexion")}
          </button>
        </div>

        <div className="relative w-full max-w-4xl pt-4 md:pt-0">

          {/* Header & Mini Stepper */}
          <div className="mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[#FF6600] font-bold text-[10px] uppercase tracking-widest px-3 py-1 bg-[#FF6600]/10 rounded-full">
                {t('producerRegister.stepIndicator', { current: step + 1, total: steps.length })}
              </span>
              <div className="flex-1 h-[2px] bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  className="h-full bg-[#FF6600]"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#1A1A1A] tracking-tight mb-4 font-inter">
              {t('producerRegister.title', "REJOIGNEZ LE RÉSEAU EXPORT")}
            </h1>
            <p className="text-gray-500 font-medium text-lg font-inter">
              {t('producerRegister.subtitle', "Intégrez l’écosystème de partenaires certifiés Kleer Infini.")}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit, onValidationError)} className="space-y-10">

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8"
              >
                {step === 0 && (
                  <>
                    <div className="md:col-span-2">
                      <label className={labelClass}>{t('producerRegister.companyName', "Nom de l'entreprise")}</label>
                      <input {...register('companyName')} placeholder={t('producerRegister.companyNamePlaceholder', "EX: GLOBAL EXPORT SA")} className={inputClass} />
                      {errors.companyName && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.companyName.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>{t('producerRegister.firstName', "Prénom du Responsable")}</label>
                      <input {...register('firstName')} placeholder={t('producerRegister.firstNamePlaceholder', "Jean")} className={inputClass} />
                      {errors.firstName && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>{t('producerRegister.lastName', "Nom du Responsable")}</label>
                      <input {...register('lastName')} placeholder={t('producerRegister.lastNamePlaceholder', "Dupont")} className={inputClass} />
                      {errors.lastName && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.lastName.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>{t('producerRegister.activity', "Activité principale")}</label>
                      <input {...register('activity')} className={inputClass} placeholder={t('producerRegister.activityPlaceholder', "VOTRE SECTEUR")} />
                      {errors.activity && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.activity.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>{t('producerRegister.email', "Email Professionnel")}</label>
                      <input {...register('email')} className={inputClass} placeholder={t('producerRegister.emailPlaceholder', "contact@votreentreprise.com")} />
                      {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>{t('producerRegister.phone', "Téléphone")}</label>
                      <Controller name="phone" control={control} render={({ field }) => (
                        <PhoneInput {...field} international className="light-phone-input" />
                      )} />
                      {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>{t('producerRegister.whatsapp', "WhatsApp")}</label>
                      <Controller name="whatsapp" control={control} render={({ field }) => (
                        <PhoneInput {...field} international className="light-phone-input" />
                      )} />
                      {errors.whatsapp && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.whatsapp.message}</p>}
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className={labelClass}>{t('producerRegister.country', "Pays")}</label>
                        <Controller name="country" control={control} render={({ field }) => (
                          <Select {...field} options={countryOptions} styles={luxurySelectStyles} placeholder={t('producerRegister.countryPlaceholder', "SÉLECTIONNER...")} />
                        )} />
                        {errors.country && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.country.message}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>{t('producerRegister.city', "Wilaya / Région")}</label>
                        <input {...register('city')} className={inputClass} placeholder={t('producerRegister.cityPlaceholder', "RÉGION")} />
                        {errors.city && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.city.message}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>{t('producerRegister.address', "Commune")}</label>
                        <input {...register('address1')} className={inputClass} placeholder={t('producerRegister.addressPlaceholder', "ADRESSE")} />
                        {errors.address1 && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.address1.message}</p>}
                      </div>
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <p className={labelClass}>{t('producerRegister.locationPrecise', "Localisation Précise")}</p>
                      <div className="h-56 border border-gray-200 rounded-xl overflow-hidden shadow-inner">
                        <MapContainer center={[36.75, 3.05]} zoom={6} style={{ height: "100%", width: "100%" }}>
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                          />
                          <LocationMarker setMarkerPosition={setMarkerPosition} />
                        </MapContainer>
                      </div>
                      {markerPosition && <p className="text-green-600 text-[10px] font-bold uppercase mt-2 flex items-center gap-2"><CircleCheck size={14} /> {t('producerRegister.locationValidated', "Localisation Validée")}</p>}
                    </div>
                  </>
                )}

                {step === 1 && (
                  <div className="md:col-span-2 space-y-10">
                    <div className="p-8 bg-[#fef3c7] border border-[#f59e0b]/20 rounded-2xl flex items-start gap-4">
                      <Award className="text-[#FF6600] shrink-0" size={24} />
                      <div>
                        <h4 className="text-[#92400e] font-bold text-sm mb-1 uppercase tracking-wider">{t('producerRegister.docsTitle', 'Certifications & Qualité')}</h4>
                        <p className="text-[#92400e]/70 text-xs font-medium leading-relaxed">
                          {t('producerRegister.docsSubtitle', 'Veuillez joindre vos documents officiels (ISO, HACCP, Fiches techniques) pour accélérer votre accréditation.')}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-200 rounded-3xl hover:border-[#FF6600] hover:bg-white transition-all cursor-pointer group relative">
                          <FileText className="text-gray-300 group-hover:text-[#FF6600] mb-4" size={40} />
                          <span className="font-bold text-sm text-gray-700">{t('producerRegister.certPdf', 'Certifications PDF')}</span>
                          <span className="text-[10px] text-gray-400 mt-2">{t('producerRegister.clickToAdd', 'Cliquez pour ajouter')}</span>
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" multiple onChange={(e) => handleFileChange(e, 'cert')} accept=".pdf,.doc,.docx,.jpg,.png" />
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {certFiles.map((f, i) => (
                            <span key={i} className="bg-gray-100 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                              {f.name.substring(0, 15)}...
                              <button type="button" onClick={() => removeFile('cert', i)} className="text-red-500">×</button>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-200 rounded-3xl hover:border-[#FF6600] hover:bg-white transition-all cursor-pointer group relative">
                          <Building2 className="text-gray-300 group-hover:text-[#FF6600] mb-4" size={40} />
                          <span className="font-bold text-sm text-gray-700">{t('producerRegister.techDocs', 'Fiches Techniques')}</span>
                          <span className="text-[10px] text-gray-400 mt-2">{t('producerRegister.productSpecs', 'Spécifications Produits')}</span>
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" multiple onChange={(e) => handleFileChange(e, 'tech')} accept=".pdf,.doc,.docx,.jpg,.png" />
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {techFiles.map((f, i) => (
                            <span key={i} className="bg-gray-100 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                              {f.name.substring(0, 15)}...
                              <button type="button" onClick={() => removeFile('tech', i)} className="text-red-500">×</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <>
                    <div className="md:col-span-2">
                      <label className={labelClass}>{t('producerRegister.categories', "Catégories d'Exportation")}</label>
                      <Controller name="exportCategories" control={control} render={({ field }) => (
                        <Select {...field} isMulti options={categoriesOptions} styles={luxurySelectStyles} placeholder={t('producerRegister.categoriesPlaceholder', "CHOISIR...")} />
                      )} />
                      {errors.exportCategories && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.exportCategories.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>{t('producerRegister.minQuantity', "Quantité Minimum")}</label>
                      <input {...register('minExportQuantity')} className={inputClass} placeholder={t('producerRegister.minQuantityPlaceholder', "EX: 1 CONTAINER 40FT")} />
                      {errors.minExportQuantity && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.minExportQuantity.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>{t('producerRegister.monthlyCapacity', "Capacité mensuelle")}</label>
                      <input {...register('monthlyCapacity')} className={inputClass} placeholder={t('producerRegister.monthlyCapacityPlaceholder', "EX: 50.000 UNITÉS")} />
                      {errors.monthlyCapacity && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.monthlyCapacity.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>{t('producerRegister.yearlyCapacity', "Capacité annuelle")}</label>
                      <input {...register('yearlyCapacity')} className={inputClass} placeholder={t('producerRegister.yearlyCapacityPlaceholder', "EX: 600.000 UNITÉS")} />
                      {errors.yearlyCapacity && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.yearlyCapacity.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>{t('producerRegister.targetMarkets', "Marchés Préférés")}</label>
                      <Controller name="targetMarkets" control={control} render={({ field }) => (
                        <Select {...field} isMulti options={['AFRIQUE', 'EUROPE', 'AMÉRIQUE', 'ASIE'].map(v => ({ value: v, label: v }))} styles={luxurySelectStyles} />
                      )} />
                    </div>
                  </>
                )}

                {step === 3 && (
                  <div className="md:col-span-2 max-w-md mx-auto w-full space-y-8 py-10">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-[#FF6600]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock size={32} className="text-[#FF6600]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#1A1A1A]">{t('producerRegister.securityAccount', 'Sécurité del compte')}</h3>
                      <p className="text-gray-400 text-sm">{t('producerRegister.securitySubtitle', 'Définissez un accès robuste pour votre espace membre.')}</p>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className={labelClass}>{t('producerRegister.password', 'Mot de passe')}</label>
                        <input type="password" {...register('password')} className={inputClass} />
                        {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.password.message}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>{t('producerRegister.confirmPassword', 'Confirmer')}</label>
                        <input type="password" {...register('confirmPassword')} className={inputClass} />
                        {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.confirmPassword.message}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="md:col-span-2 space-y-8">
                    <div>
                      <label className={labelClass}>{t('producerRegister.whyJoin', 'Pourquoi rejoindre Kleer Infini ?')}</label>
                      <textarea rows={6} {...register('description')} className={`${inputClass} resize-none`} placeholder={t('producerRegister.whyJoinPlaceholder', "PARLEZ-NOUS DE VOTRE VISION ET DE VOTRE CAPACITÉ...")} />
                      {errors.description && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.description.message}</p>}
                    </div>
                    <div className="flex gap-5 items-center p-6 bg-[#FF6600]/5 rounded-2xl border border-[#FF6600]/10">
                      <Rocket size={24} className="text-[#FF6600] shrink-0" />
                      <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                        {t('producerRegister.disclaimer', "En soumettant ce formulaire, vous initiez le processus d'accréditation Kleer Infini. Nos experts examineront votre profil sous 48h.")}
                      </p>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-10 border-t border-gray-100">
              {step > 0 ? (
                <button type="button" onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 text-gray-400 hover:text-[#1A1A1A] text-sm font-bold transition-all">
                  <ChevronLeft size={18} /> {t('producerRegister.previous', "Précédent")}
                </button>
              ) : <div />}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type={step < steps.length - 1 ? "button" : "submit"}
                onClick={step < steps.length - 1 ? handleNext : undefined}
                className="bg-[#FF6600] text-white px-10 py-4 rounded-xl font-bold text-sm flex items-center gap-4 hover:shadow-lg hover:shadow-[#FF6600]/20 transition-all duration-300"
              >
                {step < steps.length - 1 ? t('producerRegister.continue', 'Continuer') : (submitting ? t('producerRegister.processing', 'Traitement...') : t('producerRegister.finalize', 'Finaliser'))}
                <ChevronRight size={18} />
              </motion.button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProducerRegister2;
