import React from "react";
import logo from "../../assets/logo.png";

export default function Header() {
  return (
    <header className="w-full absolute top-0 left-0 z-20 text-white bg-transparent backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-4 py-2 space-y-4 lg:space-y-0">
   
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-28 h-auto object-contain" />
        </div>

      
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4 text-sm lg:text-lg w-full lg:w-auto">
          <a href="#" className="hover:underline px-2">
            Se connecter / S'inscrire
          </a>

          <button className="bg-orange-500 hover:bg-orange-600 px-3 py-2 rounded text-sm font-medium transition w-full lg:w-auto">
            S'inscrire en tant que Producteur
          </button>

          <button className="bg-orange-500 hover:bg-orange-600 px-3 py-2 rounded text-sm font-medium transition w-full lg:w-auto">
            Créer une demande d'importation
          </button>
        </div>
      </div>


      <div className="flex flex-wrap gap-4 text-sm lg:text-lg px-4 lg:pl-20 py-1">
        <a href="#" className="hover:underline">Accueil</a>
        <a href="#" className="hover:underline">Producteurs</a>
        <a href="#" className="hover:underline">Produits</a>
        <a href="#" className="hover:underline">Catégories</a>
      </div>
    </header>
  );
}
