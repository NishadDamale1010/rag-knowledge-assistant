import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Loader2, FileText, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import ChatWindow from "../components/ChatWindow";
import ChatHistory from "../components/ChatHistory";
import DocSidebar from "../components/DocSidebar";
import PdfPreview from "../components/PdfPreview";
import useStreamChat from "../hooks/useStreamChat";
import useDocuments from "../hooks/useDocuments";
import useChatHistory from "../hooks/useChatHistory";

function Chat() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isMulti = !id;

    const { messages, setMessages, loading, sendMessage } = useStreamChat();
    const { documents, loading: docsLoading, deleteDocument } = useDocuments();
    const {
        sessions,
        loading: historyLoading,
        saveSession,
        loadSession,
        deleteSession,
    } = useChatHistory();

    const [question, setQuestion] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const [showPreview, setShowPreview] = useState(true);
    const [previewDocId, setPreviewDocId] = useState(null);

    useEffect(() => {
        if (id) {
            setSelectedIds([id]);
        }
    }, [id]);

    useEffect(() => {
        if (selectedIds.length === 1) {
            setPreviewDocId(selectedIds[0]);
        } else if (selectedIds.length > 1 && !selectedIds.includes(previewDocId)) {
            setPreviewDocId(selectedIds[0]);
        } else if (selectedIds.length === 0) {
            setPreviewDocId(null);
        }
    }, [selectedIds, previewDocId]);

    const toggleSelect = (docId) => {
        setSelectedIds((prev) =>
            prev.includes(docId)
                ? prev.filter((d) => d !== docId)
                : [...prev, docId]
        );
    };

    const selectAll = () => {
        if (selectedIds.length === documents.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(documents.map((doc) => doc._id));
        }
    };

    const selectedDocs = documents.filter((doc) =>
        selectedIds.includes(doc._id)
    );

    const previewDoc = documents.find((doc) => doc._id === previewDocId);

    const getTitle = () => {
        if (isMulti) {
            if (selectedIds.length === 0) return "Multi-Document Chat";
            if (selectedIds.length === 1) return selectedDocs[0]?.name;
            return `${selectedIds.length} documents selected`;
        }
        return selectedDocs[0]?.name || "Chat with Document";
    };

    const getSubtitle = () => {
        if (selectedIds.length > 1) {
            return "Ask questions across multiple PDFs";
        }
        if (selectedIds.length === 1) {
            return "Ask questions about this document";
        }
        return "Select documents from the sidebar";
    };

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
        } catch (error) {
            console.error(error);
            toast.error("Failed to load chat");
        }
    };

    const handleDeleteHistory = async (historyId) => {
        if (window.confirm("Delete this chat?")) {
            await deleteSession(historyId);
            if (sessionId === historyId) {
                handleNewChat();
            }
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

        const updatedMessages = await sendMessage(q, selectedIds);

        if (updatedMessages?.length) {
            try {
                const saved = await saveSession({
                    sessionId,
                    documentIds: selectedIds,
                    messages: updatedMessages,
                });
                setSessionId(saved._id);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="h-screen flex bg-slate-50">
            <DocSidebar
                documents={documents}
                loading={docsLoading}
                onDelete={deleteDocument}
                multiSelect
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onSelectAll={selectAll}
            />

            <ChatHistory
                sessions={sessions}
                loading={historyLoading}
                activeId={sessionId}
                onSelect={handleSelectHistory}
                onNew={handleNewChat}
                onDelete={handleDeleteHistory}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="min-w-0 flex-1">
                        <h1 className="text-lg font-semibold text-slate-800 truncate">
                            {getTitle()}
                        </h1>
                        <p className="text-sm text-slate-500">{getSubtitle()}</p>

                        {selectedIds.length > 1 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedDocs.map((doc) => (
                                    <span
                                        key={doc._id}
                                        className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg truncate max-w-[200px]"
                                    >
                                        {doc.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {previewDocId && (
                        <div className="flex items-center gap-2">
                            {selectedIds.length > 1 && (
                                <div className="relative">
                                    <select
                                        value={previewDocId}
                                        onChange={(e) =>
                                            setPreviewDocId(e.target.value)
                                        }
                                        className="appearance-none text-sm border border-slate-200 rounded-lg pl-3 pr-8 py-2 bg-white"
                                    >
                                        {selectedDocs.map((doc) => (
                                            <option key={doc._id} value={doc._id}>
                                                {doc.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={14}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                    />
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setShowPreview(!showPreview)}
                                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                                    showPreview
                                        ? "bg-indigo-100 text-indigo-700"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                <FileText size={16} />
                                {showPreview ? "Hide PDF" : "Show PDF"}
                            </button>
                        </div>
                    )}
                </header>

                <ChatWindow messages={messages} loading={loading} />

                <form
                    onSubmit={handleSubmit}
                    className="p-4 bg-white border-t border-slate-200"
                >
                    <div className="max-w-3xl mx-auto flex gap-3">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder={
                                selectedIds.length > 1
                                    ? "Ask a question across selected documents..."
                                    : "Ask a question about this document..."
                            }
                            disabled={loading || selectedIds.length === 0}
                            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                        />

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !question.trim() ||
                                selectedIds.length === 0
                            }
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Send size={18} />
                            )}
                            Send
                        </button>
                    </div>
                </form>
            </div>

            {showPreview && previewDocId && previewDoc && (
                <PdfPreview
                    documentId={previewDocId}
                    documentName={previewDoc.name}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
}

export default Chat;
