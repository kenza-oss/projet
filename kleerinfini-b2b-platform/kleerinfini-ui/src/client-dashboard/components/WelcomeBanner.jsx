import React from 'react';
import { useNavigate } from 'react-router-dom';
import bannerImg from '../../assets/welcome.jpg'; // Assurez-vous que le chemin est correct
import ProducerSearch from '../pages/ProducerSearch';

const WelcomeBanner = ({ nom = "Client", onNavigateToSearch }) => {
  const navigate = useNavigate();

  const handleStartExploration = () => {
    // Naviguer vers la section search (ProducerSearch component)
    if (onNavigateToSearch) {
      onNavigateToSearch('<ProducerSearch />');
    }
  };

  const handleLearnMore = () => {
    // Naviguer vers la page About
    navigate('/about');
  };

  return (
    <>
      {/* Image de fond qui couvre tout l'espace restant (excluant sidebar et header) */}
      <div 
        className="fixed top-0 left-64 right-0 bottom-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${bannerImg})`,
          marginTop: '80px' // Hauteur approximative du header
        }}
      >
        {/* Overlay gradient pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Contenu principal centré dans la zone couverte par l'image */}
      <div className="fixed top-20 left-64 right-0 bottom-0 z-10 flex items-center justify-center">
        {/* Contenu texte superposé */}
        <div className="flex flex-col justify-center px-8 md:px-12 max-w-4xl text-center">
          {/* Titre principal */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Bonjour {nom} 
            {/* <span className="inline-block ml-3 animate-bounce">👋</span> */}
          </h1>
          
          {/* Sous-titre */}
          <p className="text-xl md:text-2xl text-gray-200 mb-6 font-light">
            Prêt à explorer les meilleurs producteurs ?
          </p>
          
          {/* Description supplémentaire */}
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Découvrez des produits frais et authentiques directement des producteurs locaux. 
            Votre voyage culinaire commence ici.
          </p>
          
          {/* Bouton d'action */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={handleStartExploration}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Commencer l'exploration
            </button>
            <button 
              onClick={handleLearnMore}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 border border-white/30"
            >
              En savoir plus
            </button>
          </div>
        </div>
      </div>
      
      {/* Éléments décoratifs positionnés dans la zone image */}
      <div className="fixed top-24 right-4 w-20 h-20 bg-orange-500/20 rounded-full blur-xl z-10"></div>
      <div className="fixed bottom-8 right-8 w-16 h-16 bg-white/10 rounded-full blur-lg z-10"></div>
      
    </>
  );
};

export default WelcomeBanner;