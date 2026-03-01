// src/pages/ProducerSearch.jsx
import React, { useState, useEffect } from 'react';
import ProducerCard from '../components/ProducerCard';
import api from '../../api/axios';
import { MapPin, Filter, Building, Package } from '../../components/icons';

const Search = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// Catégories et leurs certifications associées
// Catégories et leurs certifications associées (version complète)
const categoryCertificationMap = {
  "Produits agroalimentaires transformés": [
    "Certificat sanitaire / vétérinaire (si applicable)",
    "Certificat phytosanitaire (si ingrédients agricoles)",
    "HACCP / attestation hygiène",
    "Certificat d’analyse (CoA) / rapport laboratoire",
    "Certificat d’origine (CCI)",
    "Certificat Halal (si demandé)",
    "Fiche technique / étiquetage conforme",
    "Licence d’exportation (si applicable)",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Produits agricoles non transformés": [
    "Certificat phytosanitaire",
    "Certificat d’origine (CCI)",
    "Certificat de libre vente (si demandé)",
    "Certificat de qualité / CoA",
    "Packing list + facture commerciale",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Produits de la pêche & aquaculture": [
    "Certificat sanitaire vétérinaire / produits de la mer",
    "Certificat d’origine (CCI)",
    "Certificat d’analyse microbiologique / CoA",
    "Attestation HACCP",
    "Certificat de capture (si applicable)",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Produits zootechniques & animaux vivants": [
    "Certificat sanitaire vétérinaire d’exportation",
    "Passeport / document d’identification animale",
    "Certificat de conformité sanitaire",
    "Certificat d’origine",
    "Permis CITES (si espèces protégées)",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Équipements & machines zootechniques": [
    "Certificat de conformité / déclaration de conformité",
    "Certificat d’origine (CCI)",
    "Fiche technique / manuel sécurité",
    "Attestation de conformité technique (selon destination)",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Produits, équipements & machines agricoles": [
    "Certificat de conformité / déclaration CE (si UE)",
    "Certificat d’origine (CCI)",
    "Attestation de conformité technique / tests (CoC)",
    "Manuel d’utilisation / FDS si produits chimiques associés",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Produits miniers & métallurgiques": [
    "Certificat d’origine (CCI)",
    "Analyse chimique / certificat d’essai",
    "Licence d’exportation minière",
    "Certificat de conformité / contrôle qualité",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Matériaux & équipements de construction": [
    "Certificat de conformité / déclaration de performance (CPR/CE si UE)",
    "Certificat d’origine (CCI)",
    "Rapport d’essai (résistance, sécurité, feu)",
    "Attestation normes locales / pays de destination",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Produits de l’industrie mécanique": [
    "Certificat de conformité / déclaration CE (si applicable)",
    "Certificat d’origine (CCI)",
    "Rapport d’essai mécanique / CoA",
    "Manuel technique et fiche sécurité",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Produits chimiques & dérivés": [
    "Certificat de conformité chimique",
    "FDS / MSDS (fiche sécurité)",
    "Certificat d’analyse (CoA)",
    "Autorisation substances contrôlées (si applicable)",
    "Déclaration ADR / matières dangereuses",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Produits plastiques & PPE": [
    "Certificat de conformité sécurité / matériaux",
    "CoA / rapport d’essai",
    "Certificat d’origine (CCI)",
    "Marquage / conformité PPE",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Produits textiles & habillement": [
    "Certificat d’origine (CCI)",
    "Certificat de conformité textile (OEKO-TEX si demandé)",
    "Rapport d’essais (solidité, retrait, etc.)",
    "Déclaration REACH (si UE)",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Produits pharmaceutiques & médicaux": [
    "AMM / Autorisation de mise sur le marché",
    "Certificat GMP",
    "Certificat de libre vente",
    "Certificat d’analyse (CoA) / lot release",
    "Certificat d’origine (CCI)",
    "Enregistrement autorité santé (si requis)",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Meubles & décoration": [
    "Certificat de conformité sécurité / matériaux",
    "Certificat d’origine (CCI)",
    "Rapport d’essai (résistance, émissions, feu)",
    "Certification bois légal / CITES",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Produits électroménagers & électroniques": [
    "Certificat de conformité électrique (CE/UL/CB)",
    "Rapport d’essais EMC / sécurité électrique",
    "Déclaration de conformité (CoC)",
    "Certificat d’origine (CCI)",
    "Déclaration RoHS / REACH",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Machines & équipements industriels": [
    "Déclaration CE Machinery Directive (si UE)",
    "Certificat d’origine (CCI)",
    "Rapport d’essai / fiche technique",
    "Manuel utilisateur et étiquetage sécurité",
    "Attestation mise aux normes (si secteur réglementé)",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Produits ménagers & ustensiles": [
    "Certificat de conformité alimentaire (si contact alimentaire)",
    "Tests migration / CoA",
    "Certificat d’origine (CCI)",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Produits de beauté & cosmétiques": [
    "CPSR / Cosmetic Product Safety Report",
    "Certificat d’origine (CCI)",
    "Liste ingrédients INCI + fiche sécurité",
    "Certificat de libre vente",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Produits recyclés & écologiques": [
    "Certificat conformité environnementale / recyclage",
    "Certificat d’origine (CCI)",
    "Rapport d’analyse (composition, contamination)",
    "ISO 14001 (si exigé)",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],

  "Équipements & matériels électriques": [
    "Certificat de conformité électrique (CE/UL/IEC)",
    "Rapport EMC & sécurité (LVD)",
    "Certificat d’origine (CCI)",
    "Déclaration RoHS / conformité substances",
    "Facture commerciale",
    "Packing list",
    "Bill of Lading / Airway Bill",
    "Déclaration en douane (DAE)",
    "Licence/autorisation d’exportation"
  ],
};


const wilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
  "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès",
  "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf",
  "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla",
  "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
  "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet",
  "El M'Ghair", "El Meniaa"
];

const ProducerSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    sector: '',
    certification: '',
    region: '',
    type: ''
  });

  const [producers, setProducers] = useState([]);

  useEffect(() => {
    fetchProducers();
  }, []);

  const fetchProducers = async () => {
    try {
      const response = await api.get('/producers/');
      setProducers(response.data);
    } catch (error) {
      console.error('❌ Erreur producteurs:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      sector: '',
      certification: '',
      region: '',
      type: ''
    });
  };

  const filteredProducers = producers.filter(p => {
    return (
      (!filters.sector || p.sector?.toLowerCase().includes(filters.sector.toLowerCase())) &&
      (!filters.certification || p.certification?.toLowerCase().includes(filters.certification.toLowerCase())) &&
      (!filters.region || p.region?.toLowerCase().includes(filters.region.toLowerCase())) &&
      (!filters.type || p.type?.toLowerCase().includes(filters.type.toLowerCase())) &&
      (!searchTerm || p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const certificationsForSector = filters.sector ? categoryCertificationMap[filters.sector] || [] : [];

  return (
    <div className="min-h-screen">
      {/* HEADER + FILTERS FIXED */}
      <div className="fixed top-16 left-64 right-0 z-50 bg-white shadow-sm border-b mt-16">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between gap-8 mb-6">
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Recherche producteurs</h1>
              <p className="text-gray-600 text-base">Trouvez les producteurs qui correspondent à vos besoins</p>
            </div>
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un producteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base bg-white shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* FILTRES */}
          <div className="bg-[#f8f6f1] p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Filtres combinés</h3>
              </div>
              <button onClick={clearFilters} className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                Effacer tous
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Catégorie (secteur) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline w-4 h-4 mr-1" />
                  Catégorie
                </label>
                <select
                  value={filters.sector}
                  onChange={(e) => setFilters({ ...filters, sector: e.target.value, certification: '' })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
                >
                  <option value="">Toutes catégories</option>
                  {Object.keys(categoryCertificationMap).map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Certifications dynamiques */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications
                </label>
                <select
                  value={filters.certification}
                  onChange={(e) => setFilters({ ...filters, certification: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
                  disabled={!filters.sector || certificationsForSector.length === 0}
                >
                  <option value="">Toutes certifications</option>
                  {certificationsForSector.map((cert, i) => (
                    <option key={i} value={cert}>{cert}</option>
                  ))}
                </select>
              </div>

              {/* Région */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Région
                </label>
                <select
                  value={filters.region}
                  onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
                >
                  <option value="">Toutes les régions</option>
                  {wilayas.map((w, i) => (
                    <option key={i} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="inline w-4 h-4 mr-1" />
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
                >
                  <option value="">Tous les types</option>
                  <option value="Produit">Produit</option>
                  <option value="Service">Service</option>
                  <option value="Produit + Service">Produit + Service</option>
                  <option value="Savoir-faire / Service">Savoir-faire / Service</option>
                  <option value="Propriété intellectuelle">Propriété intellectuelle</option>
                  <option value="Données / Service">Données / Service</option>
                  <option value="Prototype / IP">Prototype / IP</option>
                  <option value="Immobilier">Immobilier</option>
                  <option value="Ressource humaine / Service">Ressource humaine / Service</option>
                  <option value="Service / Création">Service / Création</option>
                  <option value="Opportunité">Opportunité</option>
                  <option value="Collaboration">Collaboration</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Résultats */}

<div className="fixed top-[400px] left-64 right-0 bottom-0 bg-[#f5f2eb] overflow-y-auto">
  <div className="px-6 py-4">
 
    <p className="text-gray-600 text-lg font-medium mb-6">
      <span className="font-bold text-gray-900 text-xl">{filteredProducers.length}</span> producteurs trouvés
    </p>
    
    {filteredProducers.length > 0 ? (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredProducers.map((producer) => (
          <ProducerCard
            key={producer.id}
            producer={producer}
            onViewProfile={() => console.log('Voir profil:', producer.id)}
            onContact={() => console.log('Contacter:', producer.id)}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Building className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun producteur trouvé</h3>
          <p className="text-gray-600 mb-6">Aucun producteur ne correspond à vos critères de recherche actuels.</p>
          <button
            onClick={clearFilters}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Effacer les filtres
          </button>
        </div>
      </div>
    )}
  </div>
</div>
    </div>
  );
};

export default ProducerSearch;
