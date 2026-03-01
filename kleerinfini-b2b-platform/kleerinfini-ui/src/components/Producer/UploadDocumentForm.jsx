import React, { useState } from 'react';
import {
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Upload,
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpDown,
  File,
  FileSpreadsheet,
  Archive,
  Download,
  Eye,
  Trash2,
  Calendar,
  ShieldCheck,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadDocumentForm = ({ documents = [], setDocuments }) => {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const stats = [
    {
      title: 'En cours de validation',
      value: '12',
      total: '/50',
      subtitle: 'En attente : 12 signatures',
      color: 'blue',
      progress: 24,
      icon: <FileText className="text-blue-600" size={20} />
    },
    {
      title: 'Temps moyen de signature',
      value: '5 jours',
      total: '7h',
      subtitle: '3 jours de retard (moyenne)',
      color: 'indigo',
      progress: 65,
      icon: <Timer className="text-indigo-600" size={20} />
    },
    {
      title: 'Documents en retard',
      value: '05',
      total: '/50',
      subtitle: 'Retard : 5 documents',
      color: 'rose',
      progress: 40,
      icon: <AlertCircle className="text-rose-600" size={20} />
    },
    {
      title: 'Documents finalisés',
      value: '32',
      total: '/50',
      subtitle: '+10% ce mois-ci',
      color: 'emerald',
      progress: 75,
      icon: <CheckCircle className="text-emerald-600" size={20} />
    }
  ];

  const categories = ['Tous', 'Brouillons', 'Envoyés', 'Signés', 'Expirés', 'Annulés', 'Corbeille'];

  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.pdf')) return <FileText className="text-rose-500" size={20} />;
    if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) return <FileSpreadsheet className="text-emerald-500" size={20} />;
    if (fileName.endsWith('.zip')) return <Archive className="text-blue-500" size={20} />;
    return <File className="text-slate-400" size={20} />;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
      case 'Signed':
      case 'Assinado':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'pending':
      case 'En attente':
        return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'overdue':
      case 'rejected':
      case 'Expiré':
        return 'text-rose-600 bg-rose-50 border-rose-100';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const translateStatus = (status) => {
    const map = {
      'approved': 'Signé',
      'pending': 'En attente',
      'rejected': 'Rejeté',
      'Signed': 'Signé',
      'Overdue': 'Expiré'
    };
    return map[status] || status;
  };

  return (
    <div className="space-y-8 pb-10 font-inter max-w-[1600px] mx-auto animate-in fade-in duration-700">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 px-4">
        <div>
          <h2 className="text-3xl font-black text-[#050B18] tracking-tight">Gestion des Documents</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Gérez vos signatures et contrats d'exportation</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-[#050B18] outline-none w-full md:w-64 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
            />
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2.5 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] transition-all whitespace-nowrap"
          >
            <Upload size={18} />
            Nouveau Document
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${stat.color === 'blue' ? 'bg-blue-500' : stat.color === 'indigo' ? 'bg-indigo-500' : stat.color === 'rose' ? 'bg-rose-500' : 'bg-emerald-500'}`} />

            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <MoreHorizontal className="text-slate-300 cursor-pointer hover:text-slate-600 transition-colors" size={20} />
            </div>

            <div className="space-y-1">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#050B18]">{stat.value}</span>
                <span className="text-sm font-bold text-slate-400">{stat.total}</span>
              </div>
              <p className={`text-[10px] font-bold ${stat.color === 'rose' ? 'text-rose-500' : stat.color === 'emerald' ? 'text-emerald-500' : 'text-blue-500'} flex items-center gap-1.5 mt-2`}>
                <span className={`w-1 h-1 rounded-full ${stat.color === 'rose' ? 'bg-rose-500' : stat.color === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                {stat.subtitle}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full ${stat.color === 'blue' ? 'bg-blue-500' : stat.color === 'indigo' ? 'bg-indigo-500' : stat.color === 'rose' ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full`}
                />
              </div>
              <button className={`w-full py-2.5 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all ${stat.color === 'blue' ? 'border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}>
                Voir plus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mt-10">
        {/* Filters bar */}
        <div className="px-8 pt-8 pb-4 border-b border-slate-50">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeFilter === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8 pb-4">
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <Filter size={14} /> Filtrer
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <ArrowUpDown size={14} /> Ordonner
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input type="text" placeholder="Recherche dans la liste..." className="pl-12 pr-6 py-3 bg-slate-50 rounded-2xl text-[11px] font-bold text-slate-500 outline-none w-72 border border-transparent focus:border-blue-100 focus:bg-white transition-all shadow-inner" />
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 w-12 text-center">
                  <input type="checkbox" className="w-4 h-4 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Créé le</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Validé le</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {documents.map((doc, idx) => (
                <tr key={doc.id} className="group hover:bg-blue-50/30 transition-all cursor-pointer">
                  <td className="px-8 py-6 w-12 text-center">
                    <input type="checkbox" className="w-4 h-4 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        {getFileIcon(doc.name)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#050B18] group-hover:text-blue-600 transition-colors">{doc.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 mt-0.5">
                          {idx % 2 === 0 ? 'Assini & Co' : 'KleerInfini B2B'}
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          {doc.name.split('.').pop().toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2.5 text-slate-500">
                      <Calendar size={14} className="text-slate-300" />
                      <span className="text-sm font-bold">{doc.date || '02 Jan 2025'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2.5 text-slate-500">
                      <CheckCircle size={14} className="text-emerald-500/50" />
                      <span className="text-sm font-bold">{doc.status === 'approved' ? doc.date : '—'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border flex items-center gap-2 w-max ${getStatusStyle(doc.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${doc.status === 'approved' ? 'bg-emerald-500' : doc.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                      {translateStatus(doc.status)}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button title="Voir" className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        <Eye size={14} />
                      </button>
                      <button title="Télécharger" className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                        <Download size={14} />
                      </button>
                      <button title="Supprimer" className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {documents.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-24 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                        <Archive size={40} />
                      </div>
                      <p className="text-lg font-black text-[#050B18]">Aucun document archivé</p>
                      <p className="text-sm font-medium text-slate-400 mt-2 max-w-xs">Commencez par téléverser vos documents officiels ou vos contrats.</p>
                      <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="mt-8 px-8 py-3.5 bg-[#050B18] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all"
                      >
                        Télécharger maintenant
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="bg-[#050B18] rounded-[1.5rem] p-4 flex items-center gap-4 w-full sm:w-80 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center gap-4 justify-center relative">
              <ShieldCheck className="text-blue-400" size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Stockage Pro</span>
                <span className="text-[10px] font-black text-blue-400">78%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[78%] bg-blue-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <p className="text-xs font-bold text-slate-400">Affichage 1-{documents.length} sur {documents.length}</p>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-blue-600 transition-all">1</button>
              <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-blue-600 transition-all brightness-95">2</button>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Upload Modal implementation */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute inset-0 bg-[#050B18]/40 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-xl p-10 overflow-hidden border border-slate-200"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Upload size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#050B18] tracking-tight text-left">Ajouter un Document</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Format PDF, DOCX ou ZIP</p>
                  </div>
                </div>
                <button onClick={() => setIsUploadModalOpen(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-600 transition-all">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center group hover:bg-blue-50/30 hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden">
                <input
                  type="file"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const newDocs = files.map((file, index) => ({
                      id: documents.length + index + 1,
                      name: file.name,
                      type: 'document',
                      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
                      status: 'pending'
                    }));
                    setDocuments([...documents, ...newDocs]);
                    setIsUploadModalOpen(false);
                  }}
                />
                <div className="w-20 h-20 bg-white rounded-3xl border border-slate-100 flex items-center justify-center text-blue-500 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Archive size={32} />
                </div>
                <p className="text-sm font-black text-[#050B18]">Cliquez ou glissez-déposez ici</p>
                <p className="text-xs font-medium text-slate-400 mt-2 max-w-[200px]">Vos fichiers seront automatiquement stockés en sécurité.</p>
              </div>

              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="mt-10 w-full py-4 bg-[#050B18] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all"
              >
                Annuler
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadDocumentForm;