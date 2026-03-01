import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Facebook, Instagram, Twitter,
    ArrowRight, Globe, Star, Shield, Zap, TrendingUp, ChevronDown,
    Calculator, Scale, Truck, LayoutDashboard
} from 'lucide-react';

// Import assets properly for Vite/React
import luxury1 from '../assets/export_luxury_1.png';
import luxury2 from '../assets/export_luxury_2.png';
import marbleFloral from '../assets/luxury_marble_floral.png';
import roseMarble from '../assets/luxury_rose_marble.png';
import pinkLeaves from '../assets/luxury_pink_leaves.jpg';
import glassArt from '../assets/luxury_glass_art.png';
import topBokeh from '../assets/luxury_flowers_bokeh.png';
import blueGoldCurtain from '../assets/luxury_blue_gold_curtain.png';

const ExportFacilitation = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();

    // Scroll-based animations for the immersive effect
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
    const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

    // Performance optimization for static decorations
    const particles = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 5,
    })), []);

    const sideSparkles = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: i % 2 === 0 ? Math.random() * 8 : 92 + Math.random() * 8,
        top: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 5
    })), []);

    return (
        <div className="relative min-h-[500vh] bg-[#050505] text-white selection:bg-[#D4A574]/30 selection:text-[#D4A574] overflow-x-hidden">
            <style>
                {`
                  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Montserrat:wght@200;300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
                  .font-serif-lux { font-family: 'Cinzel', serif; }
                  .font-serif-soft { font-family: 'Playfair Display', serif; }
                  .font-sans { font-family: 'Montserrat', sans-serif; }
                  
                  .luxury-text-gradient {
                    background: linear-gradient(to bottom, #FFFFFF 20%, #D4A574 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }

                  .gold-glow { box-shadow: 0 0 120px rgba(212, 165, 116, 0.2); }
                  
                  .glass-card {
                    background: rgba(10, 10, 10, 0.5);
                    backdrop-filter: blur(50px);
                    border: 1px solid rgba(212, 165, 116, 0.15);
                  }

                  .hover-glow:hover {
                    box-shadow: 0 0 40px rgba(212, 165, 116, 0.25);
                    border-color: rgba(212, 165, 116, 0.5);
                    transform: translateY(-5px);
                  }

                  ::-webkit-scrollbar { width: 6px; }
                  ::-webkit-scrollbar-track { background: #050505; }
                  ::-webkit-scrollbar-thumb { background: #D4A574; border-radius: 10px; }
                `}
            </style>

            {/* HERO SECTION - 100vh IMMERSIVE */}
            <section className="sticky top-0 h-screen w-full flex flex-col items-center justify-center z-30 pointer-events-none">
                <motion.div style={{ opacity }} className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black"></div>

                    {/* TOP BOKEH BACKGROUND */}
                    <div className="absolute inset-0 overflow-hidden">
                        <img src={topBokeh} className="w-full h-full object-cover opacity-30 mix-blend-screen" alt="Top Motif" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
                    </div>

                    {/* SVG DEFINITIONS FOR GLOW */}
                    <svg className="hidden">
                        <defs>
                            <filter id="gold-glow-filter-final-v3" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="20" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                    </svg>

                    {/* Mandalas */}
                    <div className="absolute left-[-15%] top-1/2 -translate-y-1/2 w-[1000px] h-[1000px] opacity-[0.07]">
                        <svg viewBox="0 0 800 800" className="w-full h-full animate-[spin_150s_linear_infinite]">
                            <circle cx="400" cy="400" r="390" fill="none" stroke="#D4A574" strokeWidth="0.5" />
                            {[...Array(24)].map((_, i) => (
                                <ellipse key={i} cx="400" cy="400" rx="380" ry="120" transform={`rotate(${i * 7.5} 400 400)`} fill="none" stroke="#D4A574" strokeWidth="0.5" />
                            ))}
                        </svg>
                    </div>
                    <div className="absolute right-[-15%] top-1/2 -translate-y-1/2 w-[1000px] h-[1000px] opacity-[0.07]">
                        <svg viewBox="0 0 800 800" className="w-full h-full animate-[spin_150s_linear_infinite_reverse]">
                            <circle cx="400" cy="400" r="390" fill="none" stroke="#D4A574" strokeWidth="0.5" />
                            {[...Array(24)].map((_, i) => (
                                <ellipse key={i} cx="400" cy="400" rx="380" ry="120" transform={`rotate(${i * 7.5} 400 400)`} fill="none" stroke="#D4A574" strokeWidth="0.5" />
                            ))}
                        </svg>
                    </div>

                    {/* Side Ribbons */}
                    <svg className="absolute left-0 top-0 h-full w-[15%] opacity-70" viewBox="0 0 200 1080" preserveAspectRatio="none">
                        <path d="M0,0 Q180,200 100,540 T0,1080" fill="none" stroke="#D4A574" strokeWidth="30" strokeOpacity="0.1" filter="url(#gold-glow-filter-final-v3)" />
                        <path d="M0,0 Q180,200 100,540 T0,1080" fill="none" stroke="#D4A574" strokeWidth="1.5" strokeOpacity="0.7" />
                    </svg>
                    <svg className="absolute right-0 top-0 h-full w-[15%] opacity-70" viewBox="0 0 200 1080" preserveAspectRatio="none">
                        <path d="M200,0 Q20,200 100,540 T200,1080" fill="none" stroke="#D4A574" strokeWidth="30" strokeOpacity="0.1" filter="url(#gold-glow-filter-final-v3)" />
                        <path d="M200,0 Q20,200 100,540 T200,1080" fill="none" stroke="#D4A574" strokeWidth="1.5" strokeOpacity="0.7" />
                    </svg>

                    {/* Side Sparkles */}
                    {sideSparkles.map((s) => (
                        <motion.div
                            key={`final-sparkle-${s.id}`}
                            className="absolute rounded-full bg-[#D4A574]"
                            style={{
                                left: `${s.left}%`,
                                top: `${s.top}%`,
                                width: `${s.size}px`,
                                height: `${s.size}px`,
                                boxShadow: '0 0 10px #D4A574',
                            }}
                            animate={{ opacity: [0, 1, 0], scale: [0.3, 1.5, 0.3] }}
                            transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: s.delay }}
                        />
                    ))}

                    {/* Particles */}
                    {particles.map((p) => (
                        <motion.div key={p.id} className="absolute rounded-full bg-[#D4A574]/30"
                            style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px` }}
                            animate={{ opacity: [0.1, 0.5, 0.1], y: [0, -50, 0] }}
                            transition={{ duration: 7, repeat: Infinity, delay: p.delay }}
                        />
                    ))}
                </motion.div>

                {/* HEADER */}
                <header className="absolute top-0 left-0 right-0 z-50 px-6 lg:px-16 py-8 lg:py-12 pointer-events-auto">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-[#D4A574] to-[#8B7355] flex items-center justify-center shadow-2xl">
                                <span className="text-black font-serif-lux font-bold text-xl lg:text-2xl">K</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-serif-lux text-base lg:text-xl leading-none tracking-[0.1em] font-bold">KLEER</span>
                                <span className="text-[#D4A574] font-serif-lux text-[8px] lg:text-[10px] tracking-[0.4em] leading-tight font-black uppercase">INFINI</span>
                            </div>
                        </div>
                    </div>
                    <nav className="hidden lg:flex gap-16 items-center text-[11px] font-black tracking-[0.3em] uppercase text-white/80">
                        {['home', 'platform', 'intelligence', 'security'].map(l => (
                            <button key={l} className="hover:text-[#D4A574] transition-all relative group pb-1 font-bold">
                                {t(`export_facilitation.header.${l}`)}
                                <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#D4A574]/20 blur-[2px] transition-all group-hover:w-full"></span>
                                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4A574] transition-all group-hover:w-full"></span>
                            </button>
                        ))}
                    </nav>
                </header>

                {/* CENTRAL FLOATING BLOCK - HEIGHT ADJUSTED FOR BUTTON VISIBILITY */}
                <motion.div style={{ scale, opacity }}
                    className="relative w-[90%] lg:w-full max-w-7xl min-h-fit lg:min-h-[600px] bg-black/40 rounded-[2rem] lg:rounded-[5rem] overflow-hidden gold-glow pointer-events-auto flex flex-col lg:flex-row"
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="flex-[1.2] p-8 md:p-16 lg:p-24 flex flex-col justify-center text-left relative z-10 bg-gradient-to-b lg:bg-gradient-to-r from-black/80 to-transparent">
                        <h2 className="text-[#D4A574] font-serif-lux text-[10px] lg:text-[12px] tracking-[0.3em] lg:tracking-[0.6em] mb-4 lg:mb-8 uppercase font-black">{t("export_facilitation.hero.badge")}</h2>
                        <h1 className="text-4xl md:text-6xl lg:text-9xl font-serif-lux mb-4 leading-[0.8] tracking-tighter">
                            <span className="block text-white font-serif-soft italic font-normal lowercase tracking-normal mb-2 lg:mb-4 opacity-100">{t("export_facilitation.hero.title_italic")}</span>
                            <span className="block font-black text-5xl md:text-7xl lg:text-[11rem] luxury-text-gradient drop-shadow-[0_0_40px_rgba(212,165,116,0.4)]">{t("export_facilitation.hero.title_main")}</span>
                        </h1>
                        <p className="mt-6 lg:mt-10 text-white/90 font-sans text-base lg:text-xl max-w-xl leading-relaxed font-light mb-8 lg:mb-12">
                            {t("export_facilitation.hero.desc")}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-10">
                            <button onClick={() => navigate('/producer-dashboard')} className="w-full sm:w-auto px-8 lg:px-12 py-4 lg:py-6 bg-[#D4A574] hover:bg-[#B88A58] text-black font-black text-[10px] lg:text-[11px] uppercase tracking-[0.2em] lg:tracking-[0.3em] rounded-xl lg:rounded-2xl transition-all flex items-center justify-center gap-4 lg:gap-6 shadow-2xl shadow-[#D4A574]/20">{t("export_facilitation.hero.button_primary")} <ArrowRight size={18} /></button>
                            <button className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] text-[#D4A574] border-b-2 border-[#D4A574]/20 pb-2 hover:text-white hover:border-[#D4A574] transition-all">{t("export_facilitation.hero.button_secondary")}</button>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#050505]">
                        <img src={luxury2} className="absolute inset-0 w-full h-full object-cover scale-110 opacity-70 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" alt="Luxury" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent"></div>

                        {/* DUST SYSTEM */}
                        <div className="absolute inset-0 pointer-events-none">
                            {Array.from({ length: 50 }).map((_, i) => (
                                <motion.div key={`hero-dust-v3-${i}`} className="absolute rounded-full bg-[#D4A574]/50" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px` }} animate={{ opacity: [0.1, 0.7, 0.1] }} transition={{ duration: 5, repeat: Infinity, delay: Math.random() * 5 }} />
                            ))}
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="w-80 h-80 glass-card rounded-full flex flex-col items-center justify-center border-2 border-[#D4A574]/20 shadow-[0_0_60px_rgba(212,165,116,0.1)]">
                                <Globe size={60} className="text-[#D4A574] mb-6 opacity-90 drop-shadow-[0_0_15px_rgba(212,165,116,0.5)]" />
                                <span className="text-[11px] tracking-[0.5em] font-serif-lux text-[#D4A574] font-black uppercase">{t("export_facilitation.hero.connectivity")}</span>
                                <span className="text-[8px] tracking-[0.3em] text-white/40 mt-2 font-bold uppercase">{t("export_facilitation.hero.network")}</span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* SCROLL INDICATOR */}
                <motion.div style={{ opacity }} animate={{ y: [0, 15, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-12 flex flex-col items-center gap-4 opacity-60 text-white">
                    <span className="text-[9px] tracking-[0.8em] uppercase font-black">{t("export_facilitation.scroll")}</span>
                    <ChevronDown size={20} className="text-[#D4A574]" />
                </motion.div>
            </section>

            {/* SCROLLABLE MAIN CONTENT */}
            <div className="relative z-40 bg-[#050505]">

                {/* SECTION 1: HUB STRATÉGIQUE */}
                <section className="min-h-screen py-24 lg:py-48 px-6 lg:px-12 max-w-7xl mx-auto flex items-center overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:grid-cols-2 lg:gap-32 items-center">
                        <motion.div initial={{ opacity: 0, x: -80 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }}>
                            <h3 className="text-[#D4A574] font-serif-lux text-[10px] lg:text-[11px] tracking-[0.4em] lg:tracking-[0.7em] mb-6 lg:mb-10 uppercase font-black">{t("export_facilitation.hub.badge")}</h3>
                            <h2 className="text-4xl lg:text-9xl font-serif-lux leading-[0.85] mb-8 lg:mb-16">
                                <span className="block text-white">{t("export_facilitation.hub.title_main")}</span>
                                <span className="block luxury-text-gradient font-black mt-4 drop-shadow-[0_0_20px_rgba(212,165,116,0.2)]">{t("export_facilitation.hub.title_gradient")}</span>
                            </h2>
                            <p className="text-white/80 text-lg lg:text-2xl leading-relaxed mb-12 lg:mb-20 max-w-2xl font-light">
                                {t("export_facilitation.hub.desc")}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-16">
                                <div className="space-y-4 lg:space-y-6 group">
                                    <Shield size={32} className="text-[#D4A574] group-hover:scale-125 transition-transform duration-500" />
                                    <h4 className="font-serif-lux text-[12px] lg:text-[14px] tracking-[0.2em] lg:tracking-[0.4em] text-white font-black uppercase">{t("export_facilitation.hub.cloud_title")}</h4>
                                    <p className="text-white/40 text-[9px] lg:text-[11px] tracking-widest font-black uppercase leading-loose">{t("export_facilitation.hub.cloud_desc")}</p>
                                </div>
                                <div className="space-y-4 lg:space-y-6 group">
                                    <Zap size={32} className="text-[#D4A574] group-hover:scale-125 transition-transform duration-500" />
                                    <h4 className="font-serif-lux text-[12px] lg:text-[14px] tracking-[0.2em] lg:tracking-[0.4em] text-white font-black uppercase">{t("export_facilitation.hub.ai_title")}</h4>
                                    <p className="text-white/40 text-[9px] lg:text-[11px] tracking-widest font-black uppercase leading-loose">{t("export_facilitation.hub.ai_desc")}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.9, rotate: -2 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 1.8, ease: "easeOut" }} className="relative h-[400px] lg:h-[750px] rounded-[3rem] lg:rounded-[6rem] overflow-hidden border-2 border-[#D4A574]/15 shadow-[0_0_100px_rgba(212,165,116,0.1)] group">
                            <img src={pinkLeaves} className="w-full h-full object-cover opacity-95 transition-transform duration-[4s] group-hover:scale-110" alt="Sovereignty" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                            <div className="absolute bottom-10 lg:bottom-16 left-10 lg:left-16 right-10 lg:right-16">
                                <div className="text-[8px] lg:text-[10px] tracking-[0.5em] lg:tracking-[1em] text-[#D4A574] font-black mb-4 uppercase">{t("export_facilitation.hub.ecosystem_tag")}</div>
                                <div className="h-[2px] w-full bg-[#D4A574]/20 overflow-hidden">
                                    <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 3, delay: 0.5 }} className="h-full bg-[#D4A574]" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* SECTION 2: PROGRAMME DE FACILITATION - LIGHTER BACKGROUND */}
                <section className="relative min-h-screen py-40 px-12 overflow-hidden bg-black">
                    <div className="absolute inset-0 z-0">
                        <img src={roseMarble} className="w-full h-full object-cover opacity-60" alt="Marble" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10 px-6">
                        <div className="text-center mb-24 lg:mb-40">
                            <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[#D4A574] font-serif-lux text-[10px] lg:text-[11px] tracking-[0.5em] lg:tracking-[1em] mb-8 lg:mb-12 uppercase font-black">{t("export_facilitation.program.badge")}</motion.h3>
                            <motion.h2 initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="text-4xl lg:text-9xl font-serif-lux text-white mb-8 lg:mb-12 leading-[0.85] tracking-tighter">
                                {t("export_facilitation.program.title_main")} <br /> <span className="italic font-serif-soft text-[#D4A574] block mt-4">{t("export_facilitation.program.title_italic")}</span>
                            </motion.h2>
                            <p className="max-w-3xl mx-auto text-white/70 text-base lg:text-xl font-light leading-relaxed">
                                {t("export_facilitation.program.desc")}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                            {[
                                {
                                    icon: <Calculator size={36} />,
                                    key: 'fspe'
                                },
                                {
                                    icon: <Globe size={36} />,
                                    key: 'zlecaf'
                                },
                                {
                                    icon: <Scale size={36} />,
                                    key: 'legal'
                                },
                                {
                                    icon: <Truck size={36} />,
                                    key: 'logistics'
                                }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.15 }}
                                    className="glass-card hover-glow p-8 lg:p-14 rounded-[2rem] lg:rounded-[4rem] transition-all duration-700 h-full flex flex-col group border-2"
                                >
                                    <div className="text-[#D4A574] mb-8 lg:mb-12 group-hover:rotate-[15deg] transition-transform duration-500 opacity-90">{item.icon}</div>
                                    <div className="text-[9px] lg:text-[10px] font-black tracking-[0.3em] lg:tracking-[0.5em] text-[#D4A574] mb-4 lg:mb-6 opacity-60 uppercase">{t(`export_facilitation.program.items.${item.key}.tag`)}</div>
                                    <h4 className="font-serif-lux text-xl lg:text-2xl text-white mb-4 lg:mb-8 font-black uppercase leading-tight">{t(`export_facilitation.program.items.${item.key}.title`)}</h4>
                                    <p className="text-white/60 text-xs lg:text-sm leading-relaxed font-light mt-auto">{t(`export_facilitation.program.items.${item.key}.desc`)}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 3: VISION & BOKEH ART */}
                <section className="min-h-screen py-24 lg:py-48 px-6 lg:px-12 max-w-7xl mx-auto flex items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} className="relative h-[400px] lg:h-[700px] rounded-[3rem] lg:rounded-[6rem] overflow-hidden border-2 border-[#D4A574]/20 shadow-2xl order-2 lg:order-1 group">
                            <img src={glassArt} className="w-full h-full object-cover opacity-85 transition-transform duration-[5s] group-hover:scale-110" alt="Vision" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center p-10 lg:p-20 text-center">
                                <div className="glass-card p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] border-[#D4A574]/40 scale-90 group-hover:scale-100 transition-transform duration-1000">
                                    <span className="text-[10px] lg:text-[12px] tracking-[0.4em] lg:tracking-[0.8em] font-serif-lux text-[#D4A574] font-black uppercase italic">{t("export_facilitation.vision.elite_badge")}</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 80 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="order-1 lg:order-2">
                            <h3 className="text-[#D4A574] font-serif-lux text-[10px] lg:text-[11px] tracking-[0.4em] lg:tracking-[0.7em] mb-6 lg:mb-10 uppercase font-black">{t("export_facilitation.vision.badge")}</h3>
                            <h2 className="text-4xl lg:text-9xl font-serif-lux leading-[0.9] text-white mb-8 lg:mb-16">
                                {t("export_facilitation.vision.title_main")} <br /> <span className="italic font-serif-soft text-[#D4A574]">{t("export_facilitation.vision.title_italic")}</span>
                            </h2>
                            <p className="text-white/80 text-lg lg:text-2xl leading-relaxed mb-12 lg:mb-16 max-w-2xl font-light">
                                {t("export_facilitation.vision.desc")}
                            </p>
                            <button className="w-full sm:w-auto px-10 lg:px-16 py-5 lg:py-7 border-2 border-[#D4A574] hover:bg-[#D4A574]/15 transition-all rounded-full font-serif-lux text-[10px] lg:text-[11px] tracking-[0.3em] lg:tracking-[0.5em] uppercase text-white font-black shadow-lg shadow-[#D4A574]/10">
                                {t("export_facilitation.vision.button")}
                            </button>
                        </motion.div>
                    </div>
                </section>

                {/* FINAL SECTION WITH BLUE & GOLD CURTAIN BACKGROUND - CONSTRAINED WIDTH */}
                <section className="relative py-24 lg:py-32 overflow-hidden border-t-2 border-[#D4A574]/10 bg-black">
                    <div className="absolute inset-0 z-0 max-w-7xl mx-auto rounded-[2rem] lg:rounded-[4rem] overflow-hidden px-4">
                        <img src={blueGoldCurtain} className="w-full h-full object-cover opacity-100" alt="Luxury Background" />
                    </div>

                    <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center relative z-10">
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }}>
                            <Star size={40} className="text-[#D4A574] mx-auto mb-12 lg:mb-20 opacity-90 drop-shadow-[0_0_20px_rgba(212,165,116,0.5)]" fill="#D4A574" />
                            <h2 className="text-4xl md:text-6xl lg:text-[10rem] font-serif-lux text-white mb-12 lg:mb-24 leading-[0.8] tracking-tighter">
                                {t("export_facilitation.final.title_main")} <br /> <span className="text-[#D4A574] italic font-serif-soft">{t("export_facilitation.final.title_italic")}</span>
                            </h2>
                            <p className="text-white/60 text-base lg:text-xl mb-16 lg:mb-32 tracking-[0.1em] lg:tracking-[0.2em] font-sans font-light max-w-3xl mx-auto uppercase leading-relaxed">
                                {t("export_facilitation.final.desc")}
                            </p>
                            <button
                                onClick={() => navigate('/producer-dashboard')}
                                className="group relative w-full sm:w-auto px-12 lg:px-24 py-6 lg:py-10 bg-[#D4A574] text-black font-black text-[11px] lg:text-[13px] uppercase tracking-[0.3em] lg:tracking-[0.6em] rounded-full overflow-hidden hover:scale-110 transition-all duration-700 shadow-[0_0_80px_rgba(212,165,116,0.3)]"
                            >
                                <span className="relative z-10 flex items-center gap-4 lg:gap-8 justify-center">
                                    {t("export_facilitation.final.button")} <ArrowRight size={20} lg:size={24} strokeWidth={3} />
                                </span>
                            </button>
                        </motion.div>
                    </div>
                </section>

                {/* FORMAL GLOBAL FOOTER */}
                <footer className="bg-black py-12 lg:py-20 px-6 lg:px-12 border-t border-white/5">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 lg:gap-16">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[#D4A574] flex items-center justify-center text-black font-serif-lux font-bold">K</div>
                                <span className="font-serif-lux text-xl tracking-widest text-white">KLEERINFINI</span>
                            </div>
                            <p className="max-w-xs text-white/40 text-[9px] lg:text-[10px] tracking-widest uppercase font-black leading-loose">
                                {t("export_facilitation.footer.desc")}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-20 w-full md:w-auto">
                            <div className="flex flex-col gap-4 lg:gap-6">
                                <h5 className="text-[10px] lg:text-[11px] font-black tracking-[0.2em] lg:tracking-[0.3em] text-[#D4A574] uppercase">{t("export_facilitation.footer.platform")}</h5>
                                {[
                                    { name: t("export_facilitation.footer.links.dashboard"), path: '/producer-dashboard' },
                                    { name: t("export_facilitation.footer.links.fspe"), path: '/facilitation-export' },
                                    { name: t("export_facilitation.footer.links.zlecaf"), path: '/facilitation-export' }
                                ].map(l => (
                                    <button key={l.name} onClick={() => navigate(l.path)} className="text-white/40 hover:text-white transition-colors text-[9px] lg:text-[10px] tracking-widest text-left font-bold uppercase">{l.name}</button>
                                ))}
                            </div>
                            <div className="flex flex-col gap-4 lg:gap-6">
                                <h5 className="text-[10px] lg:text-[11px] font-black tracking-[0.2em] lg:tracking-[0.3em] text-[#D4A574] uppercase">{t("export_facilitation.footer.resources")}</h5>
                                {[
                                    { name: t("export_facilitation.footer.links.docs"), path: '/' },
                                    { name: t("export_facilitation.footer.links.api"), path: '/' },
                                    { name: t("export_facilitation.footer.links.network"), path: '/' }
                                ].map(l => (
                                    <button key={l.name} onClick={() => navigate(l.path)} className="text-white/40 hover:text-white transition-colors text-[9px] lg:text-[10px] tracking-widest text-left font-bold uppercase">{l.name}</button>
                                ))}
                            </div>
                            <div className="flex flex-col gap-4 lg:gap-6">
                                <h5 className="text-[10px] lg:text-[11px] font-black tracking-[0.2em] lg:tracking-[0.3em] text-[#D4A574] uppercase">{t("export_facilitation.footer.sovereignty")}</h5>
                                {[
                                    { name: t("export_facilitation.footer.links.privacy"), path: '/' },
                                    { name: t("export_facilitation.footer.links.terms"), path: '/' },
                                    { name: t("export_facilitation.footer.links.legal"), path: '/facilitation-export' }
                                ].map(l => (
                                    <button key={l.name} onClick={() => navigate(l.path)} className="text-white/40 hover:text-white transition-colors text-[9px] lg:text-[10px] tracking-widest text-left font-bold uppercase">{l.name}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto mt-12 lg:mt-20 pt-10 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-6 text-[8px] tracking-[0.3em] lg:tracking-[0.5em] text-white/20 uppercase font-black text-center">
                        <span>{t("export_facilitation.footer.copyright")}</span>
                        <div className="flex gap-8">
                            <span>{t("export_facilitation.footer.algeria")}</span>
                            <span>{t("export_facilitation.footer.international")}</span>
                        </div>
                    </div>
                </footer>
            </div >
        </div >
    );
};

export default ExportFacilitation;
