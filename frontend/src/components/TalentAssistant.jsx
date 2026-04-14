import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, ShieldAlert, Sparkles, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function TalentAssistant({ candidateId = null }) {
    const { token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 0,
            role: "assistant",
            text: candidateId
                ? "Hello! I have loaded this candidate's intelligence profile. What would you like to know?"
                : "Welcome to the Talent Intelligence Database. How can I help you find or evaluate candidates today?"
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput("");

        // Add User Message
        setMessages(prev => [...prev, { id: Date.now(), role: "user", text: userMsg }]);
        setIsTyping(true);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const payload = {
                message: userMsg,
                ...(candidateId && { candidateId })
            };

            const response = await axios.post("/api/chat", payload, config);

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: "assistant",
                text: response.data.reply
            }]);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: "assistant",
                text: "⚠️ I encountered a critical error communicating with the intelligence network. Please try again later."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    // Format simple markdown (bold text logic) for the chat UI
    const formatText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-white drop-shadow-sm">{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Floating Action Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center text-white border border-indigo-400/50 group"
                    >
                        <ShieldAlert className="absolute w-8 h-8 opacity-0 group-hover:opacity-10 transition-opacity duration-300 scale-150" />
                        <MessageSquare className="w-7 h-7 relative z-10" />

                        {/* Notification Dot */}
                        <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" }}
                        transition={{ duration: 0.3, type: "spring" }}
                        className="absolute bottom-0 right-0 w-[380px] sm:w-[420px] h-[600px] max-h-[85vh] rounded-3xl glass-card border border-white/10 shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header bg glow */}
                        <div className="absolute top-0 w-full h-32 bg-indigo-500/20 blur-[50px] pointer-events-none z-0"></div>

                        {/* Header */}
                        <div className="relative z-10 p-5 flex items-center justify-between border-b border-white/5 bg-slate-900/40 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                                    <Bot className="w-5 h-5 text-indigo-300" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold tracking-wide flex items-center gap-2">
                                        HireGuard AI <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                    </h3>
                                    <p className="text-xs text-indigo-200/80 font-medium">Talent Intelligence Assistant</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar relative z-10 bg-slate-900/20">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border shadow-sm ${msg.role === 'user'
                                        ? 'bg-slate-800 border-slate-700 text-slate-300'
                                        : 'bg-indigo-900/80 border-indigo-500/50 text-indigo-300'
                                        }`}>
                                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>

                                    {/* Bubble */}
                                    <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                        ? 'bg-blue-600/90 text-white rounded-tr-sm shadow-[0_4px_15px_rgba(37,99,235,0.2)]'
                                        : 'bg-slate-800/80 text-gray-300 rounded-tl-sm border border-slate-700 shadow-sm backdrop-blur-md font-medium'
                                        }`}>
                                        {formatText(msg.text)}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3"
                                >
                                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center border shadow-sm bg-indigo-900/80 border-indigo-500/50 text-indigo-300">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="px-5 py-3 rounded-2xl bg-slate-800/80 rounded-tl-sm border border-slate-700 backdrop-blur-md flex items-center gap-1.5 h-[44px]">
                                        <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                        <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                        <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-slate-900 border-t border-slate-800 relative z-10">
                            <form onSubmit={handleSend} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={candidateId ? "Ask about this candidate..." : "Query the talent database..."}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium shadow-inner"
                                    disabled={isTyping}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-2 p-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg transition-colors disabled:opacity-50 disabled:bg-slate-700 disabled:text-slate-500 shadow-sm"
                                >
                                    {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
