import React, { useState } from "react";
import { Plus, Download, Send, FileCheck, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  generatePresentationPDF,
  generateIdeaPDF,
  generateCollaborationTemplatePDF
} from "../../utils/pdfProposals";

const CircularProgress = ({ percentage, label, sublabel, color = "#2563eb" }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/10"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-white leading-none">{percentage}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{label}</p>
        <p className="text-[9px] font-bold text-emerald-400">{sublabel}</p>
      </div>
    </div>
  );
};

import dashboardBg from '../../assets/dashboard_gold_charts.png';

export default function DashboardHeader({ activeTab, onAddProductClick, documents = [], producerProfile }) {
  const { t } = useTranslation();
  const [ideaText, setIdeaText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const firstName = producerProfile?.first_name || "";
  const lastName = producerProfile?.last_name || "";
  const companyName = producerProfile?.company_name || "";

  const handlePresentationDownload = () => {
    generatePresentationPDF(producerProfile, documents);
  };

  const handleTemplateDownload = () => {
    generateCollaborationTemplatePDF(producerProfile);
  };

  const handleIdeaSubmit = () => {
    if (!ideaText.trim()) return alert("Veuillez décrire votre idée avant d'envoyer.");

    // 1. Generate & Download PDF
    generateIdeaPDF(producerProfile, ideaText);

    // 2. Open Email Client
    const subject = encodeURIComponent(`Proposition de Collaboration - ${companyName}`);
    const body = encodeURIComponent(`Bonjour,\n\nVeuillez trouver ci-joint ma proposition de collaboration générée depuis mon Dashboard Kleer Infini.\n\nCordialement,\n${firstName} ${lastName}\n${companyName}`);
    window.location.href = `mailto:contact@kleerinfini-export.com?subject=${subject}&body=${body}`;

    // 3. Feedback
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 8000);
  };


  return (
    <div className="mb-10 animate-in fade-in slide-in-from-top-6 duration-1000">
      {/* Hero Section */}
      <div className="relative h-[280px] rounded-[2.5rem] overflow-hidden shadow-2xl mb-8 group">
        <img
          src={dashboardBg}
          alt="Dashboard Hero"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221]/90 via-[#0B1221]/40 to-transparent" />

        <div className="absolute inset-0 p-6 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-0">
          <div className="space-y-3 md:space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-300 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                Premium Producer Hub
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-tight">
              {t('producer_dashboard.topbar.welcome', 'Bienvenue')}, <span className="text-white">{firstName} {lastName}</span> <br />
              <span className="text-lg md:text-2xl opacity-80 uppercase tracking-widest block mt-1 md:mt-2 text-white/70">
                {t('producer_dashboard.home.responsibleFor', 'Responsable de')} <span className="text-blue-500 font-bold">{companyName}</span>
              </span>
            </h1>
            <p className="text-white/70 text-sm md:text-base font-medium max-w-sm tracking-tight line-clamp-2 md:line-clamp-none">
              {t('producer_dashboard.home.manageCatalog', 'Gérez vos opérations B2B internationales avec précision et suivez votre croissance.')}
            </p>
            <p className="text-blue-400 text-[10px] md:text-sm font-bold tracking-widest uppercase">
              Support : <a href="mailto:contact@kleerinfini-export.com" className="hover:underline">contact@kleerinfini-export.com</a>
            </p>
          </div>

          <div className="hidden sm:flex gap-6 md:gap-12 items-center md:mr-8 bg-black/20 backdrop-blur-sm p-4 rounded-3xl border border-white/5">
            <CircularProgress percentage={87} label="Weekly Reach" sublabel="+12.4% Up" color="#2563eb" />
            <CircularProgress percentage={64} label="Conversion" sublabel="+5.2% Up" color="#26B99A" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        {/* Module 1: Roadmap */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-[#0B1221]">
                <FileCheck size={24} />
              </div>
              <h3 className="font-black text-base uppercase tracking-wider text-[#0B1221]">Mission & Roadmap</h3>
            </div>
            <p className="text-sm text-slate-500 font-bold leading-relaxed">
              Découvrez notre stratégie d'accompagnement 2026 personnalisée pour votre entrée sur les marchés mondiaux.
            </p>
          </div>
          <button
            onClick={handlePresentationDownload}
            className="mt-8 flex items-center justify-center gap-3 bg-red-600 text-white hover:bg-red-700 px-6 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all w-full shadow-lg shadow-red-500/20 active:scale-95"
          >
            <Download size={18} />
            Télécharger la Roadmap
          </button>
        </div>

        {/* Module 2: Submission */}
        <div className="lg:col-span-2 bg-[#F8FAFC] rounded-[2.5rem] p-8 border border-sky-100 shadow-sm relative group">
          {showSuccess ? (
            <div className="absolute inset-0 bg-emerald-600 rounded-[2.5rem] flex flex-col items-center justify-center text-white p-8 animate-in zoom-in duration-300 z-10">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Send size={32} />
              </div>
              <h3 className="text-2xl font-black mb-2">Votre Proposition est prête !</h3>
              <p className="text-center text-base font-bold opacity-90 max-w-md leading-relaxed">
                Le PDF a été téléchargé. Veuillez l'attacher à l'email qui vient de s'ouvrir pour finaliser l'envoi à Kleer Infini.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="mt-8 px-10 py-3 bg-white text-emerald-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Compris
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleTemplateDownload}
                    title="Télécharger un document prêt"
                    className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-110 transition-all active:scale-95"
                  >
                    <Plus size={24} />
                  </button>
                  <h3 className="font-black text-base uppercase tracking-wider text-[#0B1221]">Projet de Collaboration</h3>
                </div>
                <textarea
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  placeholder="Décrivez votre idée de partenariat ou un besoin spécifique ici..."
                  className="w-full h-36 bg-white border-2 border-slate-200 rounded-3xl p-6 text-sm font-bold outline-none focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all resize-none shadow-inner placeholder:text-slate-300"
                />
              </div>
              <div className="lg:w-72 flex flex-col justify-end gap-4">
                <div className="bg-blue-50 p-6 rounded-3xl mb-2 border border-blue-100">
                  <div className="flex items-center gap-3 text-blue-700 mb-2">
                    <Info size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Aide Stratégique</span>
                  </div>
                  <p className="text-[10px] text-blue-600 font-bold leading-relaxed">
                    Besoin d'aide ? Contactez-nous sur <span className="text-blue-600 font-black">contact@kleerinfini-export.com</span> ou Cliquez sur le "+" pour télécharger un modèle de document prêt à l'emploi.
                  </p>
                </div>
                <button
                  onClick={handleIdeaSubmit}
                  className="flex items-center justify-center gap-4 bg-[#0B1221] text-white hover:bg-blue-600 px-6 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-black/10 active:scale-95"
                >
                  <Send size={20} />
                  Générer & Envoyer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 flex justify-end gap-4 px-4">
        {activeTab === "products" && (
          <button
            onClick={() => {
              if (!producerProfile?.is_approved) {
                return alert(t('producer_dashboard.products.approvalRequired', "Votre compte doit être validé par un administrateur avant de pouvoir ajouter des produits."));
              }
              onAddProductClick();
            }}
            className={`${producerProfile?.is_approved ? 'bg-[#0B1221] hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'} text-white px-8 py-4 rounded-2xl shadow-xl shadow-black/20 transition-all active:scale-95 group font-black text-[10px] uppercase tracking-widest flex items-center gap-3`}
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
            {t('producer_dashboard.products.addProduct', 'Add Product')}
          </button>
        )}
      </div>
    </div>
  );
}
