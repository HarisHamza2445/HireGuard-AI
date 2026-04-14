import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Search, Filter, AlertTriangle, CheckCircle, ShieldAlert, Code2, Briefcase, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Candidates() {
    const { token } = useAuth();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const API_URL = import.meta.env.VITE_API_BASE_URL || '';

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${API_URL}/api/candidates`, config);
                if (data.success) {
                    setCandidates(data.data);
                }
            } catch (error) {
                console.error("Failed fetching candidates:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchCandidates();
    }, [token, API_URL]);

    const filteredCandidates = candidates.filter(c =>
        c.structuredData?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.filename?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getTrustColor = (score) => {
        if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        if (score >= 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    };

    if (loading) {
        return (
            <div className="relative min-h-screen bg-[#07090E] text-slate-200 flex items-center justify-center font-sans tracking-tight">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#07090E] text-slate-200 pt-32 pb-6 px-6 md:px-10 font-sans tracking-tight selection:bg-blue-500/30 overflow-x-hidden">
            <div className="max-w-7xl mx-auto w-full">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                            <Users className="w-3.5 h-3.5" /> Directory
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Candidates</span>
                        </h1>
                        <p className="text-slate-400 mt-2 font-medium max-w-xl">
                            Historic analysis payloads permanently preserved and bound to your encrypted tenant partition.
                        </p>
                    </motion.div>

                    {/* Search and Filter */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative group w-full md:w-80">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search candidates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/40 border border-slate-700/50 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-slate-500"
                            />
                        </div>
                        <button className="flex items-center justify-center w-11 h-11 bg-slate-900/40 border border-slate-700/50 rounded-xl hover:bg-slate-800 transition-colors shrink-0">
                            <Filter className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Grid View */}
                {filteredCandidates.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card flex flex-col items-center justify-center py-20 px-4 text-center border border-white/5 rounded-3xl">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                            <Users className="w-10 h-10 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Candidates Found</h3>
                        <p className="text-slate-400 font-medium max-w-md">
                            {searchQuery ? "No verified payloads match your search criteria." : "You have not verified any resumes yet. Navigate to the dashboard to begin analysis."}
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCandidates.map((candidate, idx) => (
                            <motion.div
                                key={candidate._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="glass-card p-6 border border-white/5 rounded-3xl hover:border-blue-500/30 hover:bg-slate-800/40 transition-all duration-300 relative overflow-hidden group cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 p-6 flex justify-end items-start pointer-events-none">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getTrustColor(candidate.finalScore)}`}>
                                        {candidate.finalScore >= 85 ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                        {candidate.finalScore}% Trust
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                        <span className="text-lg font-bold text-blue-400">
                                            {candidate.structuredData?.name?.charAt(0) || '?'}
                                        </span>
                                    </div>
                                    <div className="pt-1 pr-24">
                                        <h3 className="text-lg font-bold text-white leading-tight truncate">
                                            {candidate.structuredData?.name || 'Unknown Candidate'}
                                        </h3>
                                        <p className="text-sm text-slate-400 font-medium truncate">
                                            {candidate.structuredData?.highestDegree || 'Professional'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <Code2 className="w-4 h-4 text-blue-400 shrink-0" />
                                        <div className="flex gap-1.5 flex-wrap">
                                            {candidate.techData?.claimedStack?.slice(0, 3).map((tech, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-xs font-semibold">{tech}</span>
                                            ))}
                                            {candidate.techData?.claimedStack?.length > 3 && (
                                                <span className="px-2 py-0.5 bg-white/5 rounded text-xs font-semibold">+{candidate.techData.claimedStack.length - 3}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
                                        <span className="truncate">{candidate.employmentData?.length || 0} Professional Roles Detected</span>
                                    </div>

                                    {candidate.structuredData?.flags?.length > 0 && (
                                        <div className="flex items-center gap-3 text-sm text-rose-300">
                                            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                                            <span>{candidate.structuredData.flags.length} Security Flags</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-700/50 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                                    <p className="text-xs text-slate-500 font-medium font-mono">
                                        {new Date(candidate.createdAt).toLocaleDateString()}
                                    </p>
                                    <Link to={`/candidates/${candidate._id}`} className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider">
                                        View Report &rarr;
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
