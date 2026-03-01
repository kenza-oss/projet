



const testimonials = [
  {
    name: "Sofia M.",
    country: "France",
    quote: "Une plateforme efficace et fiable pour nos besoins d'importation.",
    photo: "/assets/testimonials/sofia.jpg",
  },
  {
    name: "Karim A.",
    country: "Émirats",
    quote: "Des producteurs sérieux avec un bon support technique.",
    photo: "/assets/testimonials/karim.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 px-8 bg-black text-white">
      <h2 className="text-3xl font-bold mb-10 text-yellow-400 text-center">Témoignages clients</h2>
      <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-gray-900 p-6 rounded-xl shadow-md border-2 border-[#D2B48C] hover:shadow-[0_8px_32px_rgba(210,180,140,0.3)] transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <img src={t.photo} alt={t.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#D2B48C]" />
              <div>
                <h4 className="text-lg font-semibold">{t.name}</h4>
                <p className="text-sm text-[#D2B48C]">{t.country}</p>
              </div>
            </div>
            <blockquote className="italic text-gray-300">"{t.quote}"</blockquote>
          </div>
        ))}
      </div>
    </section>
  );
}
