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
    AlertTriangle,
    RotateCcw,
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

    const loadPdf = async (cancelled = { current: false }) => {
        let objectUrl = null;
        try {
            setLoading(true);
            setError(null);
            setPdfUrl(null);

            const res = await api.get(`/documents/${documentId}/file`, {
                responseType: "blob",
            });

            if (cancelled.current) return;

            setBlob(res.data);
            objectUrl = URL.createObjectURL(res.data);
            setPdfUrl(objectUrl);
        } catch (err) {
            if (!cancelled.current) {
                const status = err.response?.status;
                if (status === 404) {
                    setError("PDF file not available on this server. Files on free hosting are cleared after each deploy.");
                } else if (status === 403) {
                    setError("You don't have permission to view this document.");
                } else {
                    setError("Could not load PDF preview. Please try again.");
                }
            }
        } finally {
            if (!cancelled.current) setLoading(false);
        }
        return objectUrl;
    };

    useEffect(() => {
        if (!documentId) return;
        const cancelled = { current: false };
        let objectUrl = null;

        loadPdf(cancelled).then((url) => {
            objectUrl = url;
        });

        return () => {
            cancelled.current = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [documentId]);

    const handleRetry = () => {
        loadPdf();
    };

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
            className={`glass-card flex flex-col shrink-0 ${
                fullscreen ? "fixed inset-0 z-50 w-full" : "w-[420px]"
            }`}
        >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-2 px-4 py-3 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                        <FileText size={14} className="text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {documentName}
                        </p>
                        <p className="text-[11px] text-slate-500">PDF Preview</p>
                    </div>
                </div>
                <div className="flex items-center gap-0.5">
                    <button
                        type="button"
                        onClick={() => setZoom((z) => Math.max(50, z - 25))}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-all"
                        title="Zoom out"
                    >
                        <ZoomOut size={15} />
                    </button>
                    <span className="text-xs text-slate-500 w-10 text-center font-medium tabular-nums">
                        {zoom}%
                    </span>
                    <button
                        type="button"
                        onClick={() => setZoom((z) => Math.min(200, z + 25))}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-all"
                        title="Zoom in"
                    >
                        <ZoomIn size={15} />
                    </button>
                    {blob && (
                        <button
                            type="button"
                            onClick={handleDownload}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800/80 transition-all"
                            title="Download"
                        >
                            <Download size={15} />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-all"
                        title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                    >
                        {fullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
                    </button>
                    <div className="w-px h-5 bg-slate-700/50 mx-1" />
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800/80 transition-all"
                        title="Close"
                    >
                        <X size={15} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-slate-950/50">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-slate-300">Loading document</p>
                            <p className="text-xs text-slate-500 mt-1">Fetching PDF from server...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="h-full flex items-center justify-center p-8">
                        <div className="text-center max-w-xs">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-7 h-7 text-amber-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-200 mb-2">Preview Unavailable</p>
                            <p className="text-xs text-slate-400 leading-relaxed mb-5">
                                {error}
                            </p>
                            <button
                                type="button"
                                onClick={handleRetry}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm text-slate-300 font-medium transition-all"
                            >
                                <RotateCcw size={14} />
                                Retry
                            </button>
                        </div>
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
