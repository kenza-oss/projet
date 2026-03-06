import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  ArrowRight,
  Zap,
  Star,
  Globe,
  Download,
  Calendar,
  ExternalLink,
  Building2,
  Copy,
  Smartphone,
  Wallet,
  Upload
} from "lucide-react";
import { motion } from "framer-motion";
import exportBg from "../../assets/export_port_background.png";
import { uploadPaymentProof } from "../../api/payments";
import { toast } from "react-hot-toast";
import api from "../../api/axios";

export default function PaymentStatusCard({ documents = [], setDocuments, subscription: initialSubscription }) {
  const [subscription, setSubscription] = useState(initialSubscription || {
    status: "free",
    start_date: "---",
    end_date: "---"
  });

  const [globalSettings, setGlobalSettings] = useState({
    subscription_price: 0,
    bank_name: "",
    account_holder: "",
    rib: "",
    ccp: "",
    rip: ""
  });

  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchGlobalSettings();
    if (initialSubscription) {
      setSubscription(initialSubscription);
    }
  }, [initialSubscription]);

  const fetchGlobalSettings = async () => {
    try {
      const res = await api.get("subscriptions/settings/public/");
      console.log("DEBUG: Payment Settings received:", res.data);
      setGlobalSettings(res.data);
    } catch (err) {
      console.error("Failed to fetch global settings:", err);
    }
  };

  const handleDownloadInvoice = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const res = await api.get("subscriptions/invoice-pdf/", {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'facture_kleer_infini.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Échec du téléchargement de la facture.");
    } finally {
      setIsDownloading(false);
    }
  };

  const [isUploading, setIsUploading] = useState(false);
  // No rip configured by admin yet
  const hasRip = globalSettings.rip && globalSettings.rip.trim() !== "";

  const licenseData = {
    status: subscription.status,
    price: globalSettings.subscription_price,
    currency: "DA",
    startDate: subscription.start_date || "---",
    expiryDate: subscription.end_date || "---",
    planName: "Licence Exportateur Premium",
    accessList: [
      { text: "Catalogue produits illimité", icon: <Star size={18} /> },
      { text: "Accès direct aux acheteurs B2B", icon: <Globe size={18} /> },
      { text: "Visibilité SEO internationale", icon: <Zap size={18} /> },
      { text: "Support prioritaire 24/7", icon: <ShieldCheck size={18} /> }
    ]
  };

  const isExpired = licenseData.status === "expired" || (licenseData.expiryDate !== "---" && new Date(licenseData.expiryDate) < new Date());
  const isActive = licenseData.status === "active" && !isExpired;
  const isFree = licenseData.status === "free";
  const isPending = licenseData.status === "pending_validation";

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-inter text-[#050B18]">
      <div className="max-w-[1400px] mx-auto space-y-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-600/10 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Compte Vérifié</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest uppercase">Premium Access</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              Licence Annuelle<span className="text-blue-600">.</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {(isActive || isPending) && (
              <button
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={18} /> {isDownloading ? "Téléchargement..." : "Télécharger la facture"}
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-8">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-[3rem] p-10 overflow-hidden shadow-2xl shadow-blue-500/10 border border-white">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(to bottom, rgba(5, 11, 24, 0.8), rgba(15, 23, 42, 0.85)), url(${exportBg})` }}></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="space-y-6 text-center md:text-left text-white">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border backdrop-blur-md transition-all ${isActive ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-white/90'}`}>
                    <div className={`w-2 h-2 rounded-full ${isExpired ? 'bg-red-500' : isActive ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`}></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isPending ? 'Statut : Vérification' : isFree ? 'Statut : Trial' : isExpired ? 'Statut : Expiré' : 'Statut : Actif'}</span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-5xl font-black tracking-tighter">{licenseData.planName}</h2>
                    <p className="text-white/40 font-medium text-lg">Votre entreprise est actuellement visible à l'international.</p>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-4 text-white">
                    <div className="space-y-1"><p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Date de début</p><p className="font-bold">{licenseData.startDate}</p></div>
                    <div className="w-px h-10 bg-white/10"></div>
                    <div className="space-y-1"><p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Expiration</p><p className="font-bold">{licenseData.expiryDate}</p></div>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 w-full md:w-80 text-center flex flex-col items-center justify-center">
                  <div className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em] mb-4">Investissement Annuel</div>
                  <div className="text-4xl font-black text-white mb-8 tracking-tighter">{(licenseData.price || 0).toLocaleString()} <span className="text-lg font-bold text-blue-400">DA</span></div>
                  {isActive ? (
                    <div className="w-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"><CheckCircle size={14} /> Licence Validée</div>
                  ) : isPending ? (
                    <div className="w-full bg-amber-500/20 border border-amber-500/20 text-amber-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"><Clock size={14} /> En attente</div>
                  ) : (
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">Renouveler <ArrowRight size={14} /></button>
                  )}
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {licenseData.accessList.map((item, i) => (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.1) }} key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <span className="font-bold text-slate-700">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black flex items-center gap-3"><div className="w-1.5 h-6 bg-blue-600 rounded-full" />MOYENS DE PAIEMENT</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform"><Building2 size={28} /></div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Virement</span>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-slate-900">Virement Bancaire</h4>
                    <div className="space-y-3">
                      <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Banque</p><p className="text-sm font-bold text-slate-700">{globalSettings.bank_name}</p></div>
                      <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Titulaire</p><p className="text-sm font-bold text-slate-700">{globalSettings.account_holder}</p></div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center overflow-hidden">
                        <div className="truncate shrink-1"><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">RIB (Algérie)</p><p className="text-sm font-black text-[#050B18] truncate">{globalSettings.rib}</p></div>
                        <button onClick={() => copyToClipboard(globalSettings.rib, "RIB")} className="p-3 bg-white hover:bg-blue-600 hover:text-white rounded-xl border border-slate-200 text-slate-400 transition-all active:scale-90 shrink-0"><Copy size={16} /></button>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-start mb-6"><div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-sm uppercase">CCP</div><span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Poste</span></div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-slate-900">Versement CCP</h4>
                    <div className="space-y-3">
                      <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Titulaire</p><p className="text-sm font-bold text-slate-700">{globalSettings.account_holder}</p></div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                        <div className="truncate"><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">N° Compte / Clé</p><p className="text-sm font-black text-[#050B18]">{globalSettings.ccp}</p></div>
                        <button onClick={() => copyToClipboard(globalSettings.ccp, "CCP")} className="p-3 bg-white hover:bg-emerald-600 hover:text-white rounded-xl border border-slate-200 text-slate-400 transition-all active:scale-90"><Copy size={16} /></button>
                      </div>
                    </div>
                  </div>
                </motion.div>
                {hasRip && (
                  <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-6"><div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 transition-transform"><Smartphone size={28} /></div><span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest">Mobile</span></div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-black text-slate-900">BaridiMob / RIP</h4>
                      <div className="space-y-3">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center overflow-hidden">
                          <div className="truncate"><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Numéro RIP Complet</p><p className="text-sm font-black text-[#050B18] truncate">{globalSettings.rip}</p></div>
                          <button onClick={() => copyToClipboard(globalSettings.rip, "RIP")} className="p-3 bg-white hover:bg-purple-600 hover:text-white rounded-xl border border-slate-200 text-slate-400 transition-all active:scale-90"><Copy size={16} /></button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>
            </div>

            <div className="p-8 bg-blue-50 border border-blue-100 rounded-[2rem] flex flex-col md:flex-row items-center gap-8">
              <div className="flex items-center gap-6 flex-1 text-slate-900">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 shrink-0"><Wallet size={28} /></div>
                <div><h5 className="text-sm font-black uppercase tracking-tight">Important : Preuve de Paiement</h5><p className="text-xs font-medium leading-relaxed opacity-70">Uploadez votre reçu ici pour validation.</p></div>
              </div>
              <div className="relative w-full md:w-auto">
                <div className="flex items-center gap-3 px-8 py-4 bg-[#050B18] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all cursor-pointer whitespace-nowrap">
                  {isUploading ? <Clock size={16} className="animate-spin" /> : <Upload size={16} />}
                  {isUploading ? "Envoi..." : "Uploader le reçu"}
                </div>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" disabled={isUploading} onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setIsUploading(true);
                  const formData = new FormData();
                  formData.append("proof", file);
                  try {
                    await uploadPaymentProof(formData);
                    toast.success("Preuve envoyée !");
                    setSubscription(prev => ({ ...prev, status: "pending_validation" }));
                  } catch (error) { toast.error("Échec de l'envoi."); } finally { setIsUploading(false); }
                }} />
              </div>
            </div>
          </div>
          <div className="xl:col-span-4 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-slate-900">
              <h3 className="text-lg font-black mb-8 flex items-center gap-3"><div className="w-1.5 h-6 bg-[#050B18] rounded-full" />Aperçu Compte</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl"><div className="flex items-center gap-3 text-blue-600"><Star size={18} /><span className="text-xs font-bold text-slate-500">Niveau</span></div><span className="text-xs font-black uppercase">Premium</span></div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl"><div className="flex items-center gap-3 text-emerald-600"><Calendar size={18} /><span className="text-xs font-bold text-slate-500">Renouvellement</span></div><span className="text-xs font-black">Annuel</span></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6"><AlertCircle size={24} /></div>
              <h3 className="text-xl font-black mb-2">Besoin d'aide ?</h3>
              <p className="text-white/70 text-sm font-medium mb-8">Support prioritaire inclus.</p>
              <button className="w-full bg-white text-blue-600 py-4 rounded-xl font-black text-xs uppercase hover:bg-slate-50 transition-all flex items-center justify-center gap-2">Contacter expert <ExternalLink size={14} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
