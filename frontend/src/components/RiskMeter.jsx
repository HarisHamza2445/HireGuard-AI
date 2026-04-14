import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldCheck, AlertTriangle, ShieldAlert, BrainCircuit, Info } from "lucide-react";
import Tilt from "react-parallax-tilt";

export default function RiskMeter({ data, isProcessing }) {
    const isLoaded = !!data;

    const riskValue = isLoaded ? (data.riskData?.fraudProbability || 0) : 0;
    const level = isLoaded ? (data.riskData?.level || "Pending") : "Pending";

    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - ((riskValue / 100) * circumference);

    const getColor = (level) => {
        switch (level) {
            case "High": return "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]";
            case "Medium": return "text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]";
            case "Low": return "text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]";
            default: return "text-gray-500 drop-shadow-[0_0_15px_rgba(107,114,128,0.3)]";
        }
    };

    const currentColor = getColor(level);

    const getIcon = (level) => {
        switch (level) {
            case "High": return <ShieldAlert className="w-8 h-8 text-red-500 filter drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />;
            case "Medium": return <AlertTriangle className="w-8 h-8 text-amber-500 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />;
            case "Low": return <ShieldCheck className="w-8 h-8 text-emerald-500 filter drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />;
            default: return <Activity className="w-8 h-8 text-gray-500 filter drop-shadow-[0_0_10px_rgba(107,114,128,0.5)]" />;
        }
    };

    return (
        <Tilt
            glareEnable={true}
            glareMaxOpacity={0.08}
            glareColor="#ffffff"
            glarePosition="all"
            tiltMaxAngleX={2}
            tiltMaxAngleY={2}
            perspective={1000}
            scale={1.01}
            transitionSpeed={2000}
            className="h-full"
        >
            <div className="glass-card glass-card-hover rounded-3xl p-8 relative overflow-hidden h-full flex flex-col group/risk">

                {/* Animated Background Glow Element */}
                <AnimatePresence>
                    {isLoaded && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className={`absolute -top-1/2 -left-1/2 w-full h-full rounded-full mix-blend-screen filter blur-[80px] opacity-10 pointer-events-none transition-all duration-1000
                 ${level === "High" ? "bg-red-500" : level === "Medium" ? "bg-amber-500" : "bg-emerald-500"}
               `}
                        />
                    )}
                </AnimatePresence>

                <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-white tracking-wide z-10">
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <Activity className="w-5 h-5 text-indigo-400" />
                    </div>
                    Risk Intelligence Matrix
                </h2>

                <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-12 z-10">

                    {/* Animated Circular Gauge */}
                    <div className="relative w-56 h-56 flex items-center justify-center shrink-0 group">

                        {/* Outer Decorative Ring */}
                        <div className={`absolute inset-0 rounded-full border border-slate-700/50 shadow-inner ${isProcessing ? 'animate-spin-slow' : ''}`}></div>

                        <svg className="w-full h-full transform -rotate-90 filter drop-shadow-md" viewBox="0 0 100 100">
                            <circle
                                cx="50" cy="50" r="45"
                                fill="transparent"
                                stroke="rgba(255,255,255,0.03)"
                                strokeWidth="6"
                            />
                            <motion.circle
                                cx="50" cy="50" r="45"
                                fill="transparent"
                                stroke={isLoaded ? `url(#gradient-${level})` : "rgba(255,255,255,0.1)"}
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: isProcessing ? circumference * 0.7 : strokeDashoffset }}
                                transition={{ duration: isProcessing ? 2 : 2, ease: "circOut", repeat: isProcessing ? Infinity : 0, repeatType: isProcessing ? "reverse" : "loop" }}
                                className="drop-shadow-2xl"
                            />
                            <defs>
                                <linearGradient id="gradient-High" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#f87171" />
                                    <stop offset="50%" stopColor="#ef4444" />
                                    <stop offset="100%" stopColor="#991b1b" />
                                </linearGradient>
                                <linearGradient id="gradient-Medium" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#fbbf24" />
                                    <stop offset="50%" stopColor="#f59e0b" />
                                    <stop offset="100%" stopColor="#b45309" />
                                </linearGradient>
                                <linearGradient id="gradient-Low" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#34d399" />
                                    <stop offset="50%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#047857" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Inner Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 rounded-full m-6 backdrop-blur-md border border-slate-700/50 shadow-sm">
                            {isProcessing ? (
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-8 h-8 rounded-full border-b-2 border-indigo-500 animate-spin mb-2"></div>
                                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest animate-pulse">Computing</span>
                                </div>
                            ) : (
                                <>
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        key={riskValue}
                                        className={`text-6xl font-black ${currentColor}`}
                                    >
                                        {riskValue}%
                                    </motion.span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
                                        Probability
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Risk Status Indicator */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 min-w-[200px]">
                        <p className="text-xs text-gray-500 font-bold tracking-[0.2em] uppercase mb-4">Final Assessment</p>

                        <div className="w-full relative group/status">
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-800/20 to-transparent rounded-2xl opacity-0 group-hover/status:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                            <div className="flex items-center gap-5 bg-slate-900/50 px-6 py-5 rounded-2xl border border-slate-700/50 shadow-sm backdrop-blur-md">
                                <div className="shrink-0">
                                    {getIcon(level)}
                                </div>
                                <div>
                                    <p className={`text-2xl font-black tracking-wide ${currentColor}`}>
                                        {isProcessing ? "Analyzing..." : `${level} Risk`}
                                    </p>

                                    {isLoaded ? (
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-xs font-semibold text-gray-400">AI Confidence:</span>
                                            <div className="h-1.5 w-16 bg-gray-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${data.riskData?.confidenceScore || 0}%` }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-400"
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-blue-300">{data.riskData?.confidenceScore || 0}/100</span>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-500 mt-1 font-medium">Awaiting valid input payload</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Explainable AI (XAI) Breakdown Panel */}
                {isLoaded && data.fraudAnalysis && !isProcessing && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-10 pt-8 border-t border-slate-700/50 z-10 w-full"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <BrainCircuit className="w-5 h-5 text-indigo-400" />
                            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest drop-shadow-md">Explainable AI Engine</h3>
                        </div>

                        <div className="bg-slate-900/40 rounded-2xl border border-slate-700/50 p-6 flex flex-col lg:flex-row gap-8 shadow-sm">

                            {/* Reasoning Text */}
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-blue-400" />
                                    Why this Score?
                                </p>
                                <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-indigo-500/50 pl-4 py-1 font-medium">
                                    {data.fraudAnalysis.reasoning}
                                </p>
                            </div>

                            {/* Contribution Factors */}
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                                    Risk Signal Breakdown
                                </p>
                                <div className="space-y-3">
                                    {data.fraudAnalysis.contributingFactors?.map((factor, i) => (
                                        <div key={i} className="flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                                                <span>{factor.factor}</span>
                                                <span className={`${factor.contributionPercent > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                    {factor.contributionPercent > 0 ? '+' : ''}{factor.contributionPercent}%
                                                </span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.abs(factor.contributionPercent)}%` }}
                                                    transition={{ delay: 0.8 + (i * 0.1), duration: 0.8 }}
                                                    className={`h-full rounded-full ${factor.contributionPercent > 0 ? 'bg-gradient-to-r from-red-500 to-rose-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </div>
        </Tilt>
    );
}
