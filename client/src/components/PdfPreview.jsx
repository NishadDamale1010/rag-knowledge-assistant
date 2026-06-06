import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Loader2,
    X,
    ZoomIn,
    ZoomOut,
    Download,
    Maximize,
    Minimize,
} from "lucide-react";
import api from "../api/axios";

function PdfPreview({ documentId, documentName, onClose }) {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [blob, setBlob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [zoom, setZoom] = useState(100);
    const [fullscreen, setFullscreen] = useState(false);
    const containerRef = useRef(null);

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

                setBlob(res.data);
                objectUrl = URL.createObjectURL(res.data);
                setPdfUrl(objectUrl);
            } catch (err) {
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

    const handleDownload = () => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = documentName || "document.pdf";
        a.click();
        URL.revokeObjectURL(url);
    };

    const toggleFullscreen = () => {
        if (!fullscreen) {
            containerRef.current?.requestFullscreen?.();
            setFullscreen(true);
        } else {
            document.exitFullscreen?.();
            setFullscreen(false);
        }
    };

    return (
        <motion.aside
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            ref={containerRef}
            className={`bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 ${
                fullscreen ? "fixed inset-0 z-50 w-full" : "w-[420px]"
            }`}
        >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-2 px-4 py-3 bg-slate-900/95 backdrop-blur border-b border-slate-800">
                <div className="flex items-center gap-2 min-w-0">
                    <FileText size={16} className="text-cyan-400 shrink-0" />
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {documentName}
                        </p>
                        <p className="text-xs text-slate-500">PDF Preview</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setZoom((z) => Math.max(50, z - 25))}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                        <ZoomOut size={16} />
                    </button>
                    <span className="text-xs text-slate-500 w-10 text-center">
                        {zoom}%
                    </span>
                    <button
                        type="button"
                        onClick={() => setZoom((z) => Math.min(200, z + 25))}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                        <ZoomIn size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={handleDownload}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                        <Download size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                        {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-slate-950">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                        <p className="text-sm text-slate-500">Loading document...</p>
                    </div>
                ) : error ? (
                    <div className="h-full flex items-center justify-center p-6">
                        <p className="text-sm text-rose-400">{error}</p>
                    </div>
                ) : (
                    <div
                        className="h-full w-full origin-top-left transition-transform duration-200"
                        style={{ transform: `scale(${zoom / 100})` }}
                    >
                        <iframe
                            src={pdfUrl}
                            title={documentName}
                            className="w-full h-full min-h-[600px] border-0"
                        />
                    </div>
                )}
            </div>
        </motion.aside>
    );
}

export default PdfPreview;
