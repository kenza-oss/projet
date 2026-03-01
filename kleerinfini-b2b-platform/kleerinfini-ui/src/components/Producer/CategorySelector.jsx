import React, { useState, useEffect } from "react";
import { getCategories } from "../../api/categories";

const CategorySelector = ({ onSelect }) => {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(); // GET /api/categories/
        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleToggle = (category) => {
    const exists = selected.includes(category);
    const updated = exists
      ? selected.filter((c) => c !== category)
      : [...selected, category];
    setSelected(updated);
    onSelect(updated);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((cat) => (
        <div key={cat.id} className="bg-[#F8FAFC] border border-[#064E3B]/10 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-green-900/5 transition-all">
          <label className="block text-[11px] font-black text-[#064E3B] uppercase tracking-[0.2em] mb-4 pb-2 border-b border-[#064E3B]/10">{cat.name}</label>
          <div className="space-y-3">
            {cat.subcategories?.length > 0 ? (
              cat.subcategories.map((sub) => (
                <label key={sub} className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      value={sub}
                      checked={selected.includes(sub)}
                      onChange={() => handleToggle(sub)}
                      className="peer appearance-none w-5 h-5 border-2 border-[#064E3B]/20 rounded-lg checked:bg-[#10B981] checked:border-[#10B981] transition-all cursor-pointer"
                    />
                    <div className="absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-500 group-hover:text-[#10B981] transition-colors">{sub}</span>
                </label>
              ))
            ) : (
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">Aucun sous-catégorie</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySelector;
