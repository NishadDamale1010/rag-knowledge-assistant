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
} from "lucide-react";
import DocSidebar from "../components/DocSidebar";
import FileUpload from "../components/FileUpload";
import CommandPalette from "../components/CommandPalette";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Skeleton from "../components/ui/Skeleton";
import Button from "../components/ui/Button";
import useDocuments from "../hooks/useDocuments";
import useUsage from "../hooks/useUsage";
import UsageBadge from "../components/UsageBadge";
import PageTransition from "../components/layout/PageTransition";

function Dashboard() {
    const navigate = useNavigate();
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

    const stats = [
        { label: "Documents", value: documents.length, icon: FileText, color: "indigo" },
        { label: "Total Pages", value: totalPages, icon: Layers, color: "violet" },
        { label: "Ready", value: readyDocs, icon: Sparkles, color: "cyan" },
        { label: "Chats", value: "∞", icon: MessageSquare, color: "emerald" },
    ];

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

    return (
        <div className="h-screen flex bg-slate-900 overflow-hidden">
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
                <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl">
                    <h1 className="text-sm font-medium text-slate-300">Workspace</h1>
                    <div className="flex items-center gap-3">
                        <UsageBadge usage={usage} type="chat" />
                        <UsageBadge usage={usage} type="upload" />
                        <button
                            type="button"
                            onClick={() => setCommandOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-400 hover:text-slate-300 transition-colors"
                        >
                            <Command size={14} />
                            <span className="hidden sm:inline">Command</span>
                            <kbd className="hidden sm:inline bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-slate-500">
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
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-cyan-600/10 border border-indigo-500/20 p-8"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
                            <div className="relative">
                                <Badge className="mb-4">
                                    <Sparkles size={12} />
                                    AI Knowledge Workspace
                                </Badge>
                                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                                    Welcome back to{" "}
                                    <span className="gradient-text">Knowva</span>
                                </h2>
                                <p className="text-slate-400 max-w-lg mb-6">
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

                        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <stat.icon size={18} className="text-indigo-400" />
                                            <Badge variant="muted">{stat.label}</Badge>
                                        </div>
                                        {loading ? (
                                            <Skeleton className="h-8 w-16" />
                                        ) : (
                                            <p className="text-2xl font-bold text-white">
                                                {stat.value}
                                            </p>
                                        )}
                                    </Card>
                                </motion.div>
                            ))}
                        </section>

                        <section className="grid lg:grid-cols-2 gap-6">
                            <div id="upload-section">
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
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
                                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                                        Recent Documents
                                    </h3>
                                    {documents.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => navigate("/chat")}
                                            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                        >
                                            View all <ArrowRight size={12} />
                                        </button>
                                    )}
                                </div>

                                {loading ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <Skeleton key={i} className="h-16" />
                                        ))}
                                    </div>
                                ) : documents.length === 0 ? (
                                    <Card className="p-10 text-center">
                                        <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                                        <p className="text-slate-400 text-sm">
                                            No documents yet. Upload your first PDF.
                                        </p>
                                    </Card>
                                ) : (
                                    <div className="space-y-2">
                                        {documents.slice(0, 5).map((doc) => (
                                            <Card
                                                key={doc._id}
                                                hover
                                                className="p-4 flex items-center gap-3 cursor-pointer group"
                                                onClick={() => navigate(`/chat/${doc._id}`)}
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                                                    <FileText size={18} className="text-indigo-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">
                                                        {doc.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {doc.pageCount || 0} pages ·{" "}
                                                        {doc.status || "ready"}
                                                    </p>
                                                </div>
                                                <ArrowRight
                                                    size={16}
                                                    className="text-slate-600 group-hover:text-indigo-400 transition-colors"
                                                />
                                            </Card>
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
