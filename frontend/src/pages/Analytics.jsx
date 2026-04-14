import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart as BarChartIcon, Users, AlertTriangle, TrendingUp, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Analytics() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);
    const [error, setError] = useState("");

    const API_URL = import.meta.env.VITE_API_BASE_URL || "";

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${API_URL}/api/candidates/analytics`, config);
                if (data.success) {
                    setAnalytics(data.analytics);
                }
            } catch (err) {
                console.error("Failed to load analytics:", err);
                setError("Failed to fetch analytics from database.");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchAnalytics();
    }, [token, API_URL]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center pt-24 font-sans text-slate-200">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-400 font-medium animate-pulse">Running Database Aggregation Pipelines...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#07090E] flex items-center justify-center pt-24">
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-6 rounded-2xl flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6" />
                    <p className="font-bold">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#07090E] text-slate-200 pt-32 pb-6 px-6 md:px-10 font-sans selection:bg-blue-500/30 overflow-x-hidden">

            {/* Background Aesthetic Nodes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

            <div className="max-w-7xl mx-auto w-full relative z-10">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-2">
                            <div className="p-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <BarChartIcon className="w-6 h-6 text-blue-400" />
                            </div>
                            Recruiter Analytics
                        </h1>
                        <p className="text-slate-400 text-sm font-medium pl-14">Macro-level intelligence mapped across your holistic ingestion database.</p>
                    </div>
                </motion.div>

                {/* Hero Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    {/* Total Resumes Processed */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 border border-slate-700/50 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Users className="w-20 h-20 text-blue-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Candidates Processed</p>
                        <h2 className="text-4xl font-black text-white">{analytics?.totalResumes || 0}</h2>
                        <p className="text-xs text-slate-500 font-medium mt-2">Historically parsed & permanently stored</p>
                    </motion.div>

                    {/* Average Fraud Probability */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 border border-amber-500/20 rounded-3xl relative overflow-hidden group bg-gradient-to-br from-amber-500/5 to-transparent">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <AlertTriangle className="w-20 h-20 text-amber-500" />
                        </div>
                        <p className="text-xs font-bold text-amber-500/80 uppercase tracking-widest mb-2">Average Fraud Probability</p>
                        <h2 className="text-4xl font-black text-amber-400 flex items-baseline">
                            {analytics?.averageRisk || 0}<span className="text-lg text-amber-500/50 ml-1">/100</span>
                        </h2>
                        <p className="text-xs text-amber-500/50 font-medium mt-2">Calculated across the entire tenant pool</p>
                    </motion.div>

                    {/* High-Risk % */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 border border-rose-500/20 rounded-3xl relative overflow-hidden group bg-gradient-to-br from-rose-500/5 to-transparent">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <TrendingUp className="w-20 h-20 text-rose-500" />
                        </div>
                        <p className="text-xs font-bold text-rose-500/80 uppercase tracking-widest mb-2">High-Risk Candidates</p>
                        <h2 className="text-4xl font-black text-rose-400 flex items-baseline">
                            {analytics?.highRiskPercentage || 0}<span className="text-2xl text-rose-500/50 ml-1">%</span>
                        </h2>
                        <p className="text-xs text-rose-500/50 font-medium mt-2">Percentage of candidates scoring &gt;70 risk</p>
                    </motion.div>

                </div>

                {/* 6-Month Trailing Trend Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card border border-slate-700/50 rounded-3xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white">Trailing Ingestion Volume</h3>
                            <p className="text-sm font-medium text-slate-400">Monthly throughput vector measuring candidates processed by your partition.</p>
                        </div>
                        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs font-bold text-blue-400 uppercase tracking-widest">
                            6-Month View
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics?.trendData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                    itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="Scans"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorScans)"
                                    activeDot={{ r: 6, fill: '#3b82f6', stroke: '#0f172a', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
