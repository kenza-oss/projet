import React, { useState, Component, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import HorizontalCategoryList from '../components/HorizontalCategoryList';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, Minus, Plus, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import ProductModal from '../components/ProductModal';
import luxuryHero from '../assets/luxury_hero.png';
import heroBg1 from '../assets/hero-bg-1.jpg';
import heroBg2 from '../assets/hero-bg-2.png';
import heroBg3 from '../assets/hero-bg-3.png';
import heroBg4 from '../assets/hero-bg-4.png';
import heroBg5 from '../assets/hero-bg-5.png';
import pricklyPearOil from '../assets/prickly-pear-oil.png';
import atlasHoney from '../assets/atlas-honey.png';
import medjoolDates from '../assets/medjool-dates.png';
import solarPanel from '../assets/solar-panel-industrial.png';
import oliveOilPremium from '../assets/olive-oil-premium.png';
import industrialValve from '../assets/industrial-valve.png';

// Simple Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[Products ErrorBoundary] caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white p-10 flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{this.props.t('products.errors.critical')}</h2>
          <pre className="p-4 bg-gray-100 rounded text-left overflow-auto max-w-full text-xs text-red-800">
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-black text-white rounded-full font-bold"
          >
            {this.props.t('products.errors.reload')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const Products = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const [currentSearchTerm, setCurrentSearchTerm] = useState(searchParams.get('search') || "");
  const [currentRegion, setCurrentRegion] = useState(searchParams.get('region') || "");
  const [currentCategory, setCurrentCategory] = useState(id || searchParams.get('category') || "");
  const [currentCertification, setCurrentCertification] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [productLoading, setProductLoading] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Premium Carousel Background System
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const backgroundMedia = [
    { type: 'image', src: heroBg1 },
    { type: 'image', src: heroBg2 },
    { type: 'image', src: heroBg3 },
    { type: 'image', src: heroBg4 },
    { type: 'image', src: heroBg5 }
  ];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMediaIndex((prev) => (prev + 1) % backgroundMedia.length);
    }, 6000); // Change every 6 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentSearchTerm(searchParams.get('search') || "");
    setCurrentRegion(searchParams.get('region') || "");
    setCurrentCategory(id || searchParams.get('category') || "");
  }, [searchParams, id]);

  const [appliedFilters, setAppliedFilters] = useState({
    priceRange: [0, 500],
    stars: [],
    types: []
  });

  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      priceRange,
      stars: selectedStars,
      types: selectedTypes
    });
    // On mobile, close filters after applying
    if (window.innerWidth < 1024) {
      setIsFiltersOpen(false);
    }
  };

  // Auto-apply filters when they change
  useEffect(() => {
    handleApplyFilters();
  }, [priceRange, selectedStars, selectedTypes]);

  const handleResetFilters = () => {
    setPriceRange([0, 500]);
    setSelectedStars([]);
    setSelectedTypes([]);
    setAppliedFilters({
      priceRange: [0, 500],
      stars: [],
      types: []
    });
    setCurrentCategory("");
    setCurrentSearchTerm("");
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('categories/');
        const fetched = res.data.results || res.data || [];
        setCategories(fetched);
      } catch (e) {
        console.warn("Failed to fetch categories for sidebar:", e);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const productId = searchParams.get('product');
    if (productId) {
      const fetchProductDetails = async () => {
        setProductLoading(true);
        try {
          const [productRes, categoriesRes] = await Promise.all([
            axios.get(`products/${productId}/`),
            axios.get(`categories/`)
          ]);

          const fetchedCategories = categoriesRes.data.results || categoriesRes.data || [];
          const catsMap = {};
          fetchedCategories.forEach(c => catsMap[c.id] = c);
          setCategoriesMap(catsMap);

          setSelectedProduct(productRes.data);
          setIsModalOpen(true);
        } catch (error) {
          console.error("Error fetching product details for modal:", error);
        } finally {
          setProductLoading(false);
        }
      };
      fetchProductDetails();
    } else {
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  }, [searchParams]);

  const types = categories.length > 0
    ? categories.map(c => c.name)
    : [
      t('home.products.items.fruit.name'),
      t('home.products.items.vegetable.name'),
      t('home.products.items.cereal.name'),
      t('home.products.items.oil.name'),
      t('home.products.items.bio.name'),
      t('home.products.items.spice.name')
    ];

  const featuredItems = [
    {
      id: 'f1',
      name: t('products.items.solar_panel.name'),
      category: t('home.events.category_names.cat3'),
      price: "2,500€",
      image: solarPanel,
      tag: t('products.card.exclusive_collection')
    },
    {
      id: 'f2',
      name: t('products.items.olive_oil_premium.name'),
      category: t('home.events.category_names.cat1'),
      price: "120€",
      image: oliveOilPremium,
      tag: t('products.modal.quality')
    },
    {
      id: 'f3',
      name: t('products.items.industrial_valve.name'),
      category: t('home.events.category_names.cat6'),
      price: "850€",
      image: industrialValve,
      tag: t('products.listing.featured.best_seller')
    }
  ];

  return (
    <ErrorBoundary t={t}>
      <Helmet>
        <title>{t('products.listing.hero.title')} | Kleer Infini B2B</title>
        <meta name="description" content={t('products.listing.hero.desc')} />
        <meta property="og:title" content={`${t('products.listing.hero.title')} - Kleer Infini`} />
        <meta property="og:description" content={t('products.listing.hero.desc')} />
      </Helmet>
      <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-rose-100">
        <Header theme="light" />

        {/* Premium Hero Section with Carousel Background */}
        <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-[#0A0A0A]">
          <div className="absolute inset-0 z-0">
            {backgroundMedia.map((media, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentMediaIndex ? 1 : 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full"
                style={{ pointerEvents: index === currentMediaIndex ? 'auto' : 'none' }}
              >
                {media.type === 'video' ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-70"
                    style={{ filter: 'brightness(0.85) contrast(1.15)' }}
                  >
                    <source src={media.src} type="video/mp4" />
                    <source src={media.fallback} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={media.src}
                    alt="Premium Background"
                    className="w-full h-full object-cover opacity-70"
                    style={{ filter: 'brightness(0.85) contrast(1.15)' }}
                  />
                )}
              </motion.div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/30 via-[#0A0A0A]/50 to-[#0A0A0A]/90 z-10"></div>
          </div>

          <div className="relative max-w-[1800px] mx-auto px-6 md:px-12 z-20">
            <div className="flex flex-col max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="w-12 h-px bg-rose-500"></span>
                <span className="text-rose-500 font-black text-[10px] uppercase tracking-[0.4em]">{t('products.listing.hero.badge')}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8"
              >
                {t('products.listing.hero.title')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-300">{t('products.listing.hero.subtitle')}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 text-base md:text-lg font-medium leading-relaxed mb-10 max-w-lg"
              >
                {t('products.listing.hero.desc')}
              </motion.p>
            </div>
          </div>

          {/* Background Decorative Text - Hidden on mobile for cleaner look */}
          <div className="absolute -bottom-10 -right-20 text-[100px] md:text-[200px] font-black text-white/[0.03] select-none pointer-events-none uppercase tracking-tighter leading-none italic hidden sm:block">
            {t('products.listing.hero.bg_text')}
          </div>
        </section>

        <main className="py-20 bg-slate-50/50">
          {/* Featured Selection Section */}
          <section className="max-w-7xl mx-auto px-6 mb-24">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-2 block">{t('products.listing.featured.badge')}</span>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{t('products.listing.featured.title')}</h2>
              </div>
              <div className="flex gap-2">
                <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                  <ChevronDown className="rotate-90" size={20} />
                </button>
                <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                  <ChevronDown className="-rotate-90" size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    style={{
                      filter: 'brightness(1.1) contrast(1.15) saturate(1.2)',
                      imageRendering: 'high-quality'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  <div className="absolute top-6 left-6">
                    <span className="bg-rose-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{item.tag}</span>
                  </div>

                  <div className="absolute bottom-10 left-10 right-10">
                    <p className="text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{item.category}</p>
                    <h3 className="text-white text-2xl font-black uppercase tracking-tight mb-4">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm font-medium">{t('products.listing.featured.from')} <span className="text-white font-black text-xl ml-1">{item.price}</span></span>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black"
                      >
                        <ChevronDown className="-rotate-90" size={18} />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Breadcrumb & Results Header - wider layout */}
          <div className="max-w-[1800px] mx-auto px-6 md:px-12 mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                  <span className="hover:text-rose-500 cursor-pointer transition-colors px-1">{t('products.listing.header.algeria')}</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-900 px-1">{t('products.listing.header.global_catalog')}</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                  <span className="text-rose-500">1204+</span> {t('products.listing.header.certified_count')}
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('products.listing.header.sort_by')}</span>
                  <select className="bg-white border-2 border-slate-100 rounded-xl px-5 py-3 text-sm font-black text-slate-900 focus:outline-none focus:border-rose-500 transition-all cursor-pointer shadow-sm appearance-none pr-10 relative">
                    <option>{t('products.listing.header.sort_options.relevance')}</option>
                    <option>{t('products.listing.header.sort_options.price_asc')}</option>
                    <option>{t('products.listing.header.sort_options.price_desc')}</option>
                    <option>{t('products.listing.header.sort_options.newest')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[1920px] mx-auto px-4 md:px-10">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-8">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg active:scale-[0.98]"
              >
                <div className="flex flex-col gap-1">
                  <span className={`w-5 h-0.5 bg-white transition-all ${isFiltersOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`w-5 h-0.5 bg-white transition-all ${isFiltersOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`w-5 h-0.5 bg-white transition-all ${isFiltersOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
                {isFiltersOpen ? t('products.listing.sidebar.reset') : t('products.listing.sidebar.filters')}
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left Sidebar - Ultra Minimalist & Positioned Left */}
              <div className={`w-full lg:w-72 xl:w-80 flex-shrink-0 ${isFiltersOpen ? 'block' : 'hidden lg:block'}`}>
                <div className="sticky top-32 bg-white rounded-[2rem] border border-slate-100 p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('products.listing.sidebar.filters')}</h3>
                    <button
                      onClick={handleResetFilters}
                      className="text-base font-bold text-rose-500 uppercase tracking-widest hover:text-rose-600 transition-colors"
                    >
                      {t('products.listing.sidebar.reset')}
                    </button>
                  </div>

                  {/* Categories - Simplified and professional */}
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-base font-bold text-slate-900 uppercase tracking-widest">{t('products.listing.sidebar.categories')}</h4>
                      <ChevronDown size={14} className="text-slate-400" />
                    </div>
                    <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {types.map((type) => (
                        <label key={type} className="flex items-center gap-3.5 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedTypes.includes(type)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedTypes([...selectedTypes, type]);
                                } else {
                                  setSelectedTypes(selectedTypes.filter(t => t !== type));
                                }
                              }}
                              className="peer appearance-none w-7 h-7 rounded-lg border-2 border-slate-200 checked:bg-slate-900 checked:border-slate-900 transition-all cursor-pointer group-hover:border-slate-300"
                            />
                            <svg className="absolute w-5 h-5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                          <span className="text-base font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-10 pt-8 border-t border-slate-50">
                    <h4 className="text-base font-bold text-slate-900 uppercase tracking-widest mb-6">{t('products.listing.sidebar.price_range')}</h4>
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="flex-1 px-5 py-4 bg-slate-50 rounded-xl text-base font-bold text-slate-900 text-center border border-slate-100">
                          {priceRange[0]}$
                        </div>
                        <div className="flex-1 px-5 py-4 bg-slate-50 rounded-xl text-base font-bold text-slate-900 text-center border border-slate-100">
                          {priceRange[1]}$
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="10"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                      />
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="mb-10 pt-8 border-t border-slate-50">
                    <h4 className="text-base font-bold text-slate-900 uppercase tracking-widest mb-6">{t('products.listing.sidebar.reviews')}</h4>
                    <div className="space-y-3">
                      {[5, 4, 3].map((stars) => (
                        <button
                          key={stars}
                          onClick={() => {
                            if (selectedStars.includes(stars)) {
                              setSelectedStars(selectedStars.filter(s => s !== stars));
                            } else {
                              setSelectedStars([...selectedStars, stars]);
                            }
                          }}
                          className={`flex items-center gap-3 w-full p-2 rounded-xl transition-all ${selectedStars.includes(stars) ? 'bg-slate-50' : 'hover:bg-slate-50/50'
                            }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 ${selectedStars.includes(stars) ? 'bg-slate-900 border-slate-900' : 'border-slate-200'
                            } flex items-center justify-center`}>
                            {selectedStars.includes(stars) && <div className="w-2 h-2 bg-white rounded-sm" />}
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className={i < stars ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleApplyFilters}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl text-base font-black uppercase tracking-[0.2em] hover:bg-rose-500 transition-colors shadow-lg active:scale-[0.98]"
                  >
                    {t('products.listing.sidebar.apply')}
                  </button>
                </div>
              </div>

              {/* Right Content Area - Expanding to fill space */}
              <div className="flex-1 lg:pl-4">
                <ProductGrid
                  searchTerm={currentSearchTerm}
                  selectedRegion={currentRegion}
                  selectedCategory={currentCategory}
                  selectedCertification={currentCertification}
                  appliedFilters={appliedFilters}
                />
              </div>
            </div>
          </div>
        </main>

        <Footer />

        {/* Product Detail Modal for Direct Links/Homepage Navigation */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('product');
            // Use window.history to avoid a full React Router re-navigation if possible, 
            // or just navigate back to cleanly remove the param
            navigate(`/products${newParams.toString() ? '?' + newParams.toString() : ''}`);
          }}
          product={selectedProduct}
          categoryName={selectedProduct ? (categoriesMap[selectedProduct.category]?.name || t('products.modal.product_fallback')) : ""}
        />

        {productLoading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div >
    </ErrorBoundary >
  );
};

export default Products;