// SearchSection.jsx
import React, { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import api from '../api/axios';

export default function SearchSection({ onSearch }) { // Receive onSearch prop
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCertification, setSelectedCertification] = useState('');

  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    api.get('products/')
      .then((res) => {
        const data = res.data.results || res.data || [];
        setProducts(data);
      })
      .catch((err) => {
        console.error('Error fetching products for search suggestions:', err);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (value.length > 1) {
        const filteredSuggestions = products.filter(product =>
          product.name && product.name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleSuggestionClick = (productName) => {
    setSearchTerm(productName);
    setSuggestions([]);
    setShowSuggestions(false);
    // Optionally trigger a full search here
    onSearch(productName, selectedRegion, selectedCategory, selectedCertification);
  };

  const handleSearchButtonClick = () => {
    // Pass the current search term and other filter values up to the parent
    onSearch(searchTerm, selectedRegion, selectedCategory, selectedCertification);
    setShowSuggestions(false);
  };

  return (
    <section className="py-8 px-3 bg-black text-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Trouvez vos produits d'exportation
        </h2>

        <div className="w-full">
          <div className="w-full bg-[#FAFAF9] mx-auto backdrop-blur-md p-6 rounded-2xl shadow-lg relative">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative w-full lg:flex-1" ref={searchInputRef}>
                <input
                  type="text"
                  placeholder="Recherchez un produit ou une région..."
                  className="w-full rounded-full px-5 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onFocus={() => setShowSuggestions(true)}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {suggestions.map((product) => (
                      <li
                        key={product.id}
                        className="px-5 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                        onClick={() => handleSuggestionClick(product.name)}
                      >
                        {product.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <select
                className="w-full lg:w-auto rounded-full px-5 py-3 border border-gray-300 text-black focus:outline-none"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">Région</option>
                <option value="Alger">Alger</option>
                <option value="Oran">Oran</option>
                <option value="Sétif">Sétif</option>
                {/* Ensure these values match your product.region_org values from API */}
              </select>

              <select
                className="w-full lg:w-auto rounded-full px-5 py-3 border border-gray-300 text-black focus:outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Catégorie</option>
                <option value="Fruits">Fruits</option> {/* Example: Match category.type or category string */}
                <option value="Vegetables">Légumes</option>
                <option value="Grains">Céréales</option>
                {/* Ensure these values match your product.category values from API */}
              </select>

              <select
                className="w-full lg:w-auto rounded-full px-5 py-3 border border-gray-300 text-black focus:outline-none"
                value={selectedCertification}
                onChange={(e) => setSelectedCertification(e.target.value)}
              >
                <option value="">Certification</option>
                <option value="BIO">BIO</option> {/* Example: Match a feature or specific cert field */}
                <option value="ISO">ISO</option>
                <option value="HALAL">HALAL</option>
                {/* Ensure these values match your product.features or a dedicated certification field */}
              </select>

              <button
                className="w-full lg:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full"
                onClick={handleSearchButtonClick}
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}