import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, ShieldAlert, Sparkles } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { useAuth } from "../context/AuthContext";

export default function UploadBox({ onUploadStart, onUploadComplete, isProcessing }) {
    const { token } = useAuth();
    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndSetFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            validateAndSetFiles(e.target.files);
        }
    };

    const validateAndSetFiles = (selectedFiles) => {
        setError("");
        const validFiles = [];
        Array.from(selectedFiles).forEach(file => {
            if (file.type === "application/pdf") {
                validFiles.push(file);
            } else {
                setError("Only PDF documents are allowed.");
            }
        });

        if (validFiles.length > 0) {
            setFiles(validFiles);
        }
    };

    const clearFiles = (e) => {
        e.stopPropagation(); // prevent triggering upload
        setFiles([]);
        setError("");
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        onUploadStart();
        const formData = new FormData();
        // Append multiple files to the 'resumes' key
        files.forEach(f => formData.append("resumes", f));

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await axios.post("/api/verify/upload", formData, config);
            if (res.data.success) {
                onUploadComplete(res.data.data);
                clearFiles({ stopPropagation: () => { } });
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Verification failed. Is the server running?");
            onUploadComplete(null);
        }
    };

    return (
        <Tilt
            glareEnable={true}
            glareMaxOpacity={0.15}
            glareColor="#ffffff"
            glarePosition="all"
            tiltMaxAngleX={4}
            tiltMaxAngleY={4}
            perspective={1000}
            scale={1.01}
            transitionSpeed={1500}
            className="h-full flex flex-col"
        >
            <div className="glass-card glass-card-hover rounded-3xl p-7 relative overflow-hidden flex flex-col flex-1 transform-gpu z-10 transition-colors duration-500">

                {/* Dynamic Background Glow Based on State */}
                <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[60px] pointer-events-none transition-colors duration-1000 ease-out z-0
          ${isProcessing ? "bg-indigo-500/10 animate-pulse-slow" : files.length > 0 ? "bg-emerald-500/10" : "bg-blue-500/10"}
        `} />

                <div className="relative z-10 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-3 text-white tracking-wide">
                            <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700 shadow-sm">
                                <UploadCloud className="w-5 h-5 text-blue-400" />
                            </div>
                            Payload Injection
                        </h2>
                        {files.length > 0 && !isProcessing && (
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                            </span>
                        )}
                    </div>

                    <p className="text-gray-400/80 text-sm mb-6 leading-relaxed">
                        Drag and drop PDF resumes to initialize the multi-agent AI risk analysis protocol.
                    </p>

                    <div
                        className={`relative flex-1 rounded-2xl p-8 transition-all duration-300 ease-out flex flex-col items-center justify-center min-h-[220px] text-center cursor-pointer group/dropzone border border-dashed
              ${dragActive
                                ? "border-blue-500/50 bg-blue-500/5 shadow-inner"
                                : files.length > 0
                                    ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-400/60"
                                    : "border-slate-700 bg-slate-900/30 hover:border-slate-500 hover:bg-slate-800/40"
                            }
            `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => files.length === 0 && inputRef.current && inputRef.current.click()}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept="application/pdf"
                            onChange={handleChange}
                            multiple
                            className="hidden"
                            id="resume-upload"
                        />

                        <AnimatePresence mode="wait">
                            {files.length === 0 ? (
                                <motion.div
                                    key="upload-prompt"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col items-center pointer-events-none"
                                >
                                    <motion.div
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mb-5 shadow-2xl border border-white/5 group-hover/dropzone:border-blue-500/30 group-hover/dropzone:shadow-[0_0_25px_rgba(59,130,246,0.2)] transition-all duration-500"
                                    >
                                        <UploadCloud className="w-8 h-8 text-gray-400 group-hover/dropzone:text-blue-400 transition-colors duration-500" />
                                    </motion.div>
                                    <p className="text-gray-200 font-semibold mb-1 text-lg group-hover/dropzone:text-white transition-colors duration-300">Drop your files here</p>
                                    <p className="text-gray-500 text-sm font-medium">or click to browse local files</p>

                                    <div className="mt-6 flex items-center gap-4 text-xs font-semibold text-gray-600 uppercase tracking-widest">
                                        <span className="bg-white/5 py-1 px-3 rounded-md">PDFs</span>
                                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                        <span className="bg-white/5 py-1 px-3 rounded-md">Max 5MB ea</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="file-ready"
                                    initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, type: "spring" }}
                                    className="flex flex-col items-center w-full relative z-20"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-900/40 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-4 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <p className="text-white font-bold text-lg mb-4">{files.length} Payload{files.length > 1 ? 's' : ''} Ready</p>

                                    <div className="flex flex-wrap justify-center gap-2 mb-6 max-h-[100px] overflow-y-auto px-2 custom-scrollbar">
                                        {files.map((f, i) => (
                                            <span key={i} className="text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-md truncate max-w-[150px]">
                                                {f.name}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={clearFiles}
                                        disabled={isProcessing}
                                        className="group relative px-6 py-2 overflow-hidden rounded-xl font-medium border border-red-500/20 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Dismiss Payload{files.length > 1 ? 's' : ''}
                                        </span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -10 }}
                                className="mt-4"
                            >
                                <div className="text-red-400 text-sm font-medium flex items-center gap-3 bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div className="mt-6">
                        <button
                            onClick={handleUpload}
                            disabled={files.length === 0 || isProcessing}
                            className={`relative w-full py-3.5 px-6 rounded-xl font-semibold tracking-wide flex justify-center items-center gap-3 transition-all duration-300 overflow-hidden outline-none shadow-sm
                ${files.length === 0
                                    ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                                    : isProcessing
                                        ? "bg-indigo-900/40 text-indigo-200 cursor-wait border border-indigo-800/50"
                                        : "bg-blue-600 hover:bg-blue-500 text-white border border-blue-500"}
              `}
                        >
                            {/* Button Hover effect overlay */}
                            {files.length > 0 && !isProcessing && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                            )}

                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Executing Intelligent Scan...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Initiate Verification
                                </>
                            )}
                        </button>
                    </motion.div>
                </div>
            </div>
        </Tilt>
    );
}
