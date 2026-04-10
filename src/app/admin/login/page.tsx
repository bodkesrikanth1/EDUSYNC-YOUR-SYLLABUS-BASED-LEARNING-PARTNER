"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowRight, Mail, Lock, Sparkles, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                if (data.user.role !== "ADMIN") {
                    setError("Unauthorized. Admin access only.");
                    setIsLoading(false);
                    return;
                }
                localStorage.setItem("user", JSON.stringify(data.user));
                router.push("/admin");
            } else {
                setError(data.message || "Invalid credentials.");
            }
        } catch (err) {
            setError("Network failure.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-600/10 flex relative overflow-hidden">
            {/* Split Screen branding */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-center p-24 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 glow-mesh" />
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl w-fit mb-12 shadow-2xl border border-white/10 ring-2 ring-indigo-500/20">
                        <ShieldAlert className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-6xl font-black mb-6 leading-none tracking-tight">System Control <br/> Authorization.</h2>
                    <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed mb-12">
                        Welcome to the Administrative Hub. Enter your root credentials to manage the EduSync intelligence network.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-500 font-bold mb-8">
                             <div className="w-2 h-2 rounded-full bg-indigo-500" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Security Protocol Active</span>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                             <p className="text-xs font-mono text-slate-500 leading-relaxed italic">"Direct oversight of user generations, content sequences, and system-wide curriculum mapping. Authorization verified by root cryptographic handshakes."</p>
                        </div>
                    </div>
                </motion.div>
                <div className="absolute bottom-12 left-12 flex items-center gap-3">
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">Level A1 Clearance Required</span>
                </div>
            </div>

            {/* Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white/50 backdrop-blur-3xl relative">
                <div className="max-w-md w-full">
                    <Link href="/" className="flex items-center gap-2 mb-12 text-slate-400 hover:text-indigo-600 transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-black uppercase tracking-widest">Return Home</span>
                    </Link>

                    <div className="mb-12">
                        <div className="p-2 bg-slate-900 rounded-xl w-fit mb-6 shadow-xl shadow-slate-900/40 rotate-12">
                            <ShieldAlert className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-4xl font-black mb-2 tracking-tight text-slate-900">Admin Login.</h1>
                        <p className="text-slate-500 font-medium tracking-tight">Enter your secure credentials to proceed.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-black text-xs shadow-xl shadow-red-500/[0.03] animate-shake">
                            <div className="w-2 h-2 rounded-full bg-red-600" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Root Identifier</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                <input 
                                    required
                                    type="email" 
                                    placeholder="admin@edusync.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-14 py-5 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:bg-white transition-all font-bold shadow-sm" 
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Access Token</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                <input 
                                    required
                                    type="password" 
                                    placeholder="Enter your password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-14 py-5 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:bg-white transition-all font-bold shadow-sm" 
                                />
                            </div>
                        </div>

                        <button 
                            disabled={isLoading}
                            className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-slate-900/20 hover:scale-[1.02] hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                        >
                            {isLoading ? "Verifying..." : <>Authorize <ArrowRight className="w-4 h-4"/></>}
                        </button>
                    </form>

                    <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center px-4">
                         <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">EduSync Security Core</span>
                         <div className="flex gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
