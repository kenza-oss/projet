import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import evaJaneImage from "../../assets/image8.jpeg";

export default function TestimonialSection() {
  return (
    <section className="bg-[#f5f2eb] py-20 px-4">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[#42210b] mb-4">
          Importez ou exportez facilement avec notre plateforme.
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
          Profitez de nos services pour développer votre activité à l'international.
        </p>
        <a href="#" className="text-black font-medium underline mt-4 inline-block">
          Découvrir
        </a>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-10 shadow-md flex flex-col md:flex-row items-center gap-8">
        {/* Flèche gauche */}
        <button className="text-gray-500 hover:text-gray-700">
          <ChevronLeft size={24} />
        </button>

        {/* Image et info */}
        <div className="flex items-center gap-4">
          <img
            src={evaJaneImage}
            alt="Mohammed"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="text-left">
            <h3 className="font-semibold text-lg text-black">Mohammed</h3>
            <p className="text-sm text-gray-500">Exportateur</p>
          </div>
        </div>

        {/* Témoignage */}
        <blockquote className="flex-1 text-left text-lg font-medium text-black relative">
          <span className="text-5xl absolute -top-6 left-0 text-gray-300">“</span>
          <p className="pl-6">
            Très bon service, simple et rapide.
          </p>
        </blockquote>

        {/* Flèche droite */}
        <button className="text-gray-500 hover:text-gray-700">
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
