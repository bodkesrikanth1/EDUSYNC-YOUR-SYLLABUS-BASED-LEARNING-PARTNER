"use client";

/* UI SYNC VERSION 1.1.5 - FORCED CACHE RESET & SIMPLIFIED LANGUAGE */
import { motion, AnimatePresence } from "framer-motion";
import { Video, BookOpen, GraduationCap, ChevronLeft, Play, Layout, FileText, CheckCircle2, Search, ArrowUpRight, Share2, Printer, Layers, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ResultsClient({ syllabus, stats }: { syllabus: any, stats: any }) {
    const [activeUnit, setActiveUnit] = useState(syllabus.units[0]?.id);

    return (
        <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans selection:bg-indigo-600/10 flex">
            {/* Sidebar Navigation */}
            <aside className="w-80 glass-dark border-r border-slate-200 hidden lg:flex flex-col h-screen fixed top-0 left-0 z-50 overflow-y-auto">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="p-2 grad-primary rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                            <GraduationCap className="text-white w-5 h-5 shadow-xl" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-900">EduSync</span>
                    </Link>
                    <Link href="/dashboard" className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </Link>
                </div>

                <div className="p-8 flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-md">
                        <Layout className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Course Lessons</h2>
                        <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{syllabus.title}</h3>
                    </div>
                </div>

                <div className="px-6 pb-12 space-y-3">
                    {syllabus.units.map((unit: any, i: number) => (
                        <button 
                            key={unit.id}
                            onClick={() => setActiveUnit(unit.id)}
                            className={`w-full p-5 rounded-[2rem] border transition-all text-left flex items-start gap-4 cursor-pointer hover:shadow-xl hover:shadow-indigo-500/5 group ${activeUnit === unit.id ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50/50'}`}
                        >
                            <span className={`text-xs font-bold p-2.5 rounded-xl border flex items-center justify-center min-w-[36px] ${activeUnit === unit.id ? 'bg-white/20 border-white/20' : 'bg-slate-50 border-slate-200'}`}>
                                {i + 1}
                            </span>
                            <div>
                                <h4 className="font-bold text-sm mb-1 leading-snug group-hover:translate-x-1 transition-transform">{unit.title}</h4>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${activeUnit === unit.id ? 'text-white/60' : 'text-slate-400'}`}>
                                    {unit.topics?.length || 0} Topics
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-80 min-h-screen">
                <nav className="sticky top-0 z-40 px-8 py-6 glass-dark border-b border-slate-200 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-8">
                         <div className="flex items-center gap-2">
                             <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.3em]">Study Room</span>
                             <div className="w-2 h-2 rounded-full bg-green-500 shadow-glow" />
                         </div>
                         <div className="h-6 w-[1px] bg-slate-200" />
                         <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                             <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-600"/> {stats?.units || 0} Modules</div>
                             <div className="flex items-center gap-2"><ArrowUpRight className="w-4 h-4 text-purple-600"/> {stats?.topics || 0} Lessons</div>
                         </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all hover:shadow-md"><Share2 className="w-4 h-4"/></button>
                         <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all hover:shadow-md"><Printer className="w-4 h-4"/></button>
                    </div>
                </nav>

                <div className="p-10 max-w-6xl mx-auto space-y-12">
                    <AnimatePresence mode="wait">
                        {syllabus.units.map((unit: any) => activeUnit === unit.id && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                key={unit.id} 
                                className="space-y-12"
                            >
                                {/* Unit Header */}
                                <div className="space-y-4">
                                    <div className="px-5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-extrabold uppercase tracking-[0.3em] w-fit">
                                        Learning Block Focus
                                    </div>
                                    <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">{unit.title}</h1>
                                    <p className="text-slate-500 text-lg max-w-3xl font-medium leading-relaxed">Here are the best videos and notes curated for this part of your course.</p>
                                </div>

                                {/* Results Grid */}
                                <div className="grid grid-cols-1 gap-12">
                                    {unit.topics?.map((topic: any, idx: number) => (
                                        <div key={topic.id} className="p-10 rounded-[4rem] bg-white border border-slate-200 shadow-xl shadow-indigo-500/5 space-y-10 group relative overflow-hidden transition-all hover:shadow-indigo-500/10">
                                            <div className="flex flex-col xl:flex-row gap-12 items-start relative z-10">
                                                {/* Video Section */}
                                                <div className="w-full xl:w-3/5 space-y-6">
                                                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-video bg-slate-100">
                                                        <iframe 
                                                            className="w-full h-full"
                                                            src={`https://www.youtube.com/embed/${topic.youtubeId}`}
                                                            allowFullScreen
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 grad-primary rounded-xl text-white shadow-lg"><Video className="w-5 h-5"/></div>
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Video Content</span>
                                                        </div>
                                                        <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 font-bold">Open on YouTube</button>
                                                    </div>
                                                </div>

                                                {/* Details Section */}
                                                <div className="w-full xl:w-2/5 space-y-8 h-full">
                                                    <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                                                        <div className="w-10 h-10 rounded-full grad-primary flex items-center justify-center text-xs font-bold text-white shadow-xl">
                                                            {idx + 1}
                                                        </div>
                                                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{topic.name}</h3>
                                                    </div>
                                                    
                                                    <div className="space-y-6">
                                                        <div>
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2 mb-3">
                                                                <Sparkles className="w-3 h-3" /> Topic Summary
                                                            </label>
                                                            <p className="text-slate-600 text-sm font-medium leading-[1.8] bg-white p-6 rounded-3xl border border-slate-200 shadow-inner italic">
                                                                "{topic.summary || "Organizing the best learning points for you..."}"
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-purple-600 flex items-center gap-2 mb-3">
                                                                <BookOpen className="w-3 h-3" /> Important Notes
                                                            </label>
                                                            <div className="text-slate-500 text-xs font-medium leading-relaxed whitespace-pre-wrap p-6 rounded-3xl border border-slate-200 bg-slate-50/50 min-h-[160px] custom-scrollbar">
                                                                {topic.notes || "Preparing key takeaways and study insights..."}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
