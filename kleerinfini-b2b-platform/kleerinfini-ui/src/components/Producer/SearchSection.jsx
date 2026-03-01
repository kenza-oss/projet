import React, { useState } from "react";
import { MapPin } from "lucide-react";

export default function SearchSection() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <section className="py-8 px-3 bg-black text-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Trouvez vos produits d'exportation
        </h2>

        <div className="w-full">
          <div className="w-full bg-[#FAFAF9] mx-auto backdrop-blur-md p-6 rounded-2xl shadow-lg">
          
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
 
              <input
                type="text"
                placeholder="Recherchez un produit ou une région..."
                className="flex-1 rounded-full px-5 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              
              <select className="rounded-full px-5 py-3 border border-gray-300 text-black focus:outline-none">
                <option value="">Région</option>
                <option value="algiers">Alger</option>
                <option value="oran">Oran</option>
                <option value="setif">Sétif</option>
              </select>

       
              <select className="rounded-full px-5 py-3 border border-gray-300 text-black focus:outline-none">
                <option value="">Catégorie</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Légumes</option>
                <option value="grains">Céréales</option>
              </select>

            
              <select className="rounded-full px-5 py-3 border border-gray-300 text-black focus:outline-none">
                <option value="">BIO</option>
                <option value="iso">ISO</option>
                <option value="halal">HALAL</option>
              </select>

             
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full">
                Rechercher
              </button>
            </div>
          </div>
        </div>

       
        <div className="text-center mt-8">
          <button className="bg-black hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-lg transition shadow-md hover:shadow-[0_8px_32px_rgba(210,180,140,0.3)] flex items-center gap-3 mx-auto border border-white">
            <MapPin className="w-6 h-6" />
            Carte Interactive des Producteurs
          </button>
        </div>
      </div>
    </section>
  );
}
