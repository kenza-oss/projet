import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../api/axios';
import { Search, X, MapPin, Loader, Phone, Mail, Award, BarChart3, FileText, ArrowRight, Lock, UserPlus, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Fix default Leaflet marker icons with custom orange markers
delete L.Icon.Default.prototype._getIconUrl;

// Create custom orange marker
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, #ff6b35, #ff8c42);
        width: 25px;
        height: 25px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(255, 107, 53, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 12px;
          font-weight: bold;
        ">📍</div>
      </div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  });
};

// Hook to update map center
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2) {
      map.setView(center, map.getZoom());
    }
  }, [map, center]);
  return null;
};

export default function Carte({ onClose }) {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [allProducers, setAllProducers] = useState([]);
  const [producersWithCoords, setProducersWithCoords] = useState([]);
  const [filteredProducers, setFilteredProducers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapCenter, setMapCenter] = useState([36.7538, 3.0588]); // Algeria center
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTargetId, setAuthTargetId] = useState(null);



  // Helper function to check if coordinates are valid
  const hasValidCoordinates = (producer) => {
    const lat = producer.latitude;
    const lng = producer.longitude;

    // Check if both exist and are not null/empty
    if (!lat || !lng) return false;

    // Convert to numbers and check if they're valid
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    return !isNaN(latNum) && !isNaN(lngNum) &&
      latNum >= -90 && latNum <= 90 &&
      lngNum >= -180 && lngNum <= 180;
  };

  // Fetch producers from database
  useEffect(() => {
    const fetchProducers = async () => {
      try {
        setLoading(true);
        setDebugInfo('Fetching data from API...');

        const response = await api.get('profiles/');
        const producersData = response.data.results || response.data || [];
        console.log("[DEBUG] Map Producers from Backend:", producersData);

        setAllProducers(producersData);
        setDebugInfo(`Fetched ${producersData.length} producers from API`);

        // Filter producers with valid coordinates
        const withCoords = producersData.filter(producer => hasValidCoordinates(producer));

        setProducersWithCoords(withCoords);
        setFilteredProducers(withCoords);
        setDebugInfo(`Found ${withCoords.length} producers with valid coordinates out of ${producersData.length} total`);

        if (withCoords.length > 0) {
          const firstProducer = withCoords[0];
          setMapCenter([parseFloat(firstProducer.latitude), parseFloat(firstProducer.longitude)]);
        }

      } catch (error) {
        console.error('Failed to fetch producer profiles:', error);
        setDebugInfo(`Error: ${error.message}`);
        setAllProducers([]);
        setProducersWithCoords([]);
        setFilteredProducers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducers();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredProducers(producersWithCoords);
      if (producersWithCoords.length > 0) {
        setMapCenter([parseFloat(producersWithCoords[0].latitude), parseFloat(producersWithCoords[0].longitude)]);
      }
      return;
    }

    const filtered = producersWithCoords.filter(producer => {
      const searchLower = searchTerm.toLowerCase();
      return (
        producer.company_name?.toLowerCase().includes(searchLower) ||
        producer.address?.toLowerCase().includes(searchLower) ||
        producer.city?.toLowerCase().includes(searchLower) ||
        producer.email?.toLowerCase().includes(searchLower) ||
        producer.user_email?.toLowerCase().includes(searchLower) ||
        producer.phone?.toLowerCase().includes(searchLower) ||
        producer.whatsapp?.toLowerCase().includes(searchLower) ||
        producer.activity?.toLowerCase().includes(searchLower) ||
        producer.country_display?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredProducers(filtered);

    if (filtered.length > 0) {
      setMapCenter([parseFloat(filtered[0].latitude), parseFloat(filtered[0].longitude)]);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredProducers(producersWithCoords);
    if (producersWithCoords.length > 0) {
      setMapCenter([parseFloat(producersWithCoords[0].latitude), parseFloat(producersWithCoords[0].longitude)]);
    } else {
      setMapCenter([36.7538, 3.0588]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col">
      {/* Header with close button */}
      <div className="flex justify-between items-center p-3 md:p-4 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <h2 className="text-white text-lg md:text-xl font-bold flex items-center gap-2">
          <MapPin className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
          <span className="truncate">{t("home.map.title")}</span>
        </h2>
        <button
          onClick={onClose}
          className="bg-orange-500 hover:bg-orange-600 rounded-full p-2 transition-all duration-200 hover:scale-110 shadow-lg"
        >
          <X className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </button>
      </div>

      {/* Debug Info (Hidden for production)
      <div className="p-4 bg-gray-800 text-white text-sm hidden">
        <div className="mb-2">
          <strong>Debug Info:</strong> {debugInfo}
        </div>
        ...
      </div>
      */}

      {/* Search bar */}
      <div className="flex justify-center p-4 md:p-6 bg-gradient-to-b from-orange-50 to-white">
        <div className="bg-white flex rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl max-w-2xl w-full border-2 border-orange-100">
          <input
            type="text"
            className="flex-1 px-4 md:px-6 py-3 md:py-4 text-sm md:text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-inset"
            placeholder={t("home.map.placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="px-2 md:px-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 md:px-8 text-white flex items-center hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium"
          >
            <Search className="w-5 h-5 md:w-6 md:h-6 md:mr-2" />
            <span className="hidden md:inline">{t("home.map.search")}</span>
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center pb-4">
          <div className="bg-white rounded-xl px-6 py-3 shadow-lg border border-orange-200">
            <div className="flex items-center gap-3 text-gray-700">
              <Loader className="w-5 h-5 animate-spin text-orange-500" />
              <span className="font-medium">{t("home.map.loading")}</span>
            </div>
          </div>
        </div>
      )}

      {/* Results counter */}
      {!loading && (
        <div className="flex justify-center pb-4">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full px-6 py-2 font-medium shadow-lg">
            {filteredProducers.length === 1
              ? t("home.map.count", { count: filteredProducers.length })
              : t("home.map.count_plural", { count: filteredProducers.length })}
          </div>
        </div>
      )}

      <div className="flex-1 p-2 md:p-6 bg-white">
        <MapContainer
          center={mapCenter}
          zoom={producersWithCoords.length > 0 ? 8 : 6}
          style={{ width: '100%', height: '100%' }}
          className="rounded-lg md:rounded-2xl shadow-2xl border-2 md:border-4 border-white"
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={mapCenter} />

          {!loading && filteredProducers.map((producer) => (
            <Marker
              key={producer.id}
              position={[parseFloat(producer.latitude), parseFloat(producer.longitude)]}
              icon={createCustomIcon()}
            >
              {/* Hover tooltip */}
              <Tooltip
                permanent={false}
                direction="top"
                offset={[0, -10]}
                className="custom-tooltip"
              >
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-lg font-medium shadow-lg">
                  🏢 {producer.company_name}
                </div>
              </Tooltip>

              {/* Click popup */}
              <Popup
                maxWidth={320}
                className="custom-popup"
              >
                <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-orange-100" style={{ minWidth: '250px', maxWidth: '320px' }}>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm break-words">{producer.company_name}</h3>
                        {producer.activity && (
                          <p className="text-orange-100 text-xs break-words mt-1">
                            {producer.activity}
                          </p>
                        )}
                      </div>
                      <button
                        className="ml-2 p-1.5 bg-orange-500 hover:bg-orange-600 rounded-full transition-all duration-300 hover:scale-110 flex-shrink-0 shadow-lg"
                        onClick={() => {
                          if (isAuthenticated) {
                            navigate(`/producer/${producer.id}`);
                          } else {
                            setAuthTargetId(producer.id);
                            setShowAuthModal(true);
                          }
                        }}
                        title={t("home.map.view_profile")}
                      >
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 space-y-2 text-sm">
                    {(producer.email || producer.user_email) && (
                      <div className="border-b border-gray-100 pb-2 flex items-center gap-2">
                        <Mail className="w-3 h-3 text-orange-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{t("home.map.email")}</p>
                          <p className="text-gray-800 break-all text-[11px] font-medium">{producer.email || producer.user_email}</p>
                        </div>
                      </div>
                    )}

                    {producer.phone && producer.phone.trim() !== '' && (
                      <div className="border-b border-gray-100 pb-2 flex items-center gap-2">
                        <Phone className="w-3 h-3 text-orange-500 shrink-0" />
                        <div>
                          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{t("home.map.phone")}</p>
                          <p className="text-gray-800 text-[11px] font-medium">{producer.phone}</p>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (isAuthenticated) {
                          navigate(`/producer/${producer.id}`);
                        } else {
                          setAuthTargetId(producer.id);
                          setShowAuthModal(true);
                        }
                      }}
                      className="w-full mt-3 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-gray-200"
                    >
                      {t("home.map.view_profile")}
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Auth Guard Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-8 md:p-12 max-w-lg w-full shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-rose-500"></div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce whitespace-nowrap">
              <Lock className="w-10 h-10 text-orange-500" />
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">Accès Réservé</h3>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium">
              Veuillez vous connecter en tant que client pour accéder à l'expérience complète et découvrir les profils détaillés de nos producteurs certifiés.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-3 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-[1.02]"
              >
                <LogIn className="w-4 h-4 text-orange-400" />
                Connexion
              </button>
              <button
                onClick={() => navigate('/register')}
                className="flex items-center justify-center gap-3 py-4 bg-white border-2 border-gray-100 hover:border-orange-500 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm hover:scale-[1.02]"
              >
                <UserPlus className="w-4 h-4 text-orange-500" />
                Inscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
