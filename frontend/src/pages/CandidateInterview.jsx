import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Send, Bot, User, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import axios from "axios";

export default function CandidateInterview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [status, setStatus] = useState("Loading..."); // Loading, Pending, In Progress, Completed, Error

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        const fetchInterviewContext = async () => {
            try {
                const response = await axios.get(`/api/interview/${id}`);
                const data = response.data.candidate;
                setCandidate(data);

                if (data.transcript && data.transcript.length > 0) {
                    setMessages(data.transcript);
                } else if (data.status === "Pending") {
                    // Send an initial silent ping to start the interview
                    startInterview();
                } else {
                    setStatus("Error");
                }

                setStatus(data.status === "Pending" ? "In Progress" : data.status);

            } catch (error) {
                console.error("Failed to load interview:", error);
                setStatus("Error");
            }
        };

        fetchInterviewContext();
    }, [id]);

    const startInterview = async () => {
        setIsTyping(true);
        try {
            // Send empty message to trigger the greeting/first question from the agent
            const response = await axios.post(`/api/interview/${id}/chat`, { message: "START_INTERVIEW" });
            setMessages(response.data.transcript);
            setStatus(response.data.status);
        } catch (error) {
            console.error("Failed to start interview:", error);
            setStatus("Error");
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();

        if (!input.trim() || status === "Completed") return;

        const userMsg = input.trim();
        setInput("");

        // Optimistic UI update
        const newMsg = { role: "user", content: userMsg };
        setMessages(prev => [...prev, newMsg]);
        setIsTyping(true);

        try {
            const response = await axios.post(`/api/interview/${id}/chat`, { message: userMsg });
            setMessages(response.data.transcript);
            setStatus(response.data.status);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "⚠️ I encountered a critical error processing your answer. Please try again."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    if (status === "Loading...") {
        return (
            <div className="min-h-screen bg-[#07090E] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (status === "Error") {
        return (
            <div className="min-h-screen bg-[#07090E] flex items-center justify-center flex-col gap-4 text-white">
                <AlertTriangle className="w-16 h-16 text-rose-500" />
                <h1 className="text-2xl font-bold">Session Invalid or Expired</h1>
                <p className="text-slate-400">Please contact your recruiter for a valid interview link.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#07090E] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col items-center justify-center p-4 sm:p-8 relative">

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl h-[85vh] flex flex-col glass-card rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-white/10"
            >
                {/* Header */}
                <div className="p-5 flex items-center justify-between border-b border-white/5 bg-slate-900/60 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="relative p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-500/30 shadow-sm">
                            <ShieldAlert className="w-6 h-6 text-indigo-400 relative z-10" />
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur-md"></div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-wide">Technical Assessment</h1>
                            <p className="text-sm text-slate-400">Candidate: <span className="text-blue-300">{candidate?.name}</span></p>
                        </div>
                    </div>
                    {status === "Completed" && (
                        <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg font-semibold border border-emerald-500/30">
                            <CheckCircle2 className="w-5 h-5" />
                            Assessment Complete
                        </div>
                    )}
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-900/30">

                    {/* Disclamer Message */}
                    {messages.length === 0 && (
                        <div className="max-w-xl mx-auto text-center mt-10">
                            <Bot className="w-16 h-16 text-indigo-500/50 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-white mb-2">Welcome to your technical verification.</h2>
                            <p className="text-slate-400">Our AI assistant will ask you a few contextual questions based on the skills listed in your resume. Please answer to the best of your ability.</p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border shadow-sm ${msg.role === 'user'
                                ? 'bg-slate-800 border-slate-700 text-slate-300'
                                : 'bg-indigo-900/80 border-indigo-500/50 text-indigo-300'
                                }`}>
                                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>

                            {/* Bubble */}
                            <div className={`px-5 py-4 rounded-2xl max-w-[80%] text-[15px] leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                ? 'bg-blue-600 border border-blue-500 text-white rounded-tr-sm shadow-[0_4px_20px_rgba(37,99,235,0.25)]'
                                : 'bg-slate-800/90 text-slate-200 rounded-tl-sm border border-slate-700/50 shadow-sm backdrop-blur-md'
                                }`}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4"
                        >
                            <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border shadow-sm bg-indigo-900/80 border-indigo-500/50 text-indigo-300">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="px-6 py-4 rounded-2xl bg-slate-800/90 rounded-tl-sm border border-slate-700/50 backdrop-blur-md flex items-center gap-2 h-[56px]">
                                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800/80 relative z-10 shrink-0">
                    <form onSubmit={handleSend} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={status === "Completed" ? "Assessment complete. You may close this window." : "Type your answer here..."}
                            className="w-full bg-slate-800/50 border border-slate-700 focus:bg-slate-800 rounded-2xl px-6 py-4 pr-16 text-base text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                            disabled={isTyping || status === "Completed"}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping || status === "Completed"}
                            className="absolute right-3 p-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl transition-all disabled:opacity-50 disabled:bg-slate-700 disabled:text-slate-500 focus:scale-95 shadow-sm"
                        >
                            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </form>
                    <div className="text-center mt-3 text-xs text-slate-500">
                        Powered by HireGuard AI Verification Engine
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
