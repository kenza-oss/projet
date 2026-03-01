import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import aboutVideo from "../../assets/video1.mp4"; // remplace par ton fichier réel

export default function AboutPreview() {
  return (
    <section className="bg-white py-16 px-6 md:px-20">
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Texte à gauche */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Qui sommes-nous ?
          </h2>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            <strong>Kleer Infini</strong> est une entreprise technologique algérienne spécialisée dans
            le développement de solutions numériques et commerciales dédiées aux marchés B2B.
            Notre objectif : accompagner la transformation digitale des entreprises et connecter les
            acteurs économiques à travers une plateforme innovante et performante.
          </p>

          <Link
            to="/about"
            className="inline-flex items-center bg-orange-500 text-white font-semibold px-6 py-2 rounded hover:bg-orange-600 transition"
          >
            Lire la suite <FaArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Vidéo à droite */}
        <div className="flex-1">
      <video
        autoPlay
        loop
        muted
        playsInline
        
      >
            <source src={aboutVideo} type="video/mp4" />
            Votre navigateur ne prend pas en charge la lecture de vidéos.
          </video>
        </div>
      </div>
    </section>
  );
}
