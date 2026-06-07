import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Send,
    Loader2,
    FileText,
    Command,
    Layers,
    Sparkles,
    Download,
    RefreshCw,
    Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import ChatWindow from "../components/ChatWindow";
import ChatHistory from "../components/ChatHistory";
import DocSidebar from "../components/DocSidebar";
import PdfPreview from "../components/PdfPreview";
import SourcesPanel from "../components/SourcesPanel";
import CommandPalette from "../components/CommandPalette";
import Badge from "../components/ui/Badge";
import ThemeToggle from "../components/ui/ThemeToggle";
import useStreamChat from "../hooks/useStreamChat";
import useDocuments from "../hooks/useDocuments";
import useChatHistory from "../hooks/useChatHistory";
import useUsage from "../hooks/useUsage";
import UsageBadge from "../components/UsageBadge";

function Chat() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const { messages, setMessages, loading, sendMessage } = useStreamChat();
    const { documents, loading: docsLoading, deleteDocument } = useDocuments();
    const {
        sessions,
        loading: historyLoading,
        saveSession,
        loadSession,
        deleteSession,
    } = useChatHistory();
    const { usage, fetchUsage, setUsage } = useUsage();

    const [question, setQuestion] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const [showPreview, setShowPreview] = useState(true);
    const [previewDocId, setPreviewDocId] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sourcesOpen, setSourcesOpen] = useState(false);
    const [activeSources, setActiveSources] = useState([]);
    const [commandOpen, setCommandOpen] = useState(false);

    useEffect(() => {
        if (id) setSelectedIds([id]);
    }, [id]);

    useEffect(() => {
        if (selectedIds.length >= 1) {
            setPreviewDocId((prev) =>
                prev && selectedIds.includes(prev) ? prev : selectedIds[0]
            );
        } else {
            setPreviewDocId(null);
        }
    }, [selectedIds]);

    useEffect(() => {
        const handleKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCommandOpen(true);
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    const toggleSelect = (docId) => {
        setSelectedIds((prev) =>
            prev.includes(docId) ? prev.filter((d) => d !== docId) : [...prev, docId]
        );
    };

    const selectAll = () => {
        setSelectedIds(
            selectedIds.length === documents.length
                ? []
                : documents.map((d) => d._id)
        );
    };

    const selectedDocs = documents.filter((d) => selectedIds.includes(d._id));
    const previewDoc = documents.find((d) => d._id === previewDocId);

    const handleNewChat = () => {
        setSessionId(null);
        setMessages([]);
        setQuestion("");
    };

    const handleSelectHistory = async (historyId) => {
        try {
            const session = await loadSession(historyId);
            setSessionId(session._id);
            setMessages(session.messages || []);
            setSelectedIds(
                session.documentIds?.map((d) =>
                    typeof d === "object" ? d._id?.toString() || d.toString() : d.toString()
                ) || []
            );
        } catch {
            toast.error("Failed to load chat");
        }
    };

    const handleDeleteHistory = async (historyId) => {
        if (window.confirm("Delete this chat?")) {
            await deleteSession(historyId);
            if (sessionId === historyId) handleNewChat();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim() || loading) return;
        if (selectedIds.length === 0) {
            toast.error("Select at least one document");
            return;
        }

        const q = question.trim();
        setQuestion("");

        try {
            const result = await sendMessage(q, selectedIds);

            if (result?.usage) {
                setUsage((prev) => ({ ...prev, chat: result.usage }));
            } else {
                fetchUsage();
            }

            if (result?.messages?.length) {
                const saved = await saveSession({
                    sessionId,
                    documentIds: selectedIds,
                    messages: result.messages,
                });
                setSessionId(saved._id);
            }
        } catch (error) {
            if (error.status === 429) {
                toast.error(error.message);
                if (error.usage) setUsage((prev) => ({ ...prev, chat: error.usage }));
            }
        }
    };

    const handleRegenerate = async () => {
        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        if (!lastUser || loading || selectedIds.length === 0) return;

        const trimmed = messages.slice(0, -1);
        while (trimmed.length && trimmed[trimmed.length - 1].role === "assistant") {
            trimmed.pop();
        }
        setMessages(trimmed);

        try {
            const result = await sendMessage(lastUser.content, selectedIds);
            if (result?.usage) setUsage((prev) => ({ ...prev, chat: result.usage }));
            if (result?.messages?.length) {
                const saved = await saveSession({
                    sessionId,
                    documentIds: selectedIds,
                    messages: result.messages,
                });
                setSessionId(saved._id);
            }
        } catch (error) {
            if (error.status === 429) toast.error(error.message);
        }
    };

    const commands = [
        { label: "New Chat", icon: "chat", onSelect: handleNewChat },
        { label: "Dashboard", icon: "dashboard", onSelect: () => navigate("/dashboard") },
        { label: "Toggle PDF", icon: "document", onSelect: () => setShowPreview((p) => !p) },
        ...documents.slice(0, 5).map((d) => ({
            label: d.name,
            icon: "document",
            onSelect: () => {
                setSelectedIds([d._id]);
                setPreviewDocId(d._id);
            },
        })),
    ];

    return (
        <div className={`h-screen flex overflow-hidden transition-colors duration-300 ${
            isDark ? "bg-slate-900" : "bg-gray-50"
        }`}>
            <DocSidebar
                documents={documents}
                loading={docsLoading}
                onDelete={deleteDocument}
                multiSelect
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onSelectAll={selectAll}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onUploadClick={() => navigate("/dashboard")}
            />

            <ChatHistory
                sessions={sessions}
                loading={historyLoading}
                activeId={sessionId}
                onSelect={handleSelectHistory}
                onNew={handleNewChat}
                onDelete={handleDeleteHistory}
                collapsed={sidebarCollapsed}
            />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className={`h-14 shrink-0 flex items-center gap-3 px-4 border-b transition-colors duration-300 ${
                    isDark
                        ? "bg-slate-900/80 backdrop-blur-xl border-slate-800/60"
                        : "bg-white/80 backdrop-blur-xl border-slate-200"
                }`}>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className={`p-2 rounded-lg transition-all ${
                            isDark
                                ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        }`}
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className={`text-sm font-semibold truncate ${
                                isDark ? "text-white" : "text-slate-800"
                            }`}>
                                {selectedIds.length > 1
                                    ? `${selectedIds.length} documents`
                                    : selectedDocs[0]?.name || "Chat"}
                            </h1>
                            {selectedIds.length > 1 && (
                                <Badge variant="cyan">
                                    <Layers size={10} />
                                    Multi-doc
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <UsageBadge usage={usage} type="chat" />

                        {selectedIds.length > 1 && previewDocId && (
                            <select
                                value={previewDocId}
                                onChange={(e) => setPreviewDocId(e.target.value)}
                                className={`text-xs rounded-lg px-2 py-1.5 max-w-[140px] focus:outline-none focus:ring-1 focus:ring-indigo-500/50 ${
                                    isDark
                                        ? "bg-slate-800/60 border border-slate-700/50 text-slate-300"
                                        : "bg-white border border-slate-200 text-slate-600"
                                }`}
                            >
                                {selectedDocs.map((d) => (
                                    <option key={d._id} value={d._id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        <ThemeToggle size="sm" />

                        <button
                            type="button"
                            onClick={() => setCommandOpen(true)}
                            className={`p-2 rounded-lg transition-all ${
                                isDark
                                    ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
                                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                            <Command size={16} />
                        </button>

                        {previewDocId && (
                            <button
                                type="button"
                                onClick={() => setShowPreview((p) => !p)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    showPreview
                                        ? isDark
                                            ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                                            : "bg-indigo-50 text-indigo-600 border border-indigo-200"
                                        : isDark
                                            ? "bg-slate-800/60 text-slate-400 border border-slate-700/50"
                                            : "bg-slate-100 text-slate-500 border border-slate-200"
                                }`}
                            >
                                <FileText size={14} />
                                PDF
                            </button>
                        )}
                    </div>
                </header>

                {/* Selected docs chips */}
                {selectedIds.length > 0 && (
                    <div className={`px-4 py-2.5 border-b flex flex-wrap gap-1.5 ${
                        isDark
                            ? "border-slate-800/40 bg-slate-900/50"
                            : "border-slate-100 bg-slate-50/50"
                    }`}>
                        {selectedDocs.map((doc) => (
                            <button
                                key={doc._id}
                                type="button"
                                onClick={() => setPreviewDocId(doc._id)}
                            >
                                <Badge
                                    variant={
                                        previewDocId === doc._id ? "default" : "muted"
                                    }
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    {doc.name}
                                </Badge>
                            </button>
                        ))}
                    </div>
                )}

                {/* Chat area */}
                <ChatWindow
                    messages={messages}
                    loading={loading}
                    selectedDocs={selectedDocs}
                    onRegenerate={handleRegenerate}
                    onShowSources={(sources) => {
                        setActiveSources(sources);
                        setSourcesOpen(true);
                    }}
                />

                {/* Input area */}
                <div className={`p-4 border-t transition-colors duration-300 ${
                    isDark
                        ? "bg-slate-900/80 backdrop-blur-xl border-slate-800/60"
                        : "bg-white/80 backdrop-blur-xl border-slate-200"
                }`}>
                    <form
                        onSubmit={handleSubmit}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                            <div className={`relative flex items-center rounded-2xl transition-all ${
                                isDark
                                    ? "bg-slate-800/80 border border-slate-700/50 group-focus-within:border-indigo-500/30"
                                    : "bg-white border border-slate-200 group-focus-within:border-indigo-400 shadow-sm"
                            }`}>
                                <div className={`pl-4 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                    <Sparkles size={16} className={loading ? "animate-spin text-indigo-400" : ""} />
                                </div>
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder={
                                        selectedIds.length === 0
                                            ? "Select documents to start chatting..."
                                            : "Enter a prompt here..."
                                    }
                                    disabled={loading || selectedIds.length === 0}
                                    className={`flex-1 bg-transparent pl-3 pr-3 py-3.5 text-sm focus:outline-none disabled:opacity-50 ${
                                        isDark
                                            ? "text-white placeholder:text-slate-500"
                                            : "text-slate-900 placeholder:text-slate-400"
                                    }`}
                                />

                                {/* Action buttons inside input */}
                                <div className="flex items-center gap-1 pr-2">
                                    <button
                                        type="button"
                                        className={`p-2 rounded-lg transition-colors ${
                                            isDark
                                                ? "text-slate-500 hover:text-slate-300"
                                                : "text-slate-400 hover:text-slate-600"
                                        }`}
                                        title="Download chat"
                                    >
                                        <Download size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRegenerate}
                                        disabled={loading || messages.length === 0}
                                        className={`p-2 rounded-lg transition-colors disabled:opacity-30 ${
                                            isDark
                                                ? "text-slate-500 hover:text-slate-300"
                                                : "text-slate-400 hover:text-slate-600"
                                        }`}
                                        title="Regenerate"
                                    >
                                        <RefreshCw size={16} />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !question.trim() || selectedIds.length === 0}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium disabled:opacity-30 hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 shadow-lg shadow-indigo-500/20 disabled:shadow-none"
                                    >
                                        {loading ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Send size={16} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className={`text-center text-[11px] mt-2.5 ${
                            isDark ? "text-slate-600" : "text-slate-400"
                        }`}>
                            Knowva uses RAG to answer from your documents only · Ctrl+K for commands
                        </p>
                    </form>
                </div>
            </div>

            <SourcesPanel
                sources={activeSources}
                open={sourcesOpen}
                onClose={() => setSourcesOpen(false)}
            />

            <AnimatePresence>
                {showPreview && previewDocId && previewDoc && (
                    <PdfPreview
                        documentId={previewDocId}
                        documentName={previewDoc.name}
                        onClose={() => setShowPreview(false)}
                    />
                )}
            </AnimatePresence>

            <CommandPalette
                open={commandOpen}
                onClose={() => setCommandOpen(false)}
                actions={commands}
            />
        </div>
    );
}

export default Chat;
