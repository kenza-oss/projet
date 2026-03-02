import React, { useEffect, useState, useRef } from "react";
import { Users, Globe, Package, Map } from "lucide-react";
import luxHero from "../../assets/luxury_hero.png";
import hero1 from "../../assets/hero-bg-1.jpg";
import labo from "../../assets/labo.jpeg";

export default function HeroSection() {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef(null);

  const mediaItems = [
    { type: "image", src: labo, alt: "Labo", duration: 4000 },
    { type: "image", src: luxHero, alt: "Luxury Hero", duration: 4000 },
    { type: "image", src: hero1, alt: "Hero 1", duration: 4000 },
  ];

  const currentMedia = mediaItems[currentMediaIndex];

  const goToNextMedia = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentMediaIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
      setIsVisible(true);
    }, 500);
  };

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      goToNextMedia();
    }, currentMedia.duration || 4000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentMediaIndex]);


  return (
    <section className="relative h-[90vh] text-white flex items-center justify-center text-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <img
          src={currentMedia.src}
          alt={currentMedia.alt}
          className={`absolute w-full h-full object-cover transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"
            }`}
          key={`image-${currentMediaIndex}`}
        />
      </div>

      <div className="relative z-10 px-6">
        <h1 className="text-3xl font-bold mb-4">
          Connectez-vous aux meilleurs producteurs algériens
        </h1>
        <p className="text-xl mb-6">
          Plateforme B2B innovante pour des opportunités mondiales
        </p>


        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-semibold">+500 producteurs inscrits</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-semibold">10+ pays desservis</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-semibold">1000+ produits exportables</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition shadow-md">
            Explorer les produits
          </button>
          <button className="bg-white text-black hover:bg-gray-100 font-semibold px-6 py-3 rounded-full transition shadow-md flex items-center gap-2">
            <Map className="w-5 h-5" />
            Carte interactive
          </button>
        </div>
      </div>
    </section>
  );
}