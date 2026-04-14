import React from "react";
import { motion } from "framer-motion";
import { FileSearch, CheckCircle2, XCircle, Github, Briefcase, AlertTriangle, Fingerprint, Code2, MessageSquare } from "lucide-react";
import Tilt from "react-parallax-tilt";

export default function ReportCard({ data }) {
    if (!data) {
        return (
            <Tilt glareEnable={true} glareMaxOpacity={0.05} scale={1.01} transitionSpeed={2000} className="w-full">
                <div className="glass-card rounded-3xl p-10 shadow-2xl flex flex-col items-center justify-center min-h-[400px] text-gray-500 border border-white/5 relative overflow-hidden">

                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black opacity-50 z-0"></div>

                    <div className="relative z-10 flex flex-col items-center max-w-md text-center">
                        <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center border border-slate-700/50 shadow-sm mb-6 relative group">
                            <div className="absolute inset-0 rounded-full border border-slate-600/30 scale-110 group-hover:scale-125 transition-transform duration-700 opacity-50"></div>
                            <FileSearch className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-300 mb-2">Awaiting Intelligence Payload</h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                            Upload a candidate's resume above. The AI engine will parse, verify, and generate a comprehensive forensic report here.
                        </p>
                    </div>
                </div>
            </Tilt>
        );
    }

    const { _id, structuredData, employmentData, techData, interviewStatus, interviewScore, interviewFeedback } = data;

    const flatSkills = structuredData.skills
        ? (typeof structuredData.skills[0] === 'object'
            ? structuredData.skills.flatMap(s => s.items || [])
            : structuredData.skills)
        : [];

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.2, type: "spring", stiffness: 200 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 10 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className="glass-card glass-card-hover rounded-3xl p-8 md:p-10 shadow-2xl relative"
        >
            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 pb-6 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="hidden sm:flex p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 shadow-sm">
                        <Fingerprint className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            Forensic Intelligence Report
                        </h2>
                        <p className="text-gray-400 mt-1 font-medium text-sm md:text-base">
                            Candidate Profile Analysis for <strong className="text-indigo-300 ml-1">{structuredData.name || "Unknown"}</strong>
                        </p>
                    </div>
                </div>

                <div className="text-left md:text-right w-full md:w-auto mt-6 md:mt-0 bg-slate-900/40 p-4 rounded-2xl border border-slate-700/50 flex items-center justify-between md:flex-col md:items-end gap-2 shadow-sm">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Calculated Experience</p>
                    <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                        {structuredData.total_experience_years || 0} <span className="text-lg text-indigo-400/70 font-bold">YRS</span>
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-8 relative z-10 w-full">

                {/* Employment Analysis Wing */}
                <motion.div variants={itemVariants} className="w-full">
                    <div className="flex items-center gap-3 mb-4">
                        <Briefcase className="w-5 h-5 text-amber-500" />
                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-[0.2em] drop-shadow-md">
                            Employment Verification
                        </h3>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 space-y-4 shadow-sm w-full">
                        {employmentData && employmentData.length > 0 ? employmentData.map((emp, i) => (
                            <div key={i} className="group flex flex-col md:flex-row md:items-center justify-between bg-slate-800/30 hover:bg-slate-800/60 transition-colors p-5 rounded-xl border border-slate-700/50 shadow-sm w-full gap-4">
                                <div>
                                    <p className="font-bold text-gray-200 text-lg tracking-wide">
                                        {typeof emp.company === 'object' ? (emp.company.name || emp.company.company || JSON.stringify(emp.company)) : emp.company}
                                    </p>
                                    <p className="text-xs font-semibold text-gray-500 mt-1.5 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 hidden sm:block"></span>
                                        Credibility Score: <span className="text-amber-400 ml-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">{emp.credibilityScore}/100</span>
                                    </p>
                                </div>

                                <div className="shrink-0 flex items-center">
                                    {emp.verified ? (
                                        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                            <CheckCircle2 className="w-4 h-4" /> Validated
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                                            <XCircle className="w-4 h-4" /> Flagged
                                        </span>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="p-4 rounded-xl border border-dashed border-gray-700 text-center">
                                <p className="text-sm font-medium text-gray-500">No verifiable employment data extracted.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Interview Verification Wing */}
                <motion.div variants={itemVariants} className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-5 h-5 text-purple-500" />
                            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-[0.2em] drop-shadow-md">
                                Expert AI Interview
                            </h3>
                        </div>


                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 flex flex-col shadow-sm w-full">

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 gap-4 shadow-sm w-full mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-lg border shadow-sm ${interviewStatus === "Completed" ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                    interviewStatus === "In Progress" ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                        'bg-slate-500/10 border-slate-500/20 text-slate-400'
                                    }`}>
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-200 tracking-wide">Technical Assessment</h4>
                                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Status: <span className="text-white">{interviewStatus || "Pending"}</span></p>
                                </div>
                            </div>

                            <div className="shrink-0 flex items-center">
                                {interviewStatus === "Completed" && interviewScore !== null ? (
                                    <div className="flex flex-col items-end">
                                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Score</p>
                                        <p className={`text-2xl font-black ${interviewScore >= 70 ? 'text-emerald-400' : interviewScore >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                                            {interviewScore}<span className="text-sm text-slate-500">/100</span>
                                        </p>
                                    </div>
                                ) : (
                                    <span className="text-xs font-medium text-slate-500 italic">No score available</span>
                                )}
                            </div>
                        </div>

                        {interviewStatus === "Completed" && interviewFeedback && (
                            <div className="relative z-10 bg-slate-800/30 p-5 rounded-xl border border-slate-700/50">
                                <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-purple-500 rounded-sm"></span> Evaluation Feedback
                                </p>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {interviewFeedback}
                                </p>
                            </div>
                        )}

                        {(interviewStatus === "Pending" || !interviewStatus) && (
                            <div className="p-5 rounded-xl border border-dashed border-gray-700 text-center flex flex-col items-center gap-4 bg-slate-900/20">
                                <p className="text-sm font-medium text-gray-400">Candidate has not started the technical assessment.</p>
                                <button
                                    onClick={() => window.open(`/interview/${_id}`, '_blank')}
                                    className="px-5 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-sm font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
                                >
                                    <MessageSquare className="w-4 h-4" /> Start Interview Now
                                </button>
                            </div>
                        )}
                        {interviewStatus === "In Progress" && (
                            <div className="p-4 rounded-xl border border-dashed border-amber-700/50 text-center bg-amber-500/5">
                                <p className="text-sm font-medium text-amber-500/80 animate-pulse">Candidate is currently taking the assessment...</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Technical Analysis Wing */}
                <motion.div variants={itemVariants} className="w-full">
                    <div className="flex items-center gap-3 mb-4">
                        <Github className="w-5 h-5 text-blue-500" />
                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-[0.2em] drop-shadow-md">
                            Technical Due Diligence
                        </h3>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 flex flex-col shadow-sm relative w-full">

                        {/* Tech footprint bg graphic */}
                        <Code2 className="absolute -bottom-4 -right-4 w-32 h-32 text-white/[0.02] pointer-events-none" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 relative z-10 gap-4 shadow-sm w-full">
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-lg border shadow-sm ${techData.githubPresent ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                                    <Code2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-200 tracking-wide">Developer Trace Profile</h4>
                                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Algorithmic scan for external code repositories</p>
                                </div>
                            </div>

                            <div className="shrink-0 flex items-center">
                                {techData.githubPresent ? (
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-400 text-xs font-bold uppercase tracking-widest shadow-sm">
                                        <CheckCircle2 className="w-4 h-4" /> Verified Positive
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-slate-400 text-xs font-bold uppercase tracking-widest shadow-sm">
                                        <XCircle className="w-4 h-4" /> Negative
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="relative z-10 bg-slate-800/30 p-5 rounded-xl border border-slate-700/50">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-sm"></span> Claimed Technology Stack
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                                {flatSkills.length > 0 ? (
                                    flatSkills.map((skill, index) => (
                                        <motion.span
                                            key={`${skill}-${index}`}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.5 + (index * 0.05) }}
                                            className="inline-flex items-center whitespace-nowrap px-3 py-1.5 bg-gradient-to-br from-indigo-500/10 to-blue-500/5 hover:from-indigo-500/20 hover:to-blue-500/20 border border-indigo-500/20 hover:border-indigo-400/40 text-indigo-300 text-xs font-bold tracking-wide rounded-lg transition-colors shadow-sm"
                                        >
                                            {skill}
                                        </motion.span>
                                    ))
                                ) : (
                                    <span className="text-xs font-medium text-gray-500 italic">No technical skills detected in payload.</span>
                                )}
                            </div>
                        </div>

                        {techData.flags && techData.flags.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="mt-6 relative z-10"
                            >
                                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]">
                                    <p className="text-xs text-red-400 font-bold uppercase tracking-widest flex items-center gap-2 mb-2 drop-shadow-md">
                                        <AlertTriangle className="w-4 h-4" /> Integrity Flags
                                    </p>
                                    <ul className="text-sm font-medium text-red-300/90 list-none space-y-1.5 pl-1">
                                        {techData.flags.map((flag, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-red-500 mt-0.5">•</span>
                                                <span>{flag}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
}
