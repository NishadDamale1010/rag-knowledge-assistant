import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import DocSidebar from "../components/DocSidebar";
import useDocuments from "../hooks/useDocuments";

function Dashboard() {
    const navigate = useNavigate();

    const {
        documents,
        loading,
        deleteDocument,
        fetchDocuments,
    } = useDocuments();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    };

    return (
        <div className="h-screen flex bg-slate-100">

            {/* Sidebar */}
            <DocSidebar
                documents={documents}
                loading={loading}
                onDelete={deleteDocument}
            />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">

                {/* Header */}
                <header className="bg-white border-b px-8 py-5 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Knowva
                        </h1>

                        <p className="text-gray-500">
                            Your AI Knowledge Assistant
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </header>

                {/* Content */}
                <div className="p-8">

                    {/* Upload Section */}
                    <div className="max-w-3xl mx-auto">
                        <FileUpload
                            onUploadSuccess={() => {
                                fetchDocuments();
                            }}
                        />
                    </div>

                    {/* Welcome Card */}
                    <div className="max-w-4xl mx-auto mt-8 bg-white rounded-2xl shadow p-8">

                        <h2 className="text-2xl font-semibold mb-3">
                            Welcome to Knowva
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Upload PDFs and chat with your documents
                            using Retrieval-Augmented Generation (RAG).
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">

                            <div className="bg-slate-50 p-4 rounded-xl">
                                <h3 className="font-semibold mb-2">
                                    📄 Upload Documents
                                </h3>

                                <p className="text-gray-600 text-sm">
                                    Upload PDFs and build your
                                    personal knowledge base.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl">
                                <h3 className="font-semibold mb-2">
                                    🤖 Ask Questions
                                </h3>

                                <p className="text-gray-600 text-sm">
                                    Query your documents with AI.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl">
                                <h3 className="font-semibold mb-2">
                                    🔍 Vector Search
                                </h3>

                                <p className="text-gray-600 text-sm">
                                    Semantic retrieval using embeddings.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl">
                                <h3 className="font-semibold mb-2">
                                    📚 Citations
                                </h3>

                                <p className="text-gray-600 text-sm">
                                    Every answer includes sources.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;