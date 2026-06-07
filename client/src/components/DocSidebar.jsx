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
    Settings,
    Star,
    Archive,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Badge from "./ui/Badge";
import Skeleton from "./ui/Skeleton";
import Input from "./ui/Input";
import ThemeToggle from "./ui/ThemeToggle";

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
    const location = useLocation();
    const { theme } = useTheme();
    const isDark = theme === "dark";

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

    const navItems = [
        {
            icon: MessageSquare,
            label: "New Chat",
            action: () => navigate("/chat"),
            active: location.pathname === "/chat" && !multiSelect,
            accent: true,
        },
    ];

    const categories = [
        { icon: FileText, label: "Documents", count: documents.length },
        { icon: Star, label: "Favorites", count: 0 },
        { icon: Archive, label: "Archive", count: 0 },
    ];

    return (
        <motion.aside
            animate={{ width: collapsed ? 72 : 280 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`flex flex-col shrink-0 h-full overflow-hidden border-r transition-colors duration-300 ${
                isDark
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
            }`}
        >
            {/* Logo + Collapse */}
            <div className={`p-4 border-b flex items-center justify-between ${
                isDark ? "border-slate-800" : "border-slate-100"
            }`}>
                {!collapsed && (
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                            <Brain size={16} className="text-white" />
                        </div>
                        <span className="font-bold gradient-text truncate text-lg">Knowva</span>
                    </div>
                )}
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className={`p-1.5 rounded-lg transition-colors ${
                        isDark
                            ? "text-slate-400 hover:text-white hover:bg-slate-800"
                            : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    }`}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {!collapsed && (
                <>
                    {/* New Chat Button */}
                    <div className="p-3">
                        <button
                            type="button"
                            onClick={() => navigate("/chat")}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.98]"
                        >
                            <MessageSquare size={16} />
                            New Chat
                        </button>
                    </div>

                    {/* Search */}
                    <div className="px-3 pb-2">
                        <div className="relative">
                            <Search
                                size={14}
                                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                                    isDark ? "text-slate-500" : "text-slate-400"
                                }`}
                            />
                            <Input
                                value={searchQuery}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                placeholder="Search documents..."
                                className="pl-9 py-2 text-xs"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="px-3 py-1">
                        {categories.map((cat) => (
                            <div
                                key={cat.label}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                                    isDark
                                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                <cat.icon size={16} />
                                <span className="flex-1">{cat.label}</span>
                                <span className={`text-xs font-medium ${
                                    isDark ? "text-slate-600" : "text-slate-400"
                                }`}>
                                    {cat.count}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Upload Button */}
                    <div className="px-3 py-2">
                        <button
                            type="button"
                            onClick={onUploadClick}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                                isDark
                                    ? "bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border-indigo-500/30"
                                    : "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200"
                            }`}
                        >
                            <Upload size={16} />
                            Upload PDF
                        </button>
                    </div>

                    {/* Document List Header */}
                    <div className={`px-4 py-2 flex items-center justify-between ${
                        isDark ? "text-slate-500" : "text-slate-400"
                    }`}>
                        <span className="text-xs font-medium uppercase tracking-wider">
                            Recent Chats
                        </span>
                        <Badge variant="muted">{documents.length}</Badge>
                    </div>

                    {multiSelect && documents.length > 0 && (
                        <button
                            type="button"
                            onClick={onSelectAll}
                            className={`mx-3 mb-2 text-xs font-medium ${
                                isDark
                                    ? "text-indigo-400 hover:text-indigo-300"
                                    : "text-indigo-500 hover:text-indigo-600"
                            }`}
                        >
                            {allSelected ? "Deselect all" : "Select all"}
                        </button>
                    )}
                </>
            )}

            {/* Document List */}
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
                            <FileText className={`w-8 h-8 mx-auto mb-2 ${
                                isDark ? "text-slate-600" : "text-slate-300"
                            }`} />
                            <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                No documents
                            </p>
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
                                    className={`group flex items-center gap-2 p-2.5 rounded-xl transition-all cursor-pointer ${
                                        multiSelect && isSelected
                                            ? isDark
                                                ? "bg-indigo-500/15 border border-indigo-500/30"
                                                : "bg-indigo-50 border border-indigo-200"
                                            : isActive
                                              ? isDark
                                                  ? "bg-slate-800 border border-slate-700"
                                                  : "bg-indigo-50 border border-indigo-200"
                                              : isDark
                                                  ? "hover:bg-slate-800/60 border border-transparent"
                                                  : "hover:bg-slate-50 border border-transparent"
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
                                                ? isDark ? "bg-indigo-500/20" : "bg-indigo-100"
                                                : isDark ? "bg-slate-800" : "bg-slate-100"
                                        }`}
                                    >
                                        <FileText
                                            size={14}
                                            className={
                                                isSelected
                                                    ? "text-indigo-400"
                                                    : isDark ? "text-slate-400" : "text-slate-500"
                                            }
                                        />
                                    </div>
                                    {!collapsed && (
                                        <>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium truncate ${
                                                    isDark ? "text-slate-200" : "text-slate-700"
                                                }`}>
                                                    {doc.name}
                                                </p>
                                                {doc.pageCount && (
                                                    <p className={`text-xs ${
                                                        isDark ? "text-slate-500" : "text-slate-400"
                                                    }`}>
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
                                                        className={`p-1.5 ${
                                                            isDark
                                                                ? "text-slate-400 hover:text-indigo-400"
                                                                : "text-slate-400 hover:text-indigo-500"
                                                        }`}
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
                                                        className={`p-1.5 ${
                                                            isDark
                                                                ? "text-slate-400 hover:text-rose-400"
                                                                : "text-slate-400 hover:text-rose-500"
                                                        }`}
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

            {/* Bottom section - Settings & Logout */}
            <div className={`p-3 border-t space-y-1 ${
                isDark ? "border-slate-800" : "border-slate-100"
            }`}>
                {!collapsed && (
                    <div className="flex items-center justify-between px-2 mb-1">
                        <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            Theme
                        </span>
                        <ThemeToggle size="sm" />
                    </div>
                )}
                {collapsed && (
                    <div className="flex justify-center mb-1">
                        <ThemeToggle size="sm" />
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className={`w-full flex items-center gap-2 p-2.5 rounded-xl transition-colors ${
                        collapsed ? "justify-center" : ""
                    } ${
                        isDark
                            ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                            : "hover:bg-slate-50 text-slate-500 hover:text-slate-700"
                    }`}
                >
                    <Settings size={16} />
                    {!collapsed && <span className="text-sm">Settings</span>}
                </button>
                <button
                    type="button"
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-2 p-2.5 rounded-xl transition-colors ${
                        collapsed ? "justify-center" : ""
                    } ${
                        isDark
                            ? "hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                            : "hover:bg-rose-50 text-slate-500 hover:text-rose-500"
                    }`}
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
