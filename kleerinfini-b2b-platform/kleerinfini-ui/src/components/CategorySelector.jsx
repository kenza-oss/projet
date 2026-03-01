import React, { useState } from 'react';

const CATEGORIES = [
  { id: 1, name: 'Agroalimentaire', sub: ['Fruits', 'Légumes', 'Huile d\'olive'] },
  { id: 2, name: 'Construction', sub: ['Ciment', 'Céramique'] },
  { id: 3, name: 'Électricité', sub: ['Câbles', 'Transformateurs'] },
];

const CategorySelector = ({ onSelect }) => {
  const [selected, setSelected] = useState([]);

  const handleToggle = (category) => {
    const exists = selected.includes(category);
    const updated = exists ? selected.filter(c => c !== category) : [...selected, category];
    setSelected(updated);
    onSelect(updated);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(cat => (
        <div key={cat.id}>
          <label className="block font-semibold">{cat.name}</label>
          {cat.sub.map(sub => (
            <label key={sub} className="inline-flex items-center mr-3 mt-1">
              <input
                type="checkbox"
                value={sub}
                checked={selected.includes(sub)}
                onChange={() => handleToggle(sub)}
                className="mr-1"
              />
              {sub}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CategorySelector;
