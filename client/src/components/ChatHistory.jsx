import { History, Plus, Trash2, MessageSquare } from "lucide-react";

function ChatHistory({
    sessions,
    loading,
    activeId,
    onSelect,
    onNew,
    onDelete,
}) {
    return (
        <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <History size={18} className="text-indigo-600" />
                    <h3 className="font-semibold text-sm text-slate-800">
                        Chat History
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={onNew}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg"
                    title="New chat"
                >
                    <Plus size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
                {loading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-16 bg-slate-200 rounded-xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-10 px-2">
                        <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No chats yet</p>
                        <p className="text-xs text-slate-400 mt-1">
                            Your conversations are saved here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {sessions.map((session) => (
                            <div
                                key={session._id}
                                className={`group relative rounded-xl border p-3 cursor-pointer transition-colors ${
                                    activeId === session._id
                                        ? "bg-indigo-50 border-indigo-200"
                                        : "bg-white border-slate-200 hover:border-indigo-200"
                                }`}
                                onClick={() => onSelect(session._id)}
                            >
                                <p className="text-sm font-medium text-slate-800 truncate pr-6">
                                    {session.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-1 truncate">
                                    {session.preview}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {new Date(
                                        session.updatedAt
                                    ).toLocaleDateString()}
                                </p>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(session._id);
                                    }}
                                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}

export default ChatHistory;
