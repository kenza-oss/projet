import React, { useState } from 'react';
import SearchSection from './SearchSection'; // Adjust path as needed
import ProductGrid from './ProductGrid';   // Adjust path as needed

export default function ProductsPage() {
  // States to hold the filter values from SearchSection
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [currentRegion, setCurrentRegion] = useState("");
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentCertification, setCurrentCertification] = useState("");

  // This function will be passed to SearchSection's 'onSearch' prop.
  // When SearchSection's "Rechercher" button is clicked, it will call this function
  // and update the filter states in this parent component.
  const handleSearchTrigger = (term, region, category, certification) => {
    setCurrentSearchTerm(term);
    setCurrentRegion(region);
    setCurrentCategory(category);
    setCurrentCertification(certification);
    // console.log("Parent received search trigger:", { term, region, category, certification });
  };

  return (
    <div>
      {/* SearchSection component */}
      {/* Pass the handleSearchTrigger function to SearchSection's onSearch prop */}
      <SearchSection onSearch={handleSearchTrigger} />

      {/* ProductGrid component */}
      {/* Pass the current filter states as props to ProductGrid */}
      <ProductGrid
        searchTerm={currentSearchTerm}
        selectedRegion={currentRegion}
        selectedCategory={currentCategory}
        selectedCertification={currentCertification}
      />
    </div>
  );
}
