import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getProductImage } from "../utils/utils";

export default function ExportProductsSection() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [certifications, setCertifications] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const navigate = useNavigate();



  const getCertifications = (product) => {
    const categoryData = categories[product.category];

    if (!categoryData?.certifications) {
      return [];
    }

    let certificationIds = [];

    if (typeof categoryData.certifications === 'string') {
      try {
        const parsed = JSON.parse(categoryData.certifications);

        if (Array.isArray(parsed)) {
          certificationIds = parsed;
        } else if (typeof parsed === 'object' && parsed !== null) {
          certificationIds = [parsed];
        }
      } catch (e) {
        const matches = categoryData.certifications.match(/\d+/g);
        if (matches) {
          certificationIds = matches.map(id => parseInt(id));
        }
      }
    } else if (Array.isArray(categoryData.certifications)) {
      certificationIds = categoryData.certifications;
    }

    const result = certificationIds
      .map(certId => {
        const id = typeof certId === 'object' ? certId.id : certId;
        const cert = certifications[id];

        if (!cert) return null;

        return {
          id: cert.id,
          name: cert.name || 'Unknown Certification',
          image_url: cert.image_url || cert.image,
          hasImage: !!(cert.image_url || cert.image)
        };
      })
      .filter(cert => cert && cert.hasImage);

    return result;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [productsRes, categoriesRes, certificationsRes] = await Promise.all([
          api.get(`products/`),
          api.get(`categories/`),
          api.get(`certifications/`)
        ]);

        const fetchedProducts = productsRes.data.results || productsRes.data || [];
        const fetchedCategories = categoriesRes.data.results || categoriesRes.data || [];
        const fetchedCertifications = certificationsRes.data.results || certificationsRes.data || [];

        const categoriesById = {};
        fetchedCategories.forEach(category => {
          categoriesById[category.id] = category;
        });

        const certificationsById = {};
        fetchedCertifications.forEach(certification => {
          certificationsById[certification.id] = certification;
        });

        setProducts(fetchedProducts);
        setCategories(categoriesById);
        setCertifications(certificationsById);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchAllData();
  }, []);

  const toggleDescription = (productId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <section className="py-20 px-8 bg-gradient-to-b from-[#f5f2eb] to-[#eee9dd] text-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-black">{t('products.export_section.title')}</h2>
          <p className="text-lg text-gray-600">{t('products.export_section.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 6).map((product, index) => {
            const productCertifications = getCertifications(product);

            return (
              <a
                key={product.id || index}
                href={`/products/${product.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleProductClick(product.id);
                }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] border border-[#D2B48C] border-opacity-30 hover:border-opacity-60"
                style={{
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(210,180,140,0.25), 0 8px 16px rgba(210,180,140,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                }}
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

                      {productCertifications.length > 0 && (
                        <div className="absolute top-3 right-3 flex flex-wrap gap-1">
                          {productCertifications.slice(0, 3).map((cert, certIndex) => (
                            <div
                              key={cert.id || certIndex}
                              className="w-8 h-8 bg-white/90 rounded-full p-1 backdrop-blur-sm border border-white/50"
                              title={cert.name}
                            >
                              <img
                                src={cert.image_url}
                                alt={cert.name}
                                className="w-full h-full object-contain rounded-full"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                          {productCertifications.length > 3 && (
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/50">
                              <span className="text-xs font-semibold text-gray-600">
                                +{productCertifications.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-black group-hover:text-orange-600 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    {expandedDescriptions[product.id]
                      ? product.description
                      : `${product.description?.slice(0, 100) || ''}...`}
                    {product.description && product.description.length > 100 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleDescription(product.id);
                        }}
                        className="ml-1 text-blue-600 hover:underline text-sm"
                      >
                        {expandedDescriptions[product.id] ? t('products.export_section.read_less') : t('products.export_section.read_more')}
                      </button>
                    )}
                  </p>

                  {productCertifications.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {productCertifications.map((cert, certIndex) => (
                          <div
                            key={cert.id || certIndex}
                            className="w-6 h-6 border border-gray-200 rounded bg-white p-1"
                            title={cert.name}
                          >
                            <img
                              src={cert.image_url}
                              alt={cert.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-orange-500 group-hover:text-orange-600 transition-colors duration-300">
                      {t('products.export_section.discover')}
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
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <button
            className="bg-orange-500 text-white hover:bg-orange-600 font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg transform hover:scale-105"
            style={{
              boxShadow: "0 4px 20px rgba(249,115,22,0.3)",
            }}
            onClick={() => navigate("/products")}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(210,180,140,0.4), 0 4px 16px rgba(249,115,22,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(249,115,22,0.3)";
            }}
          >
            {t('products.export_section.view_all')}
          </button>
        </div>
      </div>
    </section>
  );
}
