import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ReportCard from '../components/ReportCard';
import RiskMeter from '../components/RiskMeter';

export default function CandidateReport() {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [reportPayload, setReportPayload] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_BASE_URL || '';

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Fetch the permanently stored Candidate database object
                const { data } = await axios.get(`${API_URL}/api/candidates/${id}`, config);

                if (data.success) {
                    setReportPayload(data.data);
                }
            } catch (err) {
                console.error("Failed fetching candidate report:", err);
                setError("Unable to locate a verified analytic payload for this candidate ID. It may have been deleted or never existed.");
            } finally {
                setLoading(false);
            }
        };

        if (token && id) {
            fetchReport();
        }
    }, [id, token, API_URL]);

    if (loading) {
        return (
            <div className="relative min-h-screen bg-[#07090E] text-slate-200 flex flex-col items-center justify-center font-sans tracking-tight">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-400 font-medium animate-pulse">Decrypting historic analytic envelope...</p>
            </div>
        );
    }

    if (error || !reportPayload) {
        return (
            <div className="relative min-h-screen bg-[#07090E] text-slate-200 pt-32 pb-6 px-6 md:px-10 flex flex-col items-center justify-center font-sans">
                <div className="glass-card p-10 max-w-lg text-center rounded-3xl border border-rose-500/20 bg-rose-500/5">
                    <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Payload Unavilable</h2>
                    <p className="text-slate-400 font-medium mb-8">{error}</p>
                    <button
                        onClick={() => navigate('/candidates')}
                        className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-semibold flex items-center gap-2 mx-auto hover:bg-slate-700 transition"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to Directory
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#07090E] text-slate-200 pt-32 pb-12 px-6 md:px-10 font-sans tracking-tight selection:bg-blue-500/30 overflow-x-hidden">
            <div className="max-w-7xl mx-auto w-full">

                {/* Navigation Breadcrumb */}
                <button
                    onClick={() => navigate('/candidates')}
                    className="group mb-8 flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                    <div className="p-1.5 rounded-lg bg-slate-800/50 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors border border-slate-700/50 group-hover:border-blue-500/30">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Return to Directory
                </button>

                <div className="flex flex-col gap-6 lg:gap-8">
                    {/* Render the Risk Meter + XAI Panel for historic views */}
                    <RiskMeter data={reportPayload} isProcessing={loading} />

                    {/* React-Render of the massive legacy ReportCard UI */}
                    <ReportCard data={reportPayload} isLoading={false} />
                </div>

            </div>
        </div>
    );
}
