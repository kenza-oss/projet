import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  Code,
  GitBranch,
  Search,
  Database,
  Terminal,
  Layers,
  Zap,
  Users,
  CheckCircle2,
  ChevronRight,
  Mail,
  Phone,
  Clock,
  Globe,
  Video,
  X,
  Award,
  Briefcase,
  Target,
  Star
} from 'lucide-react';

const RegistrationModal = ({ isOpen, onClose, packTitle }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("Nom Complet"),
      email: formData.get("Email de contact"),
      level: formData.get("Université / Niveau"),
      pack: packTitle,
      link: formData.get("Lien CV / Portfolio") || "Non fourni"
    };

    try {
      // Tentative d'envoi via l'API Backend Kleer Infini (URL dynamique pour déploiement)
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/academy/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
        }, 5000);
      } else {
        throw new Error("Erreur serveur");
      }
    } catch (err) {
      // Fallback vers Formspree si le backend local n'est pas lancé
      try {
        await fetch("https://formspree.io/f/mqakvjge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
        }, 5000);
      } catch (e) {
        alert("Erreur lors de l'envoi automatique. Veuillez nous contacter à kleerinfini@gmail.com");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card"
            style={{ position: 'relative', width: '100%', maxWidth: '500px', padding: '40px', border: '1px solid var(--primary)', background: '#0a0a0a', boxShadow: '0 0 50px rgba(6, 182, 212, 0.2)' }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={24} />
            </button>

            {isSuccess ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#10b981', border: '2px solid #10b981' }}>
                  <CheckCircle2 size={48} />
                </div>
                <h2 style={{ color: 'white', marginBottom: '16px' }}>Demande Envoyée !</h2>
                <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Félicitations ! Votre demande pour le pack <strong>{packTitle}</strong> a été transmise automatiquement. Notre équipe vous répondra sous 24h.</p>
              </motion.div>
            ) : (
              <>
                <h2 style={{ marginBottom: '16px', fontSize: '1.8rem', color: 'white' }}>Inscription Academy</h2>
                <p style={{ marginBottom: '32px', color: '#a1a1aa' }}>Vous postulez pour le programme : <br /><span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.2rem' }}>{packTitle}</span></p>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span className="section-label" style={{ fontSize: '0.65rem' }}>Informations Personnelles</span>
                    <input required name="Nom Complet" type="text" placeholder="Ex: Jean Dupont" style={{ padding: '14px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white', outline: 'none' }} />
                    <input required name="Email de contact" type="email" placeholder="votre@email.com" style={{ padding: '14px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white', outline: 'none' }} />
                    <input required name="Université / Niveau" type="text" placeholder="Ex: M1 Informatique, ESI..." style={{ padding: '14px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white', outline: 'none' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span className="section-label" style={{ fontSize: '0.65rem' }}>Votre CV (Optionnel via lien Drive/Portfolio)</span>
                    <input name="Lien CV / Portfolio" type="text" placeholder="Lien Google Drive, LinkedIn ou Portfolio" style={{ padding: '14px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: 'white', outline: 'none' }} />
                  </div>

                  <button
                    disabled={isSubmitting}
                    className="glow-btn"
                    type="submit"
                    style={{ marginTop: '10px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem', opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    {isSubmitting ? "Envoi en cours..." : "Confirmer mon inscription"}
                    {!isSubmitting && <ChevronRight size={18} />}
                  </button>
                </form>
                <p style={{ marginTop: '24px', fontSize: '0.85rem', textAlign: 'center', color: '#a1a1aa' }}>
                  Besoin d'aide ? <a href="mailto:kleerinfini@gmail.com" style={{ color: 'var(--primary)', textDecoration: 'none' }}>kleerinfini@gmail.com</a>
                </p>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ onRegister }) => (
  <nav className="nav-container">
    <div className="nav-logo">
      <span style={{ color: 'white' }}>Kleer</span>
      <span style={{ color: 'var(--primary)', marginLeft: '6px', textShadow: '0 0 15px rgba(6, 182, 212, 0.4)' }}>Academy</span>
    </div>
    <div className="nav-links">
      <a href="#packs" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Packs</a>
      <a href="#method" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Méthode</a>
      <button onClick={() => onRegister("Inscription Générale")} className="glow-btn" style={{ padding: '8px 24px', fontSize: '0.8rem', cursor: 'pointer' }}>S'inscrire</button>
    </div>
  </nav>
);

const Hero = () => (
  <section className="hero-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 5%' }}>
    <div className="liquid-bg" />
    <div className="glass-overlay" />
    <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="section-label"
      >
        Formation 100% en Ligne par Kleer Infini
      </motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.3)', maxWidth: '900px', margin: '0 auto 24px', fontWeight: 300 }}
      >
        Ne codez pas seulement. <br /> <span style={{ fontWeight: 700 }}>Concevez l'excellence</span>.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ maxWidth: '650px', margin: '0 auto 40px', color: 'rgba(255,255,255,0.9)' }}
      >
        Rejoignez une formation animée par un Expert CTO. Transformez vos connaissances théoriques en compétences internationales réelles. Places limitées pour un suivi ultra-personnalisé.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}
      >
        <a href="#packs" className="glow-btn" style={{ textDecoration: 'none' }}>Voir les Packs</a>
        <a href="#method" style={{ background: 'transparent', border: '1px solid var(--card-border)', color: 'white', padding: '12px 32px', borderRadius: '100px', fontWeight: 600, textDecoration: 'none' }}>Déroulement</a>
      </motion.div>
    </div>
  </section>
);

const PackCard = ({ title, icon: Icon, tools, logic, duration, image, images, id, onRegister, toolLogos = [], details }) => (
  <motion.div
    id={id}
    whileHover={{ scale: 1.01 }}
    className="glass-card"
    style={{ padding: '40px', marginBottom: '40px', overflow: 'hidden', position: 'relative', borderRadius: '40px' }}
  >
    <div className="pack-grid">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Icon size={32} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>
            <Clock size={16} /> {duration}
          </div>
        </div>
        <h2 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>{title}</h2>
        <p style={{ marginBottom: '32px', color: 'var(--text-muted)' }}>{logic}</p>

        {details && (
          <div style={{ marginBottom: '32px', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            {details}
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
          <span className="section-label" style={{ fontSize: '0.65rem' }}>Systèmes & Outils</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            {toolLogos.map((logo, i) => (
              <img key={i} src={logo} alt="tool" style={{ height: '24px', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.2))' }} />
            ))}
          </div>
        </div>

        <button onClick={() => onRegister(title)} className="glow-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          S'inscrire à ce Pack <ChevronRight size={18} />
        </button>
      </div>

      <div className="float-anim">
        {images && images.length > 0 ? (
          <div className="pack-images-grid">
            <img
              src={images[0]}
              alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid var(--card-border)' }}
            />
            {images.slice(1, 3).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${title} detail ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.3)', border: '1px solid var(--card-border)' }}
              />
            ))}
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            style={{ width: '100%', borderRadius: '20px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: '1px solid var(--card-border)' }}
          />
        )}
      </div>
    </div>
  </motion.div>
);

const Methodology = () => (
  <section id="method" style={{ padding: '120px 5%' }}>
    <span className="section-label" style={{ textAlign: 'center', display: 'block', margin: '0 auto' }}>Pédagogie de Terrain</span>
    <h2 style={{ textAlign: 'center', marginBottom: '80px', fontSize: '2.5rem', color: 'var(--text-main)' }}>Le Déroulement <span style={{ color: 'var(--primary)' }}>Kleer Infini</span></h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', position: 'relative' }}>
      {[
        {
          icon: Globe,
          step: "01",
          title: "100% En Ligne",
          desc: "Accédez aux sessions depuis n'importe où via nos outils collaboratifs modernes (Meet, Discord)."
        },
        {
          icon: Video,
          step: "02",
          title: "Sessions Live",
          desc: "Animées le soir par le CTO. Pas de vidéos pré-enregistrées passives, uniquement de l'interaction en direct."
        },
        {
          icon: Zap,
          step: "03",
          title: "80% Pratique",
          desc: "Pas de cours magistraux interminables. Vous traitez des tickets réels, résolvez des bugs et déployez."
        },
        {
          icon: Users,
          step: "04",
          title: "Support 24/7",
          desc: "Accès direct à un groupe WhatsApp privé avec le CTO pour débloquer vos problèmes instantanément."
        }
      ].map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -10 }}
          className="glass-card"
          style={{ padding: '40px 30px', position: 'relative', zIndex: 1, borderTop: '4px solid var(--primary)', textAlign: 'center', borderRadius: '40px', background: 'var(--bg-color)' }}
        >
          <div style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-color)', border: '2px solid var(--primary)', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)' }}>
            {item.step}
          </div>
          <div style={{ width: '80px', height: '80px', background: 'rgba(6, 182, 212, 0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px auto 24px', color: 'var(--primary)' }}>
            <item.icon size={36} />
          </div>
          <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', color: 'var(--text-main)' }}>{item.title}</h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

const KleerBase = () => (
  <section style={{ padding: '120px 5%', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', zIndex: 0 }} />

    <div className="glass-card" style={{ position: 'relative', zIndex: 1, padding: '80px 5%', textAlign: 'center', border: '1px solid rgba(6, 182, 212, 0.2)', background: 'var(--bg-color)', borderRadius: '40px' }}>
      <span className="section-label" style={{ margin: '0 auto 16px', display: 'inline-block' }}>L'Avantage Exclusif</span>
      <h2 style={{ marginBottom: '24px', fontSize: '2.5rem', color: 'var(--text-main)' }}>La Fondation <span style={{ color: 'var(--primary)' }}>Kleer Infini</span></h2>
      <p style={{ maxWidth: '800px', margin: '0 auto 60px', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
        Nous ne nous contentons pas de vous former. Nous fournissons les bases réelles (Boilerplates, Architectures, Logique) sur lesquelles <strong style={{ color: 'var(--text-main)' }}>Kleer Infini</strong> construit ses services pour le marché international.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>
        {[
          { icon: Award, t: "Certification Pro", d: "Titre délivré par Kleer Infini, reconnu dans l'industrie." },
          { icon: Briefcase, t: "Portfolio Béton", d: "Un projet fonctionnel complet, prêt pour vos entretiens." },
          { icon: Target, t: "Mindset Freelance", d: "Les clés du marché international et la relation client." },
          { icon: Star, t: "Réseau d'Élite", d: "Accès à notre communauté privée de développeurs." }
        ].map((item, i) => (
          <motion.div whileHover={{ scale: 1.05 }} key={i} style={{ padding: '32px 24px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--card-border)', borderRadius: '32px', transition: 'all 0.3s' }}>
            <item.icon size={40} color="var(--primary)" style={{ marginBottom: '20px' }} />
            <h4 style={{ color: 'var(--text-main)', marginBottom: '12px', fontSize: '1.2rem' }}>{item.t}</h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{item.d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ContactFooter = () => (
  <footer id="contact" style={{ padding: '80px 5% 40px', borderTop: '1px solid var(--card-border)' }}>
    <div className="footer-grid">
      <div>
        <h2 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>Prêt à franchir le pas ?</h2>
        <p style={{ marginBottom: '32px' }}>Envoyez votre CV pour postuler. Places limitées à 15 étudiants par session.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mail size={20} color="var(--primary)" />
            <span style={{ color: 'var(--text-main)' }}>kleerinfini@gmail.com</span>
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Navigation</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Accueil</a>
          <a href="#packs" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Programmes</a>
          <a href="#method" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Méthodologie</a>
          <a href="https://www.kleerinfini.dz" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Kleer Infini Site</a>
        </div>
      </div>

      <div>
        <h4 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Bonus Étudiant</h4>
        <p style={{ fontSize: '0.9rem', marginBottom: '20px', color: 'var(--text-muted)' }}>
          Tarif préférentiel sur présentation de votre carte d'étudiant (L3/M1/M2).
        </p>
        <div style={{ padding: '16px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '12px', border: '1px solid var(--secondary)', color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
          Code Promo : STUDENT2026
        </div>
      </div>
    </div>
    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', borderTop: '1px solid var(--card-border)', paddingTop: '40px' }}>
      © 2026 Kleer Infini Academy. Propulsé par Kleer Infini DZ.
    </div>
  </footer>
);

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState("");

  const handleRegister = (title) => {
    setSelectedPack(title);
    setIsModalOpen(true);
  };

  return (
    <div style={{ background: 'var(--bg-color)' }}>
      <Navbar onRegister={handleRegister} />
      <Hero />

      <section id="packs" style={{ padding: '100px 5%' }}>
        <span className="section-label" style={{ textAlign: 'center', display: 'block' }}>Accélérateurs de Carrière</span>
        <h2 style={{ textAlign: 'center', marginBottom: '80px' }}>Nos <span style={{ color: 'var(--primary)' }}>Packs Intensifs</span></h2>

        <PackCard
          id="design"
          title="Design & Prototypage Premium"
          duration="4 Semaines"
          icon={Monitor}
          images={[
            "https://cdn.dribbble.com/userupload/25737727/file/original-fef713caaad09916bba8a1a7f27094da.png",
            "https://cdn.dribbble.com/userupload/9000434/file/original-903fac30a0a944a36dcfaeb29e373619.png",
            "https://cdn.dribbble.com/userupload/23744972/file/original-f09ad4491cf30c1628e68083ad7d12ad.jpg"
          ]}
          logic="Apprenez à concevoir des Design Systems complets. Maîtrisez Figma comme un professionnel du UI/UX international."
          details={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '8px', marginTop: '16px' }}>
                Immersion Totale Dès Le Jour 1
              </p>
              <p>Oubliez les configurations interminables. Chez Kleer Infini, votre environnement de travail est prêt avant même votre arrivée. Plongez directement dans la création :</p>

              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><Layers size={18} color="var(--primary)" /> 1. Environnement Collaboratif Prêt à l'Emploi</strong>
                <ul style={{ paddingLeft: '34px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong style={{ color: 'var(--primary)' }}>Figma Workspaces :</strong> Espaces d'équipe pré-configurés et structurés.</li>
                  <li><strong style={{ color: 'var(--primary)' }}>FigJam Boards :</strong> Templates prêts pour l'idéation, l'UX Journey et l'architecture.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} color="var(--primary)" /> 2. Ressources & Assets Premium</strong>
                <ul style={{ paddingLeft: '34px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong style={{ color: 'var(--primary)' }}>UI Kits Complets :</strong> Accélérez vos maquettes avec nos bibliothèques de composants.</li>
                  <li><strong style={{ color: 'var(--primary)' }}>Design Systems Réels :</strong> Étudiez les structures professionnelles de l'agence.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="var(--primary)" /> 3. Briefs de Projets Concrets</strong>
                <ul style={{ paddingLeft: '34px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong style={{ color: 'var(--primary)' }}>Backlog E-commerce :</strong> Spécifications claires pour des fonctionnalités e-commerce réelles.</li>
                  <li><strong style={{ color: 'var(--primary)' }}>User Personas :</strong> Ciblez vos designs avec des profils utilisateurs détaillés.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={18} color="var(--primary)" /> 4. Écosystème Professionnel Actif</strong>
                <ul style={{ paddingLeft: '34px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong style={{ color: 'var(--primary)' }}>Network Développeurs :</strong> Échangez en direct avec l'équipe technique pour valider la faisabilité.</li>
                  <li><strong style={{ color: 'var(--primary)' }}>Review & Validation :</strong> Processus de feedback réel (comme avec un client ou CTO).</li>
                </ul>
              </div>

              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '8px' }}>
                Connectez-vous et commencez à designer l'excellence sans perdre une seule minute.
              </p>
            </div>
          }
          toolLogos={[
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/storybook/storybook-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framer/framer-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg"
          ]}
          onRegister={handleRegister}
        />

        <PackCard
          id="fullstack"
          title="Fullstack Architecture Élite"
          duration="6 Semaines"
          icon={Code}
          images={[
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop"
          ]}
          logic="Architecture logicielle moderne. Apprenez à structurer vos projets avec les boilerplates utilisés par Kleer Infini."
          details={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '8px', marginTop: '16px' }}>
                Infrastructure Code Ready : Opérationnel Dès La Minute 1
              </p>
              <p>Ne perdez plus de temps à configurer des environnements complexes. Kleer Infini met à votre disposition une infrastructure technique de niveau production, prête à l'emploi.</p>

              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><Code size={18} color="var(--primary)" /> 1. La "Forge" de Développement (Boilerplates)</strong>
                <ul style={{ paddingLeft: '34px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong style={{ color: 'var(--primary)' }}>Boilerplate Next.js/React :</strong> Structure prête (Routage, Layout, SEO).</li>
                  <li><strong style={{ color: 'var(--primary)' }}>Core Backend (Python/Flask) :</strong> API de base pré-configurée pour le frontend.</li>
                  <li><strong style={{ color: 'var(--primary)' }}>Système d'Authentification :</strong> Modules JWT ou Supabase Auth prêts à l'emploi.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><Database size={18} color="var(--primary)" /> 2. L'Infrastructure Data & API</strong>
                <ul style={{ paddingLeft: '34px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong style={{ color: 'var(--primary)' }}>Base de Données (SQL) :</strong> Schéma modélisé prêt à recevoir vos données.</li>
                  <li><strong style={{ color: 'var(--primary)' }}>Scripts d'Automatisation :</strong> Traitement de données (Pandas) et gestion des requêtes.</li>
                  <li><strong style={{ color: 'var(--primary)' }}>Environnement de Déploiement :</strong> Configurations Render/Supabase testées et fonctionnelles.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><Terminal size={18} color="var(--primary)" /> 3. Le Dashboard de Travail</strong>
                <ul style={{ paddingLeft: '34px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong style={{ color: 'var(--primary)' }}>Documentation Technique :</strong> Guide d'architecture des services Kleergo.</li>
                  <li><strong style={{ color: 'var(--primary)' }}>API Documentation :</strong> Endpoints documentés (Swagger/Postman) pour tester immédiatement.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><Search size={18} color="var(--primary)" /> 4. Outils de Monitoring Pro</strong>
                <ul style={{ paddingLeft: '34px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong style={{ color: 'var(--primary)' }}>Logs de Production :</strong> Apprenez à débugger comme un vrai pro.</li>
                  <li><strong style={{ color: 'var(--primary)' }}>Support Technique :</strong> Accès direct au CTO pour débloquer les cas complexes.</li>
                </ul>
              </div>

              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '8px' }}>
                Oubliez la page blanche. Commencez avec une base professionnelle et concentrez-vous sur la logique métier et l'innovation.
              </p>
            </div>
          }
          toolLogos={[
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg"
          ]}
          onRegister={handleRegister}
        />

        <PackCard
          id="workflow"
          title="Workflow Multinational"
          duration="4 Semaines"
          icon={GitBranch}
          images={[
            "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop"
          ]}
          logic="Travaillez en équipe comme dans une multinationale. Maîtrisez le Git Flow, le Scrum et la livraison continue."
          details={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '8px', marginTop: '16px' }}>
                Immersion Directe : L'Ingénieur en Structure Internationale
              </p>
              <p>Entrez dans la peau d'un ingénieur. Chez Kleer Infini, tout est configuré pour simuler un environnement de haute performance dès votre premier jour.</p>

              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><Layers size={18} color="var(--primary)" /> 1. Écosystème de Gestion de Projet (Agile)</strong>
                <ul style={{ paddingLeft: '34px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong style={{ color: 'var(--primary)' }}>Dashboard Kanban/Scrum :</strong> Espace configuré (To Do, In Progress, Done).</li>
                  <li><strong style={{ color: 'var(--primary)' }}>Backlog de Tickets :</strong> Tâches techniques rédigées de manière professionnelle, prêtes à être assignées.</li>
                  <li><strong style={{ color: 'var(--primary)' }}>Calendrier des Rituels :</strong> Planning pré-établi (Daily Scrums, Revues de sprint).</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><GitBranch size={18} color="var(--primary)" /> 2. Infrastructure de Code Collaboratif</strong>
                <ul style={{ paddingLeft: '34px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong style={{ color: 'var(--primary)' }}>GitHub Enterprise :</strong> Accès aux dépôts avec branches protégées.</li>
                  <li><strong style={{ color: 'var(--primary)' }}>Git Flow :</strong> Gestion des branches (main, develop, feature) pour maîtriser la fusion de code.</li>
                  <li><strong style={{ color: 'var(--primary)' }}>Templates de PR :</strong> Modèles pré-remplis pour documenter les modifications avant validation du CTO.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={18} color="var(--primary)" /> 3. Canaux de Communication Business</strong>
                <ul style={{ paddingLeft: '34px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong style={{ color: 'var(--primary)' }}>Espace WhatsApp Pro :</strong> Canal configuré pour la coordination rapide d'équipe.</li>
                  <li><strong style={{ color: 'var(--primary)' }}>Visioconférence Permanente :</strong> Lien Meet dédié pour les points techniques et démos clients.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="var(--primary)" /> 4. Méthodologie "Software Delivery"</strong>
                <ul style={{ paddingLeft: '34px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong style={{ color: 'var(--primary)' }}>Standards (Clean Code) :</strong> Guide des conventions de nommage et de codage.</li>
                  <li><strong style={{ color: 'var(--primary)' }}>Processus Code Review :</strong> Grille d'évaluation pour donner et recevoir des critiques constructives.</li>
                </ul>
              </div>

              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '8px' }}>
                Ce que vous gagnez : Vous n'apprenez pas seulement des outils, vous assimilez une méthode de travail collective, la compétence la plus recherchée par les entreprises Tech.
              </p>
            </div>
          }
          toolLogos={[
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg",
            "https://cdn.worldvectorlogo.com/logos/vercel.svg",
            "https://cdn.worldvectorlogo.com/logos/netlify.svg"
          ]}
          onRegister={handleRegister}
        />
      </section>

      <Methodology />
      <KleerBase />
      <ContactFooter />

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        packTitle={selectedPack}
      />
    </div>
  );
}
