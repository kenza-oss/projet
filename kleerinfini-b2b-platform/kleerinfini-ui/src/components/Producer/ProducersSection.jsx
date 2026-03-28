import React, { useEffect, useState } from "react";
import {
  MapPin,
  Users,
  Globe,
  Package,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import api from "../../api/axios";

export default function ProducersSection() {
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const res = await api.get("profiles/"); 
        const data = res.data.results || res.data || [];
        setProducers(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les producteurs.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducers();
  }, []);

  return (
    <section className="py-16 px-8 bg-black text-white">
      <h2 className="text-3xl font-bold mb-10 text-yellow-400">
        Nos producteurs certifiés
      </h2>

      {/* Certifications */}
      <div className="bg-[#F5E8C7] rounded-xl p-8 mb-12">
        <h3 className="text-2xl font-bold mb-6 text-black text-center">
          Nos Certifications
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* ... keep your certifications here ... */}
        </div>
      </div>

      {/* Producers */}
      {loading ? (
        <p className="text-center text-gray-400">Chargement...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : producers.length === 0 ? (
        <p className="text-center text-gray-400">
          Aucun producteur disponible.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {producers.map((producer, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-xl p-6 shadow-md border-2 border-[#D2B48C] hover:shadow-[0_8px_32px_rgba(210,180,140,0.3)] transition-all duration-300"
            >
              <img
                src={producer.logo_url || "/placeholder.png"}
                alt={producer.company_name}
                className="h-32 mx-auto object-contain mb-4 rounded-lg"
              />
              <h3 className="text-xl font-semibold mb-2">{producer.company_name || "Producteur"}</h3>
              <p className="text-sm text-[#D2B48C]">
                {producer.city || "Algérie"}
              </p>
              <p className="text-sm text-yellow-400 font-medium">
                {producer.activity || "—"}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition shadow-md hover:shadow-[0_8px_32px_rgba(210,180,140,0.3)]">
          Voir tous les producteurs
        </button>
      </div>
    </section>
  );
}
