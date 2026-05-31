import React, { useState, useEffect } from "react";
import {
    X, CheckCircle, Package, DollarSign, Archive, FileText,
    Image as ImageIcon, Video, Globe, AlertCircle, Save, Info, Trash2, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CloudinaryUploadButton from "../CloudinaryUploadButton";

const ProducerProductForm = ({ product, onSubmit, onCancel, categories = [] }) => {
    const [activeSection, setActiveSection] = useState("general");
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Initial State
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        category: "",
        subCategory: "", // Optional
        shortDesc: "",
        longDesc: "",

        // Commercial
        moq: "",
        price: "",
        productionDelay: "", // e.g., "15 jours"

        // Media
        images: [], // List of { file: File, preview: string } or url strings
        video: null,
        fiche_tech: null,
        certification_files: [], // List of Files
        certifications_existing: [], // For update mode
        catalogue: null, // Optional downloadable

        // Additional
        originRegion: "",
        language: "fr",
        currency: "USD",


        // Status
        isReady: false, // false = draft, true = submitted
    });

    // Dynamic logic for Service vs Product
    const selectedCategory = categories.find(c => String(c.id) === String(formData.category));
    const isService = selectedCategory?.type === 'Service' || selectedCategory?.type === 'service';

    useEffect(() => {
        if (product) {
            setFormData({
                id: product.id,
                name: product.name || "",
                category: product.category || "",
                subCategory: product.subCategory || "",
                shortDesc: product.shortDesc || product.description?.substring(0, 100) || "",
                longDesc: product.longDesc || product.description || "",
                moq: product.moq || "",
                price: product.price || "",
                productionDelay: product.productionDelay || "",
                images: product.images || [], // Handle existing images handling logic if needed
                video: product.video || null,
                fiche_tech: product.fiche_tech || product.fiche_tech_url || null,
                certification_files: [],
                certifications_existing: product.certification_files || [],
                catalogue: product.catalogue || product.catalogue_url || null,
                originRegion: product.originRegion || "",
                language: product.language || "fr",
                currency: product.currency || "USD",
                isReady: product.status === "submitted" || product.status === "published",
            });
        }
    }, [product]);


    // Validation
    const validate = (field, value) => {
        const newErrors = { ...errors };

        switch (field) {
            case "name":
                if (!value) newErrors.name = isService ? "Le nom du service est requis." : "Le nom du produit est requis.";
                else delete newErrors.name;
                break;
            case "category":
                if (!value) newErrors.category = "La catégorie est requise.";
                else delete newErrors.category;
                break;
            case "shortDesc":
                if (!value) newErrors.shortDesc = "La description courte est requise.";
                else delete newErrors.shortDesc;
                break;
            case "longDesc":
                if (!value) newErrors.longDesc = "La description détaillée est requise.";
                else delete newErrors.longDesc;
                break;
            case "price":
                if (!value) newErrors.price = "Le prix indicatif est requis.";
                else if (parseFloat(value) < 0) newErrors.price = "Le prix doit être positif.";
                else delete newErrors.price;
                break;
            case "moq":
                if (!value) newErrors.moq = isService ? "L'unité est requise." : "Le MOQ est requis pour l'export.";
                else delete newErrors.moq;
                break;
            case "productionDelay":
                if (!value) newErrors.productionDelay = isService ? "Le délai d'exécution est requis." : "Le délai de production est requis.";
                else delete newErrors.productionDelay;
                break;
            case "certification_files":
                if (formData.certifications_existing.length === 0 && (!value || value.length === 0)) {
                    newErrors.certification_files = "Au moins une certification est requise.";
                } else {
                    delete newErrors.certification_files;
                }
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;

        setFormData(prev => ({ ...prev, [name]: val }));
        setTouched(prev => ({ ...prev, [name]: true }));
        validate(name, val);
    };

    // File Handlers
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Create previews
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => {
            const updated = [...prev.images];
            updated.splice(index, 1);
            return { ...prev, images: updated };
        });
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            if (field === "certification_files") {
                const files = Array.from(e.target.files);
                setFormData(prev => ({
                    ...prev,
                    certification_files: [...prev.certification_files, ...files]
                }));
                validate("certification_files", [...formData.certification_files, ...files]);
                // No need to set [field]: file here as it's an array handled above
            } else {
                setFormData(prev => ({ ...prev, [field]: file }));
            }

            // Common error clearing for all file types
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const removeFileArray = (index, field) => {
        setFormData(prev => {
            const updated = [...prev[field]];
            updated.splice(index, 1);
            return { ...prev, [field]: updated };
        });
    };

    const handleRemoveFile = (field) => {
        setFormData(prev => ({ ...prev, [field]: null }));
    };

    // Validation for Sidebar Visuals
    const isGeneralValid = !errors.name && formData.name && !errors.category && formData.category && !errors.shortDesc && formData.shortDesc && !errors.longDesc && formData.longDesc;
    const isCommercialValid = !errors.moq && formData.moq && !errors.price && formData.price && !errors.productionDelay && formData.productionDelay;
    // Media is valid only if images exist AND at least one certification is present
    const isMediaValid = formData.images.length > 0 && (formData.certification_files.length > 0 || formData.certifications_existing.length > 0);

    // Submit
    const handleFormSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();

        console.log("Submit Clicked!");

        // Final validation trigger
        const finalErrors = {};
        if (!formData.name) finalErrors.name = "Nom requis";
        if (!formData.category) finalErrors.category = "Catégorie requise";
        if (!formData.shortDesc) finalErrors.shortDesc = "Description courte requise";
        if (!formData.longDesc) finalErrors.longDesc = "Description longue requise";
        if (!formData.moq) finalErrors.moq = "MOQ requis";
        if (!formData.price) finalErrors.price = "Prix indicatif requis";
        if (!formData.productionDelay) finalErrors.productionDelay = "Délai de production requis";
        if (formData.certification_files.length === 0 && formData.certifications_existing.length === 0) {
            finalErrors.certification_files = "Certification requise";
        }

        if (Object.keys(finalErrors).length > 0) {
            console.log("Validation Errors:", finalErrors);
            setErrors(finalErrors);
            setTouched({
                name: true, category: true, shortDesc: true, longDesc: true,
                moq: true, price: true, productionDelay: true, certification_files: true
            });

            // Auto-switch to the first section with an error
            if (finalErrors.name || finalErrors.category || finalErrors.shortDesc || finalErrors.longDesc) {
                setActiveSection("general");
            } else if (finalErrors.moq || finalErrors.price || finalErrors.productionDelay) {
                setActiveSection("commercial");
            } else if (finalErrors.certification_files) {
                setActiveSection("media");
            }

            alert(`Erreur de validation: ${Object.keys(finalErrors).join(", ")}`);
            return;
        }

        // Prepare payload
        const payload = {
            ...formData,
            status: formData.isReady ? "submitted" : "draft"
        };

        console.log("Payload ready, calling onSubmit...", payload);

        if (onSubmit) {
            try {
                onSubmit(payload);
            } catch (err) {
                alert("Erreur lors de l'appel de onSubmit: " + err.message);
                console.error(err);
            }
        } else {
            alert("Erreur système : la fonction d'envoi (onSubmit) est manquante.");
            console.error("onSubmit prop is missing");
        }
    };

    // --- Render Helpers ---
    const SectionButton = ({ id, label, icon: Icon, isValid }) => (
        <button
            type="button"
            onClick={() => setActiveSection(id)}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all ${activeSection === id
                ? "bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600"
                : "text-gray-500 hover:bg-gray-50 font-medium"
                }`}
        >
            <Icon size={18} className={activeSection === id ? "text-blue-600" : "text-gray-400"} />
            <span className="flex-1 text-sm">{label}</span>
            {isValid && <CheckCircle size={14} className="text-emerald-500" />}
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Header */}
            <div className="bg-[#050B18] p-6 lg:p-8 flex items-center justify-between border-b border-white/10 sticky top-0 z-20 rounded-t-[2.5rem]">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-blue-400 backdrop-blur-sm">
                        <Package size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">
                            {formData.id
                                ? (isService ? "Modifier le service" : "Modifier le produit")
                                : (isService ? "Ajouter un Service" : "Ajouter un Produit")}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`w-2 h-2 rounded-full ${formData.isReady ? 'bg-amber-400' : 'bg-gray-500'}`} />
                            <p className="text-xs text-blue-200/60 font-medium uppercase tracking-wider">
                                {formData.isReady ? "En attente de validation" : "Brouillon"}
                            </p>
                        </div>
                    </div>
                </div>
                <button onClick={onCancel} className="p-3 bg-white/10 rounded-xl text-white/70 hover:bg-white/20 hover:text-white transition-all">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
                {/* Locking Overlay for Submitted Products */}
                {formData.id && formData.isReady && (
                    <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center p-10 text-center">
                        <div className="max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-amber-100 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Produit sous validation</h3>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                                Ce produit est actuellement en attente de validation par l'administration. L'édition est temporairement verrouillée pour garantir l'intégrité de la revue.
                            </p>
                            <button
                                onClick={onCancel}
                                className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
                            >
                                Retour à l'inventaire
                            </button>
                        </div>
                    </div>
                )}

                {/* Sidebar Navigation */}
                <div className="lg:w-72 bg-gray-50/50 p-6 border-r border-gray-100 flex flex-col gap-2 overflow-y-auto">
                    <SectionButton id="general" label="Informations Générales" icon={Info} isValid={isGeneralValid} />
                    <SectionButton id="commercial" label="Conditions Commerciales" icon={DollarSign} isValid={isCommercialValid} />
                    <SectionButton id="media" label="Documents & Médias" icon={ImageIcon} isValid={isMediaValid} />
                    <SectionButton id="extra" label="Infos Complémentaires" icon={Globe} isValid={true} />

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                            <h4 className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase tracking-wider mb-2">
                                <AlertCircle size={14} /> Publication
                            </h4>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-blue-900">Soumettre ?</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, isReady: !p.isReady }))}
                                    className={`w-12 h-7 rounded-full transition-all relative flex items-center px-1 ${formData.isReady ? "bg-green-500" : "bg-gray-300"
                                        }`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform transform ${formData.isReady ? "translate-x-5" : "translate-x-0"
                                        }`} />
                                </button>
                            </div>
                            <p className="text-[10px] text-blue-600/70 mt-3 leading-tight">
                                <span className="font-bold">ON</span> : Soumis à validation ADMIN. <br />
                                <span className="font-bold">OFF</span> : Reste en Brouillon.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Content Area */}
                <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-8 lg:p-10 relative bg-[#FBFBFC]">

                    <AnimatePresence mode="wait">

                        {/* --- SECTION 1: GENERAL --- */}
                        {activeSection === "general" && (
                            <motion.div
                                key="general"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 max-w-3xl"
                            >
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-900 uppercase tracking-widest pl-1">
                                        {isService ? "Nom du Service" : "Nom du Produit"} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Package className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full bg-white border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-2xl pl-14 pr-5 py-4 font-semibold text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none`}
                                            placeholder={isService ? "Ex: Expertise Conseil Export" : "Ex: Dattes Deglet Nour Premium"}
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-xs font-bold pl-2">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-900 uppercase tracking-widest pl-1">Catégorie <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className={`w-full bg-white border ${errors.category ? 'border-red-300' : 'border-gray-200'} rounded-2xl px-5 py-4 font-semibold text-gray-700 outline-none appearance-none`}
                                            >
                                                <option value="">Sélectionner...</option>
                                                {/* Only display categories from API */}
                                                {categories.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                                        </div>
                                        {errors.category && <p className="text-red-500 text-xs font-bold pl-2">{errors.category}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-900 uppercase tracking-widest pl-1">Sous-Catégorie</label>
                                        <input
                                            type="text"
                                            name="subCategory"
                                            value={formData.subCategory}
                                            onChange={handleChange}
                                            placeholder={isService ? "Ex: Conseil Juridique" : "Ex: Fruits secs"}
                                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 font-semibold text-gray-900 outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-900 uppercase tracking-widest pl-1">Description Courte <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="shortDesc"
                                        value={formData.shortDesc}
                                        onChange={handleChange}
                                        rows={2}
                                        maxLength={200}
                                        className={`w-full bg-white border ${errors.shortDesc ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-2xl p-5 font-medium text-gray-700 outline-none focus:border-blue-500 resize-none`}
                                        placeholder={isService ? "Résumé accrocheur pour les fiches services (max 200 car.)" : "Résumé accrocheur pour les cartes produits (max 200 car.)"}
                                    />
                                    <p className="text-right text-[10px] text-gray-400 font-bold">{formData.shortDesc.length}/200</p>
                                    {errors.shortDesc && <p className="text-red-500 text-xs font-bold pl-2">{errors.shortDesc}</p>}
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-900 uppercase tracking-widest pl-1">Description Détaillée <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="longDesc"
                                        value={formData.longDesc}
                                        onChange={handleChange}
                                        rows={6}
                                        className={`w-full bg-white border ${errors.longDesc ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-2xl p-5 font-medium text-gray-700 outline-none focus:border-blue-500 resize-none`}
                                        placeholder={isService ? "Détails complets, périmètre d'intervention, bénéfices..." : "Détails complets, processus de fabrication, bienfaits..."}
                                    />
                                    {errors.longDesc && <p className="text-red-500 text-xs font-bold pl-2">{errors.longDesc}</p>}
                                </div>
                            </motion.div>
                        )}

                        {/* --- SECTION 2: COMMERCIAL --- */}
                        {activeSection === "commercial" && (
                            <motion.div
                                key="commercial"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 max-w-3xl"
                            >
                                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 mb-8 flex gap-4">
                                    <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm h-fit">
                                        <Info size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-blue-900 mb-1">Information sur les prix</h4>
                                        <p className="text-sm text-blue-800/70">Les prix affichés sont indicatifs. La négociation finale se fait souvent après demande de devis (RFQ) selon les volumes{isService ? " et la durée de la prestation." : " et conditions Incoterms."}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-900 uppercase tracking-widest pl-1">
                                            {isService ? "Unité (ex: /heure, /forfait)" : "MOQ (Minimum Order Qty)"} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Archive className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                name="moq"
                                                value={formData.moq}
                                                onChange={handleChange}
                                                className={`w-full bg-white border ${errors.moq ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-2xl pl-14 pr-5 py-4 font-semibold text-gray-900 outline-none focus:border-blue-500`}
                                                placeholder={isService ? "Ex: /Heure, /Jour, /Forfait" : "Ex: 500 Kg / 1000 Unités"}
                                            />
                                        </div>
                                        {errors.moq && <p className="text-red-500 text-xs font-bold pl-2">{errors.moq}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-900 uppercase tracking-widest pl-1">Prix Indicatif (Unitaire) <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                className={`w-full bg-white border ${errors.price ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-2xl pl-14 pr-5 py-4 font-semibold text-gray-900 outline-none focus:border-blue-500`}
                                                placeholder="0.00"
                                            />
                                            <select
                                                name="currency"
                                                value={formData.currency}
                                                onChange={handleChange}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 border-none rounded-lg px-2 py-1 text-gray-700 font-bold text-[10px] outline-none cursor-pointer"
                                            >
                                                <option value="USD">USD</option>
                                                <option value="DZD">DZD</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                        </div>
                                        {errors.price && <p className="text-red-500 text-xs font-bold pl-2">{errors.price}</p>}
                                    </div>

                                    <div className="space-y-4 md:col-span-2">
                                        <label className="text-xs font-bold text-gray-900 uppercase tracking-widest pl-1">
                                            {isService ? "Délai d'exécution moyen" : "Délai de production moyen"} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="productionDelay"
                                            value={formData.productionDelay}
                                            onChange={handleChange}
                                            className={`w-full bg-white border ${errors.productionDelay ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-2xl px-5 py-4 font-semibold text-gray-900 outline-none focus:border-blue-500`}
                                            placeholder={isService ? "Ex: 5 jours d'exécution" : "Ex: 15 jours après commande"}
                                        />
                                        {errors.productionDelay && <p className="text-red-500 text-xs font-bold pl-2">{errors.productionDelay}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- SECTION 3: MEDIA --- */}
                        {activeSection === "media" && (
                            <motion.div
                                key="media"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-10 max-w-3xl"
                            >
                                {/* Images */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-gray-900 uppercase tracking-widest pl-1">Galerie Photos</label>
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-bold">{formData.images.length} Images</span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {formData.images.map((img, idx) => {
                                            const imgSrc = img.preview || img.image || (typeof img === 'string' ? img : img.image_url);
                                            return (
                                                <div key={idx} className="aspect-square rounded-2xl overflow-hidden relative group border border-gray-100 bg-white">
                                                    <img src={imgSrc} alt={`${isService ? 'Service' : 'Product'} ${idx}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(idx)}
                                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            );
                                        })}

                                        <div className="aspect-square">
                                            <CloudinaryUploadButton
                                                value={null}
                                                folder="products"
                                                accept="image/*"
                                                label="Ajouter"
                                                helperText="JPG, PNG, WEBP"
                                                onUploaded={(url) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        images: [...prev.images, url]
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 pl-1">Formats acceptés: JPG, PNG, WEBP. Max 5MB par image.</p>
                                </div>

                                <div className="h-px bg-gray-100 w-full" />

                                {/* Tech Sheet */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-900 uppercase tracking-widest pl-1">Fiche Technique (PDF)</label>
                                    <CloudinaryUploadButton
                                        value={typeof formData.fiche_tech === 'string' ? formData.fiche_tech : (formData.fiche_tech?.name ? null : formData.fiche_tech)}
                                        folder="fiches_tech"
                                        accept=".pdf"
                                        label="Charger la fiche technique"
                                        helperText="PDF uniquement (Max 10MB)"
                                        isPdf={true}
                                        onUploaded={(url) => {
                                            setFormData(prev => ({ ...prev, fiche_tech: url }));
                                            setErrors(prev => { const e = { ...prev }; delete e.fiche_tech; return e; });
                                        }}
                                        onClear={() => {
                                            setFormData(prev => ({ ...prev, fiche_tech: null }));
                                        }}
                                    />
                                </div>

                                {/* Video */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-900 uppercase tracking-widest pl-1">Vidéo de présentation (Optionnel)</label>
                                    <CloudinaryUploadButton
                                        value={formData.video}
                                        folder="videos"
                                        accept="video/*"
                                        label="Charger la vidéo de présentation"
                                        helperText="MP4, WebM (Max 50MB)"
                                        isVideo={true}
                                        onUploaded={(url) => {
                                            setFormData(prev => ({ ...prev, video: url }));
                                            setErrors(prev => { const e = { ...prev }; delete e.video; return e; });
                                        }}
                                        onClear={() => {
                                            setFormData(prev => ({ ...prev, video: null }));
                                        }}
                                    />
                                </div>

                                <div className="h-px bg-gray-100 w-full" />

                                {/* Certification - MULTI */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-gray-900 uppercase tracking-widest pl-1">
                                            Certifications & Diplômes <span className="text-red-500">*</span>
                                        </label>
                                        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-bold">
                                            {formData.certifications_existing.length + formData.certification_files.length} Document(s)
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Existing Certs */}
                                        {formData.certifications_existing.map((cert, idx) => (
                                            <div key={`existing-${idx}`} className="w-full bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 group">
                                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                                    <CheckCircle size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm text-gray-800 truncate">{cert.name || `Certification #${idx + 1}`}</p>
                                                    <p className="text-[10px] text-gray-400 uppercase font-black">Certificat vérifié</p>
                                                </div>
                                                <button type="button" onClick={() => removeFileArray(idx, "certifications_existing")} className="p-2 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}

                                        {/* New Certs */}
                                        {formData.certification_files.map((file, idx) => {
                                            const fileName = typeof file === 'string' ? file.split('/').pop() : file.name;
                                            return (
                                                <div key={`new-${idx}`} className="w-full bg-blue-50/30 border border-blue-100 rounded-2xl p-4 flex items-center gap-4 group animate-pulse-subtle">
                                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm text-blue-900 truncate">{fileName}</p>
                                                        <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest">Nouveau fichier</p>
                                                    </div>
                                                    <button type="button" onClick={() => removeFileArray(idx, "certification_files")} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            );
                                        })}

                                        <CloudinaryUploadButton
                                            value={null}
                                            folder="product_certifications"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            label="Ajouter une certification"
                                            helperText="PDF, JPG, PNG (Max 10MB)"
                                            onUploaded={(url) => {
                                                const updatedCerts = [...formData.certification_files, url];
                                                setFormData(prev => ({
                                                    ...prev,
                                                    certification_files: updatedCerts
                                                }));
                                                validate("certification_files", updatedCerts);
                                            }}
                                        />
                                    </div>
                                    {errors.certification_files && <p className="text-red-500 text-xs font-bold pl-2">{errors.certification_files}</p>}
                                </div>

                                {/* Catalogue - Optional */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-900 uppercase tracking-widest pl-1">
                                        Catalogue à télécharger (Optionnel)
                                    </label>
                                    <CloudinaryUploadButton
                                        value={formData.catalogue}
                                        folder="catalogues"
                                        accept=".pdf"
                                        label="Charger le catalogue"
                                        helperText="PDF uniquement (Max 20MB)"
                                        isPdf={true}
                                        onUploaded={(url) => {
                                            setFormData(prev => ({ ...prev, catalogue: url }));
                                        }}
                                        onClear={() => {
                                            setFormData(prev => ({ ...prev, catalogue: null }));
                                        }}
                                    />
                                </div>

                            </motion.div>
                        )}

                        {/* --- SECTION 4: EXTRA --- */}
                        {activeSection === "extra" && (
                            <motion.div
                                key="extra"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 max-w-3xl"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-900 uppercase tracking-widest pl-1">Région d'Origine</label>
                                        <input
                                            type="text"
                                            name="originRegion"
                                            value={formData.originRegion}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-200 rounded-2xl p-4 font-semibold text-gray-900 outline-none focus:border-blue-500"
                                            placeholder="Ex: Biskra"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-900 uppercase tracking-widest pl-1">
                                            Langue principale {isService ? 'du service' : 'du produit'}
                                        </label>
                                        <select
                                            name="language"
                                            value={formData.language}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-200 rounded-2xl p-4 font-semibold text-gray-900 outline-none"
                                        >
                                            <option value="fr">Français</option>
                                            <option value="en">Anglais</option>
                                            <option value="ar">Arabe</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </form>
            </div >

            {/* Footer Actions */}
            < div className="p-6 border-t border-gray-100 bg-white sticky bottom-0 z-20 flex justify-end gap-4 rounded-b-[2.5rem]" >
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
                >
                    Annuler
                </button>
                <button
                    onClick={handleFormSubmit}
                    className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3"
                >
                    <CheckCircle size={18} />
                    {formData.id
                        ? (isService ? "Enregistrer le service" : "Enregistrer les modifications")
                        : (isService ? "Créer le service" : "Créer le produit")}
                </button>
            </div >
        </div >
    );
};

export default ProducerProductForm;
