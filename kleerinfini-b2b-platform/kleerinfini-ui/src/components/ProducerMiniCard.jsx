import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Award, Send, User, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthRequiredModal from './AuthRequiredModal';
import { useAuth } from '../context/AuthContext';

const ProducerMiniCard = ({ producer, categoryName }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleMessageClick = (e) => {
        e.stopPropagation(); // Prevents clicking the underlying card
        if (isAuthenticated) {
            navigate(`/producers/${producer.id || 1}`); // Fallback ID if none provided
        } else {
            setIsAuthModalOpen(true);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-64 bg-white/95 backdrop-blur-2xl border border-white/20 rounded-[1.5rem] p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] text-left"
        >
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden shadow-inner">
                        {producer.avatar ? (
                            <img src={producer.avatar} alt={producer.name} className="w-full h-full object-cover" />
                        ) : (
                            <User size={18} strokeWidth={1} className="text-slate-300" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-slate-900 font-black text-[14px] leading-tight tracking-tight">{producer.name}</h4>
                        <p className="text-[#966B08] text-[9px] uppercase tracking-[0.2em] font-black mt-1">{categoryName.split('—')[0].trim()}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-600 text-[11px] font-bold tracking-wide">
                    <MapPin size={14} strokeWidth={2} className="text-slate-400" />
                    {producer.region || 'Algérie'}
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-[11px] font-bold tracking-wide">
                    <Award size={14} strokeWidth={2} className="text-[#B8860B]" />
                    Fiabilité : <span className="text-slate-900 font-black">98%</span>
                </div>
            </div>

            <div className="space-y-2.5">
                <button
                    onClick={handleMessageClick}
                    className="w-full bg-[#B8860B] text-white text-[10px] font-black py-3 rounded-xl hover:bg-[#8B6508] transition-all duration-300 flex items-center justify-center gap-2.5 uppercase tracking-[0.2em] shadow-lg active:scale-[0.97]"
                >
                    <Send size={12} strokeWidth={2.5} />
                    Message Direct
                </button>
                <button
                    onClick={handleMessageClick}
                    className="w-full border-2 border-slate-100 text-slate-900 text-[10px] font-black py-3 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 flex items-center justify-center gap-2.5 uppercase tracking-[0.15em] active:scale-[0.97]"
                >
                    Profil Partenaire
                </button>
            </div>

            {/* Subtle luxury arrow */}
            <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white/95 backdrop-blur-2xl border-b border-r border-white/20 transform rotate-45"></div>

            <AuthRequiredModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </motion.div>
    );
};

export default ProducerMiniCard;
