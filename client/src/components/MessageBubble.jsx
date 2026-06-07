import { motion } from "framer-motion";
import { Bot, User, Copy, Check, RotateCcw, BookOpen } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import MarkdownContent from "./MarkdownContent";
import Badge from "./ui/Badge";

function MessageBubble({ message, onRegenerate, onShowSources, isLast }) {
    const isUser = message.role === "user";
    const isError = message.isError;
    const [copied, setCopied] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
        >
            {/* Avatar */}
            <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                        ? "bg-gradient-to-br from-indigo-500 to-violet-600"
                        : isError
                          ? isDark
                              ? "bg-rose-500/20 border border-rose-500/30"
                              : "bg-rose-50 border border-rose-200"
                          : isDark
                              ? "bg-slate-800 border border-slate-700"
                              : "bg-slate-100 border border-slate-200"
                }`}
            >
                {isUser ? (
                    <User size={15} className="text-white" />
                ) : (
                    <Bot size={15} className={
                        isError
                            ? "text-rose-400"
                            : isDark ? "text-cyan-400" : "text-indigo-500"
                    } />
                )}
            </div>

            {/* Message Content */}
            <div className={`max-w-[80%] min-w-0 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
                {/* Sender name */}
                <span className={`text-xs font-medium mb-1 px-1 ${
                    isUser
                        ? isDark ? "text-slate-400" : "text-slate-500"
                        : isDark ? "text-cyan-400" : "text-indigo-500"
                }`}>
                    {isUser ? "You" : "Knowva"}
                    {message.timestamp && (
                        <span className={`ml-2 font-normal ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </span>

                <div
                    className={`px-4 py-3 rounded-2xl ${
                        isUser
                            ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-md"
                            : isError
                              ? isDark
                                  ? "bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-tl-md"
                                  : "bg-rose-50 border border-rose-200 text-rose-600 rounded-tl-md"
                              : isDark
                                  ? "bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-tl-md"
                                  : "bg-slate-50 border border-slate-200 text-slate-700 rounded-tl-md"
                    }`}
                >
                    {isUser ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                        </p>
                    ) : message.content ? (
                        <div className="text-sm prose-invert">
                            <MarkdownContent content={message.content} />
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 py-1">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                    )}

                    {message.sources?.length > 0 && (
                        <div className={`flex flex-wrap gap-1.5 mt-3 pt-3 border-t ${
                            isDark ? "border-slate-700/50" : "border-slate-200"
                        }`}>
                            {message.sources.map((src) => (
                                <Badge key={src.source} variant="cyan">
                                    [{src.source}] {src.documentName || "doc"}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                {!isUser && message.content && (
                    <div className="flex items-center gap-1 mt-1.5 px-1">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className={`p-1.5 rounded-lg transition-colors ${
                                isDark
                                    ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            }`}
                            title="Copy"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        {isLast && onRegenerate && (
                            <button
                                type="button"
                                onClick={onRegenerate}
                                className={`p-1.5 rounded-lg transition-colors ${
                                    isDark
                                        ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                }`}
                                title="Regenerate"
                            >
                                <RotateCcw size={14} />
                            </button>
                        )}
                        {message.sources?.length > 0 && (
                            <button
                                type="button"
                                onClick={() => onShowSources?.(message.sources)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                    isDark
                                        ? "text-slate-500 hover:text-cyan-400 hover:bg-slate-800"
                                        : "text-slate-400 hover:text-indigo-500 hover:bg-slate-100"
                                }`}
                                title="View sources"
                            >
                                <BookOpen size={14} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default MessageBubble;
