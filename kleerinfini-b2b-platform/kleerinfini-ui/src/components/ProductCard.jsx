import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Eye, User, ArrowRight, Star, Package, Image as ImageIcon, BadgeCheck } from 'lucide-react';
import { getProductImage } from '../utils/utils';

import { motion, AnimatePresence } from 'framer-motion';
import ProductModal from './ProductModal';
import ProducerMiniCard from './ProducerMiniCard';
import QuoteRequestModal from './QuoteRequestModal';
import AuthRequiredModal from './AuthRequiredModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, categories = {} }) => {
  const { t } = useTranslation();
  if (!product) return null;

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [isHovered, setIsHovered] = useState(false);
  const [showProducerCard, setShowProducerCard] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(product.likes > 0);

  // Use the utility for consistent image resolution
  const imgUrl = getProductImage(product.images?.[0] || product.image, 0, product);


  const categoryName = (product.category && categories?.[product.category]?.name) || t('products.card.exclusive_collection');

  // Mock producer data
  const producer = {
    name: product.producer_name || t('products.modal.producer_fallback'),
    avatar: null,
    region: product.region_org || t('products.listing.header.algeria'),
    certifications: [t('products.modal.quality'), t('products.listing.featured.badge')]
  };

  return (
    <>
      <motion.div
        layout
        className="group relative flex flex-col bg-white rounded-[2rem] border border-slate-100 hover:border-slate-200 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setShowProducerCard(false); }}
      >
        {/* Image Stage */}
        <div
          className="relative aspect-[4/5] overflow-hidden bg-[#FBFBFA] cursor-pointer rounded-t-[2rem]"
          onClick={() => setIsModalOpen(true)}
        >
          {imgUrl ? (
            <motion.img
              src={imgUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-700"
              style={{
                filter: isHovered ? 'brightness(1.08) contrast(1.1) saturate(1.15)' : 'brightness(1.04) contrast(1.08) saturate(1.1)',
                imageRendering: '-webkit-optimize-contrast',
                WebkitBackfaceVisibility: 'hidden'
              }}
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 gap-4 bg-slate-50/50">
              <Package size={40} strokeWidth={0.5} />
              <span className="text-[9px] uppercase tracking-[0.3em] font-light">{t('products.card.exclusive_collection')}</span>
            </div>
          )}

          {/* Multiple Images Indicator */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-6 left-6 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2 group-hover:bg-white/40 transition-all duration-500">
              <ImageIcon size={12} className="text-white" />
              <span className="text-[10px] font-bold text-white tracking-widest">+{product.images.length - 1}</span>
            </div>
          )}

          {/* Luxury Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          {/* Refined Quick Action */}
          <div className="absolute inset-x-8 bottom-8 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100 ease-[cubic-bezier(0.23,1,0.32,1)]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isAuthenticated) {
                  setIsQuoteModalOpen(true);
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[#B8860B] transition-all duration-500 shadow-2xl active:scale-[0.98]"
            >
              {t('products.card.request_quote')}
            </button>
          </div>

          {/* Badges & Actions */}
          <div className="absolute top-6 inset-x-6 flex justify-between items-start">
            <div className="w-8 h-8 rounded-full overflow-hidden flex border border-white/50 shadow-[0_4px_12px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-500 bg-white">
              {/* Algerian Flag SVG Circle */}
              <svg viewBox="0 0 32 32" className="w-full h-full scale-110">
                <path fill="#006233" d="M0 0h16v32H0z" />
                <path fill="#fff" d="M16 0h16v32H16z" />
                <path fill="#d21034" d="M18.8 11.2a6 6 0 1 0 0 9.6 7 7 0 1 1 0-9.6zM20 13.5l0.8 2.5 2.6 0-2.1 1.5 0.8 2.5 -2.1-1.5 -2.1 1.5 0.8-2.5 -2.1-1.5 2.6 0z" />
              </svg>
            </div>

            <motion.button
              onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 1)' }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-xl flex items-center justify-center text-slate-400 hover:text-red-600 transition-all shadow-sm border border-white/40"
            >
              <Heart size={18} strokeWidth={1.5} className={isLiked ? "fill-red-600 text-red-600 border-none" : ""} />
            </motion.button>
          </div>
        </div>

        {/* Info Block */}
        <div className="p-8 flex flex-col flex-1 bg-white rounded-b-[2rem]">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-8 bg-gradient-to-r from-red-600 to-transparent flex-shrink-0"></span>
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] leading-tight">
                {categoryName.split('—')[0].trim()}
              </span>
            </div>
            <h3 className="text-[22px] font-bold text-slate-900 leading-[1.3] line-clamp-2 font-display tracking-tight transition-colors duration-500">
              {product.name}
            </h3>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
            <div
              className="flex items-center gap-4 cursor-pointer group/producer relative"
              onMouseEnter={() => setShowProducerCard(true)}
              onClick={(e) => {
                e.stopPropagation();
                if (isAuthenticated) {
                  navigate(`/producer/${producer.id || 1}`);
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
            >
              <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center border border-red-700 shadow-[0_0_15px_rgba(220,38,38,0.25)] overflow-hidden transition-all duration-500 group-hover/producer:border-red-500 group-hover/producer:shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover/producer:scale-105">
                {producer.avatar ? (
                  <img src={producer.avatar} alt={producer.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-white" />
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[9px] text-red-600 uppercase tracking-[0.2em] font-black">{t('products.card.partner')}</span>
                  <BadgeCheck size={10} className="text-red-600 fill-red-50" />
                </div>
                <span className="text-[13px] font-bold text-slate-800 group-hover/producer:text-red-700 transition-colors duration-300 truncate max-w-[140px]">
                  {producer.name}
                </span>
              </div>

              <AnimatePresence>
                {showProducerCard && (
                  <div className="absolute bottom-full left-0 mb-6 z-50">
                    <ProducerMiniCard producer={producer} categoryName={categoryName} />
                  </div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ x: 5, color: '#000' }}
              onClick={() => setIsModalOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-slate-300 hover:bg-slate-50 rounded-full transition-all"
            >
              <ArrowRight size={22} strokeWidth={1} />
            </motion.button>
          </div>
        </div>
      </motion.div >

      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Product Details Slide-over */}
      < ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        categoryName={categoryName}
      />

      {/* Direct Quote Modal */}
      < QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        product={product}
        producerId={product.producer_id}
      />
    </>
  );
};

export default ProductCard;
