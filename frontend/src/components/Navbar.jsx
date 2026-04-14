import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Bell, LogOut, Settings, Users, LayoutDashboard, ChevronDown, BarChart2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "System Update: HireGuard v2.4 deployed.", time: "1h ago", read: false },
        { id: 2, text: "Candidate John Doe analysis complete.", time: "3h ago", read: false },
        { id: 3, text: "New API limits reached for tech crawler.", time: "1d ago", read: true }
    ]);
    const unreadCount = notifications.filter(n => !n.read).length;

    const location = useLocation();
    const { user, logout } = useAuth();

    // Add scroll listener to change navbar styling on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Dashboard", path: "/", icon: <LayoutDashboard className="w-4 h-4" /> },
        { name: "Candidates", path: "/candidates", icon: <Users className="w-4 h-4" /> },
        { name: "Analytics", path: "/analytics", icon: <BarChart2 className="w-4 h-4" /> },
        { name: "Settings", path: "/settings", icon: <Settings className="w-4 h-4" /> },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${scrolled
                ? "bg-[#07090E]/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                : "bg-transparent py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">

                {/* Left: Brand / Logo */}
                <div className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative p-2.5 bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-sm group-hover:bg-slate-800/80 transition-all duration-300">
                        <ShieldAlert className="w-6 h-6 text-blue-500 relative z-10" />
                        <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                            HireGuard <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">AI</span>
                        </h1>
                    </div>
                </div>

                {/* Center: Navigation Links (Hidden on mobile) */}
                <nav className="hidden md:flex items-center gap-1 glass-card rounded-2xl p-1 border border-white/5">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive
                                    ? "bg-blue-500/10 text-blue-400 shadow-sm border border-blue-500/20"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                                    }`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right: User Controls */}
                <div className="flex items-center gap-4">

                    {/* Notification Dropdown Trigger */}
                    <div className="relative">
                        <button
                            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                            className="relative p-2.5 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-800/50"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#07090E] animate-pulse"></span>
                            )}
                        </button>

                        {/* Notification Dropdown Menu */}
                        <AnimatePresence>
                            {notifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-3 w-80 glass-card rounded-2xl border border-slate-700/50 shadow-2xl py-2 z-50 overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-slate-700/50 flex justify-between items-center">
                                        <p className="text-sm font-bold text-white">Notifications</p>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                                                className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {notifications.length > 0 ? notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                className={`px-4 py-3 border-b border-slate-700/30 last:border-0 hover:bg-slate-800/40 transition-colors cursor-pointer ${notif.read ? 'opacity-60' : ''}`}
                                                onClick={() => setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className={`text-sm ${notif.read ? 'text-slate-400' : 'text-slate-200 font-medium'}`}>{notif.text}</p>
                                                    {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5 ml-2"></span>}
                                                </div>
                                                <p className="text-xs text-slate-500">{notif.time}</p>
                                            </div>
                                        )) : (
                                            <div className="px-4 py-6 text-center text-sm text-slate-500">
                                                No notifications at this time.
                                            </div>
                                        )}
                                    </div>
                                    <Link onClick={() => setNotifOpen(false)} to="/settings" className="block w-full text-center px-4 py-2 border-t border-slate-700/50 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
                                        View all settings
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile Dropdown Trigger */}
                    <div className="relative">
                        <button
                            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full border border-slate-700/50 hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        >
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0D8ABC&color=fff&bold=true`}
                                alt="User Profile"
                                className="w-8 h-8 rounded-full shadow-sm"
                            />
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-bold text-white leading-tight">{user?.firstName} {user?.lastName}</p>
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{user?.role}</p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {profileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-3 w-56 glass-card rounded-2xl border border-slate-700/50 shadow-2xl py-2 z-50 overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-slate-700/50 mb-2 sm:hidden">
                                        <p className="text-sm font-bold text-white">{user?.firstName} {user?.lastName}</p>
                                        <p className="text-xs text-blue-400 capitalize">{user?.role}</p>
                                    </div>
                                    <Link onClick={() => setProfileOpen(false)} to="/account-settings" className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-blue-500/10 hover:border-l-2 hover:border-blue-500 transition-all flex items-center gap-3">
                                        <Settings className="w-4 h-4" /> Account Settings
                                    </Link>
                                    <div className="h-px w-full bg-slate-700/50 my-2"></div>
                                    <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:border-l-2 hover:border-rose-500 transition-all flex items-center gap-3">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </header>
    );
}
