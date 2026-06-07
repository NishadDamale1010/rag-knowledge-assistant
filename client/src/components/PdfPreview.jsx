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
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";

function PdfPreview({ documentId, documentName, onClose }) {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [blob, setBlob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [zoom, setZoom] = useState(100);
    const [fullscreen, setFullscreen] = useState(false);
    const containerRef = useRef(null);
    const { theme } = useTheme();
    const isDark = theme === "dark";

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

    const btnClass = `p-1.5 rounded-lg transition-all ${
        isDark
            ? "text-slate-400 hover:text-white hover:bg-slate-800/80"
            : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
    }`;

    return (
        <motion.aside
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            ref={containerRef}
            className={`flex flex-col shrink-0 border-l ${
                fullscreen ? "fixed inset-0 z-50 w-full" : "w-[420px]"
            } ${
                isDark
                    ? "bg-slate-800/50 backdrop-blur-xl border-slate-700/30"
                    : "bg-white border-slate-200"
            }`}
        >
            {/* Header */}
            <div className={`sticky top-0 z-10 flex items-center justify-between gap-2 px-4 py-3 backdrop-blur-xl border-b ${
                isDark
                    ? "bg-slate-900/90 border-slate-700/50"
                    : "bg-white/90 border-slate-200"
            }`}>
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isDark
                            ? "bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border-cyan-500/30"
                            : "bg-indigo-50 border-indigo-200"
                    }`}>
                        <FileText size={14} className={isDark ? "text-cyan-400" : "text-indigo-500"} />
                    </div>
                    <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${
                            isDark ? "text-white" : "text-slate-800"
                        }`}>
                            {documentName}
                        </p>
                        <p className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            PDF Preview
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-0.5">
                    <button type="button" onClick={() => setZoom((z) => Math.max(50, z - 25))} className={btnClass} title="Zoom out">
                        <ZoomOut size={15} />
                    </button>
                    <span className={`text-xs w-10 text-center font-medium tabular-nums ${
                        isDark ? "text-slate-500" : "text-slate-400"
                    }`}>
                        {zoom}%
                    </span>
                    <button type="button" onClick={() => setZoom((z) => Math.min(200, z + 25))} className={btnClass} title="Zoom in">
                        <ZoomIn size={15} />
                    </button>
                    {blob && (
                        <button type="button" onClick={handleDownload} className={`${btnClass} hover:!text-emerald-400`} title="Download">
                            <Download size={15} />
                        </button>
                    )}
                    <button type="button" onClick={toggleFullscreen} className={btnClass} title={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
                        {fullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
                    </button>
                    <div className={`w-px h-5 mx-1 ${isDark ? "bg-slate-700/50" : "bg-slate-200"}`} />
                    <button type="button" onClick={onClose} className={`${btnClass} hover:!text-rose-400`} title="Close">
                        <X size={15} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className={`flex-1 overflow-auto ${isDark ? "bg-slate-950/50" : "bg-slate-50"}`}>
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                            isDark
                                ? "bg-indigo-500/10 border-indigo-500/20"
                                : "bg-indigo-50 border-indigo-200"
                        }`}>
                            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                        </div>
                        <div className="text-center">
                            <p className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                Loading document
                            </p>
                            <p className={`text-xs mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                Fetching PDF from server...
                            </p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="h-full flex items-center justify-center p-8">
                        <div className="text-center max-w-xs">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${
                                isDark
                                    ? "bg-amber-500/10 border-amber-500/20"
                                    : "bg-amber-50 border-amber-200"
                            }`}>
                                <AlertTriangle className="w-7 h-7 text-amber-400" />
                            </div>
                            <p className={`text-sm font-medium mb-2 ${
                                isDark ? "text-slate-200" : "text-slate-700"
                            }`}>Preview Unavailable</p>
                            <p className={`text-xs leading-relaxed mb-5 ${
                                isDark ? "text-slate-400" : "text-slate-500"
                            }`}>
                                {error}
                            </p>
                            <button
                                type="button"
                                onClick={handleRetry}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                                    isDark
                                        ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
                                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                                }`}
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
