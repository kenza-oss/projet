import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Send, Package, MapPin, Calendar, MessageSquare, BadgeDollarSign, Ship, Box, ShieldCheck, Briefcase, Clock, FileText, Paperclip, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { createEstimate } from '../api/estimates';

const QuoteRequestModal = ({ isOpen, onClose, product, category, producerId }) => {
  const { t } = useTranslation();
  const isCategoryMode = !!category;

  // Detect if it's a service category (heuristic based on name or type)
  const isService = category && (
    category.type?.toLowerCase().includes('service') ||
    category.name?.toLowerCase().includes('service') ||
    category.is_service ||
    ["transport", "consulting", "logistique", "assurance", "maintenance"].some(k => category.name?.toLowerCase().includes(k))
  );

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      subject: product
        ? `${t('quotes.title_quote')} : ${product.name}`
        : category
          ? `${t('quotes.title_sourcing')} : ${category.name}`
          : '',
      quantity: product?.moq || product?.cle_min || '',
    }
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Incoterms Options for Products
  const incoterms = ["FOB - Free On Board", "EXW - Ex Works", "CIF - Cost Insurance Freight", "CFR - Cost and Freight", "DAP - Delivered at Place"];

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Build rich message with contextual fields
      let specsBlock = '';

      if (isService) {
        specsBlock = `
[SPÉCIFICATIONS SERVICE]
- Lieu d'intervention: ${data.service_location || 'Non spécifié'}
- Type de Mission: ${data.service_type || 'Non spécifié'}
- Durée / Fréquence: ${data.duration || 'Non spécifié'}
            `.trim();
      } else {
        specsBlock = `
[SPÉCIFICATIONS PRODUIT]
- Incoterm: ${data.incoterm || 'Non spécifié'}
- Prix Cible: ${data.target_price || 'Non spécifié'}
- Conditionnement: ${data.packaging || 'Standard'}
- Destination: ${data.destination || 'Non spécifié'}
- Date souhaitée: ${data.delivery_date || 'Dès que possible'}
            `.trim();
      }

      const enrichedMessage = `
Objet: ${data.subject}
${specsBlock}

[MESSAGE CLIENT]
${data.message}

[PIÈCE JOINTE]
${selectedFile ? `Fichier joint : ${selectedFile.name}` : 'Aucune pièce jointe'}
        `.trim();

      // The backend EstimateSerializer expects:
      // {
      //   "producer": producer_id,
      //   "products": [{ "product": id, "quantity": qty, "unit_price": 0 }],
      //   "comment": message
      // }

      // CRITICAL: Backend currently requires a valid product ID. 
      // If we are in Category/Sourcing mode, we might not have a specific product yet.
      // We will need to either select a representative product or update backend to allow product-less estimates.
      // For now, if no product, we will check if it's a Product or Category.

      const payload = {
        producer: producerId || category?.producer_id || null, // Allow null for sourcing requests
        comment: enrichedMessage,
        products: []
      };

      if (product?.id) {
        payload.products.push({
          product: product.id,
          quantity: data.quantity || "0",
          unit_price: 0
        });
      } else {
        // For sourcing requests, we add a product-less entry OR just keep products empty
        // The backend serializer now allows null products in Estimate_Product,
        // but if we want to store quantity/packaging for a category, 
        // we might still want an entry.
        payload.products.push({
          product: null,
          quantity: data.quantity || "0",
          unit_price: 0
        });
      }

      await createEstimate(payload);

      setIsSuccess(true);
      toast.success(t('form.success') || "Consultation lancée avec succès !");

      setTimeout(() => {
        setIsSuccess(false);
        reset();
        setSelectedFile(null);
        onClose();
      }, 2500);

    } catch (error) {
      console.error("[SUBMIT ERROR]", error.response?.data || error.message);

      const backendError = error.response?.data;
      let errorMsg = "Erreur lors de l'envoi de la demande.";

      if (backendError) {
        if (typeof backendError === 'string') {
          errorMsg = backendError;
        } else if (backendError.detail) {
          errorMsg = backendError.detail;
        } else if (typeof backendError === 'object') {
          // Join validation errors into a single string
          errorMsg = Object.entries(backendError)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ');
        }
      }

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-start bg-slate-900/40 backdrop-blur-md p-4 pl-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-orange-500/10 w-full max-w-3xl overflow-hidden relative border border-white/20"
        >
          {/* Decorative Orange Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF6600] to-transparent opacity-50"></div>

          <div className="flex h-full max-h-[90vh] flex-col">

            {/* Header */}
            <div className="px-8 py-10 border-b border-orange-100 flex justify-between items-start bg-[#FFF5ED] relative overflow-hidden rounded-t-[2rem]">
              {/* Decorative Background Elements */}
              <div className="absolute top-[-30px] left-[-30px] w-64 h-64 bg-orange-200/40 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-[-20px] right-[20%] w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-3 h-3 rounded-full bg-[#FF6600] animate-pulse shadow-[0_0_12px_rgba(242,92,5,0.6)]"></div>
                  <span className="text-[11px] uppercase tracking-[0.5em] text-[#FF6600] font-black">{t('quotes.pro_space')}</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-display text-slate-900 font-bold tracking-tight">
                  {isService ? t('quotes.title_service') : (isCategoryMode ? t('quotes.title_sourcing') : t('quotes.title_quote'))}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-slate-500 hover:text-[#FF6600] bg-white/80 hover:bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-orange-100 group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">

              {/* Context Card */}
              <div className="mb-8 flex items-center gap-5 p-5 bg-slate-50/50 rounded-xl border border-slate-100 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-orange-500/5 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  {isService ? <Briefcase size={120} /> : (isCategoryMode ? <Package size={120} /> : <Box size={120} />)}
                </div>

                <div className="w-16 h-16 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm z-10 text-[#FF6600]">
                  {isCategoryMode ? (
                    isService ? <Briefcase className="text-[#FF6600]" size={28} /> : <Ship className="text-[#FF6600]" size={28} />
                  ) : (
                    <img
                      src={product?.image || product?.images?.[0]?.image_url}
                      className="w-full h-full object-cover rounded-lg"
                      alt=""
                    />
                  )}
                </div>
                <div className="z-10">
                  <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-1">{t('quotes.concerning')}</p>
                  <p className="text-lg font-medium text-slate-900">
                    {isCategoryMode ? category.name : product?.name}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Section 1: Logistique & Prix (Product) OR Location & Type (Service) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isService ? (
                    <>
                      {/* Service Type */}
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#FF6600] flex items-center gap-2">
                          <FileText size={12} /> {t('quotes.service_type')}
                        </label>
                        <input
                          type="text"
                          {...register("service_type")}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600]/20 outline-none text-slate-900 text-sm placeholder-slate-400"
                          placeholder={t('quotes.service_type_placeholder')}
                        />
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#FF6600] flex items-center gap-2">
                          <MapPin size={12} /> {t('quotes.service_location')}
                        </label>
                        <input
                          type="text"
                          {...register("service_location")}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600]/20 outline-none text-slate-900 text-sm placeholder-slate-400"
                          placeholder={t('quotes.service_location_placeholder')}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Incoterm */}
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#FF6600] flex items-center gap-2">
                          <Ship size={12} /> {t('quotes.incoterm')}
                        </label>
                        <select
                          {...register("incoterm")}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600]/20 outline-none text-slate-900 text-sm appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                          <option value="">{t('quotes.incoterm_placeholder')}</option>
                          {incoterms.map(term => <option key={term} value={term}>{term}</option>)}
                        </select>
                      </div>

                      {/* Prix Cible */}
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#FF6600] flex items-center gap-2">
                          <BadgeDollarSign size={12} /> {t('quotes.target_price')}
                        </label>
                        <input
                          type="text"
                          {...register("target_price")}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600]/20 outline-none text-slate-900 text-sm placeholder-slate-400"
                          placeholder={t('quotes.target_price_placeholder')}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Section 2: Quantité & Conditionnement (Product) OR Duration (Service) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 flex items-center gap-2">
                      {isService ? <Briefcase size={12} /> : <Package size={12} />}
                      {isService ? t('quotes.volume_service') : t('quotes.volume_product')}
                    </label>
                    <input
                      type="text" // string allowed for services
                      {...register("quantity", { required: true })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600]/20 outline-none text-slate-900 text-sm placeholder-slate-400"
                      placeholder={isService ? t('quotes.volume_service_placeholder') : t('quotes.volume_product_placeholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 flex items-center gap-2">
                      {isService ? <Clock size={12} /> : <Box size={12} />}
                      {isService ? t('quotes.duration') : t('quotes.packaging')}
                    </label>
                    <input
                      type="text"
                      {...register(isService ? "duration" : "packaging")}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600]/20 outline-none text-slate-900 text-sm placeholder-slate-400"
                      placeholder={isService ? t('quotes.duration_placeholder') : t('quotes.packaging_placeholder')}
                    />
                  </div>
                </div>

                {/* Section 3: Destination & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 flex items-center gap-2">
                      <MapPin size={12} /> {isService ? t('quotes.office') : t('quotes.destination')}
                    </label>
                    <input
                      type="text"
                      {...register("destination", { required: true })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600]/20 outline-none text-slate-900 text-sm placeholder-slate-400"
                      placeholder={isService ? t('quotes.office_placeholder') : t('quotes.destination_placeholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 flex items-center gap-2">
                      <Calendar size={12} /> {isService ? t('quotes.start_date') : t('quotes.deadline')}
                    </label>
                    <input
                      type="date"
                      {...register("delivery_date")}
                      style={{ colorScheme: 'light' }}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600]/20 outline-none text-slate-900 text-sm placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Message & File Upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 flex items-center gap-2">
                      <MessageSquare size={12} /> {t('quotes.specs_label')}
                    </label>

                    <div className="relative">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                      />
                      <label
                        htmlFor="file-upload"
                        className="text-[9px] uppercase font-bold tracking-widest text-[#FF6600] cursor-pointer hover:underline flex items-center gap-1.5 hover:text-slate-900 transition-colors"
                      >
                        <Paperclip size={12} />
                        {selectedFile ? t('quotes.modify_file') : t('quotes.attach_file')}
                      </label>
                    </div>
                  </div>

                  <textarea
                    {...register("message", { required: true })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg h-32 focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600]/20 outline-none text-slate-900 text-sm placeholder-slate-400 resize-none font-light leading-relaxed"
                    placeholder={t('quotes.message_placeholder')}
                  ></textarea>

                  {/* File Feedback */}
                  <AnimatePresence>
                    {selectedFile && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between bg-orange-50 border border-orange-200 p-2 rounded-lg text-xs"
                      >
                        <div className="flex items-center gap-2 text-[#FF6600]">
                          <FileText size={14} />
                          <span className="font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                          <span className="opacity-50 text-[10px]">({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={loading || isSuccess}
                  className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all duration-500 flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group/submit ${isSuccess
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                    : 'bg-[#0A0B14] text-white hover:bg-slate-900 shadow-slate-900/20'
                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover/submit:translate-x-full transition-transform duration-1000"></div>

                  {loading ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                        <Send size={18} />
                      </motion.div>
                      <span className="relative z-10">{t('quotes.sending')}</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <Check size={20} />
                      <span className="relative z-10">{t('quotes.sent')}</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">{t('quotes.submit')}</span>
                      <Send size={18} className="relative z-10 group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>

              </form>

              <div className="mt-8 -mx-8 -mb-8 px-8 py-6 bg-gradient-to-t from-orange-50/50 to-transparent border-t border-orange-100/50 flex items-center justify-center gap-4 group">
                <div className="p-2 bg-white rounded-full shadow-sm border border-orange-100 transition-transform group-hover:scale-110 duration-500">
                  <ShieldCheck size={18} className="text-[#FF6600]" />
                </div>
                <p className="text-[11px] text-center text-slate-800 font-black uppercase tracking-[0.25em] leading-none">
                  {t('quotes.secure')} <span className="mx-2 text-orange-300">•</span> <span className="text-slate-500 font-bold">{t('quotes.confidential')}</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuoteRequestModal;
