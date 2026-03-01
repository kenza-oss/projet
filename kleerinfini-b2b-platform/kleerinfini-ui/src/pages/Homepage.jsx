import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import SearchSection from "../components/SearchSection";
import Category from "../components/category";
import ExportProductsSection from "../components/ExportProductsSection";
import Signup from "../components/Signup";
import EventsSection from "../components/EventsSection";
import BussinesSection from "../components/BussinesSection";
import CertificationsSection from "../components/CertificationsSection";
import StepsGuideSection from "../components/StepsGuideSection";
import Whychoose from "../components/Whychoose";
import Testimonials from "../components/Testimonials";
import AboutPreview from "../components/AboutPreview";
import Footer from "../components/Footer";
import Carte from "../components/Carte";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

function Homepage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);

  const handleSearch = (searchTerm, region, category) => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (region) params.append('region', region);
    if (category) params.append('category', category);

    navigate(`/products?${params.toString()}`);
  };

  return (
    <>
      <Helmet>
        <title>Kleer Infini | {t("home.hero.title")} {t("home.hero.subtitle")}</title>
        <meta name="description" content={t("home.footer.desc")} />
        <meta name="keywords" content="B2B, Export, Algérie, Produits Algériens, Sourcing, International Trade" />
        <meta property="og:title" content={`Kleer Infini - ${t("home.hero.title")} ${t("home.hero.subtitle")}`} />
        <meta property="og:description" content={t("home.footer.desc")} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />

      <main>
        <HeroSection onOpenMap={() => setShowMap(true)} />
        <SearchSection
          onSearch={handleSearch}
          onOpenMap={() => setShowMap(true)}
        />
        {showMap && <Carte onClose={() => setShowMap(false)} />}
        <Category />
        <ExportProductsSection />
        <Signup />
        <EventsSection />
        <CertificationsSection />
        <StepsGuideSection />
        <BussinesSection />
        <Whychoose />
        <Testimonials />
        <AboutPreview />
      </main>

      <Footer />
    </>
  );
}

export default Homepage;
