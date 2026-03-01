import React, { useEffect } from 'react';
import Header from "../components/Header";
import ProductDetails from "../components/ProductDetails";
import ProductListDetails from "../components/ProductListDetails";
import Footer from "../components/Footer";

function ProductDetailsPage() {
  const { t } = useTranslation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans">
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-24"></div>

      <main className="flex-grow">
        <ProductDetails />

        <div className="bg-gray-50 pt-16 pb-20 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
            <h3 className="text-3xl font-display font-bold text-gray-900">{t('products.details.similar_discoveries')}</h3>
            <div className="w-16 h-1 bg-[#D4AF37] opacity-60 rounded-full mt-4 mx-auto"></div>
          </div>
          {/* Note: ProductListDetails styles might need adjustment to not have their own padding if reused */}
          <div className="[&>section]:!py-0 [&>section]:!bg-transparent">
            <ProductListDetails />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ProductDetailsPage;