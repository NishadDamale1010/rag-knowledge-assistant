import { motion } from "framer-motion";
import {
    Brain,
    ChevronLeft,
    ChevronRight,
    FileText,
    MessageSquare,
    Search,
    Trash2,
    Upload,
    LogOut,
    User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Badge from "./ui/Badge";
import Skeleton from "./ui/Skeleton";
import Input from "./ui/Input";

function DocSidebar({
    documents,
    loading,
    onDelete,
    multiSelect = false,
    selectedIds = [],
    onToggleSelect,
    onSelectAll,
    collapsed = false,
    onToggleCollapse,
    searchQuery = "",
    onSearchChange,
    onUploadClick,
    activeDocId,
}) {
    const navigate = useNavigate();

    const filtered = documents.filter((doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const allSelected =
        documents.length > 0 &&
        documents.every((doc) => selectedIds.includes(doc._id));

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <motion.aside
            animate={{ width: collapsed ? 72 : 288 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-full overflow-hidden"
        >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                {!collapsed && (
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                            <Brain size={16} className="text-white" />
                        </div>
                        <span className="font-bold gradient-text truncate">Knowva</span>
                    </div>
                )}
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {!collapsed && (
                <>
                    <div className="p-3 space-y-2">
                        <div className="relative">
                            <Search
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                            />
                            <Input
                                value={searchQuery}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                placeholder="Search documents..."
                                className="pl-9 py-2"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={onUploadClick}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-sm font-medium border border-indigo-500/30 transition-all"
                        >
                            <Upload size={16} />
                            Upload PDF
                        </button>
                    </div>

                    <div className="px-4 py-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Documents
                        </span>
                        <Badge variant="muted">{documents.length}</Badge>
                    </div>

                    {multiSelect && documents.length > 0 && (
                        <button
                            type="button"
                            onClick={onSelectAll}
                            className="mx-3 mb-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                            {allSelected ? "Deselect all" : "Select all"}
                        </button>
                    )}
                </>
            )}

            <div className="flex-1 overflow-y-auto px-2 pb-2">
                {loading ? (
                    <div className="space-y-2 p-2">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-14" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    !collapsed && (
                        <div className="text-center py-10 px-4">
                            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">No documents</p>
                        </div>
                    )
                ) : (
                    <div className="space-y-1">
                        {filtered.map((doc) => {
                            const isSelected = selectedIds.includes(doc._id);
                            const isActive = activeDocId === doc._id;

                            return (
                                <div
                                    key={doc._id}
                                    className={`group flex items-center gap-2 p-2 rounded-xl transition-all cursor-pointer ${
                                        multiSelect && isSelected
                                            ? "bg-indigo-500/15 border border-indigo-500/30"
                                            : isActive
                                              ? "bg-slate-800 border border-slate-700"
                                              : "hover:bg-slate-800/60 border border-transparent"
                                    }`}
                                    onClick={() => {
                                        if (multiSelect) onToggleSelect(doc._id);
                                        else navigate(`/chat/${doc._id}`);
                                    }}
                                >
                                    {multiSelect && !collapsed && (
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => onToggleSelect(doc._id)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-4 h-4 accent-indigo-500 shrink-0"
                                        />
                                    )}
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                            isSelected
                                                ? "bg-indigo-500/20"
                                                : "bg-slate-800"
                                        }`}
                                    >
                                        <FileText
                                            size={14}
                                            className={
                                                isSelected
                                                    ? "text-indigo-400"
                                                    : "text-slate-400"
                                            }
                                        />
                                    </div>
                                    {!collapsed && (
                                        <>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-200 truncate">
                                                    {doc.name}
                                                </p>
                                                {doc.pageCount && (
                                                    <p className="text-xs text-slate-500">
                                                        {doc.pageCount} pages
                                                    </p>
                                                )}
                                            </div>
                                            {!multiSelect && (
                                                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/chat/${doc._id}`);
                                                        }}
                                                        className="p-1.5 text-slate-400 hover:text-indigo-400"
                                                    >
                                                        <MessageSquare size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (
                                                                window.confirm(
                                                                    `Delete "${doc.name}"?`
                                                                )
                                                            )
                                                                onDelete(doc._id);
                                                        }}
                                                        className="p-1.5 text-slate-400 hover:text-rose-400"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-slate-800">
                <button
                    type="button"
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors ${collapsed ? "justify-center" : ""}`}
                >
                    {collapsed ? <LogOut size={18} /> : (
                        <>
                            <User size={16} />
                            <span className="text-sm">Sign out</span>
                            <LogOut size={14} className="ml-auto" />
                        </>
                    )}
                </button>
            </div>
        </motion.aside>
    );
}

export default DocSidebar;
