// src/components/LanguageSelector.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'fr', name: 'FR' },
    { code: 'en', name: 'EN' },
    { code: 'ar', name: 'AR' },
    { code: 'es', name: 'ES' },
    { code: 'it', name: 'IT' },
    { code: 'tr', name: 'TR' },
  ];

  const handleChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  return (
    <div className="relative">
      <select
        value={i18n.language}
        onChange={handleChange}
        className="px-3 py-1 rounded border border-gray-300 bg-black text-sm text-white focus:outline-none focus:border-orange-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
