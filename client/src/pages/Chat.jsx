import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import ChatWindow from "../components/ChatWindow";
import DocSidebar from "../components/DocSidebar";
import useStreamChat from "../hooks/useStreamChat";
import useDocuments from "../hooks/useDocuments";

function Chat() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isMulti = !id;

    const { messages, loading, sendMessage } = useStreamChat();
    const { documents, loading: docsLoading, deleteDocument } = useDocuments();
    const [question, setQuestion] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        if (id) {
            setSelectedIds([id]);
        }
    }, [id]);

    useEffect(() => {
        setQuestion("");
    }, [id, selectedIds.join(",")]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim() || loading) return;

        if (selectedIds.length === 0) {
            toast.error("Select at least one document");
            return;
        }

        const q = question.trim();
        setQuestion("");
        await sendMessage(q, selectedIds);
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
        </div>
    );
}

export default Chat;
