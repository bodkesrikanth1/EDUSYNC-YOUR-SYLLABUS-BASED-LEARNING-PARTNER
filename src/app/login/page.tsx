"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, Mail, Lock, Sparkles, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
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
                localStorage.setItem("user", JSON.stringify(data.user));
                router.push("/dashboard");
            } else {
                setError(data.message || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-600/20 flex relative overflow-hidden">
            {/* Split Screen Design */}
            <div className="hidden lg:flex w-1/2 grad-primary relative flex-col justify-center p-24 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 glow-mesh" />
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl w-fit mb-12 shadow-2xl border border-white/20">
                        <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-6xl font-black mb-6 leading-none tracking-tight">Access Your <br/> AI Learning Path.</h2>
                    <p className="text-white/80 text-lg max-w-md font-medium leading-relaxed mb-12">
                        Welcome back! Login to continue your accelerated learning journey with personalized AI-curated syllabi.
                    </p>
                    <div className="space-y-6">
                        {[
                            "Continue your curriculum syncs",
                            "Review saved study notes",
                            "Track your progress in real-time"
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-3 text-white/90 font-bold">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
                <div className="absolute bottom-12 left-12 p-8 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 max-w-xs shadow-2xl">
                     <p className="text-sm font-medium italic text-white/70">"The fastest way to learn any complex subject from scratch."</p>
                     <p className="mt-4 text-xs font-black uppercase tracking-widest text-white">— EduSync System</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white/50 backdrop-blur-xl relative">
                {/* Mobile Naval */}
                <Link href="/" className="absolute top-10 left-10 lg:hidden flex items-center gap-2">
                    <div className="p-2 grad-primary rounded-xl shadow-lg">
                        <GraduationCap className="text-white w-5 h-5" />
                    </div>
                    <span className="text-lg font-black tracking-tight text-slate-900">EduSync</span>
                </Link>

                <div className="max-w-md w-full">
                    <Link href="/" className="hidden lg:flex items-center gap-2 mb-12 text-slate-400 hover:text-indigo-600 transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Return Home</span>
                    </Link>

                    <div className="mb-10 text-center lg:text-left">
                        <div className="p-2 bg-indigo-100 rounded-xl w-fit mb-4 mx-auto lg:mx-0 shadow-lg shadow-indigo-500/10">
                            <Sparkles className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h1 className="text-4xl font-black mb-2 tracking-tight">Welcome Back.</h1>
                        <p className="text-slate-500 font-medium tracking-tight">Sign in to your account with your credentials.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm shadow-xl shadow-red-500/5 animate-shake">
                            <div className="w-2 h-2 rounded-full bg-red-600" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input 
                                required
                                type="email" 
                                placeholder="Email address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-12 py-5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all shadow-sm group-hover:bg-white font-medium" 
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input 
                                required
                                type="password" 
                                placeholder="Account Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-12 py-5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all shadow-sm group-hover:bg-white font-medium" 
                            />
                        </div>

                        <div className="flex justify-end">
                            <span className="text-sm font-bold text-indigo-600 hover:underline cursor-pointer">Forgot your password?</span>
                        </div>

                        <button 
                            disabled={isLoading}
                            className="w-full grad-primary text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            {isLoading ? "Synchronizing..." : <>Sign In <ArrowRight className="w-5 h-5"/></>}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-slate-500 font-bold mb-4">Don't have an account yet?</p>
                        <Link href="/register" className="px-10 py-4 mb-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black text-sm hover:bg-slate-50 transition-all inline-flex items-center gap-2 shadow-xl shadow-slate-100">
                           Create New Account <ArrowRight className="w-4 h-4 text-indigo-600" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
