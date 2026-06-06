import { Trash2, FileText, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DocSidebar({ documents, loading, onDelete }) {
    const navigate = useNavigate();

    const handleDelete = (e, id, name) => {
        e.stopPropagation();
        if (window.confirm(`Delete "${name}"?`)) {
            onDelete(id);
        }
    };

    return (
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm">
            <div className="p-5 border-b border-slate-100">
                <h2 className="font-bold text-lg text-slate-800">Documents</h2>
                <p className="text-sm text-slate-500 mt-1">
                    {loading
                        ? "Loading..."
                        : `${documents.length} file${documents.length !== 1 ? "s" : ""}`}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-14 bg-slate-100 rounded-xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : documents.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                            <FileText className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-medium">No documents yet</p>
                        <p className="text-sm text-slate-400 mt-1">
                            Upload a PDF to get started
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {documents.map((doc) => (
                            <div
                                key={doc._id}
                                className="group flex items-center gap-2 bg-slate-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 p-3 rounded-xl transition-colors"
                            >
                                <button
                                    type="button"
                                    onClick={() => navigate(`/chat/${doc._id}`)}
                                    className="flex items-center gap-3 text-left flex-1 min-w-0"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 group-hover:border-indigo-200">
                                        <FileText
                                            size={16}
                                            className="text-indigo-600"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block truncate text-sm font-medium text-slate-800">
                                            {doc.name}
                                        </span>
                                        {doc.pageCount && (
                                            <span className="text-xs text-slate-400">
                                                {doc.pageCount} pages
                                            </span>
                                        )}
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate(`/chat/${doc._id}`)}
                                    className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white transition-colors"
                                    title="Chat with document"
                                >
                                    <MessageSquare size={16} />
                                </button>

                                <button
                                    type="button"
                                    onClick={(e) =>
                                        handleDelete(e, doc._id, doc.name)
                                    }
                                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
                                    title="Delete document"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}

export default DocSidebar;
