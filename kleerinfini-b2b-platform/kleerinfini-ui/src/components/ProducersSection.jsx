import React, { useState } from "react";
import { MapPin, Users, Globe, Package, Facebook, Twitter, Linkedin, Instagram, Menu, X, ChevronDown } from "lucide-react";


const producers = [
  {
    name: "Algeria Bio Farms",
    logo: "/assets/producers/biofarms.jpg",
    location: "Blida, Algeria",
    category: "Agriculture",
  },
  {
    name: "Sahara Dates Co.",
    logo: "/assets/producers/sahara-dates.jpg",
    location: "Biskra, Algeria",
    category: "Date Production",
  },
  {
    name: "Atlas Olive Oils",
    logo: "/assets/producers/atlas-olive.jpg",
    location: "Tizi Ouzou, Algeria",
    category: "Olive Oil",
  },
];

export default function ProducersSection() {
  return (
    <section className="py-16 px-8 bg-black text-white">
      <h2 className="text-3xl font-bold mb-10 text-yellow-400">
        Nos producteurs certifiés
      </h2>


      <div className="bg-[#F5E8C7] rounded-xl p-8 mb-12">
        <h3 className="text-2xl font-bold mb-6 text-black text-center">Nos Certifications</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-md border-2 border-[#D2B48C] hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">ISO</span>
              </div>
              <p className="text-sm font-medium text-gray-700">ISO 9001</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md border-2 border-[#D2B48C] hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">HALAL</span>
              </div>
              <p className="text-sm font-medium text-gray-700">Certifié Halal</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md border-2 border-[#D2B48C] hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">BIO</span>
              </div>
              <p className="text-sm font-medium text-gray-700">Agriculture Bio</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md border-2 border-[#D2B48C] hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">FDA</span>
              </div>
              <p className="text-sm font-medium text-gray-700">FDA Approuvé</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {producers.map((producer, index) => (
          <div key={index} className="bg-gray-900 rounded-xl p-6 shadow-md border-2 border-[#D2B48C] hover:shadow-[0_8px_32px_rgba(210,180,140,0.3)] transition-all duration-300">
            <img
              src={producer.logo}
              alt={producer.name}
              className="h-32 mx-auto object-contain mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{producer.name}</h3>
            <p className="text-sm text-[#D2B48C]">{producer.location}</p>
            <p className="text-sm text-yellow-400 font-medium">
              {producer.category}
            </p>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <button className="bg-[#FF6600] hover:bg-[#E65C00] text-white font-semibold px-6 py-3 rounded-full transition shadow-md hover:shadow-[0_8px_32px_rgba(255,102,0,0.3)]">
          Voir tous les producteurs
        </button>
      </div>
    </section>
  );
}