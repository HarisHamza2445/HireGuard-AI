import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Mail, Lock, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate('/'); // Reroute to protected dashboard boundary
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Invalid credentials');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#07090E] flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden font-sans">

            {/* Dynamic Abstract Background Geometry */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex justify-center"
                >
                    <div className="relative p-3.5 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl">
                        <ShieldAlert className="w-10 h-10 text-blue-500 relative z-10" />
                        <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-md"></div>
                    </div>
                </motion.div>
                <motion.h2
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mt-6 text-center text-3xl font-black tracking-tight text-white drop-shadow-sm"
                >
                    Sign in to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">HireGuard</span>
                </motion.h2>
                <motion.p
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-2 text-center text-sm text-slate-400 font-medium"
                >
                    Enterprise AI Verification Engine
                </motion.p>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-[420px] relative z-10"
            >
                <div className="glass-card bg-slate-900/40 backdrop-blur-2xl py-10 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-700/50 rounded-3xl sm:px-12 relative overflow-hidden">

                    {/* Inner glowing top border effect */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-300 font-medium">{error}</p>
                            </motion.div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-[#0B0F19]/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all sm:text-sm font-medium"
                                    placeholder="recruiter@enterprise.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Secure Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-[#0B0F19]/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all sm:text-sm font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full relative group flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-[#07090E] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4 relative z-10" />
                                        <span className="relative z-10">Sign in securely</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-400 font-medium">
                            New to HireGuard?{' '}
                            <Link to="/register" className="font-bold text-blue-400 hover:text-blue-300 transition-colors drop-shadow-sm">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
