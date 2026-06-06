import { useEffect, useState } from "react";
import { FileText, Loader2, X } from "lucide-react";
import api from "../api/axios";

function PdfPreview({ documentId, documentName, onClose }) {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!documentId) return;

        let objectUrl = null;
        let cancelled = false;

        const loadPdf = async () => {
            try {
                setLoading(true);
                setError(null);
                setPdfUrl(null);

                const res = await api.get(`/documents/${documentId}/file`, {
                    responseType: "blob",
                });

                if (cancelled) return;

                objectUrl = URL.createObjectURL(res.data);
                setPdfUrl(objectUrl);
            } catch (err) {
                console.error(err);
                if (!cancelled) setError("Could not load PDF preview");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadPdf();

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [documentId]);

    return (
        <aside className="w-[420px] bg-white border-l border-slate-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <FileText size={18} className="text-indigo-600 shrink-0" />
                    <div className="min-w-0">
                        <h3 className="font-semibold text-sm text-slate-800 truncate">
                            PDF Preview
                        </h3>
                        <p className="text-xs text-slate-500 truncate">
                            {documentName}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 bg-slate-100">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="h-full flex items-center justify-center p-6 text-center">
                        <p className="text-sm text-slate-500">{error}</p>
                    </div>
                ) : (
                    <iframe
                        src={pdfUrl}
                        title={documentName}
                        className="w-full h-full border-0"
                    />
                )}
            </div>
        </aside>
    );
}

export default PdfPreview;
