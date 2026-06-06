import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, MessageSquare, Upload, LayoutDashboard } from "lucide-react";

const icons = {
    dashboard: LayoutDashboard,
    chat: MessageSquare,
    upload: Upload,
    document: FileText,
};

function CommandPalette({ open, onClose, actions = [] }) {
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (!open) setQuery("");
    }, [open]);

    const filtered = actions.filter((a) =>
        a.label.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -10 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700">
                            <Search size={18} className="text-slate-500" />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search commands..."
                                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-500"
                            />
                            <kbd className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-700">
                                ESC
                            </kbd>
                        </div>
                        <div className="max-h-64 overflow-y-auto p-2">
                            {filtered.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-6">
                                    No commands found
                                </p>
                            ) : (
                                filtered.map((action) => {
                                    const Icon = icons[action.icon] || Search;
                                    return (
                                        <button
                                            key={action.label}
                                            type="button"
                                            onClick={() => {
                                                action.onSelect();
                                                onClose();
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-slate-700/50 transition-colors"
                                        >
                                            <Icon size={16} className="text-indigo-400" />
                                            <div>
                                                <p className="text-sm text-white">{action.label}</p>
                                                {action.description && (
                                                    <p className="text-xs text-slate-500">
                                                        {action.description}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default CommandPalette;
