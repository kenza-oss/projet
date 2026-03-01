import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:8000/api/password_reset/', { email });
            setIsSent(true);
        } catch (err) {
            // Point 2: Generic message even on error if configured in backend, 
            // but here we handle API errors gracefully
            setIsSent(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 font-inter">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-10 border border-gray-100"
            >
                {/* Logo */}
                <div className="flex justify-center mb-10">
                    <div className="text-2xl font-black tracking-tighter uppercase italic">
                        KLEER <span className="text-blue-600">INFINI</span>
                    </div>
                </div>

                {!isSent ? (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">Mot de passe oublié ?</h2>
                            <p className="text-sm text-gray-500 font-medium">Saisissez votre e-mail pour recevoir un lien de réinitialisation stratégique.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Adresse E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="votre@email.com"
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isLoading ? "Traitement..." : "Envoyer le lien"}
                                <Send size={16} />
                            </button>
                        </form>
                    </>
                ) : (
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-center py-10"
                    >
                        <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center text-green-500 mx-auto mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">Email Envoyé !</h2>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
                            Si cette adresse est enregistrée, vous recevrez un lien de réinitialisation dans quelques instants.
                        </p>
                    </motion.div>
                )}

                <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                    <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={14} />
                        Retour à la connexion
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
