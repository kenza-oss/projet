import React from "react";

export default function SearchBar() {
  return (
   <div className="mt-10 w-full px-4 lg:px-8">
  <div className="w-full max-w-[1800px] mx-auto bg-black backdrop-blur-md p-8 rounded-2xl shadow-xl">
        
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between ">
     
          <input
            type="text"
            placeholder="Recherchez un produit ou une région..."
            className="flex-1 rounded-full px-6 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            <option value="fruits">ISO</option>
            <option value="vegetables">Légumes</option>
            <option value="grains">HALAL</option>
           
          </select>

          
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full ">
            Rechercher
          </button>
        </div>

        {/* 
        <div className="mt-4 flex flex-wrap gap-4 items-center">
          <span className="font-medium text-sm text-gray-700">Certification :</span>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-orange-500" />
            BIO
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-orange-500" />
            ISO
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-orange-500" />
            HALAL
          </label>
        </div> */}
      </div>
    </div>
  );
}
