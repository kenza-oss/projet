import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Package, ShieldCheck, Clock, MapPin, Play, FileText, ArrowRight } from 'lucide-react';
import { getProductImage } from '../utils/utils';
import QuoteRequestModal from './QuoteRequestModal';
import { useAuth } from '../context/AuthContext';
import AuthRequiredModal from './AuthRequiredModal';

const ProductModal = ({ isOpen, onClose, product, categoryName }) => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);

    // Initialise selected image
    React.useEffect(() => {
        if (product) {
            const firstImage = product.images?.[0] || product.image;
            setSelectedImage(firstImage);
        }
    }, [product]);

    if (!product) return null;


    // Prepare gallery images
    const galleryImages = (product.images && product.images.length > 0)
        ? product.images
        : (product.image ? [product.image] : []);


    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        />

                        {/* Slide-over Right */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full lg:max-w-6xl bg-white shadow-2xl z-[70] flex flex-col"
                        >
                            {/* Header Section (Fixed at top) */}
                            <div className="px-5 md:px-8 py-4 md:py-6 flex justify-between items-start bg-white sticky top-0 z-[80] border-b border-gray-100">
                                <div className="max-w-[90%] space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-red-600">{categoryName}</span>
                                        <span className="text-gray-300">•</span>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                            <MapPin size={10} className="text-red-500" />
                                            {product.region_org || t('products.details.origin_fallback')}
                                        </div>
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{product.name}</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all border border-gray-100"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Scrollable Content Container */}
                            <div className="flex-1 overflow-y-auto bg-white">
                                <div className="flex flex-col lg:flex-row min-h-full">
                                    {/* Left Column (65%) - Media & Details */}
                                    <div className="flex-1 lg:flex-[0.65] p-5 md:p-8 space-y-8 md:space-y-12">
                                        {/* Media Gallery */}
                                        <div className="space-y-4">
                                            <div className="aspect-[3/2] w-full bg-blue-50/30 rounded-3xl overflow-hidden relative group border border-blue-50">
                                                <img
                                                    src={getProductImage(selectedImage || product.image, 0, product)}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.01]"
                                                />
                                                <div className="absolute inset-0 bg-blue-600/2 opacity-0 group-hover:opacity-100 transition-opacity" />

                                                {/* Video Indicator */}
                                                {product.video && (
                                                    <div
                                                        onClick={() => setActiveTab('video')}
                                                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-full shadow-sm cursor-pointer hover:bg-red-50 transition-colors border border-red-100"
                                                    >
                                                        <Play size={14} className="text-red-600 fill-red-600" />
                                                    </div>
                                                )}
                                            </div>
                                            {/* Thumbnail row */}
                                            {galleryImages.length > 1 && (
                                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                                                    {galleryImages.map((img, i) => {
                                                        const isSelected = selectedImage === img || (!selectedImage && i === 0);
                                                        return (
                                                            <div
                                                                key={i}
                                                                onClick={() => setSelectedImage(img)}
                                                                className={`w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${isSelected ? 'border-red-500' : 'border-transparent hover:border-blue-100'}`}
                                                            >
                                                                <img
                                                                    src={getProductImage(img, i, product)}
                                                                    alt=""
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Description & Specs Tabs */}
                                        <div className="space-y-8">
                                            <div className="flex gap-8 border-b border-gray-100 mb-6">
                                                {['description', 'specifications', 'video'].map((tab) => (
                                                    (tab !== 'video' || product.video) && (
                                                        <button
                                                            key={tab}
                                                            onClick={() => setActiveTab(tab)}
                                                            className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all relative ${activeTab === tab ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
                                                        >
                                                            {tab === 'description' ? t('products.modal.description') : tab === 'specifications' ? t('products.modal.specifications') : t('products.modal.video')}
                                                            {activeTab === tab && (
                                                                <motion.div layoutId="tab-underline" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-red-600" />
                                                            )}
                                                        </button>
                                                    )
                                                ))}
                                            </div>

                                            <div className="min-h-[150px]">
                                                {activeTab === 'description' ? (
                                                    <div className="space-y-6">
                                                        <p className="text-lg font-medium text-gray-900 leading-relaxed pl-6 border-l-4 border-red-500 bg-red-50/30 py-4 rounded-r-2xl">
                                                            {product.desc_courte || t('products.modal.desc_quality')}
                                                        </p>
                                                        <div className="text-base text-gray-600 leading-relaxed font-normal">
                                                            <p>{product.desc_longue || product.description || t('products.modal.desc_protocols')}</p>
                                                        </div>
                                                    </div>
                                                ) : activeTab === 'specifications' ? (
                                                    <div className="grid grid-cols-1 gap-6">
                                                        <div className="bg-blue-50/20 p-6 rounded-3xl border border-blue-50 space-y-4">
                                                            <div className="flex justify-between items-center py-4 border-b border-blue-50/50">
                                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('products.modal.language')}</span>
                                                                <span className="text-xs font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-100 uppercase">{product.langue_du_product || t('language.fr')}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center py-4 border-b border-blue-50/50">
                                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('products.modal.origin')}</span>
                                                                <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">{product.region_org || t('products.listing.header.algeria')}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center py-4">
                                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('products.modal.availability')}</span>
                                                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-2">
                                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                                                    {product.est_pret ? t('products.modal.in_stock') : t('products.modal.on_order')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-4">
                                                            {/* First priority: Catalogue */}
                                                            {(product.catalogue || product.catalogue_url || product.catalog || product.catalog_url || product.file_catalogue || product.catalog_file) && (
                                                                <a
                                                                    href={product.catalogue_url || product.catalogue || product.catalog_url || product.catalog || product.file_catalogue || product.catalog_file}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center justify-center gap-3 w-full py-5 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-red-200"
                                                                >
                                                                    <FileText size={20} />
                                                                    {t('products.modal.download_catalog')}
                                                                </a>
                                                            )}

                                                            {/* Second priority: Fiche Technique */}
                                                            {(product.fiche_tech || product.fiche_tech_url || product.tech_sheet) && (
                                                                <a
                                                                    href={product.fiche_tech_url || product.fiche_tech || product.tech_sheet}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center justify-center gap-3 w-full py-5 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 hover:bg-blue-100 transition-all font-black text-xs uppercase tracking-widest shadow-sm"
                                                                >
                                                                    <FileText size={20} />
                                                                    {t('products.modal.tech_sheet')}
                                                                </a>
                                                            )}
                                                        </div>
                                                        <div className="mt-8 space-y-8">
                                                            {/* fiche_tech section moved to sidebar */}

                                                            {/* Multiple Certifications View with Security */}
                                                            {(product.certification_files?.length > 0 || product.certification_file) && (
                                                                <div className="space-y-6">
                                                                    <h4 className="text-[11px] font-bold text-red-600 uppercase tracking-[0.3em] flex items-center gap-3">
                                                                        <ShieldCheck size={18} />
                                                                        {t('products.details.compliance')}
                                                                    </h4>
                                                                    <div className="grid grid-cols-1 gap-4">
                                                                        {/* Single legacy certification if exists */}
                                                                        {product.certification_file && (
                                                                            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                                                                                <div className="flex items-center justify-between mb-4">
                                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('products.modal.cert_verified')}</p>
                                                                                    <ShieldCheck size={16} className="text-emerald-500" />
                                                                                </div>

                                                                                {/* Security Overlay Layer to discourage screenshots/direct interactions */}
                                                                                <div
                                                                                    className="relative rounded-2xl overflow-hidden border border-gray-50 select-none pointer-events-none"
                                                                                    onContextMenu={(e) => e.preventDefault()}
                                                                                    onDragStart={(e) => e.preventDefault()}
                                                                                >
                                                                                    <img
                                                                                        src={product.certification_file_url || product.certification_file}
                                                                                        alt="Certification"
                                                                                        className="w-full h-auto"
                                                                                        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                                                                                    />
                                                                                    <div className="absolute inset-0 bg-blue-600/5 opacity-40 pointer-events-none" />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {/* Multiple certifications */}
                                                                        {(product.certification_files || []).map((cert, certIdx) => (
                                                                            <div key={certIdx} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm relative">
                                                                                <div className="flex items-center justify-between mb-4">
                                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('products.modal.certificate')} #{certIdx + 1}</p>
                                                                                    <ShieldCheck size={16} className="text-emerald-500" />
                                                                                </div>

                                                                                <div
                                                                                    className="relative rounded-2xl overflow-hidden border border-gray-50 select-none pointer-events-none"
                                                                                    onContextMenu={(e) => e.preventDefault()}
                                                                                    onDragStart={(e) => e.preventDefault()}
                                                                                >
                                                                                    <img
                                                                                        src={cert.file}
                                                                                        alt={`${t('products.modal.certificate')} ${certIdx + 1}`}
                                                                                        className="w-full h-auto"
                                                                                        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                                                                                    />
                                                                                    <div className="absolute inset-0 bg-blue-600/5 opacity-40 pointer-events-none" />
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="aspect-video w-full bg-blue-50 rounded-2xl overflow-hidden">
                                                        <video
                                                            src={product.video}
                                                            controls
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column (35%) - Business Info (Sticky) */}
                                    <div className="flex-1 lg:flex-[0.35] bg-white border-t lg:border-t-0 lg:border-l border-gray-100 p-5 md:p-8 space-y-6 md:space-y-8">
                                        {/* Main CTA Button */}
                                        <button
                                            onClick={() => {
                                                if (isAuthenticated) {
                                                    setIsQuoteModalOpen(true);
                                                } else {
                                                    setIsAuthModalOpen(true);
                                                }
                                            }}
                                            className="w-full bg-red-600 text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-3 group mb-8"
                                        >
                                            {t('products.modal.request_quote')}
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        {/* Status Badge */}
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${product.est_pret ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">
                                                {product.est_pret ? t('products.modal.available') : t('products.modal.on_order')}
                                            </span>
                                        </div>

                                        {/* Business Stats Blocks */}
                                        <div className="space-y-6">
                                            {/* Price Block - Light Blue Theme */}
                                            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-50/50 relative overflow-hidden">
                                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">{t('products.modal.business_stats.indicative_price')}</h4>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-3xl font-bold text-red-600">{product.prix_indicatif || "---"}</span>
                                                    <span className="text-xs text-gray-500 font-bold">{product.currency || "USD"} / {t('products.details.unit')}</span>
                                                </div>
                                                <p className="text-[9px] text-gray-400 mt-4 font-bold uppercase tracking-widest italic">{t('products.modal.business_stats.quote_disclamer')}</p>
                                            </div>

                                            {/* MOQ Block */}
                                            <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                                                    <Package size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-[9px] uppercase tracking-widest font-bold text-gray-400">{t('products.modal.business_stats.moq')}</h4>
                                                    <p className="text-lg font-bold text-gray-900">{product.cle_min || "500"} {t('products.details.units')}</p>
                                                </div>
                                            </div>

                                            {/* Delivery Block */}
                                            <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <Clock size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-[9px] uppercase tracking-widest font-bold text-gray-400">{t('products.modal.business_stats.logistic_delay')}</h4>
                                                    <p className="text-lg font-bold text-gray-900">{product.delai_production || t('products.modal.business_stats.logistic_delay_fallback')}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* DOCUMENTS SECTION (Catalogue & Fiche Tech) */}
                                        {/* DOCUMENTS SECTION (Catalogue & Fiche Tech) */}
                                        {(product.catalogue || product.catalogue_url || product.catalog || product.catalog_url || product.file_catalogue || product.catalog_file || product.fiche_tech || product.fiche_tech_url || product.tech_sheet) && (
                                            <div className="pt-6 border-t border-gray-100 space-y-4">
                                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-900 flex items-center gap-2 px-1">
                                                    <FileText size={16} className="text-blue-600" />
                                                    {t('products.modal.documents')}
                                                </h4>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {(product.catalogue || product.catalogue_url || product.catalog || product.catalog_url || product.file_catalogue || product.catalog_file) && (
                                                        <a
                                                            href={product.catalogue_url || product.catalogue || product.catalog_url || product.catalog || product.file_catalogue || product.catalog_file}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-red-50 rounded-2xl border border-gray-100 hover:border-red-100 transition-all group"
                                                        >
                                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-600 shadow-sm border border-red-50 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                                                <FileText size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-900">{t('products.details.product_catalog')}</p>
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{t('products.details.download_pdf')}</p>
                                                            </div>
                                                        </a>
                                                    )}
                                                    {(product.fiche_tech || product.fiche_tech_url || product.tech_sheet) && (
                                                        <a
                                                            href={product.fiche_tech_url || product.fiche_tech || product.tech_sheet}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-2xl border border-gray-100 hover:border-blue-100 transition-all group"
                                                        >
                                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                <FileText size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-900">{t('products.details.tech_sheet')}</p>
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{t('products.details.specifications')}</p>
                                                            </div>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Certifications Mini View */}
                                        {(product.certifications?.length > 0 || product.certification_file) && (
                                            <div className="pt-6 border-t border-gray-100">
                                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <ShieldCheck size={16} className="text-red-600" />
                                                    {t('products.modal.quality')}
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {(product.certifications || []).map(cert => (
                                                        <span key={cert.id || cert} className="px-3 py-1.5 bg-blue-50/50 text-[9px] font-bold text-gray-600 uppercase tracking-widest rounded-lg border border-blue-50">
                                                            {cert.name || cert}
                                                        </span>
                                                    ))}
                                                    {product.certification_file && (
                                                        <span className="px-3 py-1.5 bg-red-600 text-[9px] font-bold text-white uppercase tracking-widest rounded-lg flex items-center gap-2">
                                                            <CheckCircle2 size={12} /> {t('products.modal.certified')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AuthRequiredModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            <QuoteRequestModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                product={product}
                producerId={product.producer_user_id}
            />
        </>
    );
};
export default ProductModal;
