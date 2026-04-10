import { prisma } from "@/lib/prisma";
import ResultsClient from "./results-client";
import { GraduationCap, ArrowLeft, Layers, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function ResultsPage(props: { 
    params: Promise<{ id: string }> 
}) {
    // Resolve params explicitly as a promise
    const params = await props.params;
    const syllabusId = params?.id;

    // Safety guard
    if (!syllabusId || typeof syllabusId !== 'string') {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
                <div className="p-4 bg-red-100 rounded-2xl text-red-600 mb-6 shadow-xl shadow-red-500/10">
                    <GraduationCap className="w-12 h-12" />
                </div>
                <h1 className="text-slate-900 text-3xl font-bold mb-2 tracking-tight">Login Error</h1>
                <p className="text-slate-500 font-medium max-w-xs mb-8">We could not find the course ID for this page.</p>
                <Link href="/" className="px-8 py-3 grad-primary text-white rounded-xl font-bold hover:scale-105 transition-transform uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20">Go Home</Link>
            </div>
        );
    }

    const syllabus = await prisma.syllabus.findUnique({
        where: { id: syllabusId },
        include: {
            units: {
                include: {
                    topics: {
                        include: {
                            videos: true
                        }
                    }
                }
            }
        }
    });

    if (!syllabus) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
                <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600 mb-6 shadow-xl shadow-indigo-500/10 animate-pulse">
                    <GraduationCap className="w-12 h-12" />
                </div>
                <h1 className="text-slate-900 text-3xl font-bold mb-2 tracking-tight">Study Plan Not Found</h1>
                <p className="text-slate-500 font-medium max-w-xs mb-8">This course study plan could not be found in our database.</p>
                <Link href="/" className="px-8 py-3 grad-primary text-white rounded-xl font-bold hover:scale-105 transition-transform uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20">Return Home</Link>
            </div>
        );
    }

    // Calculate metadata
    const stats = {
        units: syllabus.units.length,
        topics: syllabus.units.reduce<number>((acc, unit) => acc + (unit.topics?.length || 0), 0)
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9]">
            {/* Header */}
            <nav className="fixed top-0 w-full z-100 px-6 py-4 flex justify-between items-center glass-dark border-b border-slate-200 shadow-sm">
                <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                    <div className="p-2 grad-primary rounded-xl shadow-lg ring-2 ring-indigo-500/10">
                        <GraduationCap className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 tracking-tighter">EduSync</span>
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">Course View</p>
                    </div>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                         <div className="flex items-center gap-2"><Layers className="w-3 h-3 text-indigo-600"/> {stats.units} Modules</div>
                         <div className="w-[1px] h-3 bg-slate-200" />
                         <div className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-purple-600"/> {stats.topics} Topics</div>
                    </div>
                    <Link href="/dashboard" className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 transition-all shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </div>
            </nav>

            <main className="pt-24 min-h-screen">
                <ResultsClient syllabus={syllabus} stats={stats} />
            </main>
        </div>
    );
}
