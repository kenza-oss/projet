import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from '../api/axios';
import { getCertificationsForProduct } from "../utils/utils";
import ProductCard from './ProductCard';

const ProductGrid = ({ searchTerm, selectedRegion, selectedCategory, selectedCertification, appliedFilters }) => {
  const { t } = useTranslation();
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState({});
  const [certifications, setCertifications] = useState({});
  const productsPerPage = 100; // Increased to 100 per page as requested

  // Filter state (sidebar removed, but potential future use or mobile filters)
  const [sidebarFilters, setSidebarFilters] = useState({
    categories: [],
    regions: [],
    certifications: []
  });

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Individual try-catches for better resilience
        let fetchedProducts = [];
        let fetchedCategories = [];
        let fetchedCertifications = [];

        try {
          const res = await axios.get('products/');
          fetchedProducts = res.data.results || res.data || [];
        } catch (e) { console.warn("Failed to fetch products:", e); }

        try {
          const res = await axios.get('categories/');
          fetchedCategories = res.data.results || res.data || [];
        } catch (e) { console.warn("Failed to fetch categories:", e); }

        try {
          const res = await axios.get('certifications/');
          fetchedCertifications = res.data.results || res.data || [];
        } catch (e) { console.warn("Failed to fetch certifications:", e); }

        // MOCK DATA FALLBACK for International Standard Look
        const mockProducts = [
          {
            id: 'mock-1',
            name: t('products.items.olive.name'),
            category: 1,
            description: t('products.items.olive.desc'),
            region_org: t('home.search.regionList.0'), // Bejaia
            likes: 450,
            rating: 4.9,
            views: 12500,
            image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80",
            price: 45
          },
          {
            id: 'mock-2',
            name: t('products.items.dates.name'),
            category: 1,
            description: t('products.items.dates.desc'),
            region_org: t('home.search.regionList.14'), // Biskra
            likes: 890,
            rating: 5.0,
            views: 24000,
            image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=800&q=80",
            price: 120
          },
          {
            id: 'mock-3',
            name: "Couscous Artisanal Roulé à la Main",
            category: 2,
            description: "Produit traditionnel fabriqué selon un savoir-faire ancestral transmis de génération en génération.",
            region_org: "Mila",
            likes: 320,
            rating: 3.8,
            views: 8900,
            image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&q=80",
            price: 15
          },
          {
            id: 'mock-4',
            name: "Safran Pur des Hauts Plateaux",
            category: 3,
            description: "L'or rouge d'Algérie, un safran d'une pureté exceptionnelle et d'un arôme intense.",
            region_org: "Tlemcen",
            likes: 1200,
            rating: 5.0,
            views: 45000,
            image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&q=80",
            price: 450
          }
        ];

        // Merge API data with mock data if API is empty
        console.log(`[DEBUG] Fetched ${fetchedProducts.length} products from backend.`);
        const finalProducts = fetchedProducts.length > 0 ? fetchedProducts : mockProducts;

        const categoriesMap = {};
        fetchedCategories.forEach(c => { if (c && c.id) categoriesMap[c.id] = c; });

        const certificationsMap = {};
        fetchedCertifications.forEach(c => { if (c && c.id) certificationsMap[c.id] = c; });

        setAllProducts(finalProducts);
        setCategories(categoriesMap);
        setCertifications(certificationsMap);

      } catch (err) {
        console.error('Error in fetching process:', err);
        setError(t('products.details.loading_error'));
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    // Systematic filter: Remove any "Test" data
    let filteredProducts = allProducts.filter(p =>
      !p.name?.toLowerCase().includes('test') &&
      !p.description?.toLowerCase().includes('test') &&
      !p.company_name?.toLowerCase().includes('test') &&
      !p.producer_name?.toLowerCase().includes('test')
    );

    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product =>
        product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(product => {
        const normSelected = selectedCategory.toLowerCase().trim();

        // Match by ID first (useful for footer links with internal IDs)
        if (String(product.category) === String(selectedCategory)) {
          return true;
        }

        // Match by Name if category is an ID mapped to the categories dictionary
        const categoryData = categories[product.category];
        if (categoryData && categoryData.name && categoryData.name.toLowerCase().trim() === normSelected) {
          return true;
        }

        // Match if product.category is already a populated object from the API
        if (product.category && typeof product.category === 'object' && product.category.name) {
          if (product.category.name.toLowerCase().trim() === normSelected) return true;
        }

        // Fallback for mock data or if API provided a flat category_name string
        if (product.category_name && product.category_name.toLowerCase().trim() === normSelected) {
          return true;
        }

        return false;
      });
    }

    if (selectedRegion) {
      filteredProducts = filteredProducts.filter(product =>
        product.region_org && product.region_org.toLowerCase() === selectedRegion.toLowerCase()
      );
    }

    // Applied sidebar filters
    if (appliedFilters) {
      const { priceRange, stars, types } = appliedFilters;

      // Price filter
      if (priceRange) {
        filteredProducts = filteredProducts.filter(product => {
          const price = product.price || 0;
          return price >= priceRange[0] && price <= priceRange[1];
        });
      }

      // Stars filter
      if (stars && stars.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
          const rating = Math.floor(product.rating || 0);
          return stars.includes(rating);
        });
      }

      // Types/Categories filter (Sidebar checkboxes)
      if (types && types.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
          let categoryName = "";

          if (product.category && typeof product.category === 'object') {
            categoryName = product.category.name;
          } else if (categories[product.category]) {
            categoryName = categories[product.category].name;
          } else if (product.category_name) {
            categoryName = product.category_name;
          }

          if (!categoryName) return false;

          // Check if the product's resolved category name exists in the selected types array
          return types.some(t => t.toLowerCase().trim() === categoryName.toLowerCase().trim());
        });
      }
    }

    setDisplayedProducts(filteredProducts);
    setCurrentPage(1);
  }, [searchTerm, selectedRegion, selectedCategory, sidebarFilters, allProducts, categories, appliedFilters]);

  const totalPagesFiltered = Math.ceil(displayedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = displayedProducts.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const Pagination = () => {
    if (totalPagesFiltered <= 1) return null;
    return (
      <div className="flex items-center justify-center space-x-2 mt-12 mb-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all ${currentPage === 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-700 bg-white border border-gray-200 hover:border-gray-400 hover:shadow-md'
            }`}
        >
          <ChevronLeft size={16} className="mr-1" /> {t('products.grid.prev')}
        </button>

        <span className="text-sm font-medium text-gray-500 px-4">
          {t('products.grid.page_info', { current: currentPage, total: totalPagesFiltered })}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPagesFiltered}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all ${currentPage === totalPagesFiltered
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-700 bg-white border border-gray-200 hover:border-gray-400 hover:shadow-md'
            }`}
        >
          {t('products.grid.next')} <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full p-6 min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">{t('products.grid.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
          <strong className="font-bold">{t('products.grid.error_title')}</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (displayedProducts.length === 0) {
    return (
      <div className="w-full p-6 min-h-[40vh]">
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-lg mb-4">{t('products.grid.no_results')}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-black font-medium hover:underline"
          >
            {t('products.grid.reset')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-12">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            categories={categories}
          />
        ))}
      </div>

      <Pagination />
    </div>
  );
};


export default ProductGrid;

