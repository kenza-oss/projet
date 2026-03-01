import React, { useState } from "react";

export default function Footer() {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Français");

  const languages = [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇩🇿" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ];

  return (
    <footer className="bg-black text-white py-12 px-8 border-t-4 border-orange-500">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo & Description */}
          <div>
            <h3 className="text-2xl font-extrabold mb-4 text-white">AlgerExport</h3>
            <p className="text-gray-300 mb-4">
              La plateforme pour importer ou exporter facilement depuis l'Algérie.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Liens Rapides</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition">À propos</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition">Conditions</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition">Producteurs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition">Catalogue</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition">Commandes</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition">Support</a></li>
            </ul>
          </div>

          {/* Language Selector */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Langue</h3>
            <div className="relative">
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="bg-orange-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white hover:text-black transition"
              >
                <span>{languages.find(lang => lang.name === selectedLanguage)?.flag}</span>
                <span>{selectedLanguage}</span>
              </button>
              {languageOpen && (
                <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg z-10 w-full overflow-hidden border border-orange-500">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.name);
                        setLanguageOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-orange-100 flex items-center gap-2 text-black"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2025 AlgerExport. Tous droits réservés.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-orange-500 text-sm transition">
              Politique de confidentialité
            </a>
            <a href="#" className="text-gray-300 hover:text-orange-500 text-sm transition">
              Mentions légales
            </a>
            <a href="#" className="text-gray-300 hover:text-orange-500 text-sm transition">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
