import React, { useState, useEffect, useRef } from "react";
import { MapPin, Loader2, Search, Filter, Briefcase, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import api from '../api/axios';
import CustomSelect from './CustomSelect';

export default function SearchSection({ onSearch, onOpenMap }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [label, setLabel] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('categories/');
        const data = response.data.results || response.data || [];
        setCategories(data.map(cat => ({ value: cat.name, label: cat.name })));
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to initial hardcoded list
        setCategories([
          { value: t("home.categories.items.elec"), label: t("home.categories.items.elec") },
          { value: t("home.categories.items.agri_raw"), label: t("home.categories.items.agri_raw") },
          { value: t("home.categories.sectors.fishery"), label: t("home.categories.sectors.fishery") },
          { value: t("home.categories.sectors.mining_metallurgy"), label: t("home.categories.sectors.mining_metallurgy") },
          { value: t("home.categories.items.mecanique"), label: t("home.categories.items.mecanique") },
          { value: t("home.categories.sectors.pharma_medical"), label: t("home.categories.sectors.pharma_medical") },
          { value: t("home.categories.items.beauty"), label: t("home.categories.items.beauty") },
          { value: t("home.categories.items.industrial"), label: t("home.categories.items.industrial") },
          { value: t("home.categories.items.electro"), label: t("home.categories.items.electro") },
          { value: t("home.categories.items.spices"), label: t("home.categories.items.spices") },
          { value: t("home.categories.items.construction"), label: t("home.categories.items.construction") }
        ]);
      }
    };
    fetchCategories();
  }, [t]);

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setSuggestionsLoading(true);
    try {
      const response = await api.get(`products/`, {
        params: { name__icontains: query }
      });
      const data = response.data.results || response.data || [];
      setSuggestions(data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleSearchTermChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const selectSuggestion = (suggestionName) => {
    setSearchTerm(suggestionName);
    setSuggestions([]);
    handleSearch();
  };

  const handleSearch = async () => {
    setLoading(true);
    if (onSearch) onSearch(searchTerm, region, category, label);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
    setSuggestions([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <section className="relative -mt-16 md:-mt-32 z-30 px-4 md:px-6 grainy-texture">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 lg:p-14 shadow-4xl border border-white/20 bg-white/10 backdrop-blur-[40px]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 items-end md:items-center">
            {/* Search Input */}
            <div className="space-y-5">
              <div className="inline-block bg-white px-3 py-1.5 rounded-sm">
                <label className="text-[13px] font-bold uppercase tracking-[0.6em] text-black font-cinzel">
                  {t("home.search.what")}
                </label>
              </div>
              <div className="flex items-center gap-5 bg-white border-b border-white/20 transition-all p-5 group focus-within:border-white/40 focus-within:bg-gray-50">
                <Search size={22} className="text-black transition-colors" />
                <input
                  type="text"
                  placeholder={t("home.search.placeholder")}
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  onKeyPress={handleKeyPress}
                  className="bg-transparent border-none outline-none w-full font-medium tracking-wide placeholder:text-black/60 text-base text-black focus:ring-0"
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="space-y-5">
              <div className="inline-block bg-white px-3 py-1.5 rounded-sm">
                <label className="text-[13px] font-bold uppercase tracking-[0.6em] text-black font-cinzel">
                  {t("home.search.category")}
                </label>
              </div>
              <CustomSelect
                value={category}
                onChange={setCategory}
                placeholder={t("home.search.placeholderCat")}
                icon={Briefcase}
                iconColor="text-black"
                options={categories}
              />
            </div>

            {/* Region Select */}
            <div className="space-y-5">
              <div className="inline-block bg-white px-3 py-1.5 rounded-sm">
                <label className="text-[13px] font-bold uppercase tracking-[0.6em] text-black font-cinzel">
                  {t("home.search.where")}
                </label>
              </div>
              <CustomSelect
                value={region}
                onChange={setRegion}
                placeholder={t("home.search.placeholderWhere")}
                icon={MapPin}
                iconColor="text-black"
                options={Object.values(t("home.search.regionList", { returnObjects: true }) || []).map((w, i) => ({ value: w, label: `${i + 1}. ${w}` }))}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 md:pt-8 w-full mt-4 md:mt-0">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                disabled={loading}
                className="w-full h-20 bg-gradient-to-r from-[#FF4D00] to-[#FF9100] hover:from-[#FF9100] hover:to-[#FF4D00] text-white rounded-none flex items-center justify-center gap-6 font-cinzel font-bold uppercase tracking-[0.4em] text-[11px] transition-all duration-500 shadow-2xl shadow-orange-600/40 disabled:opacity-50 border border-white/20"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <span>{t("home.search.action")}</span>}
                <div className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
                  <ArrowRight size={16} />
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
