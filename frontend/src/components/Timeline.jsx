import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Search, Code2, Cpu } from "lucide-react";
import Tilt from "react-parallax-tilt";

export default function Timeline({ isProcessing, data }) {

    const steps = [
        { id: 1, title: "Deep Resume Parsing", icon: <Database className="w-4 h-4" /> },
        { id: 2, title: "Employment Verification", icon: <Search className="w-4 h-4" /> },
        { id: 3, title: "Technical Reconnaissance", icon: <Code2 className="w-4 h-4" /> },
        { id: 4, title: "Risk Computation Matrix", icon: <Cpu className="w-4 h-4" /> }
    ];

    return (
        <Tilt
            glareEnable={true}
            glareMaxOpacity={0.05}
            glareColor="#ffffff"
            glarePosition="all"
            tiltMaxAngleX={1}
            tiltMaxAngleY={3}
            perspective={1000}
            scale={1}
            transitionSpeed={1000}
            className="flex-1"
        >
            <div className="glass-card glass-card-hover rounded-3xl p-8 relative overflow-hidden h-full">

                {/* Subtle background glow */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50"></div>

                <h2 className="text-xl font-bold mb-8 text-white flex items-center gap-3 tracking-wide">
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <Cpu className="w-5 h-5 text-indigo-400" />
                    </div>
                    Verification Pipeline
                </h2>

                <div className="relative pl-4 space-y-7 before:absolute before:inset-0 before:ml-[22px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 md:before:ml-auto md:before:mr-auto before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/20 before:via-blue-500/10 before:to-transparent">

                    <AnimatePresence>
                        {steps.map((step, index) => {

                            const isDone = !!data;
                            const isActive = isProcessing;

                            let statusColor = "text-slate-500 bg-slate-900/50 border border-slate-700/50 shadow-sm";
                            let textColor = "text-slate-500";
                            let cardBg = "bg-slate-900/30 border border-slate-800/50";

                            let animationProps = {
                                initial: { opacity: 0, x: -10 },
                                animate: { opacity: 1, x: 0 },
                                transition: { delay: index * 0.1 }
                            };

                            let iconAnimation = {};

                            if (isDone) {
                                statusColor = "text-indigo-400 bg-indigo-500/10 border-indigo-400/30 shadow-sm";
                                textColor = "text-slate-200 font-bold";
                                cardBg = "bg-slate-800/40 border-indigo-500/20 shadow-sm";
                                iconAnimation = {
                                    animate: { scale: [1, 1.1, 1] },
                                    transition: { duration: 0.5, delay: index * 0.15 }
                                };
                            } else if (isActive) {
                                statusColor = "text-blue-400 bg-blue-500/10 border-blue-500/40 shadow-sm";
                                textColor = "text-slate-300 font-semibold";
                                cardBg = "bg-slate-800/50 border-blue-500/20";

                                iconAnimation = {
                                    animate: { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] },
                                    transition: { duration: 1.5, repeat: Infinity, delay: index * 0.2, ease: "easeInOut" }
                                };
                            }

                            return (
                                <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group select-none">

                                    {/* Central Node */}
                                    <div className="shrink-0 w-10 h-10 flex items-center justify-center md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                        <motion.div
                                            {...iconAnimation}
                                            className={`flex items-center justify-center w-8 h-8 rounded-full z-10 transition-all duration-500 ${statusColor}`}
                                        >
                                            {step.icon}
                                        </motion.div>
                                    </div>

                                    {/* Content Card */}
                                    <motion.div
                                        {...animationProps}
                                        className={`w-[calc(100%-3.5rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl backdrop-blur-md transition-all duration-300 group-hover:bg-slate-800/60 ${cardBg}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm tracking-wide ${textColor}`}>{step.title}</span>

                                            {isDone && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", delay: 0.2 + (index * 0.1) }}
                                                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20"
                                                >
                                                    Pass
                                                </motion.span>
                                            )}

                                            {isActive && (
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 animate-pulse">
                                                    Running
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>

                                </div>
                            );
                        })}
                    </AnimatePresence>
                </div>

            </div>
        </Tilt>
    );
}
