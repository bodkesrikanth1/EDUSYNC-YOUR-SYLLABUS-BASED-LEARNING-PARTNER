"use client";

import { motion } from "framer-motion";
import { GraduationCap, Sparkles, Video, BookOpen, Clock, Users, ChevronRight, Send, ArrowUpRight, PlayCircle, Layers } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-600/20 relative overflow-hidden">
            {/* Background Mesh */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[180px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-500/10 blur-[180px] rounded-full" />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4 glass-dark backdrop-blur-3xl flex justify-between items-center transition-all">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="p-2 grad-primary rounded-xl shadow-lg">
                        <GraduationCap className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">EduSync</span>
                </div>
                
                <div className="hidden md:flex items-center gap-10 font-medium text-sm">
                    {["How it Works", "Features", "Pricing", "Support"].map((item) => (
                        <span key={item} className="hover:text-indigo-600 transition-colors cursor-pointer text-slate-500">{item}</span>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Login</Link>
                    <Link href="/register" className="grad-primary text-white text-xs font-bold uppercase tracking-wider px-8 py-3 rounded-full shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all">Sign Up</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-48 pb-32 px-6 max-w-7xl mx-auto text-center z-10">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="flex justify-center mb-8">
                        <div className="px-4 py-1.5 rounded-full glass border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> 
                            Easy Learning
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                        Turn your Syllabus into a <br/> <span className="text-grad">Simple Study Plan</span>.
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                        Paste your course syllabus and we will find the best YouTube videos, study notes, and summaries for you automatically.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <Link href="/register" className="grad-primary px-10 py-5 rounded-2xl text-white font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
                            Start Learning Now <Send className="w-5 h-5" />
                        </Link>
                        <button className="px-10 py-5 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold text-lg hover:bg-slate-50 transition-all flex items-center gap-3 shadow-lg">
                            See How It Works <PlayCircle className="w-5 h-5 text-indigo-600" />
                        </button>
                    </div>
                </motion.div>
                
                {/* Visual Preview */}
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="mt-32 relative mx-auto max-w-5xl rounded-[3rem] p-4 glass border border-white shadow-2xl overflow-hidden">
                    <div className="relative rounded-[2rem] bg-slate-100/50 h-[400px] flex items-center justify-center overflow-hidden">
                        <div className="p-20 text-center space-y-4">
                             <Layers className="w-16 h-16 text-indigo-600/20 mx-auto" />
                             <h4 className="text-3xl font-bold text-slate-400">Course Dashboard Preview</h4>
                             <p className="text-slate-400 font-medium max-w-xs mx-auto">Your syllabus is turned into a list of lessons and videos.</p>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Features Info */}
            <section className="py-40 px-6 bg-white relative z-10 border-t border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl font-extrabold mb-4">Everything you need to study</h2>
                        <p className="text-slate-500 font-medium">Simple tools to help you learn faster.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <Video />, title: "Best Videos", desc: "We find the most helpful YouTube videos for your course topics." },
                            { icon: <BookOpen />, title: "Topic Notes", desc: "Get simple notes and summaries for every part of your syllabus." },
                            { icon: <Clock />, title: "Save Time", desc: "No more searching for hours. Everything is ready in one place." },
                            { icon: <Users />, title: "Share with Friends", desc: "Send your study plans to your classmates easily." }
                        ].map((feat, i) => (
                            <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-200/50 hover:bg-white transition-all group shadow-sm hover:shadow-xl">
                                <div className="p-4 grad-primary rounded-2xl mb-6 w-fit text-white shadow-lg">
                                    {feat.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-slate-100 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-2">
                        <div className="p-2 grad-primary rounded-xl">
                            <GraduationCap className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold text-slate-900">EduSync</span>
                    </div>
                    <div className="flex gap-10 text-slate-500 font-semibold text-sm">
                        <span className="hover:text-indigo-600 cursor-pointer">Terms</span>
                        <span className="hover:text-indigo-600 cursor-pointer">Privacy</span>
                        <span className="hover:text-indigo-600 cursor-pointer">Support</span>
                    </div>
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">© 2026 EduSync Learning.</div>
                </div>
            </footer>
        </div>
    );
}
