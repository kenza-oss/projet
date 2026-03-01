import React, { useState } from 'react';

// Icônes simples
const MapPin = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ProducerCard = ({ producer, onViewProfile, onContact }) => {
  // Exemple de fallback image si pas de documents


  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">


      
      {/* Infos principales */}
      <div className="px-6 pb-6">
        <div className="mb-4 space-y-2">
          <div>
            <span className="text-gray-500 text-sm font-medium">Entreprise :</span>
            <p className="text-gray-900 font-medium">{producer.company_name}</p>
          </div>
          
          <div>
            <span className="text-gray-500 text-sm font-medium">Adresse :</span>
            <p className="text-gray-900">{producer.address || "Non renseignée"}</p>
          </div>

          <div>
            <span className="text-gray-500 text-sm font-medium">Téléphone :</span>
            <p className="text-gray-900">{producer.phone || "Non renseigné"}</p>
          </div>
        </div>
        
        {/* Boutons actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onViewProfile(producer)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-1.5 px-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Voir plus
          </button>
          <button
            onClick={() => onContact(producer)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-1.5 px-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Contacter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProducerCard;
