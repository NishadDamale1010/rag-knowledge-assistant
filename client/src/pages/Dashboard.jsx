import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FileText,
    MessageSquare,
    Layers,
    Sparkles,
    ArrowRight,
    Command,
    Clock,
    TrendingUp,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import DocSidebar from "../components/DocSidebar";
import FileUpload from "../components/FileUpload";
import CommandPalette from "../components/CommandPalette";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Skeleton from "../components/ui/Skeleton";
import Button from "../components/ui/Button";
import ThemeToggle from "../components/ui/ThemeToggle";
import useDocuments from "../hooks/useDocuments";
import useUsage from "../hooks/useUsage";
import UsageBadge from "../components/UsageBadge";
import PageTransition from "../components/layout/PageTransition";

const statConfigs = [
    {
        label: "Documents",
        icon: FileText,
        darkGradient: "from-blue-500/20 to-indigo-500/20",
        darkBorder: "border-blue-500/20",
        lightGradient: "from-blue-50 to-indigo-50",
        lightBorder: "border-blue-200",
        iconColor: "text-blue-400",
        lightIconColor: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        label: "Total Pages",
        icon: Layers,
        darkGradient: "from-violet-500/20 to-purple-500/20",
        darkBorder: "border-violet-500/20",
        lightGradient: "from-violet-50 to-purple-50",
        lightBorder: "border-violet-200",
        iconColor: "text-violet-400",
        lightIconColor: "text-violet-500",
        bg: "bg-violet-500/10",
    },
    {
        label: "Ready",
        icon: TrendingUp,
        darkGradient: "from-emerald-500/20 to-green-500/20",
        darkBorder: "border-emerald-500/20",
        lightGradient: "from-emerald-50 to-green-50",
        lightBorder: "border-emerald-200",
        iconColor: "text-emerald-400",
        lightIconColor: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        label: "Chats",
        icon: MessageSquare,
        darkGradient: "from-cyan-500/20 to-teal-500/20",
        darkBorder: "border-cyan-500/20",
        lightGradient: "from-cyan-50 to-teal-50",
        lightBorder: "border-cyan-200",
        iconColor: "text-cyan-400",
        lightIconColor: "text-cyan-500",
        bg: "bg-cyan-500/10",
    },
];

function Dashboard() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { documents, loading, deleteDocument, fetchDocuments } = useDocuments();
    const { usage, fetchUsage } = useUsage();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [commandOpen, setCommandOpen] = useState(false);
    const scrollToUpload = () => {
        document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const handleKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCommandOpen(true);
            }
            if (e.key === "Escape") setCommandOpen(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    const totalPages = documents.reduce((sum, d) => sum + (d.pageCount || 0), 0);
    const readyDocs = documents.filter((d) => d.status === "ready").length;

    const statValues = [documents.length, totalPages, readyDocs, "∞"];

    const commands = [
        { label: "Go to Dashboard", icon: "dashboard", onSelect: () => navigate("/dashboard") },
        { label: "New Chat", icon: "chat", description: "Start multi-document chat", onSelect: () => navigate("/chat") },
        { label: "Upload PDF", icon: "upload", onSelect: scrollToUpload },
        ...documents.slice(0, 5).map((d) => ({
            label: `Chat: ${d.name}`,
            icon: "document",
            onSelect: () => navigate(`/chat/${d._id}`),
        })),
    ];

    const formatRelativeTime = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

    return (
        <div className={`h-screen flex overflow-hidden transition-colors duration-300 ${
            isDark ? "bg-slate-900" : "bg-gray-50"
        }`}>
            <DocSidebar
                documents={documents}
                loading={loading}
                onDelete={deleteDocument}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onUploadClick={scrollToUpload}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className={`h-14 shrink-0 flex items-center justify-between px-6 border-b transition-colors duration-300 ${
                    isDark
                        ? "bg-slate-900/80 backdrop-blur-xl border-slate-800/60"
                        : "bg-white/80 backdrop-blur-xl border-slate-200"
                }`}>
                    <div className="flex items-center gap-3">
                        <h1 className={`text-sm font-semibold ${
                            isDark ? "text-white" : "text-slate-800"
                        }`}>Workspace</h1>
                        <Badge variant="muted" className="hidden sm:flex">
                            <Sparkles size={10} />
                            Pro
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                        <UsageBadge usage={usage} type="chat" />
                        <UsageBadge usage={usage} type="upload" />
                        <ThemeToggle size="sm" />
                        <button
                            type="button"
                            onClick={() => setCommandOpen(true)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                                isDark
                                    ? "bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-300 hover:border-slate-600"
                                    : "bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            }`}
                        >
                            <Command size={14} />
                            <span className="hidden sm:inline">Command</span>
                            <kbd className={`hidden sm:inline px-1.5 py-0.5 rounded border text-[10px] ${
                                isDark
                                    ? "bg-slate-900/80 border-slate-700/50 text-slate-500"
                                    : "bg-slate-50 border-slate-200 text-slate-400"
                            }`}>
                                ⌘K
                            </kbd>
                        </button>
                        {documents.length > 0 && (
                            <Button size="sm" onClick={() => navigate("/chat")}>
                                <MessageSquare size={14} />
                                New Chat
                            </Button>
                        )}
                    </div>
                </header>

                <PageTransition className="flex-1 overflow-y-auto">
                    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
                        {/* Hero banner */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`relative overflow-hidden rounded-2xl p-8 lg:p-10 border ${
                                isDark
                                    ? "bg-gradient-to-br from-indigo-600/15 via-violet-600/10 to-cyan-600/8 border-indigo-500/15"
                                    : "bg-gradient-to-br from-indigo-50 via-violet-50/50 to-cyan-50/30 border-indigo-100"
                            }`}
                        >
                            <div className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-[100px] ${
                                isDark ? "bg-indigo-500/8" : "bg-indigo-500/5"
                            }`} />
                            <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[80px] ${
                                isDark ? "bg-violet-500/8" : "bg-violet-500/5"
                            }`} />
                            <div className="relative">
                                <Badge className="mb-4 shimmer">
                                    <Sparkles size={12} className="text-amber-400" />
                                    AI Knowledge Workspace
                                </Badge>
                                <h2 className={`text-2xl lg:text-4xl font-bold mb-3 tracking-tight ${
                                    isDark ? "text-white" : "text-slate-900"
                                }`}>
                                    Welcome back to{" "}
                                    <span className="gradient-text">Knowva</span>
                                </h2>
                                <p className={`max-w-lg mb-7 leading-relaxed ${
                                    isDark ? "text-slate-400" : "text-slate-500"
                                }`}>
                                    Upload PDFs, search semantically, and chat with your
                                    documents using RAG-powered AI.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Button onClick={() => navigate("/chat")}>
                                        <MessageSquare size={16} />
                                        Multi-Document Chat
                                    </Button>
                                    <Button variant="secondary" onClick={scrollToUpload}>
                                        Upload PDF
                                    </Button>
                                </div>
                            </div>
                        </motion.section>

                        {/* Stats grid */}
                        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {statConfigs.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                >
                                    <Card className="p-5 group hover:border-slate-600/50 transition-all duration-300">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                                                isDark
                                                    ? `${stat.darkGradient} ${stat.darkBorder}`
                                                    : `${stat.lightGradient} ${stat.lightBorder}`
                                            }`}>
                                                <stat.icon size={18} className={isDark ? stat.iconColor : stat.lightIconColor} />
                                            </div>
                                            <span className={`text-[11px] font-medium uppercase tracking-wider ${
                                                isDark ? "text-slate-500" : "text-slate-400"
                                            }`}>
                                                {stat.label}
                                            </span>
                                        </div>
                                        {loading ? (
                                            <Skeleton className="h-9 w-16" />
                                        ) : (
                                            <p className={`text-3xl font-bold tracking-tight ${
                                                isDark ? "text-white" : "text-slate-900"
                                            }`}>
                                                {statValues[i]}
                                            </p>
                                        )}
                                    </Card>
                                </motion.div>
                            ))}
                        </section>

                        {/* Upload + Recent docs */}
                        <section className="grid lg:grid-cols-2 gap-6">
                            <div id="upload-section">
                                <h3 className={`text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2 ${
                                    isDark ? "text-slate-500" : "text-slate-400"
                                }`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    Upload Document
                                </h3>
                                <FileUpload
                                    onUploadSuccess={() => {
                                        fetchDocuments();
                                        fetchUsage();
                                    }}
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-xs font-semibold uppercase tracking-widest flex items-center gap-2 ${
                                        isDark ? "text-slate-500" : "text-slate-400"
                                    }`}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                                        Recent Documents
                                    </h3>
                                    {documents.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => navigate("/chat")}
                                            className={`text-xs flex items-center gap-1 group ${
                                                isDark
                                                    ? "text-indigo-400 hover:text-indigo-300"
                                                    : "text-indigo-500 hover:text-indigo-600"
                                            }`}
                                        >
                                            View all
                                            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    )}
                                </div>

                                {loading ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <Skeleton key={i} className="h-[72px]" />
                                        ))}
                                    </div>
                                ) : documents.length === 0 ? (
                                    <Card className="p-12 text-center">
                                        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-4 ${
                                            isDark
                                                ? "bg-slate-800 border-slate-700/50"
                                                : "bg-slate-50 border-slate-200"
                                        }`}>
                                            <FileText className={`w-7 h-7 ${
                                                isDark ? "text-slate-600" : "text-slate-300"
                                            }`} />
                                        </div>
                                        <p className={`text-sm font-medium mb-1 ${
                                            isDark ? "text-slate-400" : "text-slate-500"
                                        }`}>
                                            No documents yet
                                        </p>
                                        <p className={`text-xs ${
                                            isDark ? "text-slate-500" : "text-slate-400"
                                        }`}>
                                            Upload your first PDF to get started.
                                        </p>
                                    </Card>
                                ) : (
                                    <div className="space-y-2">
                                        {documents.slice(0, 5).map((doc, i) => (
                                            <motion.div
                                                key={doc._id}
                                                initial={{ opacity: 0, x: 12 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <Card
                                                    hover
                                                    className="p-4 flex items-center gap-3 cursor-pointer group"
                                                    onClick={() => navigate(`/chat/${doc._id}`)}
                                                >
                                                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
                                                        isDark
                                                            ? "from-indigo-500/15 to-violet-500/15 border-indigo-500/20"
                                                            : "from-indigo-50 to-violet-50 border-indigo-200"
                                                    }`}>
                                                        <FileText size={18} className={isDark ? "text-indigo-400" : "text-indigo-500"} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium truncate ${
                                                            isDark ? "text-white" : "text-slate-800"
                                                        }`}>
                                                            {doc.name}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className={`text-xs ${
                                                                isDark ? "text-slate-500" : "text-slate-400"
                                                            }`}>
                                                                {doc.pageCount || 0} pages
                                                            </span>
                                                            <span className={isDark ? "text-slate-700" : "text-slate-300"}>·</span>
                                                            <span className={`text-xs ${
                                                                doc.status === 'ready'
                                                                    ? 'text-emerald-400'
                                                                    : 'text-amber-400'
                                                            }`}>
                                                                {doc.status || "ready"}
                                                            </span>
                                                            {doc.createdAt && (
                                                                <>
                                                                    <span className={isDark ? "text-slate-700" : "text-slate-300"}>·</span>
                                                                    <span className={`text-xs flex items-center gap-1 ${
                                                                        isDark ? "text-slate-600" : "text-slate-400"
                                                                    }`}>
                                                                        <Clock size={10} />
                                                                        {formatRelativeTime(doc.createdAt)}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <ArrowRight
                                                        size={16}
                                                        className={`group-hover:translate-x-0.5 transition-all ${
                                                            isDark
                                                                ? "text-slate-600 group-hover:text-indigo-400"
                                                                : "text-slate-300 group-hover:text-indigo-500"
                                                        }`}
                                                    />
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </PageTransition>
            </div>

            <CommandPalette
                open={commandOpen}
                onClose={() => setCommandOpen(false)}
                actions={commands}
            />
        </div>
    );
}

export default Dashboard;
