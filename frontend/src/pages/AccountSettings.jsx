import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings as SettingsIcon, Shield, Key, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function AccountSettings() {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState("Profile");
    const [loading, setLoading] = useState(true);

    // Profile State
    const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", organization: "" });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

    // Security State
    const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

    const API_URL = import.meta.env.VITE_API_BASE_URL || '';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${API_URL}/api/users/profile`, config);
                if (data.success) {
                    setProfile({
                        firstName: data.data.firstName || "",
                        lastName: data.data.lastName || "",
                        email: data.data.email || "",
                        organization: data.data.organization || ""
                    });
                }
            } catch (error) {
                console.error("Failed to load profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProfile();
    }, [token, API_URL]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        setProfileMessage({ type: "", text: "" });

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.put(`${API_URL}/api/users/profile`, {
                firstName: profile.firstName,
                lastName: profile.lastName
            }, config);

            if (data.success) {
                setProfileMessage({ type: "success", text: "Profile updated successfully." });
                setTimeout(() => setProfileMessage({ type: "", text: "" }), 4000);
            }
        } catch (error) {
            setProfileMessage({ type: "error", text: error.response?.data?.message || "Error updating profile." });
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: "", text: "" });

        if (passwords.newPassword !== passwords.confirmPassword) {
            return setPasswordMessage({ type: "error", text: "New passwords do not match." });
        }

        setIsSavingPassword(true);

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.put(`${API_URL}/api/users/password`, {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            }, config);

            if (data.success) {
                setPasswordMessage({ type: "success", text: "Password changed successfully." });
                setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setTimeout(() => setPasswordMessage({ type: "", text: "" }), 4000);
            }
        } catch (error) {
            setPasswordMessage({ type: "error", text: error.response?.data?.message || "Error updating password." });
        } finally {
            setIsSavingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="relative min-h-screen bg-[#07090E] text-slate-200 flex flex-col items-center justify-center font-sans">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-400 font-medium animate-pulse">Establishing secure connection...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#07090E] text-slate-200 pt-32 pb-6 px-6 md:px-10 font-sans selection:bg-blue-500/30 overflow-x-hidden">
            <div className="max-w-5xl mx-auto w-full">

                {/* Header Section */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                            <Shield className="w-6 h-6 text-indigo-400" />
                        </div>
                        Account Management
                    </h1>
                    <p className="text-slate-400 text-sm font-medium pl-14 max-w-lg">
                        Manage your secure tenant partition, profile parameters, and advanced cryptographic access keys.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

                    {/* Settings Sidebar Menus */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="md:col-span-4 lg:col-span-3 space-y-2">
                        {[
                            { name: "General Profile", id: "Profile", icon: <Shield className="w-4 h-4" /> },
                            { name: "Account Security", id: "Security", icon: <Key className="w-4 h-4" /> }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === tab.id
                                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-sm"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                                    }`}
                            >
                                {tab.icon}
                                {tab.name}
                            </button>
                        ))}
                    </motion.div>

                    {/* Dynamic Main Settings Pane */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-8 lg:col-span-9 glass-card rounded-3xl border border-white/5 p-8 lg:p-10 shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Glow Node */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

                        <AnimatePresence mode="wait">

                            {/* TAB: PROFILE */}
                            {activeTab === "Profile" && (
                                <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

                                    <h2 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center justify-between">
                                        Personal Workspace
                                        {profileMessage.text && (
                                            <span className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1.5 ${profileMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                                                {profileMessage.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                                {profileMessage.text}
                                            </span>
                                        )}
                                    </h2>

                                    <form onSubmit={handleProfileSubmit} className="space-y-6 relative z-10">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">First Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={profile.firstName}
                                                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                                    className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder-slate-600 font-medium"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Last Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={profile.lastName}
                                                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                                    className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder-slate-600 font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 flex justify-between">
                                                Email Address <span className="text-slate-500 font-medium lowercase normal-case flex items-center gap-1"><Shield className="w-3 h-3" /> Identity Locked</span>
                                            </label>
                                            <input type="email" disabled value={profile.email} className="w-full bg-slate-900/30 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-400 text-sm outline-none cursor-not-allowed font-medium" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Organization</label>
                                            <input type="text" disabled value={profile.organization} className="w-full bg-slate-900/30 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-400 text-sm outline-none cursor-not-allowed font-medium" />
                                        </div>

                                        <div className="pt-4 flex justify-end gap-3 mt-8">
                                            <button
                                                type="submit"
                                                disabled={isSavingProfile}
                                                className="px-6 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.2)] transition-colors border border-indigo-500 min-w-[140px] flex justify-center disabled:opacity-70"
                                            >
                                                {isSavingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* TAB: SECURITY */}
                            {activeTab === "Security" && (
                                <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

                                    <h2 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center justify-between">
                                        Cryptographic Access
                                        {passwordMessage.text && (
                                            <span className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1.5 ${passwordMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                                                {passwordMessage.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                                {passwordMessage.text}
                                            </span>
                                        )}
                                    </h2>

                                    <form onSubmit={handlePasswordSubmit} className="space-y-6 relative z-10 max-w-xl">

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Current Authorization Key</label>
                                            <input
                                                type="password"
                                                required
                                                value={passwords.currentPassword}
                                                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono tracking-widest"
                                            />
                                        </div>

                                        <div className="space-y-2 pt-4">
                                            <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest pl-1">New Secure Cipher</label>
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                value={passwords.newPassword}
                                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                placeholder="Enter new 6+ char password"
                                                className="w-full bg-slate-900/60 border border-indigo-500/30 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all font-mono"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 flex justify-between">
                                                Confirm Cipher <span className="text-xs font-medium text-slate-500 normal-case">{passwords.newPassword && passwords.confirmPassword === passwords.newPassword ? "Matches" : ""}</span>
                                            </label>
                                            <input
                                                type="password"
                                                required
                                                value={passwords.confirmPassword}
                                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                placeholder="Re-enter new password"
                                                className={`w-full bg-slate-900/60 border rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all font-mono ${passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-700/80 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50'}`}
                                            />
                                        </div>

                                        <div className="pt-4 flex justify-start mt-8">
                                            <button
                                                type="submit"
                                                disabled={isSavingPassword || (passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword)}
                                                className="px-6 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.2)] transition-colors border border-indigo-500 min-w-[170px] flex justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isSavingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : "Encrypt New Cycle"}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
