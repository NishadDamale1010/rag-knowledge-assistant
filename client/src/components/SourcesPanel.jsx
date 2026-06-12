import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, FileText } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Badge from "./ui/Badge";

function SourcesPanel({ sources, open, onClose }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <AnimatePresence>
            {open && sources?.length > 0 && (
                <motion.aside
                    initial={{ x: 320, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 320, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className={`w-80 flex flex-col shrink-0 border-l transition-colors duration-300 ${
                        isDark
                            ? "bg-slate-800/95 border-slate-700"
                            : "bg-white border-slate-200"
                    }`}
                >
                    <div className={`flex items-center justify-between p-4 border-b ${
                        isDark ? "border-slate-700" : "border-slate-200"
                    }`}>
                        <div className="flex items-center gap-2">
                            <BookOpen size={18} className={isDark ? "text-cyan-400" : "text-indigo-500"} />
                            <h3 className={`font-semibold text-sm ${
                                isDark ? "text-white" : "text-slate-800"
                            }`}>Sources</h3>
                            <Badge variant="cyan">{sources.length}</Badge>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className={`p-1.5 rounded-lg transition-colors ${
                                isDark
                                    ? "text-slate-400 hover:text-white hover:bg-slate-700"
                                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {sources.map((src) => (
                            <div
                                key={src.source}
                                className={`p-3 rounded-xl border ${
                                    isDark
                                        ? "bg-slate-900/50 border-slate-700/50"
                                        : "bg-slate-50 border-slate-200"
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge>[{src.source}]</Badge>
                                    <span className={`text-xs flex items-center gap-1 truncate ${
                                        isDark ? "text-slate-400" : "text-slate-500"
                                    }`}>
                                        <FileText size={12} />
                                        {src.documentName || "Document"}
                                    </span>
                                </div>
                                <p className={`text-xs leading-relaxed line-clamp-4 ${
                                    isDark ? "text-slate-400" : "text-slate-500"
                                }`}>
                                    {src.excerpt || "Excerpt hidden for safety."}
                                </p>
                                {src.redacted && (
                                    <p className={`text-[11px] mt-2 ${
                                        isDark ? "text-slate-600" : "text-slate-400"
                                    }`}>
                                        Code-like content omitted
                                    </p>
                                )}
                                {src.score && (
                                    <p className={`text-xs mt-2 ${
                                        isDark ? "text-slate-600" : "text-slate-400"
                                    }`}>
                                        Score: {src.score.toFixed(3)}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}

export default SourcesPanel;
