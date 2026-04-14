import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings as SettingsIcon, Key, Bell, CreditCard, Plus, Trash2, Copy, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState("Notifications");
    const [loading, setLoading] = useState(false);

    // Notifications State (Simulated)
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        webhookTriggers: false,
        securityAnomalies: true
    });

    const API_URL = import.meta.env.VITE_API_BASE_URL || '';


    return (
        <div className="relative min-h-screen bg-[#07090E] text-slate-200 pt-32 pb-6 px-6 md:px-10 font-sans selection:bg-blue-500/30 overflow-x-hidden">
            <div className="max-w-5xl mx-auto w-full">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                            <SettingsIcon className="w-6 h-6 text-blue-400" />
                        </div>
                        System Preferences
                    </h1>
                    <p className="text-slate-400 text-sm font-medium pl-14">Configure forensic engine weights, team access, and API keys.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

                    {/* Settings Sidebar */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="md:col-span-4 lg:col-span-3 space-y-2">
                        {[
                            { name: "Notifications", id: "Notifications", icon: <Bell className="w-4 h-4" /> },
                            { name: "Billing", id: "Billing", icon: <CreditCard className="w-4 h-4" /> },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === tab.id
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-sm"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                                    }`}
                            >
                                {tab.icon}
                                {tab.name}
                            </button>
                        ))}
                    </motion.div>

                    {/* Main Settings Pane */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-8 lg:col-span-9 glass-card rounded-3xl border border-white/5 p-8 lg:p-10 shadow-2xl relative overflow-hidden min-h-[500px]">

                        {/* Background Accents */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">


                                {/* TAB: NOTIFICATIONS */}
                                {activeTab === "Notifications" && (
                                    <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-8 relative z-10">
                                        <h2 className="text-xl font-bold text-white mb-6">Alert Configurations</h2>

                                        <div className="space-y-6">
                                            {[
                                                { id: 'emailAlerts', title: 'System Email Alerts', desc: 'Receive critical timeline injection updates via email.' },
                                                { id: 'webhookTriggers', title: 'Webhook Execution', desc: 'Ping remote servers instantly when a high-risk candidate is flagged.' },
                                                { id: 'securityAnomalies', title: 'Security Anomalies', desc: 'Immediately alert admins upon suspicious API rate limits or deepfake detection.' }
                                            ].map((notif) => (
                                                <div key={notif.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-800">
                                                    <div>
                                                        <h4 className="font-bold text-slate-200 text-sm">{notif.title}</h4>
                                                        <p className="text-xs text-slate-500 mt-1 max-w-sm">{notif.desc}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setNotifications({ ...notifications, [notif.id]: !notifications[notif.id] })}
                                                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${notifications[notif.id] ? 'bg-blue-500' : 'bg-slate-700'}`}
                                                    >
                                                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${notifications[notif.id] ? 'translate-x-6' : 'translate-x-0'}`} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* TAB: BILLING */}
                                {activeTab === "Billing" && (
                                    <motion.div key="billing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="relative z-10">
                                        <h2 className="text-xl font-bold text-white mb-6">Enterprise Subscription</h2>

                                        <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/20 border border-blue-500/30 rounded-2xl p-8 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                                <Shield className="w-48 h-48 text-blue-400" />
                                            </div>

                                            <div className="relative z-10">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-500/30 mb-4">
                                                    Active Plan
                                                </div>
                                                <h3 className="text-4xl font-black text-white tracking-tight mb-2">HireGuard Unlimited</h3>
                                                <p className="text-slate-300 mb-8 max-w-md">You are currently locked into the lifetime foundational enterprise tier. All premium AI model features are unlocked.</p>

                                                <div className="grid grid-cols-2 gap-4 max-w-sm mb-8">
                                                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">API Limit</p>
                                                        <p className="text-lg font-bold text-white">Unlimited</p>
                                                    </div>
                                                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Seats</p>
                                                        <p className="text-lg font-bold text-white">Scale-Free</p>
                                                    </div>
                                                </div>

                                                <button disabled className="px-6 py-3 rounded-xl text-sm font-bold bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700">
                                                    Manage via Stripe Component
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
