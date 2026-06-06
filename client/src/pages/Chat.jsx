import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import ChatWindow from "../components/ChatWindow";
import DocSidebar from "../components/DocSidebar";
import useStreamChat from "../hooks/useStreamChat";
import useDocuments from "../hooks/useDocuments";

function Chat() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { messages, loading, sendMessage } = useStreamChat();
    const { documents, loading: docsLoading, deleteDocument } = useDocuments();
    const [question, setQuestion] = useState("");

    const currentDoc = documents.find((doc) => doc._id === id);

    useEffect(() => {
        setQuestion("");
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim() || loading) return;

        const q = question.trim();
        setQuestion("");
        await sendMessage(q, id);
    };

    return (
        <div className="h-screen flex bg-slate-50">
            <DocSidebar
                documents={documents}
                loading={docsLoading}
                onDelete={deleteDocument}
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

                    <div className="min-w-0">
                        <h1 className="text-lg font-semibold text-slate-800 truncate">
                            {currentDoc?.name || "Chat with Document"}
                        </h1>
                        <p className="text-sm text-slate-500">
                            Ask questions about this document
                        </p>
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
                            placeholder="Ask a question about this document..."
                            disabled={loading}
                            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                        />

                        <button
                            type="submit"
                            disabled={loading || !question.trim()}
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
