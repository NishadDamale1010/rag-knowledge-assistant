import { Trash2, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DocSidebar({
    documents,
    loading,
    onDelete,
}) {
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="p-4">
                <p>Loading documents...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="px-4 py-3 border-b">
                <h2 className="font-semibold">
                    Documents
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto">
                {documents.length === 0 ? (
                    <div className="p-4 text-gray-500 text-sm">
                        No documents uploaded yet.
                    </div>
                ) : (
                    documents.map((doc) => (
                        <div
                            key={doc._id}
                            className="group border-b p-3 hover:bg-slate-50 cursor-pointer"
                        >
                            <div
                                onClick={() =>
                                    navigate(`/chat/${doc._id}`)
                                }
                            >
                                <div className="flex items-center gap-2">
                                    <FileText size={18} />

                                    <span className="font-medium truncate">
                                        {doc.name}
                                    </span>
                                </div>

                                <div className="mt-2 text-xs text-gray-500">
                                    {doc.chunkCount || 0} chunks
                                </div>

                                <div className="mt-1">
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${doc.status === "ready"
                                                ? "bg-green-100 text-green-700"
                                                : doc.status === "processing"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {doc.status}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    onDelete(doc._id)
                                }
                                className="hidden group-hover:flex mt-2 text-red-500"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default DocSidebar;