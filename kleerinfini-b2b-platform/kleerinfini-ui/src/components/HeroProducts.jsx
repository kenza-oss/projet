
import React, { useEffect, useState, useRef } from "react";
import { Users, Globe, Package, Map } from "lucide-react";
import signup from "../assets/bg.jpeg";
import { useTranslation } from "react-i18next";

const HeroProducts = () => {
  const { t } = useTranslation();
  return (
    <section className="relative h-[70vh] text-white flex items-center justify-center text-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0">

        <img
          src={signup}
          alt=""
          className={`absolute w-full h-full object-cover transition-opacity duration-500
           "opacity-100" : "opacity-0"
            }`}

        />

      </div>

      <div className="relative  z-10 px-6 pt-40">
        <h1 className="text-3xl font-bold mb-4">
          {t("home.hero_products.title")}
        </h1>
        {/* <p className="text-xl mb-6">
          Plateforme B2B innovante pour des opportunités mondiales
        </p> */}


        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-semibold">{t("home.hero_products.stats.producers")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-semibold">{t("home.hero_products.stats.countries")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-semibold">{t("home.hero_products.stats.products")}</span>
          </div>
        </div>

        {/* <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition shadow-md">
            Explorer les produits
          </button>
          <button className="bg-white text-black hover:bg-gray-100 font-semibold px-6 py-3 rounded-full transition shadow-md flex items-center gap-2">
            <Map className="w-5 h-5" />
            Carte interactive
          </button> */}
        {/* </div> */}
      </div>
    </section>
  )
}

export default HeroProducts