import React, { useEffect, useState } from "react";
import { getProductImage } from "../../utils/utils";
import api from "../../api/axios";

export default function ExportProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("access"); // assuming JWT is stored here after login
        const response = await api.get("products/");
        setProducts(response.data.results || response.data || []);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-8 bg-gradient-to-b from-[#f5f2eb] to-[#eee9dd] text-black">
        <div className="text-center">Chargement des produits...</div>
      </section>
    );
  }

  return (
    <section className="py-20 px-8 bg-gradient-to-b from-[#f5f2eb] to-[#eee9dd] text-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-black">Produits à l'export</h2>
          <p className="text-lg text-gray-600">
            Découvrez l'authenticité des produits algériens d'excellence
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <a
              key={product.id}
              href={`#/products/${product.id}`} // or navigate to detail page
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] border border-[#D2B48C] border-opacity-30 hover:border-opacity-60"
            >
              <div className="relative overflow-hidden">
                <div className="bg-gradient-to-br from-[#f5f2eb] to-[#ede7d9] p-6">
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={getProductImage(product.image || (product.images && product.images[0]))}
                      alt={product.name}
                      className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl"></div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-black group-hover:text-orange-600 transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-sm font-medium mb-4" style={{ color: "#D2B48C" }}>
                  {product.sector || "Produit authentique d'Algérie"}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-orange-500 group-hover:text-orange-600 transition-colors duration-300">
                    Découvrir →
                  </span>
                  <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors duration-300">
                    <svg
                      className="w-4 h-4 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="bg-orange-500 text-white hover:bg-orange-600 font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg transform hover:scale-105">
            Voir tous les produits
          </button>
        </div>
      </div>
    </section>
  );
}
