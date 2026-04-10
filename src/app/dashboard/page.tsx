"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
    PlusCircle, 
    BookOpen, 
    Sparkles, 
    History, 
    Search, 
    ChevronRight,
    Trash2,
    Edit3,
    LogOut,
    GraduationCap,
    Clock,
    Layers,
    ArrowUpRight,
    FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
    const [title, setTitle] = useState("");
    const [syllabusText, setSyllabusText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [history, setHistory] = useState<any[]>([]);
    const [stats, setStats] = useState({ units: 0, topics: 0, syllabi: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/login");
    };

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const userStr = localStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;
            const userId = user?.id;

            const res = await fetch(`/api/user/history${userId ? `?userId=${userId}` : ''}`);
            const data = await res.json();
            if (data.success) {
                setHistory(data.history || []);
                setStats(data.stats || { units: 0, topics: 0, syllabi: 0 });
            }
        } catch (err) {
            console.error("Fetch failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !syllabusText) {
            setError("Please fill in both fields.");
            return;
        }

        setError("");
        setIsProcessing(true);

        try {
            const userStr = localStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;
            const userId = user?.id;

            const res = await fetch("/api/process", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, syllabusText, userId }),
            });

            const data = await res.json();
            if (data.success) {
                router.push(`/results/${data.syllabusId}`);
            } else {
                setError(data.error || "Something went wrong.");
                setIsProcessing(false);
            }
        } catch (err) {
            setError("Connection error.");
            setIsProcessing(false);
        }
    };

    const deleteSyllabus = async (id: string) => {
        if (!confirm("Are you sure you want to delete this course and all its data?")) return;
        try {
            const res = await fetch(`/api/user/history/edit?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchHistory();
        } catch (err) { console.error("Remove error"); }
    };

    const renameSyllabus = async (id: string, oldTitle: string) => {
        const newTitle = prompt("Enter a new name for this course:", oldTitle);
        if (!newTitle || newTitle === oldTitle) return;
        try {
            const res = await fetch(`/api/user/history/edit`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, title: newTitle }),
            });
            if (res.ok) fetchHistory();
        } catch (err) { console.error("Rename error"); }
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans selection:bg-indigo-600/10">
            {/* Nav Header */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4 glass-dark backdrop-blur-3xl flex justify-between items-center transition-all border-b border-slate-200">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push("/")}>
                    <div className="p-2 grad-primary rounded-xl shadow-lg">
                        <GraduationCap className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">EduSync</span>
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">Student Portal</p>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-10 font-bold text-sm text-slate-500">
                    <button onClick={() => alert("Courses module coming soon!")} className="hover:text-indigo-600 transition-colors">My Courses</button>
                    <button onClick={() => alert("Archives module coming soon!")} className="hover:text-indigo-600 transition-colors">Archived</button>
                    <div className="h-6 w-[1px] bg-slate-200" />
                    <button onClick={handleLogout} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all cursor-pointer">
                        <LogOut className="w-4 h-4" />
                    </button>
                    <div className="w-10 h-10 rounded-xl grad-primary flex items-center justify-center text-white text-xs font-bold shadow-lg cursor-pointer">JD</div>
                </div>
            </nav>

            <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 z-10">
                {/* Left: Input & Stats */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Welcome Box */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 rounded-[3rem] bg-white border border-slate-200 shadow-xl shadow-indigo-500/5 relative overflow-hidden group">
                        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Create your <span className="text-indigo-600">Study Plan</span>.</h1>
                        <p className="text-slate-500 font-medium max-w-lg leading-relaxed">Paste your syllabus text below and we will organize everything for you instantly.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                            {[
                                { icon: <Layers className="text-indigo-600" />, val: stats.syllabi, label: "Courses Created" },
                                { icon: <ArrowUpRight className="text-purple-600" />, val: stats.units, label: "Total Lessons" },
                                { icon: <Sparkles className="text-pink-600" />, val: stats.topics, label: "Topics Found" }
                            ].map((s, i) => (
                                <div key={i} className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100/50">
                                    <div className="p-3 bg-white shadow-md rounded-xl w-fit mb-4">{s.icon}</div>
                                    <h4 className="text-3xl font-extrabold mb-1">{s.val}</h4>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Input Form */}
                    <div className="p-10 rounded-[3rem] bg-white border border-slate-200 shadow-xl shadow-indigo-500/5 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 grad-primary rounded-xl text-white"><PlusCircle className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-extrabold uppercase tracking-tight">Add New Syllabus</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold">{error}</div>}
                            
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Course Name</label>
                                <input 
                                    placeholder="e.g. Biology 101, Marketing Tips" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:bg-white transition-all font-bold" 
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Syllabus Text</label>
                                <textarea 
                                    placeholder="Paste your course units and topics here..." 
                                    rows={10}
                                    value={syllabusText}
                                    onChange={(e) => setSyllabusText(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-8 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:bg-white transition-all font-medium resize-none leading-relaxed"
                                />
                            </div>

                            <button 
                                disabled={isProcessing}
                                className="w-full grad-primary text-white py-6 rounded-[2rem] font-bold uppercase tracking-widest text-sm shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                {isProcessing ? "Working on it..." : <><Sparkles className="w-5 h-5" /> Create Study Plan</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right: History List */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm"><History className="w-5 h-5"/></div>
                            <h3 className="text-xl font-extrabold uppercase tracking-tight">Recent Plans</h3>
                        </div>
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 shadow-sm uppercase tracking-widest">{history.length} Saved</span>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-24 bg-white/50 border border-slate-200 rounded-3xl animate-pulse" />
                            ))
                        ) : history.length === 0 ? (
                            <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 bg-white/30">
                                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold text-sm">No plans created yet.</p>
                            </div>
                        ) : (
                            history.map((item) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={item.id} 
                                    className="p-6 bg-white border border-slate-200 rounded-[2rem] hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => renameSyllabus(item.id, item.title)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"><Edit3 className="w-4 h-4"/></button>
                                            <button onClick={() => deleteSyllabus(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-lg mb-4 line-clamp-1">{item.title}</h4>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                <Layers className="w-3 h-3" /> {item._count?.units || 0} Lessons
                                            </div>
                                            <div className="w-[1px] h-3 bg-slate-200" />
                                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                <Clock className="w-3 h-3" /> {new Date(item.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => router.push(`/results/${item.id}`)}
                                            className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
