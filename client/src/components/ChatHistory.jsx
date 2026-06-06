import { motion } from "framer-motion";
import { History, Plus, Trash2, MessageSquare } from "lucide-react";
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
    if (collapsed) return null;

    return (
        <aside className="w-60 bg-slate-900/50 border-r border-slate-800 flex flex-col shrink-0">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <History size={16} className="text-indigo-400" />
                    <h3 className="font-semibold text-sm text-slate-200">History</h3>
                </div>
                <button
                    type="button"
                    onClick={onNew}
                    className="p-1.5 text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-colors"
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
                        <MessageSquare className="w-7 h-7 text-slate-700 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">No chat history</p>
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
                                        ? "bg-indigo-500/15 border border-indigo-500/30"
                                        : "hover:bg-slate-800/60 border border-transparent"
                                }`}
                            >
                                <p className="text-sm font-medium text-slate-200 truncate pr-5">
                                    {session.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5 truncate">
                                    {session.preview}
                                </p>
                                <p className="text-xs text-slate-600 mt-1">
                                    {new Date(session.updatedAt).toLocaleDateString()}
                                </p>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(session._id);
                                    }}
                                    className="absolute top-2 right-2 p-1 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
