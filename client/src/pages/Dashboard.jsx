import { useNavigate } from "react-router-dom";
import { LogOut, Sparkles, Search, BookOpen, Bot, MessagesSquare } from "lucide-react";
import FileUpload from "../components/FileUpload";
import DocSidebar from "../components/DocSidebar";
import useDocuments from "../hooks/useDocuments";

const features = [
    {
        icon: BookOpen,
        title: "Upload PDFs",
        description: "Build a searchable knowledge base from your documents.",
    },
    {
        icon: Bot,
        title: "AI Chat",
        description: "Ask questions about a single PDF or across multiple documents.",
    },
    {
        icon: Search,
        title: "Semantic Search",
        description: "Retrieve the most relevant chunks using embeddings.",
    },
    {
        icon: Sparkles,
        title: "Citations",
        description: "Every response is backed by your uploaded content.",
    },
];

function Dashboard() {
    const navigate = useNavigate();
    const { documents, loading, deleteDocument, fetchDocuments } =
        useDocuments();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="h-screen flex bg-slate-50">
            <DocSidebar
                documents={documents}
                loading={loading}
                onDelete={deleteDocument}
            />

            <main className="flex-1 overflow-y-auto">
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-5 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            Knowva
                        </h1>
                        <p className="text-slate-500 text-sm">
                            AI-Powered Knowledge Assistant
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </header>

                <div className="p-8 max-w-5xl mx-auto space-y-8">
                    {documents.length > 0 && (
                        <section className="bg-indigo-600 rounded-2xl p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-white">
                                    Multi-Document Chat
                                </h2>
                                <p className="text-indigo-100 text-sm mt-1">
                                    Ask questions across multiple PDFs at once
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate("/chat")}
                                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-50 transition-colors"
                            >
                                <MessagesSquare size={18} />
                                Start Chat
                            </button>
                        </section>
                    )}

                    <section>
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">
                            Add a document
                        </h2>
                        <FileUpload onUploadSuccess={fetchDocuments} />
                    </section>

                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                            Welcome to Knowva
                        </h2>
                        <p className="text-slate-500 mb-8">
                            Upload PDFs and chat with your documents using
                            Retrieval-Augmented Generation.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {features.map(({ icon: Icon, title, description }) => (
                                <div
                                    key={title}
                                    className="flex gap-4 p-5 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                                        <Icon size={20} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">
                                            {title}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
