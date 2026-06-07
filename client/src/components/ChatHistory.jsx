import { motion } from "framer-motion";
import { History, Plus, Trash2, MessageSquare } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Skeleton from "./ui/Skeleton";

function ChatHistory({
    sessions,
    loading,
    activeId,
    onSelect,
    onNew,
    onDelete,
    collapsed = false,
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    if (collapsed) return null;

    return (
        <aside className={`w-60 flex flex-col shrink-0 border-r transition-colors duration-300 ${
            isDark
                ? "bg-slate-900/50 border-slate-800"
                : "bg-slate-50 border-slate-200"
        }`}>
            <div className={`flex items-center justify-between p-4 border-b ${
                isDark ? "border-slate-800" : "border-slate-200"
            }`}>
                <div className="flex items-center gap-2">
                    <History size={16} className="text-indigo-400" />
                    <h3 className={`font-semibold text-sm ${
                        isDark ? "text-slate-200" : "text-slate-700"
                    }`}>History</h3>
                </div>
                <button
                    type="button"
                    onClick={onNew}
                    className={`p-1.5 rounded-lg transition-colors ${
                        isDark
                            ? "text-indigo-400 hover:bg-indigo-500/20"
                            : "text-indigo-500 hover:bg-indigo-50"
                    }`}
                    title="New chat"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {loading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-16" />
                        ))}
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-10 px-3">
                        <MessageSquare className={`w-7 h-7 mx-auto mb-2 ${
                            isDark ? "text-slate-700" : "text-slate-300"
                        }`} />
                        <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            No chat history
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {sessions.map((session) => (
                            <motion.div
                                key={session._id}
                                whileHover={{ x: 2 }}
                                onClick={() => onSelect(session._id)}
                                className={`group relative p-3 rounded-xl cursor-pointer transition-all ${
                                    activeId === session._id
                                        ? isDark
                                            ? "bg-indigo-500/15 border border-indigo-500/30"
                                            : "bg-indigo-50 border border-indigo-200"
                                        : isDark
                                            ? "hover:bg-slate-800/60 border border-transparent"
                                            : "hover:bg-white border border-transparent hover:shadow-sm"
                                }`}
                            >
                                <p className={`text-sm font-medium truncate pr-5 ${
                                    isDark ? "text-slate-200" : "text-slate-700"
                                }`}>
                                    {session.title}
                                </p>
                                <p className={`text-xs mt-0.5 truncate ${
                                    isDark ? "text-slate-500" : "text-slate-400"
                                }`}>
                                    {session.preview}
                                </p>
                                <p className={`text-xs mt-1 ${
                                    isDark ? "text-slate-600" : "text-slate-400"
                                }`}>
                                    {new Date(session.updatedAt).toLocaleDateString()}
                                </p>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(session._id);
                                    }}
                                    className={`absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                                        isDark
                                            ? "text-slate-600 hover:text-rose-400"
                                            : "text-slate-400 hover:text-rose-500"
                                    }`}
                                >
                                    <Trash2 size={12} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}

export default ChatHistory;
