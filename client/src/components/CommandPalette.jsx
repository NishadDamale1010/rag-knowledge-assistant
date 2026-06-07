import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, MessageSquare, Upload, LayoutDashboard } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const icons = {
    dashboard: LayoutDashboard,
    chat: MessageSquare,
    upload: Upload,
    document: FileText,
};

function CommandPalette({ open, onClose, actions = [] }) {
    const [query, setQuery] = useState("");
    const { theme } = useTheme();
    const isDark = theme === "dark";

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
                    className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -10 }}
                        onClick={(e) => e.stopPropagation()}
                        className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border ${
                            isDark
                                ? "bg-slate-800 border-slate-700"
                                : "bg-white border-slate-200"
                        }`}
                    >
                        <div className={`flex items-center gap-3 px-4 py-3 border-b ${
                            isDark ? "border-slate-700" : "border-slate-200"
                        }`}>
                            <Search size={18} className={isDark ? "text-slate-500" : "text-slate-400"} />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search commands..."
                                className={`flex-1 bg-transparent text-sm outline-none ${
                                    isDark
                                        ? "text-white placeholder:text-slate-500"
                                        : "text-slate-900 placeholder:text-slate-400"
                                }`}
                            />
                            <kbd className={`text-xs px-2 py-1 rounded border ${
                                isDark
                                    ? "text-slate-500 bg-slate-900 border-slate-700"
                                    : "text-slate-400 bg-slate-50 border-slate-200"
                            }`}>
                                ESC
                            </kbd>
                        </div>
                        <div className="max-h-64 overflow-y-auto p-2">
                            {filtered.length === 0 ? (
                                <p className={`text-sm text-center py-6 ${
                                    isDark ? "text-slate-500" : "text-slate-400"
                                }`}>
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
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                                                isDark
                                                    ? "hover:bg-slate-700/50"
                                                    : "hover:bg-slate-50"
                                            }`}
                                        >
                                            <Icon size={16} className={isDark ? "text-indigo-400" : "text-indigo-500"} />
                                            <div>
                                                <p className={`text-sm ${isDark ? "text-white" : "text-slate-800"}`}>
                                                    {action.label}
                                                </p>
                                                {action.description && (
                                                    <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
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
