import React, { useState, useEffect } from "react";
import {
  getProducerProfile, updateProducerProfile
} from "../../api/profiles";
import { useAuth } from "../../context/AuthContext";
import {
  User, Mail, Phone, MapPin, Globe, Save, Camera, Trash2, Plus, X,
  Building2, CheckCircle, Briefcase, ShieldCheck, Award,
  FileText, Activity, Map, Navigation, UploadCloud, PieChart,
  MessageCircle, BarChart3, AlertTriangle, FileCheck, Landmark,
  Clock, Check, UserPlus, Package, ChevronRight, Users
} from "lucide-react";
import { getProductImage } from "../../utils/utils";
import {
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, AreaChart, Area
} from 'recharts';

const DEFAULT_PROFILE = {
  id: null,
  activity: "",
  whatsapp: "",
  website: "",
  profilePhoto: null,
  profilePhotoPreview: null,
  logo: null,
  logoPreview: null,
  coverImage: null,
  coverImagePreview: null,
  country: "Algérie",
  city: "",
  address: "",
  latitude: "",
  longitude: "",
  moq: "",
  capacityAnnual: "",
  capacityMonthly: "",
  targetMarkets: [],
  technicalDocs: [],
  certifications: [],
  exportCategories: [],
  companyName: "",
  email: "",
  phone: "",
  contactEmail: "",
  taxId: "",
  yearEstablished: "",
  description: "",
  leadTime: "",
  incoterms: [],
  logisticsDetails: [],
};

const ProducerProfile = ({ profileData, onSave }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Local state for lists
  const [newMarket, setNewMarket] = useState("");
  const [newIncoterm, setNewIncoterm] = useState("");
  const [newLogisticsPoint, setNewLogisticsPoint] = useState("");
  const [newCert, setNewCert] = useState({ name: "", type: "", file: null });

  // Mock Data for Analytics
  const topLocations = [
    { name: 'Alger', value: 45, color: '#E31E24' },
    { name: 'Oran', value: 28, color: '#00c49f' },
    { name: 'Constantine', value: 12, color: '#ffbb28' },
    { name: 'Sétif', value: 15, color: '#ff8042' },
  ];

  const monthlyData = [
    { month: 'Jan', views: 400 },
    { month: 'Feb', views: 300 },
    { month: 'Mar', views: 600 },
    { month: 'Apr', views: 800 },
    { month: 'May', views: 700 },
    { month: 'Jun', views: 900 },
    { month: 'Jul', views: 1100 },
  ];

  const partners = [
    { id: 1, name: 'EuroFood GmbH', initial: 'EF', status: 'Active', type: 'Strategic Partner' },
    { id: 2, name: 'Organic Plus', initial: 'OP', status: 'Partner', type: 'Verified Producer' },
    { id: 3, name: 'Global Trade Co', initial: 'GT', status: 'Partner', type: 'Export Hub' },
  ];

  const activityLedger = [
    { id: 1, title: 'Global Dispatch', time: '2h ago', icon: Activity, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 2, title: 'Quote Finalized', time: '5h ago', icon: FileCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 3, title: 'Product Updated', time: 'Yesterday', icon: Package, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  const activities = ["Producteur", "Exportateur", "Producteur & Exportateur", "Service"];

  const setProfileFromData = (data) => {
    setProfile({
      id: data.id,
      activity: data.activity || "",
      whatsapp: data.whatsapp || "",
      website: data.website || "",
      profilePhoto: data.profile_photo || null,
      profilePhotoPreview: null,
      logo: data.logo || null,
      logoPreview: null,
      coverImage: data.cover_image || null,
      coverImagePreview: null,
      country: data.country || "Algérie",
      city: data.city || "",
      address: data.address || "",
      latitude: data.latitude || "",
      longitude: data.longitude || "",
      moq: data.min_export_quantity || "",
      capacityAnnual: data.yearly_capacity || "",
      capacityMonthly: data.monthly_capacity || "",
      targetMarkets: Array.isArray(data.target_markets) ? data.target_markets : [],
      technicalDocs: Array.isArray(data.tech_files) ? data.tech_files : [],
      certifications: Array.isArray(data.certifications_detail) ? data.certifications_detail : [],
      exportCategories: Array.isArray(data.export_categories) ? data.export_categories : [],
      companyName: data.company_name || "",
      email: data.email || "",
      phone: data.phone || "",
      contactEmail: data.user_email || "",
      taxId: data.nif_number || "",
      yearEstablished: data.year_established || "",
      description: data.description || "",
      leadTime: data.lead_time || "",
      incoterms: Array.isArray(data.incoterms) ? data.incoterms : [],
      logisticsDetails: Array.isArray(data.logistics_details) ? data.logistics_details : [],
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (profileData) {
        setProfileFromData(profileData);
        setLoading(false);
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await getProducerProfile('me');
        if (data) {
          setProfileFromData(data);
        } else {
          setProfile(prev => ({
            ...prev,
            email: user.email || "",
            companyName: user.company_name || user.name || "",
          }));
        }
      } catch (err) {
        console.error("❌ Erreur chargement profil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prev) => ({
        ...prev,
        [`${type}File`]: file,
        [`${type}Preview`]: reader.result
      }));
    }
    reader.readAsDataURL(file);
  };

  const handleAddMarket = () => {
    if (newMarket && !profile.targetMarkets.includes(newMarket)) {
      setProfile(prev => ({
        ...prev,
        targetMarkets: [...prev.targetMarkets, newMarket],
      }));
      setNewMarket("");
    }
  };

  const handleRemoveMarket = (mk) => {
    setProfile(prev => ({
      ...prev,
      targetMarkets: prev.targetMarkets.filter((m) => m !== mk),
    }));
  };

  const handleAddCert = () => {
    if (!newCert.name || !newCert.type || !newCert.file) {
      alert("⚠️ Tous les champs et le fichier sont obligatoires.");
      return;
    }
    setProfile(prev => ({
      ...prev,
      certifications: [...prev.certifications, { ...newCert }]
    }));
    setNewCert({ name: "", type: "", file: null });
  };

  const handleRemoveCert = (index) => {
    setProfile(prev => {
      const updated = [...prev.certifications];
      updated.splice(index, 1);
      return { ...prev, certifications: updated };
    });
  };

  const handleTechDocUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newDocs = files.map(f => ({ name: f.name, file: f, url: URL.createObjectURL(f) }));
    setProfile(prev => ({
      ...prev,
      technicalDocs: [...prev.technicalDocs, ...newDocs]
    }));
  };

  const handleRemoveTechDoc = (index) => {
    setProfile(prev => {
      const updated = [...prev.technicalDocs];
      updated.splice(index, 1);
      return { ...prev, technicalDocs: updated };
    });
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setProfile(prev => ({
            ...prev,
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6)
          }));
          alert("📍 Position détectée !");
        },
        () => alert("Impossible de détecter la position.")
      );
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      // Basic fields
      formData.append("company_name", profile.companyName || "");
      formData.append("activity", profile.activity || "");
      formData.append("email", profile.email || "");
      formData.append("phone", profile.phone || "");
      formData.append("whatsapp", profile.whatsapp || "");
      formData.append("website", profile.website || "");
      formData.append("city", profile.city || "");
      formData.append("address", profile.address || "");

      // Numeric fields optimization
      if (profile.latitude && profile.latitude !== "") formData.append("latitude", profile.latitude);
      if (profile.longitude && profile.longitude !== "") formData.append("longitude", profile.longitude);

      formData.append("min_export_quantity", profile.moq || "");
      formData.append("monthly_capacity", profile.capacityMonthly || "");
      formData.append("yearly_capacity", profile.capacityAnnual || "");
      formData.append("nif_number", profile.taxId || "");
      formData.append("year_established", profile.yearEstablished || "");
      formData.append("description", profile.description || "");

      // JSON stringification for multipart
      formData.append("target_markets", JSON.stringify(profile.targetMarkets || []));
      formData.append("country", JSON.stringify(profile.country || "Algérie"));
      formData.append("incoterms", JSON.stringify(profile.incoterms || []));
      formData.append("logistics_details", JSON.stringify(profile.logisticsDetails || []));
      formData.append("lead_time", profile.leadTime || "");

      // Files
      if (profile.logoFile) formData.append("logo", profile.logoFile);
      if (profile.profilePhotoFile) formData.append("profile_photo", profile.profilePhotoFile);
      if (profile.coverImageFile) formData.append("cover_image", profile.coverImageFile);

      const res = await updateProducerProfile(formData);
      if (res && res.data) {
        setProfileFromData(res.data);
        if (onSave) onSave(res.data);
        alert("✅ Profil enregistré avec succès !");
      }
    } catch (err) {
      console.error("❌ Save Error:", err);
      const errorDetail = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      alert(`Erreur lors de l'enregistrement : ${errorDetail}`);
    } finally {
      setSaving(false);
    }
  };

  const calculateCompletion = () => {
    const mandatoryFields = ['companyName', 'email', 'phone', 'activity', 'description', 'city', 'address', 'moq', 'capacityAnnual'];
    const filled = mandatoryFields.filter(f => profile[f] && profile[f].toString().trim() !== "").length;
    let score = (filled / mandatoryFields.length) * 70;
    if (profile.certifications?.length > 0) score += 20;
    if (profile.logo || profile.profilePhoto) score += 10;
    return Math.min(Math.round(score), 100);
  };

  const completion = calculateCompletion();
  const inputStyle = "w-full bg-[#F8FAFC] border border-red-100 rounded-2xl p-4 font-bold text-[#1a1a1a] text-sm focus:bg-white focus:border-red-500 outline-none transition-all";

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-10 h-10 border-4 border-red-100 border-t-red-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-32 max-w-7xl mx-auto px-4">
      {/* 📊 Progress Card */}
      <div className="bg-white rounded-[2rem] p-8 border border-red-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * completion) / 100} className="text-red-600 transition-all duration-1000" />
          </svg>
          <span className="absolute text-xl font-bold text-red-900">{completion}%</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-gray-900 uppercase">État du Profil : <span className={completion === 100 ? "text-green-500" : "text-amber-500"}>{completion === 100 ? "Complet" : "Incomplet"}</span></h3>
          <p className="text-sm text-gray-500 mt-2">Maximisez votre visibilité à l'international.</p>
        </div>
        <button onClick={handleSave} className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2">
          <Save size={16} /> Enregistrer
        </button>
      </div>

      {/* --- SECTION 1: IDENTITY --- */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
        <div className="relative h-64 bg-gray-100 group">
          {profile.coverImagePreview || profile.coverImage ? (
            <img src={profile.coverImagePreview || getProductImage(profile.coverImage)} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300"><Plus size={48} /></div>
          )}
          <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="text-white mb-2" />
            <span className="text-white text-xs font-bold uppercase tracking-widest">Image de couverture</span>
            <input type="file" onChange={(e) => handleImageChange(e, 'coverImage')} className="hidden" />
          </label>
        </div>

        <div className="p-10 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row items-end gap-8 mb-10">
            <div className="relative group">
              <div className="w-40 h-40 bg-white rounded-full p-2 shadow-xl border border-gray-100 overflow-hidden">
                {profile.profilePhotoPreview || profile.profilePhoto ? (
                  <img src={profile.profilePhotoPreview || getProductImage(profile.profilePhoto)} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-200"><User size={64} /></div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 p-3 bg-red-600 rounded-full text-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Camera size={20} /><input type="file" onChange={(e) => handleImageChange(e, 'profilePhoto')} className="hidden" />
              </label>
            </div>

            <div className="relative group">
              <div className="w-24 h-24 bg-white rounded-2xl p-1 shadow-lg border border-gray-100 overflow-hidden">
                {profile.logoPreview || profile.logo ? (
                  <img src={profile.logoPreview || getProductImage(profile.logo)} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-200"><Building2 size={24} /><span className="text-[8px] font-bold mt-1">Logo</span></div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-2 bg-gray-800 rounded-full text-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Camera size={14} /><input type="file" onChange={(e) => handleImageChange(e, 'logo')} className="hidden" />
              </label>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold">Nom de l'entreprise</label>
                  <input type="text" name="companyName" value={profile.companyName || ""} onChange={handleInputChange} className={inputStyle} placeholder="Nom officiel..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold">Activité</label>
                  <select name="activity" value={profile.activity} onChange={handleInputChange} className={inputStyle}>
                    <option value="">Sélectionner...</option>
                    {activities.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold">Identifiant Fiscal (NIF)</label>
                  <input type="text" name="taxId" value={profile.taxId || ""} onChange={handleInputChange} className={inputStyle} placeholder="NIF..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold">Année de Création</label>
                  <input type="text" name="yearEstablished" value={profile.yearEstablished || ""} onChange={handleInputChange} className={inputStyle} placeholder="Ex: 1995" />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold">ADN & Présentation</label>
            <textarea name="description" value={profile.description || ""} onChange={handleInputChange} rows={4} className={`${inputStyle} resize-none rounded-[1.5rem]`} placeholder="Décrivez votre expertise..." />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- SECTION 2: CONTACT --- */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
          <h3 className="flex items-center gap-3 text-lg font-black text-red-900 uppercase tracking-widest pb-4 border-b border-gray-100">
            <Phone className="text-red-500" /> Contact & Réseaux
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold">Email Pro</label>
              <input type="email" value={profile.email || ""} disabled className={inputStyle + " opacity-60 bg-gray-50 cursor-not-allowed"} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold">Téléphone</label>
              <input type="tel" name="phone" value={profile.phone || ""} onChange={handleInputChange} className={inputStyle} placeholder="+213..." />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold flex items-center gap-2"><MessageCircle size={12} className="text-green-500" /> WhatsApp</label>
              <input type="tel" name="whatsapp" value={profile.whatsapp || ""} onChange={handleInputChange} className={inputStyle} placeholder="+213..." />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold flex items-center gap-2"><Globe size={12} className="text-red-500" /> Site Web</label>
              <input type="url" name="website" value={profile.website || ""} onChange={handleInputChange} className={inputStyle} placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* --- SECTION 3: LOCATION --- */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="flex items-center gap-3 text-lg font-black text-red-900 uppercase tracking-widest">
              <MapPin className="text-red-500" /> Localisation
            </h3>
            <button onClick={detectLocation} type="button" className="flex items-center gap-2 text-red-600 font-bold text-[10px] uppercase tracking-widest hover:underline">
              <Navigation size={14} /> Detect
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold">Pays</label>
              <select name="country" value={typeof profile.country === 'object' ? profile.country.label : profile.country} onChange={handleInputChange} className={inputStyle}>
                <option value="Algérie">Algérie</option>
                <option value="Tunisie">Tunisie</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold">Ville</label>
              <input type="text" name="city" value={profile.city || ""} onChange={handleInputChange} className={inputStyle} placeholder="Ex: Alger" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold">Adresse</label>
              <input type="text" name="address" value={profile.address || ""} onChange={handleInputChange} className={inputStyle} placeholder="Zone Industrielle..." />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- SECTION 4: CAPACITY --- */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
          <h3 className="flex items-center gap-3 text-lg font-black text-red-900 uppercase tracking-widest pb-4 border-b border-gray-100">
            <BarChart3 className="text-red-500" /> Capacité & Marchés
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold">MOQ</label>
              <input type="text" name="moq" value={profile.moq || ""} onChange={handleInputChange} className={inputStyle} placeholder="Ex: 100 unités" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold">Capacité Mensuelle</label>
              <input type="text" name="capacityMonthly" value={profile.capacityMonthly || ""} onChange={handleInputChange} className={inputStyle} placeholder="Ex: 50T" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold">Capacité Annuelle</label>
              <input type="text" name="capacityAnnual" value={profile.capacityAnnual || ""} onChange={handleInputChange} className={inputStyle} placeholder="Ex: 600T" />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold">Marchés Cibles</label>
            <div className="flex flex-wrap gap-2">
              {profile.targetMarkets.map((m, i) => (
                <span key={i} className="bg-red-50 text-red-800 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
                  {typeof m === 'object' ? m.label : m} <button onClick={() => handleRemoveMarket(m)}><X size={14} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <select value={newMarket} onChange={e => setNewMarket(e.target.value)} className={inputStyle + " flex-1"}>
                <option value="">Ajouter...</option>
                <option value="Europe">Europe</option><option value="Afrique">Afrique</option>
                <option value="Moyen-Orient">Moyen-Orient</option><option value="Amérique">Amérique</option>
              </select>
              <button onClick={handleAddMarket} className="bg-red-600 text-white px-6 rounded-2xl font-bold">OK</button>
            </div>
          </div>
        </div>

        {/* --- SECTION 5: DOCS --- */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
          <h3 className="flex items-center gap-3 text-lg font-black text-red-900 uppercase tracking-widest pb-4 border-b border-gray-100">
            <ShieldCheck className="text-red-500" /> Certifications & Documents
          </h3>
          <div className="space-y-4">
            {profile.certifications.map((cert, idx) => (
              <div key={idx} className="flex items-center justify-between bg-green-50 p-3 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <FileCheck size={16} className="text-green-600" /><span className="font-bold text-xs text-green-900">{cert.name}</span>
                </div>
                <button onClick={() => handleRemoveCert(idx)} className="text-red-400"><X size={14} /></button>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <input type="text" placeholder="Nom Certification" value={newCert.name} onChange={e => setNewCert({ ...newCert, name: e.target.value })} className={inputStyle} />
              <select value={newCert.type} onChange={e => setNewCert({ ...newCert, type: e.target.value })} className={inputStyle}>
                <option value="">Type...</option><option value="Qualité">Qualité</option><option value="Bio">Bio</option>
              </select>
              <label className="col-span-2 flex items-center justify-center gap-2 bg-gray-50 border border-dashed border-gray-200 p-4 rounded-xl cursor-pointer hover:bg-white transition-colors">
                <UploadCloud size={16} className="text-red-500" />
                <span className="text-[10px] font-bold text-gray-500">{newCert.file ? newCert.file.name : "Fichier Preuve (obligatoire)"}</span>
                <input type="file" onChange={e => setNewCert({ ...newCert, file: e.target.files[0] })} className="hidden" />
              </label>
              <button onClick={handleAddCert} className="col-span-2 py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-shadow">Ajouter</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 6: LOGISTICS --- */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
        <h3 className="flex items-center gap-3 text-lg font-black text-red-900 uppercase tracking-widest pb-4 border-b border-gray-100">
          <Package size={20} className="text-red-500" /> Gestion de la Logistique
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Lead Time & Incoterms */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold flex items-center gap-2">
                <Clock size={12} className="text-red-500" /> Temps de traitement moyen
              </label>
              <input
                type="text"
                name="leadTime"
                value={profile.leadTime || ""}
                onChange={handleInputChange}
                className={inputStyle}
                placeholder="Ex: 14 Jours"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold">Incoterms Acceptés</label>
              <div className="flex flex-wrap gap-2">
                {(profile.incoterms || []).map((inc, i) => (
                  <span key={i} className="bg-red-50 text-red-800 px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-2">
                    {inc} <button onClick={() => setProfile(prev => ({ ...prev, incoterms: prev.incoterms.filter(x => x !== inc) }))}><X size={12} /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={newIncoterm}
                  onChange={e => setNewIncoterm(e.target.value)}
                  className={inputStyle + " flex-1"}
                >
                  <option value="">Ajouter un incoterm...</option>
                  {["EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP", "FAS", "FOB", "CFR", "CIF"].map(x => (
                    <option key={x} value={x}>{x}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    if (newIncoterm && !profile.incoterms.includes(newIncoterm)) {
                      setProfile(prev => ({ ...prev, incoterms: [...prev.incoterms, newIncoterm] }));
                      setNewIncoterm("");
                    }
                  }}
                  className="bg-red-600 text-white px-6 rounded-2xl font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Logistics Details (Points) */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest pl-2 font-bold flex items-center gap-2">
              <Building2 size={12} className="text-red-500" /> Infrastructures & Points Forts Logistiques
            </label>
            <div className="space-y-3">
              {(profile.logisticsDetails || []).map((point, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-100 p-4 rounded-2xl group transition-all hover:bg-white">
                  <span className="text-xs font-bold text-gray-700">{point}</span>
                  <button
                    onClick={() => setProfile(prev => ({ ...prev, logisticsDetails: prev.logisticsDetails.filter((_, idx) => idx !== i) }))}
                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newLogisticsPoint}
                onChange={e => setNewLogisticsPoint(e.target.value)}
                className={inputStyle + " flex-1"}
                placeholder="Ex: Entrepôt de 5000m², Proximité Port d'Alger, Stockage climatisé..."
              />
              <button
                onClick={() => {
                  if (newLogisticsPoint) {
                    setProfile(prev => ({ ...prev, logisticsDetails: [...prev.logisticsDetails, newLogisticsPoint] }));
                    setNewLogisticsPoint("");
                  }
                }}
                className="bg-[#050B18] text-white px-6 rounded-2xl font-bold"
              >
                Ajouter
              </button>
            </div>
            <p className="text-[9px] text-gray-400 font-medium pl-2 italic">* Expliquez ici vos avantages : stockage, localisation stratégique, rapidité, équipements spéciaux.</p>
          </div>
        </div>
      </div>

      {/* 🚀 PERFORMANCE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <h3 className="flex items-center gap-3 text-lg font-black text-red-900 uppercase tracking-widest mb-8"><PieChart className="text-red-500" /> Top Locations</h3>
          <div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><RePieChart><Pie data={topLocations} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">{topLocations.map((entry, index) => <Cell key={index} fill={entry.color} />)}</Pie><ReTooltip /></RePieChart></ResponsiveContainer></div>
        </div>
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <h3 className="flex items-center gap-3 text-lg font-black text-red-900 uppercase tracking-widest mb-8"><Activity className="text-red-500" /> Performance</h3>
          <div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis hide /><ReTooltip /><Area type="monotone" dataKey="views" stroke="#E31E24" fill="#eef2ff" /></AreaChart></ResponsiveContainer></div>
        </div>
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <h3 className="flex items-center gap-3 text-lg font-black text-red-900 uppercase tracking-widest mb-8"><Users className="text-red-500" /> Partenaires</h3>
          <div className="space-y-4">
            {partners.map(p => (
              <div key={p.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                <span className="font-bold text-sm">{p.name}</span>
                <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-3 py-1 rounded-full">{p.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <h3 className="flex items-center gap-3 text-lg font-black text-red-900 uppercase tracking-widest mb-8"><Activity className="text-red-500" /> Ledger</h3>
          <div className="space-y-6">
            {activityLedger.map(a => {
              const Icon = a.icon;
              return (
                <div key={a.id} className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${a.bg} ${a.color}`}><Icon size={16} /></div>
                  <div className="flex-1"><h4 className="font-bold text-sm">{a.title}</h4><span className="text-[10px] text-gray-400 font-bold uppercase">{a.time}</span></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <button onClick={handleSave} disabled={saving} className="bg-[#050B18] text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all">
          {saving ? "Sauvegarde..." : <><Save size={18} className="text-red-400" /> Sauvegarder mon profil</>}
        </button>
      </div>
    </div>
  );
};

export default ProducerProfile;
