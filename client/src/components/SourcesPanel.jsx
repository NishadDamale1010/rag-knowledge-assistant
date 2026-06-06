import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, FileText } from "lucide-react";
import Badge from "./ui/Badge";

function SourcesPanel({ sources, open, onClose }) {
    return (
        <AnimatePresence>
            {open && sources?.length > 0 && (
                <motion.aside
                    initial={{ x: 320, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 320, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="w-80 bg-slate-800/95 border-l border-slate-700 flex flex-col shrink-0"
                >
                    <div className="flex items-center justify-between p-4 border-b border-slate-700">
                        <div className="flex items-center gap-2">
                            <BookOpen size={18} className="text-cyan-400" />
                            <h3 className="font-semibold text-sm">Sources</h3>
                            <Badge variant="cyan">{sources.length}</Badge>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {sources.map((src) => (
                            <div
                                key={src.source}
                                className="p-3 rounded-xl bg-slate-900/50 border border-slate-700/50"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge>[{src.source}]</Badge>
                                    <span className="text-xs text-slate-400 flex items-center gap-1 truncate">
                                        <FileText size={12} />
                                        {src.documentName || "Document"}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">
                                    {src.text}
                                </p>
                                {src.score && (
                                    <p className="text-xs text-slate-600 mt-2">
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
