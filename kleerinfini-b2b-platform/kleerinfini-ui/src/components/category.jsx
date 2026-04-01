import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Factory, Grape, HardHat, Pill, Loader2, Wrench, Tv, Zap, Leaf, Sparkles, Utensils, Droplets, Coffee, Gem, Trees, Layers, ShieldCheck, Tractor } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';
import { getProductImage } from "../utils/utils";
import { BASE_HOST } from "../api/axios";

export default function CategorySection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('categories/');
        // Assume backend returns an array of category objects { id, name, image, description }
        const data = response.data.results || response.data || [];
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Mock fallback
        setCategories([
          { id: 1, name: t("home.categories.items.beauty"), description: t("home.categories.card.description_default") },
          { id: 2, name: t("home.categories.sectors.fishery"), description: t("home.categories.card.description_default") },
          { id: 3, name: t("home.categories.sectors.pharma_medical"), description: t("home.categories.card.description_default") },
          { id: 5, name: t("home.categories.sectors.perfumes"), description: t("home.categories.card.description_default") },
          { id: 4, name: t("home.categories.items.agri_raw"), description: t("home.categories.card.description_default") }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Icon mapping as fallback
  const getIcon = (slug) => {
    if (slug?.includes('agri')) return <Grape size={18} />;
    if (slug?.includes('machine') || slug?.includes('indus')) return <Factory size={18} />;
    if (slug?.includes('construction')) return <HardHat size={18} />;
    if (slug?.includes('pharma') || slug?.includes('medici')) return <Pill size={18} />;
    return <ArrowUpRight size={18} />;
  };

  // Diverse Elite Fallbacks
  const eliteFallbacks = [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800", // Agri
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800", // Indus
    "https://images.unsplash.com/photo-1541888941259-79974ec1896d?q=80&w=800", // Construction
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800", // Solar
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800", // Tech
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800", // Luxury
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800", // Fashion
    "https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=800", // Food
  ];

  // Image URL helper using centralized logic
  const getImageUrl = (category, index) => {
    if (category && (category.image_url || category.image)) {
      const url = getProductImage(category.image_url || category.image, 0, category);
      if (url && !url.includes('placeholder.png')) {
        return url;
      }
    }
    return eliteFallbacks[index % eliteFallbacks.length];
  };

  return (
    <section className="py-16 md:py-32 bg-[#080808] relative overflow-hidden border-t border-white/5">
      {/* Cinematic Auras */}
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#FF6600]/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12 md:mb-24 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center gap-6"
          >
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-[1px] bg-white/10 group-hover:w-20 group-hover:bg-[#FF6600] transition-all duration-700"></div>
              <p className="text-white font-bold uppercase tracking-[0.8em] text-[11px] font-cinzel">
                {t("home.categories.elite_sectors")}
              </p>
              <div className="w-12 h-[1px] bg-white/10 group-hover:w-20 group-hover:bg-[#FF6600] transition-all duration-700"></div>
            </div>

            <h2 className="text-5xl md:text-8xl font-display-luxury text-white leading-tight tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FF6600] to-[#D4AF37] font-serif-luxury italic font-light">{t("home.categories.subtitle")}</span>
            </h2>

            <div className="w-[100px] h-[1px] bg-gradient-to-r from-transparent via-[#FF6600]/50 to-transparent"></div>

            <p className="!text-white font-serif-luxury italic max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              {t("home.categories.desc_excellence")}
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#FF6600]" size={32} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {categories
                .filter(cat => {
                  const name = cat.name?.replace(/\s*:\s*$/, '').trim();
                  return [
                    "Produits Cosmétiques", "Cosmétique", "Cosmetics",
                    "Parfums & Eaux de Parfum", "Parfum", "Perfume",
                    "Produits de la pêche & Aquaculture", "Fishery",
                    "Produits Pharmaceutiques & Médicaux", "Pharmaceutical"
                  ].some(term => name.includes(term));
                })
                .map((category, index) => {
                  let displayName = category.name?.replace(/\s*:\s*$/, '') || t("home.categories.sector_default");

                  if (displayName.includes("Cosmétique") || displayName.includes("Cosmetic")) displayName = t("home.categories.sectors.cosmetic_products") || "Cosmétiques";
                  if (displayName.includes("Parfum") || displayName.includes("Perfume")) displayName = t("home.categories.sectors.perfumes") || "Parfums";
                  if (displayName.includes("pêche") || displayName.includes("Fishery")) displayName = t("home.categories.sectors.fishery") || "Pêche";
                  if (displayName.includes("Pharmaceutique") || displayName.includes("Pharmaceutical")) displayName = t("home.categories.sectors.pharma_medical") || "Pharma";

                  const imageSrc = getImageUrl(category, index);

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative h-[420px] overflow-hidden rounded-[2.5rem] cursor-pointer bg-[#111] border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-1000"
                    >
                      {/* Image Layer with Luxury Gradient */}
                      <div className="absolute inset-0 w-full h-full overflow-hidden">
                        <img
                          src={imageSrc}
                          alt={displayName}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-110"
                          style={{ filter: 'saturate(1.2)' }}
                        />
                        {/* Multi-layered Gradient for Depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-black/20 to-transparent opacity-90 transition-opacity duration-700"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-10 flex flex-col justify-between z-20">
                        {/* Elite Badge */}
                        <div className="flex justify-between items-start translate-y-[-20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                          <div className="px-5 py-2 rounded-full glass-effect border border-white/10 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></div>
                            <span className="text-[9px] font-bold text-white uppercase tracking-[0.3em] font-outfit">{t("home.categories.premium_badge")}</span>
                          </div>
                          <div className="w-12 h-12 rounded-full glass-effect flex items-center justify-center text-white/50 border border-white/10 group-hover:border-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-all duration-700">
                            <ArrowUpRight size={22} className="group-hover:rotate-45 transition-transform duration-500" />
                          </div>
                        </div>

                        {/* Information Section */}
                        <div className="space-y-6 transform translate-y-12 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]">
                          {/* Icon with Gold Aura */}
                          <div className="w-16 h-16 rounded-2xl bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/5 flex items-center justify-center text-[#D4AF37] group-hover:text-white group-hover:bg-[#FF6600] transition-all duration-700 shadow-2xl">
                            {getIcon(category.slug)}
                          </div>

                          <div className="space-y-3">
                            <h3 className="text-2xl font-serif-luxury text-white group-hover:text-[#D4AF37] transition-colors leading-[1.2] tracking-normal">
                              {displayName}
                            </h3>

                            <div className="w-0 group-hover:w-full h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent transition-all duration-1000"></div>

                            <p className="text-[13px] text-white/50 font-light leading-relaxed max-w-[280px] line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-100">
                              {category.description || t("categories.card.description_default")}
                            </p>
                          </div>

                          <div className="pt-2 opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-300">
                            <div className="inline-flex items-center gap-3 text-[10px] font-bold text-white/80 uppercase tracking-[0.4em] group-hover:text-[#D4AF37] transition-colors">
                              {t("home.categories.sector_details")}
                              <div className="w-8 h-[1px] bg-white/20 group-hover:bg-[#D4AF37] transition-all duration-500"></div>
                            </div>
                          </div>
                        </div>
                      </div>


                    </motion.div>
                  );
                })}
            </div>

            {/* Secondary Categories Grid - Discrete & Elegant */}
            <div className="mt-10 md:mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 px-2 md:px-4">
              {[
                { key: "construction", keywords: ["construction"], icon: <HardHat size={20} /> },
                { key: "mecanique", keywords: ["mécanique", "mechanical"], icon: <Wrench size={20} /> },
                { key: "electro", keywords: ["électroménager", "électronique", "appliance", "electronic"], icon: <Tv size={20} /> },
                { key: "industrial", keywords: ["machine", "industriel", "machinery"], icon: <Factory size={20} /> },
                { key: "elec", keywords: ["électrique", "electrical"], icon: <Zap size={20} /> },
                { key: "agri_raw", keywords: ["Agricoles Non Transformés", "unprocessed"], icon: <Leaf size={20} /> },
                { key: "agri_processed", keywords: ["Agroalimentaires Transformés", "processed"], icon: <Utensils size={20} /> },
                { key: "beauty", keywords: ["Beauté Naturels", "beauty"], icon: <Sparkles size={20} /> },
                { key: "spices", keywords: ["Épices", "Thés", "spices", "tea"], icon: <Coffee size={20} /> },
                { key: "dairy", keywords: ["Laitiers", "dairy"], icon: <Droplets size={20} /> },
                { key: "jewelry_fashion", keywords: ["Bijoux", "L’Éclat de l’Algérie", "jewelry"], icon: <Gem size={20} /> },
                { key: "wood_derivatives", keywords: ["bois", "wood"], icon: <Trees size={20} /> },
                { key: "industrial_construction", keywords: ["inox", "aluminium", "pvc", "industriels"], icon: <Layers size={20} /> },
                { key: "juice_drinks", keywords: ["jus", "boissons", "juice", "drinks"], icon: <Utensils size={20} /> },
                { key: "plastic_ppe", keywords: ["plastiques", "ppe", "plastic"], icon: <ShieldCheck size={20} /> },
                { key: "agri_machinery", keywords: ["machines agricoles", "équipements agricoles"], icon: <Tractor size={20} /> },
                { key: "hydraulic_systems", keywords: ["hydraulique", "hydraulic", "systèmes hydrauliques"], icon: <Droplets size={20} /> },
                { key: "solar_energy_full", keywords: ["solaire", "solar", "énergie du soleil"], icon: <Zap size={20} /> },
                { key: "mining_metallurgy", keywords: ["minier", "métallurgique", "mining", "metallurgy"], icon: <HardHat size={20} /> },
                { key: "furniture_decoration", keywords: ["meuble", "décoration", "furniture", "decoration"], icon: <Layers size={20} /> }
              ].map((item, idx) => {
                const catName = t(`home.categories.items.${item.key}`);

                // Find category by keyword match
                const category = categories.find(c => {
                  const cName = c.name?.toLowerCase() || "";
                  return item.keywords.some(k => {
                    const kw = k.toLowerCase();
                    // Special case for "Bois": use word boundary to avoid partial match with "Boissons"
                    if (kw === "bois") {
                      const regex = new RegExp(`\\b${kw}\\b`, 'i');
                      return regex.test(cName);
                    }
                    return cName.includes(kw);
                  });
                }) || { name: catName };

                // Icon mapping (simplified using the icon property from the array)
                const icon = item.icon || <Factory size={20} />;

                // Use item specific image, or backend image, else fallback
                const imageSrc = item.image || (category.id ? getImageUrl(category, idx + 8) : "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600");

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx, duration: 0.8, ease: "easeOut" }}
                    className="group relative aspect-square bg-[#0A0A0A] border border-white/5 hover:border-[#D4AF37]/40 rounded-[1.5rem] overflow-hidden flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-500 shadow-lg hover:shadow-[#D4AF37]/10"
                  >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                      <img
                        src={imageSrc}
                        alt={catName}
                        className="w-full h-full object-cover opacity-100 group-hover:scale-110 transition-transform duration-700"
                        style={{ filter: 'saturate(1.3)' }}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                    </div>

                    <div className="relative z-10 mb-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/50 group-hover:text-[#D4AF37] group-hover:bg-[#D4AF37]/20 transition-all duration-500 border border-white/5 group-hover:border-[#D4AF37]/30">
                      {icon}
                    </div>

                    <h4 className="relative z-10 text-[13px] md:text-[14px] font-bold text-white group-hover:text-[#D4AF37] transition-colors duration-300 font-outfit uppercase tracking-wider leading-tight">
                      {catName}
                    </h4>
                  </motion.div>
                )
              })}
            </div>

            {/* View More Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-12 md:mt-20 flex justify-center"
            >
              <button
                onClick={() => navigate("/categories")}
                className="group relative px-10 py-4 bg-transparent border border-[#D4AF37]/30 rounded-full overflow-hidden transition-all duration-500 hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FF6600] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                <div className="relative flex items-center gap-3">
                  <span className="text-xs font-bold text-[#D4AF37] group-hover:text-white uppercase tracking-[0.4em] transition-colors duration-500">
                    {t("home.categories.explore_more")}
                  </span>
                  <ArrowUpRight size={18} className="text-[#D4AF37] group-hover:text-white transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
