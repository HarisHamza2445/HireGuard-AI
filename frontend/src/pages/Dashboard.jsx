import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import UploadBox from "../components/UploadBox";
import Timeline from "../components/Timeline";
import RiskMeter from "../components/RiskMeter";
import ReportCard from "../components/ReportCard";
import ComparisonDashboard from "../components/ComparisonDashboard";
import TalentAssistant from "../components/TalentAssistant";

export default function Dashboard() {
    const [reportData, setReportData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
        show: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                mass: 1.2
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-[#07090E] text-slate-200 pt-32 pb-6 px-6 md:px-10 font-sans selection:bg-blue-500/30 overflow-x-hidden">

            {/* Subtle Professional Background Accents */}
            <div className="absolute top-0 -left-64 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-slate-800/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Dashboard Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
                >
                    {/* Left Column (Input & Processing) */}
                    <motion.div variants={itemVariants} className={`${reportData && reportData.length > 1 ? 'lg:col-span-12' : 'lg:col-span-5'} flex flex-col gap-6 lg:gap-8`}>
                        <UploadBox
                            onUploadStart={() => { setIsProcessing(true); setReportData(null); }}
                            onUploadComplete={(data) => { setReportData(data); setIsProcessing(false); }}
                            isProcessing={isProcessing}
                        />
                        {(!reportData || reportData.length <= 1) && (
                            <Timeline isProcessing={isProcessing} data={reportData ? reportData[0] : null} />
                        )}
                    </motion.div>

                    {/* Right Column (Results & Output) */}
                    {reportData && reportData.length > 1 ? (
                        <motion.div variants={itemVariants} className="lg:col-span-12 flex flex-col gap-6 lg:gap-8">
                            <ComparisonDashboard data={reportData} />
                        </motion.div>
                    ) : (
                        <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col gap-6 lg:gap-8">
                            <RiskMeter data={reportData ? reportData[0] : null} isProcessing={isProcessing} />
                            <ReportCard data={reportData ? reportData[0] : null} />
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* AI Assistant Chat Widget */}
            <TalentAssistant candidateId={reportData && reportData.length === 1 ? reportData[0]._id : null} />
        </div>
    );
}
