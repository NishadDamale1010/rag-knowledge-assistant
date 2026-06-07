import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";
import api from "../api/axios";

function FileUpload({ onUploadSuccess, compact = false }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [success, setSuccess] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const uploadFile = async (file) => {
        if (!file) return;
        if (file.type !== "application/pdf") {
            toast.error("Only PDF files are allowed");
            return;
        }

        try {
            setUploading(true);
            setSuccess(false);
            setProgress(0);

            const formData = new FormData();
            formData.append("pdf", file);

            const response = await api.post("/documents/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (e) => {
                    setProgress(Math.round((e.loaded * 100) / e.total));
                },
            });

            setSuccess(true);
            toast.success("PDF uploaded successfully");
            onUploadSuccess?.(response.data);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    if (compact) {
        return (
            <>
                <input
                    type="file"
                    accept=".pdf"
                    hidden
                    ref={fileInputRef}
                    onChange={(e) => uploadFile(e.target.files[0])}
                />
                {uploading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className={`rounded-2xl p-6 w-80 border ${
                            isDark
                                ? "bg-slate-800 border-slate-700"
                                : "bg-white border-slate-200 shadow-xl"
                        }`}>
                            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
                            <p className={`text-sm text-center ${
                                isDark ? "text-slate-300" : "text-slate-600"
                            }`}>
                                Processing... {progress}%
                            </p>
                            <div className={`mt-3 h-1.5 rounded-full overflow-hidden ${
                                isDark ? "bg-slate-700" : "bg-slate-200"
                            }`}>
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <motion.div
            onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                uploadFile(e.dataTransfer.files[0]);
            }}
            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            animate={{
                borderColor: dragging
                    ? "#6366f1"
                    : isDark ? "rgba(51,65,85,0.5)" : "rgba(203,213,225,0.8)",
                scale: dragging ? 1.01 : 1,
            }}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${
                isDark ? "bg-slate-800/40" : "bg-slate-50/50"
            }`}
        >
            <AnimatePresence mode="wait">
                {success ? (
                    <motion.div
                        key="success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex flex-col items-center"
                    >
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
                        <p className="text-emerald-500 font-medium">Upload complete!</p>
                    </motion.div>
                ) : uploading ? (
                    <motion.div key="loading" className="flex flex-col items-center">
                        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
                        <p className={`mb-3 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                            Processing... {progress}%
                        </p>
                        <div className={`w-48 h-1.5 rounded-full overflow-hidden ${
                            isDark ? "bg-slate-700" : "bg-slate-200"
                        }`}>
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="idle" className="flex flex-col items-center">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                            isDark ? "bg-indigo-500/20" : "bg-indigo-50"
                        }`}>
                            <Upload className={`w-7 h-7 ${isDark ? "text-indigo-400" : "text-indigo-500"}`} />
                        </div>
                        <h3 className={`text-lg font-semibold mb-2 ${
                            isDark ? "text-white" : "text-slate-800"
                        }`}>
                            Upload a PDF
                        </h3>
                        <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            Drag & drop or browse from your device
                        </p>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                        >
                            <FileText size={16} />
                            Select PDF
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <input
                type="file"
                accept=".pdf"
                hidden
                ref={fileInputRef}
                onChange={(e) => uploadFile(e.target.files[0])}
            />
        </motion.div>
    );
}

export default FileUpload;
