import React from "react";

const advantages = [
  { icon: "", title: "Producteurs vérifiés" },
  { icon: "", title: "Plateforme sécurisée" },
  { icon: "", title: "Commandes rapides" },
  { icon: "", title: "Paiement encadré" },
  { icon: "", title: "Support multilingue" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 px-8 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-10 text-yellow-400">Pourquoi nous choisir ?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {advantages.map((adv, i) => (
          <div key={i} className="flex items-center gap-4 bg-black p-4 rounded-lg shadow-md">
            <span className="text-3xl">{adv.icon}</span>
            <h3 className="text-lg font-semibold">{adv.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
