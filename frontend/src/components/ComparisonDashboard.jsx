import React from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CheckCircle2, AlertTriangle, Briefcase, Code2, AlertCircle } from "lucide-react";

export default function ComparisonDashboard({ data }) {
    if (!data || data.length < 2) return null;

    // Computed format for Recharts Radar mapped against arbitrary high marks
    const chartData = [
        { subject: "Calculated Experience", fullMark: 10 },
        { subject: "Tech Stack Breadth", fullMark: 30 },
        { subject: "Employment Credibility", fullMark: 100 },
        { subject: "Integrity Risks", fullMark: 10 } // Reverse ideal metric logically handled by graph size
    ];

    const candidates = data.map((candidate, i) => {
        const { structuredData, techData, employmentData } = candidate;

        const experience = parseFloat(structuredData.total_experience_years || 0);

        const flatSkills = structuredData.skills
            ? (typeof structuredData.skills[0] === 'object'
                ? structuredData.skills.flatMap(s => s.items || [])
                : structuredData.skills)
            : [];
        const techStackSize = flatSkills.length;

        const credibility = employmentData?.length > 0
            ? employmentData.reduce((acc, emp) => acc + (emp.credibilityScore || 0), 0) / employmentData.length
            : 0;

        const flagsCount = (techData.flags?.length || 0) + (structuredData.education_flags?.length || 0);

        return {
            name: structuredData.name || `Candidate ${i + 1}`,
            experience,
            techStackSize,
            credibility,
            flagsCount,
            raw: candidate
        };
    });

    const radarData = chartData.map(c => {
        const row = { subject: c.subject, fullMark: c.fullMark };
        candidates.forEach(cand => {
            if (c.subject === "Calculated Experience") row[cand.name] = cand.experience;
            if (c.subject === "Tech Stack Breadth") row[cand.name] = (cand.techStackSize > 30 ? 30 : cand.techStackSize); // Cap for chart normalization
            if (c.subject === "Employment Credibility") row[cand.name] = cand.credibility;
            if (c.subject === "Integrity Risks") row[cand.name] = cand.flagsCount;
        });
        return row;
    });

    const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"]; // Blue, Emerald, Violet, Amber, Rose

    return (
        <div className="flex flex-col gap-10 w-full mt-4">

            {/* Radar AI Visualizer */}
            <div className="glass-card rounded-3xl p-8 md:p-12 bg-slate-900/40 border-slate-700/50 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">AI Radar Comparison</h2>
                <p className="text-slate-400 text-sm font-medium mb-10 w-full md:w-1/2">
                    Multi-dimensional overlay of candidate profiles mapping raw technical footprint, employment credibility, and discovered forensic risk flags side-by-side.
                </p>

                <div className="w-full h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 13, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />

                            {candidates.map((cand, i) => (
                                <Radar
                                    key={cand.name}
                                    name={cand.name}
                                    dataKey={cand.name}
                                    stroke={colors[i % colors.length]}
                                    strokeWidth={3}
                                    fill={colors[i % colors.length]}
                                    fillOpacity={0.3}
                                />
                            ))}
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                                itemStyle={{ fontWeight: 'bold' }}
                                labelStyle={{ color: '#94a3b8', fontWeight: 'bold', borderBottom: '1px solid #334155', paddingBottom: '5px', marginBottom: '5px' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '30px' }} iconType="circle" />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Side by Side Grid Engine */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
                {candidates.map((cand, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: i * 0.15, type: 'spring' }}
                        className="glass-card rounded-3xl p-6 bg-[#0B0F19] border border-slate-700/50 flex flex-col shadow-2xl overflow-hidden relative"
                    >
                        {/* Custom Color Bar for Legend Matching */}
                        <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: colors[i % colors.length] }}></div>

                        <div className="mb-6 mt-2">
                            <h3 className="text-xl font-bold text-white mb-1 truncate drop-shadow-sm">{cand.name}</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Candidate Profile {i + 1}</p>
                        </div>

                        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-700 space-y-4 mb-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/20 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/2"></div>
                            <div className="flex justify-between items-center text-sm relative z-10">
                                <span className="text-slate-400 font-medium tracking-wide text-xs uppercase">Calculated Yrs</span>
                                <span className="text-blue-400 font-black text-lg">{cand.experience} <span className="text-xs text-blue-500 font-bold">YRS</span></span>
                            </div>
                            <div className="flex justify-between items-center text-sm relative z-10">
                                <span className="text-slate-400 font-medium tracking-wide text-xs uppercase">Tech Payload</span>
                                <span className="text-indigo-400 font-black text-lg">{cand.techStackSize} <span className="text-xs text-indigo-500 font-bold">SKILLS</span></span>
                            </div>
                            <div className="flex justify-between items-center text-sm relative z-10">
                                <span className="text-slate-400 font-medium tracking-wide text-xs uppercase">Avg Credibility</span>
                                <span className="text-emerald-400 font-black text-lg">{cand.credibility.toFixed(0)}<span className="text-xs text-emerald-500 font-bold">/100</span></span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-slate-500" /> Forensic Integrity
                                </h4>
                                {cand.flagsCount === 0 ? (
                                    <div className="text-emerald-400 text-xs font-bold flex items-center gap-2 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                                        <CheckCircle2 className="w-5 h-5" /> Clean Profile Verified
                                    </div>
                                ) : (
                                    <div className="text-red-400 text-xs font-bold flex items-start gap-2 bg-red-500/10 p-3 rounded-xl border border-red-500/20 shadow-inner">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <span>{cand.flagsCount} Risk Flag{cand.flagsCount > 1 ? 's' : ''} Identified in History</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Code2 className="w-4 h-4 text-slate-500" /> Technology DNA
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {cand.raw.structuredData.skills && (typeof cand.raw.structuredData.skills[0] === 'object' ? cand.raw.structuredData.skills.flatMap(s => s.items || []) : cand.raw.structuredData.skills).slice(0, 8).map((skill, idx) => (
                                        <span key={idx} className="text-xs font-bold bg-slate-800/80 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                    {cand.techStackSize > 8 && (
                                        <span className="text-xs font-bold bg-slate-800/30 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                            +{cand.techStackSize - 8} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
