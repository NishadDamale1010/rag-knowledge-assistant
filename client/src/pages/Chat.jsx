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
} from "lucide-react";
import toast from "react-hot-toast";
import ChatWindow from "../components/ChatWindow";
import ChatHistory from "../components/ChatHistory";
import DocSidebar from "../components/DocSidebar";
import PdfPreview from "../components/PdfPreview";
import SourcesPanel from "../components/SourcesPanel";
import CommandPalette from "../components/CommandPalette";
import Badge from "../components/ui/Badge";
import useStreamChat from "../hooks/useStreamChat";
import useDocuments from "../hooks/useDocuments";
import useChatHistory from "../hooks/useChatHistory";
import useUsage from "../hooks/useUsage";
import UsageBadge from "../components/UsageBadge";

function Chat() {
    const { id } = useParams();
    const navigate = useNavigate();

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
        <div className="h-screen flex bg-slate-900 overflow-hidden">
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
                <header className="h-14 shrink-0 flex items-center gap-3 px-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm font-semibold text-white truncate">
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
                                className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-300 max-w-[140px]"
                            >
                                {selectedDocs.map((d) => (
                                    <option key={d._id} value={d._id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        <button
                            type="button"
                            onClick={() => setCommandOpen(true)}
                            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                        >
                            <Command size={16} />
                        </button>

                        {previewDocId && (
                            <button
                                type="button"
                                onClick={() => setShowPreview((p) => !p)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    showPreview
                                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                        : "bg-slate-800 text-slate-400 border border-slate-700"
                                }`}
                            >
                                <FileText size={14} />
                                PDF
                            </button>
                        )}
                    </div>
                </header>

                {selectedIds.length > 0 && (
                    <div className="px-4 py-2 border-b border-slate-800/50 flex flex-wrap gap-1.5">
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
                                    className="cursor-pointer"
                                >
                                    {doc.name}
                                </Badge>
                            </button>
                        ))}
                    </div>
                )}

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

                <form
                    onSubmit={handleSubmit}
                    className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-xl"
                >
                    <div className="max-w-3xl mx-auto relative">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder={
                                selectedIds.length === 0
                                    ? "Select documents to start chatting..."
                                    : "Ask anything about your documents..."
                            }
                            disabled={loading || selectedIds.length === 0}
                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-4 pr-24 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={loading || !question.trim() || selectedIds.length === 0}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium disabled:opacity-50 hover:from-indigo-500 hover:to-violet-500 transition-all"
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Send size={16} />
                            )}
                        </button>
                    </div>
                    <p className="text-center text-xs text-slate-600 mt-2">
                        Knowva uses RAG to answer from your documents only
                    </p>
                </form>
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
