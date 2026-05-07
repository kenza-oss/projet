import React, { useState, useEffect } from "react";
import { Star, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import { getProductImage, getCertificationsForProduct, getProductImages } from "../utils/utils";
import ProductImageSlideshow from "./ProductImageSlideshow";

// Star Rating Component
const StarRating = ({ rating = 4, reviews = 0 }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={10}
            fill={i < rating ? "#FF6600" : "none"}
            className={i < rating ? "text-[#FF6600]" : "text-gray-300"}
          />
        ))}
      </div>
      {reviews >= 0 && (
        <span className="text-gray-400 text-[9px] font-medium">{reviews} {t("home.products.reviews")}</span>
      )}
    </div>
  );
};

export default function ExportProductsSection() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [certifications, setCertifications] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, certificationsRes] = await Promise.all([
          api.get("products/"),
          api.get("categories/"),
          api.get("certifications/")
        ]);

        const fetchedProducts = productsRes.data.results || productsRes.data || [];
        const fetchedCategories = categoriesRes.data.results || categoriesRes.data || [];
        const fetchedCertifications = certificationsRes.data.results || certificationsRes.data || [];

        const catMap = {};
        fetchedCategories.forEach(c => catMap[c.id] = c);

        const certMap = {};
        fetchedCertifications.forEach(c => certMap[c.id] = c);

        // Fetch up to 9 products
        const processedProducts = fetchedProducts.slice(0, 9).map(p => ({
          ...p,
          prix_indicatif: p.prix_indicatif || p.price || "0.00",
          description: p.description || p.desc_courte || "",
        }));

        setProducts(processedProducts);
        setCategories(catMap);
        setCertifications(certMap);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products data:", err);
        // Mock Data Fallback
        const mockProducts = [
          { id: 1, name: t("home.products.items.olive_oil_premium.name"), image: null, description: t("home.products.items.olive_oil_premium.desc"), prix_indicatif: 120.00, rating: 5, reviews_count: 120 },
          { id: 2, name: t("home.products.items.solar_panel.name"), image: null, description: t("home.products.items.solar_panel.desc"), prix_indicatif: 2500.00, rating: 5, reviews_count: 85 },
          { id: 3, name: t("home.products.items.industrial_valve.name"), image: null, description: t("home.products.items.industrial_valve.desc"), prix_indicatif: 850.00, rating: 5, reviews_count: 45 },
          { id: 4, name: t("home.products.items.ceramics.name"), image: null, description: t("home.products.items.ceramics.desc"), prix_indicatif: 25.00, rating: 4, reviews_count: 30 },
          { id: 5, name: t("home.products.items.electronics.name"), image: null, description: t("home.products.items.electronics.desc"), prix_indicatif: 45.00, rating: 5, reviews_count: 10 },
          { id: 6, name: t("home.products.items.textile.name"), image: null, description: t("home.products.items.textile.desc"), prix_indicatif: 9.50, rating: 4, reviews_count: 60 }
        ];
        setProducts(mockProducts);
        setError(null); // Clear error to show mock data
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  return (
    <section className="relative py-16 md:py-24 bg-[#FAF9F6] overflow-hidden">
      {/* Luxury Separator - More Prominent */}
      <div className="flex items-center justify-center pb-20">
        <div className="w-60 h-[1.5px] bg-gradient-to-r from-transparent via-neutral-900/40 to-transparent"></div>
        <div className="mx-8 w-3 h-3 rotate-45 border-2 border-[#D4AF37] bg-neutral-900 shadow-[0_0_20px_rgba(212,175,55,0.4)]"></div>
        <div className="w-60 h-[1.5px] bg-gradient-to-l from-transparent via-neutral-900/40 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">

        {/* Refined Header - Luxury Style */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-20 space-y-6 md:space-y-8 px-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center gap-6"
          >
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-[1px] bg-[#FF6600]/40 group-hover:w-20 group-hover:bg-[#FF6600] transition-all duration-700"></div>
              <p className="text-[#1A1A1A] font-bold uppercase tracking-[0.6em] text-[12px] font-cinzel">
                {t("home.products.portfolio")}
              </p>
              <div className="w-12 h-[1px] bg-[#FF6600]/40 group-hover:w-20 group-hover:bg-[#FF6600] transition-all duration-700"></div>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-display-luxury text-[#1A1A1A] leading-tight tracking-tighter">
              {t("home.products.haute_couture")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6600] via-[#FF6600] to-[#FF6600] font-serif-luxury italic font-light">{t("home.products.export_b2b")}</span>
            </h2>

            <div className="w-[100px] h-[1px] bg-gradient-to-r from-transparent via-[#FF6600]/30 to-transparent"></div>

            <p className="text-[#4A4A4A] font-medium font-serif-luxury italic max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              {t("home.products.desc")}
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white aspect-[4/5] rounded-xl animate-pulse shadow-sm"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white/80 rounded-2xl border border-gray-100 italic text-gray-400">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => {
              const productCerts = getCertificationsForProduct(product, categories, certifications);
              const imageUrl = getProductImage(product.image, index, product);

              return (
                <motion.div
                  key={product.id || index}
                  initial={{ opacity: 0.5, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="group relative bg-white rounded-[2rem] p-4 shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.07)] transition-all duration-500 flex flex-col items-start cursor-pointer border border-gray-100"
                  onClick={() => navigate(`/products?product=${product.id}`)}
                >
                  {/* Image Section - Now with Slideshow */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-[#F8F8F8] mb-6">
                    <ProductImageSlideshow
                      images={getProductImages(product)}
                      productName={product.name}
                    />

                    {/* Certification Logos Overlay */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1.5 pointer-events-none">
                      {productCerts.slice(0, 2).map((cert, cIdx) => (
                        <div key={cIdx} className="w-6 h-6 bg-white/95 backdrop-blur-sm rounded-full p-1 shadow-sm flex items-center justify-center">
                          <img src={cert.image_url} alt={cert.name} className="w-full h-full object-contain" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="w-full space-y-1 px-1 flex-grow">
                    <h3 className="text-[13px] font-bold text-[#1A1A1A] line-clamp-2 leading-[1.4] uppercase tracking-wider mb-2 h-[38px] overflow-hidden">
                      {product.name}
                    </h3>

                    <StarRating rating={product.rating || 4} reviews={product.reviews_count || 0} />

                    <p className="text-gray-400 text-[13px] font-medium leading-relaxed line-clamp-2 mt-2">
                      {product.description || product.desc_courte || t("home.categories.card.description_default")}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="w-full mt-4 md:mt-5 flex items-center justify-between px-1">
                    <span className="text-[16px] md:text-[18px] font-black text-[#1A1A1A]">
                      ${product.prix_indicatif ? Number(product.prix_indicatif).toFixed(2) : "0.00"}
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: "#1A1A1A" }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center bg-[#FF6600] text-white px-5 py-2.5 md:px-8 md:py-3.5 rounded-full text-[11px] md:text-[13px] font-bold transition-all duration-300 shadow-md whitespace-nowrap"
                    >
                      {t("home.products.quick_buy")}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Explore Collection Button */}
        <div className="mt-12 md:mt-20 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/products')}
            className="group relative px-10 py-4 md:px-12 md:py-5 bg-[#1A1A1A] text-white rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6600] to-[#FF6600] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center gap-4">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">
                {t("home.products.explore_full")}
              </span>
              <div className="w-6 h-[1px] md:w-8 md:h-[1px] bg-white/30 group-hover:w-10 md:group-hover:w-12 transition-all duration-500"></div>
            </div>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
