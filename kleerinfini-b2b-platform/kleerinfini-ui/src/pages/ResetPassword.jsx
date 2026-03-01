import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:8000/api/password_reset/confirm/', {
                token: token,
                password: password
            });
            setIsSuccess(true);
        } catch (err) {
            setError(err.response?.data?.password?.[0] || err.response?.data?.detail || 'Le lien est invalide ou a expiré.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 font-inter">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-10 border border-gray-100"
            >
                {/* Logo */}
                <div className="flex justify-center mb-10">
                    <div className="text-2xl font-black tracking-tighter uppercase italic">
                        KLEER <span className="text-blue-600">INFINI</span>
                    </div>
                </div>

                {!isSuccess ? (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">Nouveau Mot de Passe</h2>
                            <p className="text-sm text-gray-500 font-medium">Définissez une nouvelle clé d'accès sécurisée pour votre compte.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600 text-xs font-bold">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nouveau Mot de Passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-14 pr-14 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Confirmer le Mot de Passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isLoading ? "Mise à jour..." : "Réinitialiser"}
                                <ArrowRight size={16} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-10">
                        <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center text-green-500 mx-auto mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">Succès !</h2>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
                            Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 py-4 px-8 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                        >
                            Retour à la connexion
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ResetPassword;
