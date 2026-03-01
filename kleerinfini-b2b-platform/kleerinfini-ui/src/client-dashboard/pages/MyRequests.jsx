import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Filter, Calendar, User, ShoppingBag, ChevronRight, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const MyRequests = () => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les quotes depuis le backend
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await api.get("quotes/");
        setRequests(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des demandes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  // Fonction pour style du statut
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Texte en français
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return t('client_dashboard.requests.status.pending', 'En attente');
      case "processed":
        return t('client_dashboard.requests.status.processed', 'Répondu');
      case "closed":
        return t('client_dashboard.requests.status.closed', 'Clôturé');
      default:
        return status;
    }
  };

  const handleView = (id) => {
    console.log("Voir demande ID:", id);
  };

  const handleReply = (id) => {
    console.log("Répondre demande ID:", id);
  };

  // Filtrage
  const filteredRequests = statusFilter
    ? requests.filter((req) => req.status === statusFilter)
    : requests;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#FAFAFA] min-h-screen">
      {/* En-tête Dynamique */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">
            {t('client_dashboard.requests.title', 'Mes demandes')}
          </h1>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            {t('client_dashboard.requests.subtitle', "Suivez l'état de vos négociations stratégiques")}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <Filter className="w-4 h-4 text-blue-600 ml-2" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-none bg-transparent py-2 pl-2 pr-8 text-xs font-black uppercase tracking-widest focus:ring-0 outline-none cursor-pointer"
          >
            <option value="">{t('client_dashboard.requests.filter.all', 'Tous les statuts')}</option>
            <option value="pending">{t('client_dashboard.requests.status.pending', 'En attente')}</option>
            <option value="processed">{t('client_dashboard.requests.status.processed', 'Répondu')}</option>
            <option value="closed">{t('client_dashboard.requests.status.closed', 'Clôturé')}</option>
          </select>
        </div>
      </div>

      {/* Liste des Demandes */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('client_dashboard.requests.table.date', 'Date')}</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('client_dashboard.requests.table.producer', 'Producteur')}</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('client_dashboard.requests.table.product', 'Produit')}</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('client_dashboard.requests.table.status', 'Statut')}</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">{t('client_dashboard.requests.table.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                      {new Date(req.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-black">
                        {req.producer?.company_name?.charAt(0) || "P"}
                      </div>
                      <span className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                        {req.producer?.company_name || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-700">
                    {req.product?.name || "-"}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusStyle(req.status)}`}>
                      {getStatusText(req.status)}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleView(req.id)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                      >
                        {t('client_dashboard.requests.actions.view', 'Voir')}
                      </button>
                      {req.status === "processed" && (
                        <button
                          onClick={() => handleReply(req.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                          {t('client_dashboard.requests.actions.reply', 'Répondre')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="lg:hidden divide-y divide-gray-50">
          {filteredRequests.map((req) => (
            <div key={req.id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-black">
                    {req.producer?.company_name?.charAt(0) || "P"}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900">{req.producer?.company_name || "-"}</h4>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {new Date(req.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(req.status)}`}>
                  {getStatusText(req.status)}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('client_dashboard.requests.table.product', 'Produit')}</p>
                <p className="text-xs font-bold text-gray-800">{req.product?.name || "-"}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleView(req.id)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  {t('client_dashboard.requests.actions.view', 'Voir')}
                </button>
                {req.status === "processed" && (
                  <button
                    onClick={() => handleReply(req.id)}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200"
                  >
                    {t('client_dashboard.requests.actions.reply', 'Répondre')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-300">
              <ShoppingBag size={40} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">
              {t('client_dashboard.requests.empty', 'Aucune demande stratégique')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
