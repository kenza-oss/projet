import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from '../api/axios';
import { getProductImages, getCertificationsForProduct } from "../utils/utils";
import QuoteRequestModal from "./QuoteRequestModal";
import { ChevronLeft, MapPin, Award, CheckCircle, Clock, Package, Share2, Heart, FileText, Download } from 'lucide-react';

const ProductDetails = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState({});
    const [certifications, setCertifications] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) return;
            try {
                // Fetch product, categories, and certifications in parallel
                const [productRes, categoriesRes, certificationsRes] = await Promise.all([
                    axios.get(`products/${id}/`),
                    axios.get(`categories/`),
                    axios.get(`certifications/`)
                ]);

                const fetchedProduct = productRes.data;
                const fetchedCategories = categoriesRes.data.results || categoriesRes.data || [];
                const fetchedCertifications = certificationsRes.data.results || certificationsRes.data || [];

                setProduct(fetchedProduct);

                // Create maps for easier lookup
                const catsMap = {};
                fetchedCategories.forEach(c => catsMap[c.id] = c);
                setCategories(catsMap);

                const certsMap = {};
                fetchedCertifications.forEach(c => certsMap[c.id] = c);
                setCertifications(certsMap);

                // Set initial image
                const images = getProductImages(fetchedProduct);
                setMainImage(images.length > 0 ? images[0] : null);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching details:", err);
                setError(t('products.details.loading_error'));
                setLoading(false);
            }
        };

        fetchProductData();
    }, [id, t]);

    const productCertifications = useMemo(() => {
        return getCertificationsForProduct(product, categories, certifications);
    }, [product, categories, certifications]);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
        </div>
    );

    if (error || !product) return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
            <p className="text-red-500 mb-4 font-bold">{error || t('products.details.product_not_found')}</p>
            <button onClick={() => navigate('/products')} className="px-6 py-2 bg-red-600 text-white rounded-full font-bold uppercase text-xs tracking-widest">{t('products.details.return_to_products')}</button>
        </div>
    );

    const images = getProductImages(product);
    const categoryName = categories[product.category]?.name || t('products.card.exclusive_collection');

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 lg:py-20">
            {/* Breadcrumb / Back Navigation */}
            <button
                onClick={() => navigate('/products')}
                className="group flex items-center text-[10px] font-bold text-gray-400 hover:text-red-600 mb-12 transition-all uppercase tracking-widest"
                aria-label={t('products.details.back_to_catalog')}
            >
                <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center mr-4 group-hover:border-red-100 group-hover:bg-red-50 transition-all">
                    <ChevronLeft size={16} />
                </div>
                {t('products.details.back_to_catalog')}
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                {/* Visuals Column */}
                <div className="space-y-8">
                    <div className="relative aspect-[3/2] bg-blue-50/20 rounded-[2.5rem] overflow-hidden border border-blue-50 shadow-sm group">
                        {mainImage ? (
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-blue-200">
                                <Package size={48} strokeWidth={1} />
                                <span className="text-[10px] uppercase tracking-widest font-bold mt-4">{t('products.details.no_image')}</span>
                            </div>
                        )}
                        <div className="absolute top-6 right-6 flex gap-3">
                            <button className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-all">
                                <Heart size={18} />
                            </button>
                            <button className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 transition-all">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    {images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-red-500 scale-95' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Information Column */}
                <div className="space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] uppercase font-bold tracking-widest rounded-lg border border-red-100">
                                {categoryName}
                            </span>
                            {product.est_pret && (
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] uppercase font-bold tracking-widest rounded-lg border border-emerald-100 flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    {t('products.details.export_immediate')}
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <MapPin size={14} className="text-red-500" />
                            {product.region_org || t('products.details.origin_fallback')}
                        </div>
                    </div>

                    {/* Price & Primary CTA */}
                    <div className="bg-blue-50/30 p-8 rounded-[2rem] border border-blue-50 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-[0.2em] font-bold">{t('products.details.indicative_price')}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-red-600">
                                    {product.prix_indicatif ? `${Number(product.prix_indicatif).toLocaleString()}` : '---'}
                                </span>
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">USD / {t('products.details.unit')}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsQuoteModalOpen(true)}
                            className="px-10 py-5 bg-red-600 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100 active:scale-95"
                        >
                            {t('products.details.request_quote')}
                        </button>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-3">
                            <div className="w-1 h-4 bg-red-600 rounded-full" />
                            {t('products.details.presentation')}
                        </h3>
                        <p className="text-gray-600 leading-relaxed font-normal text-base">
                            {product.description || product.desc_longue || t('products.details.desc_fallback')}
                        </p>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 group hover:border-blue-100 transition-all">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <Clock size={22} />
                            </div>
                            <div>
                                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">{t('products.details.logistic_delay')}</p>
                                <p className="font-bold text-gray-900">{product.delai_production || t('products.modal.business_stats.logistic_delay_fallback')}</p>
                            </div>
                        </div>
                        <div className="p-6 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 group hover:border-red-100 transition-all">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                                <Package size={22} />
                            </div>
                            <div>
                                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">{t('products.details.min_moq')}</p>
                                <p className="font-bold text-gray-900">{product.cle_min || "500"} {t('products.details.units')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Technical Documents Section */}
                    {(product.catalogue || product.catalogue_url || product.catalog || product.catalog_url || product.file_catalogue || product.catalog_file || product.fiche_tech || product.fiche_tech_url || product.tech_sheet) && (
                        <div className="pt-8 border-t border-gray-100">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <FileText size={18} className="text-red-500" />
                                {t('products.details.tech_doc')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(product.catalogue || product.catalogue_url || product.catalog || product.catalog_url || product.file_catalogue || product.catalog_file) && (
                                    <a
                                        href={product.catalogue_url || product.catalogue || product.catalog_url || product.catalog || product.file_catalogue || product.catalog_file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white text-red-600 rounded-lg shadow-sm font-bold">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-bold text-gray-900">{t('products.details.product_catalog')}</h5>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{t('products.details.download_pdf')}</p>
                                            </div>
                                        </div>
                                        <Download size={18} className="text-gray-300 group-hover:text-red-600 transition-colors" />
                                    </a>
                                )}
                                {(product.fiche_tech || product.fiche_tech_url || product.tech_sheet) && (
                                    <a
                                        href={product.fiche_tech_url || product.fiche_tech || product.tech_sheet}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white text-blue-600 rounded-lg shadow-sm font-bold">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-bold text-gray-900">{t('products.details.tech_sheet')}</h5>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{t('products.details.specifications')}</p>
                                            </div>
                                        </div>
                                        <Download size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Compliance / Certifications */}
                    {productCertifications.length > 0 && (
                        <div className="pt-8 border-t border-gray-100">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <Award size={18} className="text-red-500" />
                                {t('products.details.compliance')}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {productCertifications.map(cert => (
                                    <div key={cert.id} className="flex items-center gap-3 pl-1 pr-5 py-2 bg-white border border-gray-100 rounded-xl hover:border-blue-200 transition-all shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50/50 p-1 flex-shrink-0 flex items-center justify-center">
                                            {cert.hasImage ? (
                                                <img src={cert.image_url} alt={cert.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <Award size={20} className="text-blue-400" />
                                            )}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">{cert.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Producer Info Mini Card */}
                    <div className="flex items-center gap-6 p-6 bg-blue-50/20 rounded-[2rem] border border-blue-50 group hover:bg-blue-50/40 transition-all">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm overflow-hidden text-red-600 font-bold text-2xl uppercase group-hover:scale-105 transition-all">
                            {product.producer_name?.charAt(0) || "K"}
                        </div>
                        <div className="flex-1">
                            <p className="text-[9px] text-red-500 font-black uppercase tracking-[0.2em] mb-1">{t('products.details.certified_partner')}</p>
                            <h4 className="text-lg font-bold text-gray-900 leading-tight mb-2">{product.producer_name || "Maison Kleer Infini"}</h4>
                            {(product.producer_id || product.producer) && (
                                <button
                                    onClick={() => navigate(`/producer/${product.producer_id || product.producer}`)}
                                    className="text-[10px] font-bold text-blue-600 hover:text-red-600 transition-colors uppercase tracking-widest flex items-center gap-2"
                                >
                                    {t('products.details.company_profile')} <ChevronLeft size={12} className="rotate-180" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {product && (
                <QuoteRequestModal
                    isOpen={isQuoteModalOpen}
                    onClose={() => setIsQuoteModalOpen(false)}
                    product={product}
                    producerId={product.producer_user_id}
                />
            )}
        </div>
    );
};

export default ProductDetails;
