import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { getDashboard, updateDashboard } from "../api/dashboard";
import { getProducerProfile } from "../api/profiles";
import { getProductsByProducer, createProduct, updateProduct, deleteProduct } from "../api/products";
import { getCategories } from "../api/categories";
import { useAuth } from "../context/AuthContext";
import realTimeService from "../services/RealTimeService";

import SidebarProducer from "../components/Producer/SidebarProducer";
import RightPanel from "../components/Producer/RightPanel";
import ProducerTopBar from "../components/Producer/ProducerTopBar";
import ProducerProfile from "../components/Producer/ProducerProfile";
import ProducerProductForm from "../components/Producer/ProducerProductForm";
import DashboardHeader from "../components/Producer/DashboardHeader";
import StatsBox from "../components/Producer/StatsBox";
import DetailedStatistics from "../components/Producer/DetailedStatistics";
import ActivityLog from "../components/Producer/ActivityLog";

// Components
import Messages from "../components/Producer/Messages";
import QuoteRequests from "../components/Producer/QuoteRequests";
import ProductCard from "../components/Producer/ProductCard";
import PaymentStatusCard from "../components/Producer/PaymentStatusCard";
import UploadDocumentForm from "../components/Producer/UploadDocumentForm";

import {
  Package, Plus, User, ArrowRight, LayoutDashboard, Zap, Globe, ChevronRight, PlusCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ExportHubDashboard from "../export-hub/ExportHubDashboard";
import FSPECalculator from "../export-hub/components/FSPECalculator";
import LegalWatch from "../export-hub/components/LegalWatch";
import ISONorms from "../export-hub/components/ISONorms";

// ProducerDashboard Loaded


import profileBg from '../assets/card_profile_bg.png';
import productsBg from '../assets/card_products_bg.png';
import companyProfileBg from '../assets/company_profile_bg.png';

const ProducerDashboard = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [demands, setDemands] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [producerProfile, setProducerProfile] = useState(null);
  const [categories, setCategories] = useState([]);

  // Product Form State
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Guard to prevent infinite loops
  const hasFetched = React.useRef(false);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      if (authLoading || !user) return;
      // Fetching Dashboard Data

      try {
        // Use the new stable 'me' endpoint for profile
        const profile = await getProducerProfile('me');

        if (!profile) {
          console.warn("No producer profile found for session");
          return;
        }
        setProducerProfile(profile);

        // Fetch dashboard, products, and categories using 'me' (token identity)
        const [dashboardData, productsData, categoriesData] = await Promise.all([
          getDashboard('me'),
          getProductsByProducer('me'),
          getCategories()
        ]);

        setMessages(dashboardData.messages || []);
        setDemands(dashboardData.demands || []);
        setProducts(productsData || []);
        setCategories(categoriesData || []);

        // Debug: Log categories to console
        console.log("📦 Categories fetched from backend:", categoriesData);

      } catch (err) {
        console.error("Dashboard Stabilization Failure:", err);
        hasFetched.current = false; // Allow retry on failure

        // Fallback cleanup
        setProducerProfile(null);
        setMessages([]);
        setDemands([]);
        setProducts([]);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, [user?.id, authLoading]);

  // Real-time updates
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const cleanup = realTimeService.addListener((data) => {
      console.log("📢 ProducerDashboard received real-time data:", data);

      if (data.type === 'notification' && data.notification_type === 'new_quote_request') {
        const newDemand = data.data;
        setDemands(prev => [newDemand, ...prev]);

        // Show notification (simple alert for now or custom toast if available)
        // Check if there's a notification system in the UI
        console.log("✅ New Quote Request Alert!");
      }

      if (data.type === 'chat.message') {
        // Update messages stats
        setMessages(prev => [data.message, ...prev]);
      }
    });

    return () => cleanup();
  }, [isAuthenticated, user]);

  // Product Handlers
  const handleProductSubmit = async (formData) => {
    if (!producerProfile) return alert(t('producer_dashboard.products.profileNotFound', "Profil producteur introuvable."));

    if (!producerProfile.is_approved && !formData.id) {
      return alert(t('producer_dashboard.products.waitingValidation', "Votre compte est en attente de validation. Vous ne pouvez pas encore ajouter de produits publics."));
    }

    try {
      const formPayload = new FormData();

      // Mapping des champs front -> back
      formPayload.append("name", formData.name || "");
      formPayload.append("category_id", formData.category || ""); // Reverted to category_id
      formPayload.append("producer", producerProfile.id);

      formPayload.append("desc_courte", formData.shortDesc || "");
      formPayload.append("desc_longue", formData.longDesc || "");
      formPayload.append("description", formData.longDesc || ""); // Facultatif si desc_longue est utilisé

      formPayload.append("cle_min", formData.moq || "");
      formPayload.append("prix_indicatif", formData.price || "");
      formPayload.append("currency", formData.currency || "USD");
      formPayload.append("delai_production", formData.productionDelay || "");

      formPayload.append("region_org", formData.originRegion || "");
      formPayload.append("langue_du_product", formData.language || "fr");
      formPayload.append("est_pret", formData.isReady ? "true" : "false");

      // Gestion des fichiers
      if (formData.fiche_tech instanceof File) formPayload.append("fiche_tech", formData.fiche_tech);
      if (formData.video instanceof File) formPayload.append("video", formData.video);
      if (formData.catalogue instanceof File) formPayload.append("catalogue", formData.catalogue);

      // Ajout des certifications multiples
      if (formData.certification_files && formData.certification_files.length > 0) {
        formData.certification_files.forEach((file) => {
          if (file instanceof File) {
            formPayload.append("certification_files", file);
          }
        });
      }

      // Legacy support check (optional since we have multi-upload now)
      if (formData.certification instanceof File) {
        formPayload.append("certification_file", formData.certification);
      }

      // Images multiples
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((img) => {
          if (img.file instanceof File) {
            formPayload.append("images", img.file);
          }
        });
      }

      let res;
      if (formData.id) {
        res = await patchProduct(formData.id, formPayload);
      } else {
        res = await createProduct(formPayload);
      }

      if (res) {
        const productsData = await getProductsByProducer('me');
        setProducts(productsData || []);
        setIsProductFormOpen(false);
        setEditingProduct(null);
        alert(t('producer_dashboard.products.successSave', "✅ Produit enregistré avec succès !"));
      }
    } catch (err) {
      console.error("Error saving product:", err);
      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);
      }
      let errorMsg = t('producer_dashboard.products.errorSave', "Erreur lors de la sauvegarde du produit.");
      if (err.response && err.response.data) {
        // Formatage d'erreur DRF
        errorMsg += "\n" + JSON.stringify(err.response.data, null, 2);
      }
      alert(errorMsg);
    }
  };

  const handleEditProduct = (id) => {
    const prod = products.find((p) => p.id === id);
    if (prod) {
      setEditingProduct(prod);
      setIsProductFormOpen(true);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm(t('producer_dashboard.products.confirmDelete', "Êtes-vous sûr de vouloir supprimer ce produit ?"))) {
      const success = await deleteProduct(id);
      if (success) {
        setProducts(products.filter(p => p.id !== id));
      }
    }
  };


  // --- VIEWS ---

  const HomeView = () => (
    <div className="space-y-10 animate-in fade-in duration-700">
      <DashboardHeader
        documents={documents}
        producerProfile={producerProfile}
        onAddProductClick={() => { setEditingProduct(null); setIsProductFormOpen(true); }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Row 1: Actionable Cards */}
        <div className="lg:col-span-2 group relative bg-[#111827] rounded-[3rem] p-12 shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden min-h-[300px]"
          onClick={() => navigate('/producer-dashboard/profile')}>
          <img src={companyProfileBg} alt="Profile" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="relative z-20 h-full flex flex-col justify-end">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 border border-white/20">
              <User size={28} />
            </div>
            <h3 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter leading-tight truncate mb-4">
              {producerProfile?.company_name || t('producer_dashboard.profile.companyName', 'Profil Entreprise')}
            </h3>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-fit">
              <p className="text-white font-bold text-sm">{t('producer_dashboard.home.completeProfile', 'Compléter votre profil')}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 group relative bg-[#0B1221] rounded-[3rem] p-12 shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden min-h-[300px]"
          onClick={() => navigate('/producer-dashboard/products')}>
          <img src={productsBg} alt="Products" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="relative z-20 h-full flex flex-col justify-end">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 border border-white/20">
              <Package size={28} />
            </div>
            <h3 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter leading-tight mb-4">
              {t('producer_dashboard.sidebar.products', 'Gestion des Produits')}
            </h3>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-fit">
              <p className="text-white font-bold text-sm">{t('producer_dashboard.home.manageCatalog', 'Gérez votre catalogue export')}</p>
            </div>
          </div>
        </div>

        {/* Pulse: Vital Stats (Integrated in grid) */}
        <div className="lg:col-span-4 py-4">
          <StatsBox
            products={products}
            messages={messages}
            demands={demands}
            producerProfile={producerProfile}
            setActiveTab={() => { }}
          />
        </div>
      </div>
    </div>
  );

  const ProductsView = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#1A1D23] tracking-tighter uppercase mb-2">
            {t('producer_dashboard.products.title', 'Inventaire International')}
          </h1>
          <p className="text-gray-500 font-bold text-sm tracking-tight uppercase">
            {t('producer_dashboard.products.subtitle', "Gérez votre catalogue d'exportation")}
          </p>
        </div>
        <button
          onClick={() => {
            if (!producerProfile?.is_approved) {
              return alert(t('producer_dashboard.products.approvalRequired', "Votre compte doit être validé par un administrateur avant de pouvoir ajouter des produits."));
            }
            setEditingProduct(null);
            setIsProductFormOpen(true);
          }}
          className={`flex items-center gap-3 px-8 py-4 ${producerProfile?.is_approved ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-95`}
        >
          <PlusCircle size={18} /> {t('producer_dashboard.products.addProduct', 'Ajouter un produit')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            isOwner={true}
            onEdit={() => handleEditProduct(product.id)}
            onDelete={() => handleDeleteProduct(product.id)}
          />
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white rounded-3xl border border-slate-200 flex items-center justify-center text-blue-400 mb-6 shadow-sm">
              <Plus size={40} />
            </div>
            <p className="text-xl font-extrabold text-[#050B18] tracking-tight">{t('producer_dashboard.home.noProducts', 'Aucun produit au catalogue')}</p>
            <p className="text-base text-gray-600 font-medium mt-2 max-w-sm">{t('producer_dashboard.home.noProductsDesc', "Commencez par ajouter votre premier produit pour devenir visible à l'international.")}</p>
            <button
              onClick={() => {
                if (!producerProfile?.is_approved) {
                  return alert(t('producer_dashboard.products.approvalRequired', "Votre compte doit être validé par un administrateur avant de pouvoir ajouter des produits."));
                }
                setEditingProduct(null);
                setIsProductFormOpen(true);
              }}
              className={`mt-8 px-8 py-3.5 ${producerProfile?.is_approved ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20`}
            >
              {t('producer_dashboard.products.addProduct', 'Ajouter un produit')}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white font-inter relative selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transform md:translate-x-0 transition duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarProducer unreadCount={messages.filter(m => !m.read).length} />
      </div>

      <div className="flex-1 md:pl-52 flex min-w-0 transition-all duration-300 relative z-10 overflow-y-auto h-screen scrollbar-hide">
        <div className="flex-1 flex min-w-0 bg-[#F8FAFC]">

          <div className="flex-1 flex flex-col min-w-0">
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm">
              <ProducerTopBar onMenuClick={() => setIsSidebarOpen(true)} />
            </div>

            <main className="flex-1 p-4 md:p-8 lg:p-10 w-full overflow-x-hidden">
              <Routes>
                <Route index element={<HomeView />} />
                <Route path="home" element={<HomeView />} />
                <Route path="dashboard" element={<HomeView />} />
                <Route path="products" element={<ProductsView />} />
                <Route path="profile" element={<ProducerProfile profileData={producerProfile} onSave={(data) => setProducerProfile(data)} />} />
                <Route path="demands" element={<QuoteRequests demands={demands} setDemands={setDemands} />} />
                <Route path="messages" element={<Messages messages={messages} setMessages={setMessages} />} />
                <Route path="statistics" element={<DetailedStatistics products={products} profile={producerProfile} />} />
                <Route path="documents" element={<UploadDocumentForm documents={documents} setDocuments={setDocuments} />} />
                <Route path="activity" element={<ActivityLog />} />
                <Route path="hub" element={<ExportHubDashboard />} />
                <Route path="calculator" element={<FSPECalculator />} />
                <Route path="legal-watch" element={<LegalWatch />} />
                <Route path="iso-norms" element={<ISONorms />} />
                <Route path="payments" element={<PaymentStatusCard documents={documents} setDocuments={setDocuments} subscription={producerProfile?.subscription} />} />
                <Route path="*" element={<Navigate to="/producer-dashboard/home" replace />} />
              </Routes>
            </main>
          </div>

          <RightPanel />
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isProductFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductFormOpen(false)}
              className="absolute inset-0 bg-[#1a1a1a]/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-6xl h-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <ProducerProductForm
                product={editingProduct}
                categories={categories}
                onCancel={() => setIsProductFormOpen(false)}
                onSubmit={handleProductSubmit}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProducerDashboard;
