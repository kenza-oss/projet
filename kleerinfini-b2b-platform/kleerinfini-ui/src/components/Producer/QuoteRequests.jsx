import React, { useState } from 'react';
import {
  ClipboardList,
  Globe,
  Download,
  ArrowUpRight,
  Plus,
  MessageSquare,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import ClientPublicProfile from '../ClientPublicProfile';
import { User } from 'lucide-react';

const QuoteRequests = ({ demands = [], setDemands }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedClientProfile, setSelectedClientProfile] = useState(null);

  const handleShowClientProfile = async (clientId) => {
    try {
      const response = await api.get(`/client-profiles/${clientId}/`);
      setSelectedClientProfile(response.data);
      setIsProfileModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch client profile:", error);
    }
  };

  // Map API fields to UI fields if they differ
  const processedRequests = demands.map(d => ({
    id: d.id,
    date: d.created_at ? new Date(d.created_at).toLocaleDateString() : 'N/A',
    clientName: d.client_name || `Client #${d.client}`,
    clientId: d.client,
    country: d.client_country || 'N/A',
    productName: d.estimate_products?.length > 0 ? d.estimate_products.map(p => p.product_name).join(', ') : 'Produit personnalisé',
    productImage: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&q=80&w=400', // Placeholder
    status: d.status || 'pending',
    quantity: d.estimate_products?.reduce((acc, p) => acc + (p.quantity || 0), 0) || 0,
    destination: d.comment ? (d.comment.length > 30 ? d.comment.substring(0, 30) + '...' : d.comment) : 'N/A'
  }));

  return (
    <div className="space-y-10 pb-20">
      {/* Transaction Dashboard Header */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[3rem] p-10 border border-[#064E3B]/10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#064E3B] rounded-2xl flex items-center justify-center text-[#10B981] shadow-2xl shadow-green-900/20">
            <ClipboardList size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">Flux de Transactions</h2>
            <p className="text-gray-500 font-semibold text-xs tracking-wide">Gestion des demandes d'exportation globales</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-[#F8FAFC] rounded-xl border border-[#064E3B]/5 flex items-center gap-4">
            <div className="text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">En Attente</p>
              <p className="text-lg font-bold text-[#064E3B]">{processedRequests.filter(r => r.status === 'pending').length}</p>
            </div>
            <div className="w-[1px] h-6 bg-[#064E3B]/10" />
            <div className="text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Approuvées</p>
              <p className="text-lg font-bold text-[#10B981]">{processedRequests.filter(r => r.status === 'accepted' || r.status === 'sent').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Strips */}
      <div className="grid grid-cols-1 gap-6">
        {processedRequests.length > 0 ? processedRequests.map((request) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 border border-[#064E3B]/5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:border-[#10B981]/30 hover:shadow-[0_20px_50px_rgba(16,185,129,0.08)] transition-all duration-500 overflow-hidden relative"
          >
            {/* Status Accent Beam */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${request.status === 'pending' ? 'bg-[#10B981]' : 'bg-[#064E3B]'} opacity-40`} />

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] border border-[#064E3B]/10 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={request.productImage} className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-[#1a1a1a] tracking-tight">{request.productName}</h4>
                  <p
                    onClick={() => handleShowClientProfile(request.clientId)}
                    className="text-xs text-[#10B981] font-bold tracking-wide flex items-center gap-2 cursor-pointer hover:underline underline-offset-4"
                  >
                    <Globe size={11} /> Client: {request.clientName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 flex-1 xl:max-w-3xl border-t xl:border-t-0 xl:border-l xl:border-l-[#064E3B]/5 pt-6 xl:pt-0 xl:pl-10">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Volume</p>
                  <p className="text-sm font-bold text-[#064E3B]">{request.quantity} <span className="text-[10px] opacity-60">Unités</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Détails</p>
                  <p className="text-sm font-bold text-[#064E3B] truncate max-w-[150px]">{request.destination || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Date</p>
                  <p className="text-sm font-bold text-[#064E3B] tabular-nums">{request.date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Statut</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${request.status === 'pending' ? 'bg-[#10B981] animate-pulse' : 'bg-gray-400'}`} />
                    <span className="text-xs font-bold text-[#1a1a1a] opacity-80">{request.status === 'pending' ? 'En Cours' : request.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="flex-1 xl:flex-none px-8 py-4 bg-[#064E3B] text-white rounded-2xl font-bold text-xs hover:bg-[#10B981] transition-all shadow-[0_10px_20px_rgba(6,78,59,0.15)] active:scale-95">
                  Analyser les détails
                </button>
                <button className="p-4 bg-[#F8FAFC] border border-[#064E3B]/10 text-[#064E3B] rounded-2xl hover:bg-white transition-all">
                  <Download size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="py-20 text-center bg-white/50 backdrop-blur-md rounded-[3rem] border border-dashed border-[#064E3B]/20">
            <p className="text-gray-400 font-bold uppercase tracking-widest">Aucune demande reçue pour le moment</p>
          </div>
        )}
      </div>

      {/* Response Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="absolute inset-0 bg-[#022C22]/60 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-white/90 backdrop-blur-3xl rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20"
            >
              <div className="bg-[#064E3B] p-10 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-[#10B981]">
                    <MessageSquare size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Détails de la transaction</h2>
                    <p className="text-xs text-white/60 font-semibold tracking-wide mt-1">{selectedRequest.clientName}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-4 bg-white/10 rounded-2xl text-white/60 hover:text-white transition-all">
                  <X size={24} />
                </button>
              </div>
              <div className="p-10 space-y-10">
                <div className="bg-[#F8FAFC] rounded-[2rem] p-8 border border-[#064E3B]/5">
                  <p className="text-gray-500 font-bold text-sm leading-relaxed mb-4">
                    ID Demande: #{selectedRequest.id}<br />
                    Produit(s): {selectedRequest.productName}<br />
                    Statut: {selectedRequest.status}<br />
                    Commentaire client: {selectedRequest.destination}
                  </p>
                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-[#064E3B] text-white rounded-xl text-xs font-bold hover:bg-[#10B981] transition-all">
                      Répondre au client
                    </button>
                    <button className="px-6 py-3 bg-white border border-[#064E3B]/10 text-gray-500 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-all">
                      Décliner
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Client Business Card Modal */}
      <ClientPublicProfile
        profile={selectedClientProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default QuoteRequests;
