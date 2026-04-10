"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    Users, 
    BookOpen, 
    AlertCircle, 
    Search, 
    RefreshCcw,
    ChevronRight,
    SearchX,
    LogOut,
    FileText,
    Edit3,
    Trash2,
    ShieldAlert,
    UserPlus,
    X,
    Layout,
    ArrowUpRight,
    Search as SearchIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState({ users: 0, syllabi: 0, topics: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [activeUserHistory, setActiveUserHistory] = useState<any>(null);
    
    // Form state
    const [userForm, setUserForm] = useState({ fullName: "", email: "", password: "", role: "STUDENT" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        
        if (!user || user.role !== "ADMIN") {
            router.push("/admin/login");
            return;
        }

        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (data.success) {
                setUsers(data.users || []);
                setStats(data.stats || { users: 0, syllabi: 0, topics: 0 });
            }
        } catch (err) {
            console.error("Fetch error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/admin/login");
    };

    const handleShowSyllabi = async (user: any) => {
        try {
            const res = await fetch(`/api/user/history?userId=${user.id}`);
            const data = await res.json();
            if (data.success) {
                setActiveUserHistory({ ...user, syllabi: data.history });
            }
        } catch (err) { console.error("History fetch failed"); }
    };

    const handleDeleteSyllabus = async (id: string) => {
        if (!confirm("Delete this syllabus?")) return;
        try {
            await fetch(`/api/user/history/edit?id=${id}`, { method: "DELETE" });
            handleShowSyllabi(activeUserHistory);
        } catch (err) { console.error("Delete failed"); }
    };

    const handleRenameSyllabus = async (id: string, oldTitle: string) => {
        const newTitle = prompt("New title:", oldTitle);
        if (!newTitle || newTitle === oldTitle) return;
        try {
            await fetch(`/api/user/history/edit`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, title: newTitle })
            });
            handleShowSyllabi(activeUserHistory);
        } catch (err) { console.error("Rename failed"); }
    };

    const handleRoleToggle = async (id: string, currentRole: string) => {
        const nextRole = currentRole === "ADMIN" ? "STUDENT" : "ADMIN";
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, role: nextRole })
            });
            if (res.ok) fetchData();
        } catch (err) { console.error("Update failed"); }
    };

    const handleEditUser = (user: any) => {
        setEditingUser(user);
        setUserForm({ fullName: user.fullName, email: user.email, password: "", role: user.role });
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingUser.id, fullName: userForm.fullName, email: userForm.email, role: userForm.role })
            });
            if (res.ok) {
                setIsEditModalOpen(false);
                fetchData();
            }
        } catch (err) { console.error("Update failed"); }
        finally { setIsSubmitting(false); }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Remove this user permanently?")) return;
        try {
            const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchData();
        } catch (err) { console.error("Delete failed"); }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userForm)
            });
            if (res.ok) {
                setIsAddModalOpen(false);
                setUserForm({ fullName: "", email: "", password: "", role: "STUDENT" });
                fetchData();
            }
        } catch (err) { console.error("Create failed"); }
        finally { setIsSubmitting(false); }
    };

    const filteredUsers = users.filter(u => 
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-600/10">
            {/* Admin Nav */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4 glass-dark backdrop-blur-3xl flex justify-between items-center border-b border-slate-200">
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push("/admin")}>
                    <div className="p-2 bg-slate-900 rounded-xl shadow-lg ring-2 ring-indigo-500/20 group-hover:scale-110 transition-transform">
                        <ShieldAlert className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xl font-black tracking-tighter uppercase text-slate-900">Admin</span>
                        <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest leading-none">Management Core</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={fetchData} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
                        <RefreshCcw className={`w-4 h-4 text-slate-400 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
                    </button>
                    <div className="h-6 w-[1px] bg-slate-200" />
                    <button 
                        onClick={() => {
                            setUserForm({ fullName: "", email: "", password: "", role: "STUDENT" });
                            setIsAddModalOpen(true);
                        }}
                        className="bg-indigo-600 text-white text-xs font-black uppercase tracking-widest px-8 py-3 rounded-full hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 cursor-pointer"
                    >
                        Add New User
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all cursor-pointer shadow-sm"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </nav>

            <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Total Users", val: stats.users, icon: <Users className="w-8 h-8 text-indigo-600" /> },
                        { label: "Syllabi Created", val: stats.syllabi, icon: <BookOpen className="w-8 h-8 text-purple-600" /> },
                        { label: "Topics Analyzed", val: stats.topics, icon: <AlertCircle className="w-8 h-8 text-pink-600" /> }
                    ].map((stat, i) => (
                        <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-200 flex items-center gap-6 group hover:translate-y-[-4px] transition-all shadow-xl shadow-indigo-500/[0.02]">
                            <div className="bg-slate-50 p-5 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                <h3 className="text-4xl font-black text-slate-900 tabular-nums">{stat.val}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter">Registered Users</h2>
                            <p className="text-slate-500 text-sm font-medium">Full systematic control over all enrolled accounts and content.</p>
                        </div>
                        <div className="relative group w-full md:w-96">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
                            <input 
                                placeholder="Search by name, email, or college..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-200 transition-all font-medium text-slate-900" 
                            />
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] bg-white border border-slate-200 overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    {["Profile Identity", "Security Root", "Intel Context", "Journeys", "Commands"].map((th) => (
                                        <th key={th} className="px-10 py-6 text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">{th}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm uppercase shadow-lg shadow-slate-900/10 transition-transform group-hover:scale-110">
                                                    {user.fullName.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 mb-0.5">{user.fullName}</p>
                                                    <p className="text-xs text-slate-400 font-mono italic">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <button 
                                                onClick={() => handleRoleToggle(user.id, user.role)}
                                                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all hover:shadow-lg border ${user.role === 'ADMIN' ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/20' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                            >
                                                {user.role}
                                            </button>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="text-sm font-bold text-slate-700">{user.college || "Independent"}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{user.department || "General Sync"}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="text-center">
                                                    <span className="text-xl font-black text-slate-900 leading-none">{user._count?.syllabi || 0}</span>
                                                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-1">Modules</p>
                                                </div>
                                                <button onClick={() => handleShowSyllabi(user)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:text-indigo-600 hover:border-indigo-100 hover:bg-white transition-all">
                                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeUserHistory?.id === user.id ? 'text-indigo-600 rotate-90' : ''}`} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleEditUser(user)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-xl transition-all shadow-sm">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteUser(user.id)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 rounded-xl transition-all shadow-sm">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Intelligent Drilldown */}
                <AnimatePresence>
                    {activeUserHistory && (
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="pt-12 border-t border-slate-200 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-10 bg-indigo-600 rounded-full" />
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 font-mono">Archive Audit: {activeUserHistory.fullName}</h2>
                                        <p className="text-slate-500 text-sm font-medium">Operational oversight of {activeUserHistory.syllabi?.length || 0} curriculum sequences.</p>
                                    </div>
                                </div>
                                <button onClick={() => setActiveUserHistory(null)} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors shadow-sm">Close Audit View</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeUserHistory.syllabi?.map((s: any) => (
                                    <div key={s.id} className="p-8 rounded-[3rem] bg-white border border-slate-200 space-y-6 shadow-xl shadow-indigo-500/[0.03] group hover:border-indigo-200 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 shadow-inner group-hover:scale-110 transition-transform"><FileText className="w-6 h-6" /></div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleRenameSyllabus(s.id, s.title)} className="p-2.5 bg-slate-50/50 rounded-xl text-slate-300 hover:text-indigo-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteSyllabus(s.id)} className="p-2.5 bg-slate-50/50 rounded-xl text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                        <h4 className="text-slate-800 font-black text-xl mb-4 line-clamp-1">{s.title}</h4>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s._count?.units || 0} Study Blocks</span>
                                            <button onClick={() => router.push(`/results/${s.id}`)} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline flex items-center gap-2">Inspect Result <ArrowUpRight className="w-3 h-3"/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Form Modals */}
            <AnimatePresence>
                {(isAddModalOpen || isEditModalOpen) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white border border-slate-200 rounded-[3.5rem] p-12 max-w-lg w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                            <div className="flex justify-between items-start mb-10">
                                <h2 className="text-3xl font-black tracking-tight text-slate-900">
                                    {isAddModalOpen ? "New User Setup" : "Edit Intelligence Root"}
                                </h2>
                                <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="p-2.5 bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={isAddModalOpen ? handleCreateUser : handleUpdateUser} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Identifier Name</label>
                                        <input required type="text" placeholder="e.g. John Doe" value={userForm.fullName} onChange={e => setUserForm({...userForm, fullName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:bg-white transition-all font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Secure Network Address</label>
                                        <input required type="email" placeholder="e.g. user@edusync.com" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:bg-white transition-all font-bold" />
                                    </div>
                                    {isAddModalOpen && (
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Authentication Token</label>
                                            <input required type="password" placeholder="Min. 8 Chars" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:bg-white transition-all font-bold" />
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        {['STUDENT', 'ADMIN'].map(r => (
                                            <button 
                                                key={r} type="button" onClick={() => setUserForm({...userForm, role: r})}
                                                className={`py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border transition-all ${userForm.role === r ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-600/20' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'}`}
                                            >
                                                {r} Identity
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full grad-primary py-5 rounded-[2.5rem] font-black text-white uppercase text-xs tracking-[0.2em] shadow-2xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all mt-6">
                                    {isSubmitting ? "Processing..." : (isAddModalOpen ? "Deploy Identity" : "Commit Changes")}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
