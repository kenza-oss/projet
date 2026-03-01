import React from "react";
import {
  FaRocket, FaSearch, FaHandshake, FaChartLine,
  FaCloud, FaCogs, FaCode, FaGlobe, FaUserTie, FaDatabase, FaEye, FaLightbulb
} from "react-icons/fa";
import backgroundVideo from "../../assets/video6.mp4";
import bgBlurred from "../../assets/back.jpeg";
import partner1 from "../../assets/back.jpeg";
import partner2 from "../../assets/back.jpeg";
import partner3 from "../../assets/back.jpeg";
import partner4 from "../../assets/back.jpeg";
import partner5 from "../../assets/back.jpeg";
import partner6 from "../../assets/back.jpeg";

export default function AboutPage() {
  const scrollToMissions = () => {
    document.getElementById("missions")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="text-gray-800">
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ 
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              minWidth: '100vw',
              minHeight: '100vh'
            }}
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="w-full max-w-5xl px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white  drop-shadow-lg">
              QUI SOMMES-NOUS ?
            </h1>
            <p className="text-lg md:text-xl mb-6 text-white drop-shadow-md">
              Kleer Infini est une entreprise technologique algérienne spécialisée dans le développement de solutions numériques et commerciales dédiées aux marchés B2B nationaux et internationaux. Notre mission est d'accompagner la transformation digitale des entreprises, de renforcer leur compétitivité à l'export, et de leur fournir des outils concrets pour la prospection, le marketing et la mise en relation commerciale. Fondée par une équipe pluridisciplinaire, Kleer Infini associe des compétences en technologie, commerce international et intelligence de marché pour offrir une plateforme unique à valeur ajoutée.
            </p>
            <button
              onClick={scrollToMissions}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition-colors duration-200 shadow-lg"
            >
              Nos missions
            </button>
          </div>
        </div>
      </div>

      {/* Missions Section */}
      <section id="missions" className="py-16 px-6 md:px-12 lg:px-20 bg-white">
        <h2 className="text-3xl font-bold text-orange-500 mb-12 text-center">Notre mission</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <MissionCard icon={<FaRocket />} text="Simplifier et moderniser les processus de vente B2B, d'export et de génération de leads." />
          <MissionCard icon={<FaSearch />} text="Offrir une plateforme fiable, multilingue et constamment mise à jour, intégrant des outils d'aide à la décision." />
          <MissionCard icon={<FaHandshake />} text="Renforcer la visibilité internationale des entreprises algériennes à travers des solutions numériques performantes." />
        </div>
      </section>

      {/* Ce que nous proposons */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-[#fdf6ee]">
        <h2 className="text-3xl font-bold  text-orange-500 mb-12 text-center">Ce que nous proposons</h2>
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-8">
          <OfferCard title="Plateforme Sales & Marketing" icon={<FaChartLine />} desc="Moteur de recherche avancé pour filtrer les entreprises et accéder à des fiches détaillées." />
          <OfferCard title="Marketing digital B2B" icon={<FaGlobe />} desc="Promotion sur les marchés régionaux et internationaux avec contenu et ciblage." />
          <OfferCard title="EasyBusiness Export" icon={<FaUserTie />} desc="Démarches export : douane, stats, règlements, docs, référentiels." />
          <OfferCard title="Directory Business" icon={<FaDatabase />} desc="Annuaire structurant les données par secteur, région, produit, etc." />
        </div>
      </section>

      {/* Expertise */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-white">
        <h2 className="text-3xl font-bold text-orange-500 mb-12 text-center">Nos domaines d'expertise</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <ExpertiseItem label="Web & Mobile" icon={<FaCode />} />
          <ExpertiseItem label="Cloud & Infra IT" icon={<FaCloud />} />
          <ExpertiseItem label="Automatisation (CRM, ERP)" icon={<FaCogs />} />
          <ExpertiseItem label="Veille & Data B2B" icon={<FaEye />} />
          <ExpertiseItem label="Plateformes B2B" icon={<FaHandshake />} />
          <ExpertiseItem label="Internationalisation" icon={<FaGlobe />} />
        </div>
      </section>

      {/* Valeurs + Vision */}
      <section
        className="py-20 px-6 md:px-12 lg:px-20 bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${bgBlurred})` }}
      >
        <div className="bg-black bg-opacity-60 p-10 rounded-lg max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-orange-400 mb-6">Nos valeurs</h2>
          <p className="text-lg mb-6">Exigence – Transparence – Fiabilité – Innovation</p>
          <h2 className="text-3xl font-bold text-orange-400 mb-4">Notre vision</h2>
          <p className="text-lg">Faire de Kleer Infini un leader B2B digital en Afrique du Nord connecté à l'international grâce à une infrastructure intelligente et scalable.</p>
        </div>
      </section>

      {/* Partenaires */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-white">
        <h2 className="text-3xl font-bold text-orange-500 mb-12 text-center">Nos partenaires</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <PartnerCard name="Ali Benyoucef" role="Responsable Export" image={partner1} />
          <PartnerCard name="Sara Bensalem" role="Partenaire Tech" image={partner2} />
          <PartnerCard name="Nabil Ait" role="Directeur Com." image={partner3} />
          <PartnerCard name="Lina Brahimi" role="Responsable Marché" image={partner4} />
          <PartnerCard name="Ahmed Djellal" role="Consultant Senior" image={partner5} />
          <PartnerCard name="Yasmine Bacha" role="Data Strategist" image={partner6} />
        </div>
      </section>
    </div>
  );
}

function MissionCard({ icon, text }) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-orange-500 text-5xl">{icon}</div>
      <p className="text-lg max-w-xs text-center">{text}</p>
    </div>
  );
}

function OfferCard({ title, icon, desc }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center">
      <div className="text-4xl text-orange-500 mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}

function ExpertiseItem({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-4xl text-orange-500">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function PartnerCard({ image, name, role }) {
  return (
    <div className="bg-white p-4 shadow-md rounded-xl hover:shadow-lg transition flex flex-col items-center text-center">
      <img src={image} alt={name} className="w-28 h-28 rounded-full object-cover mb-4" />
      <h4 className="font-bold text-lg">{name}</h4>
      <p className="text-sm text-gray-600">{role}</p>
    </div>
  );
}