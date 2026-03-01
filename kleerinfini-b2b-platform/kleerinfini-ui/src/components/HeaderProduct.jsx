import React, { useState } from "react";
import { Menu, X ,Users} from "lucide-react";
import logo from "../assets/logo.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full absolute top-0 left-0 z-20 text-white bg-transparent backdrop-blur-sm">
      <div className="flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-28 h-auto object-contain" />
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex lg:bg-transparent items-center gap-4 text-sm lg:text-lg">
          <a href="#" className="hover:underline">Se connecter / S'inscrire</a>
          <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded font-medium transition">
            S'inscrire en tant que Producteur
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded font-medium transition">
            Créer une demande d'importation
          </button>
        </div>
      </div>


      {/* Desktop Links */}
      <div className="hidden lg:flex gap-6 text-sm lg:text-lg px-4 lg:px-20 py-2">
        <a href="#" className="hover:underline">Accueil</a>
        <a href="#" className="hover:underline">Producteurs</a>
        <a href="#" className="hover:underline">Produits</a>
        <a href="#" className="hover:underline">Catégories</a>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden px-4 py-3 space-y-3 bg-transparent text-white">
          <a href="#" className="block hover:underline">Accueil</a>
          <a href="#" className="block hover:underline">Producteurs</a>
          <a href="#" className="block hover:underline">Produits</a>
          <a href="#" className="block hover:underline">Catégories</a>
          <hr className="border-white/20" />
          <a href="#" className="block hover:underline">Se connecter / S'inscrire</a>
          <button className="w-full bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded font-medium transition">
            S'inscrire en tant que Producteur
          </button>
          <button className="w-full bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded font-medium transition">
            Créer une demande d'importation
          </button>
        </div>
      )}
    </header>
  );
}
