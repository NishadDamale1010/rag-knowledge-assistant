import { motion } from "framer-motion";
import { Bot, User, Copy, Check, RotateCcw, BookOpen } from "lucide-react";
import { useState } from "react";
import MarkdownContent from "./MarkdownContent";
import Badge from "./ui/Badge";

function MessageBubble({ message, onRegenerate, onShowSources, isLast }) {
    const isUser = message.role === "user";
    const isError = message.isError;
    const [copied, setCopied] = useState(false);

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
            <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                        ? "bg-gradient-to-br from-indigo-500 to-violet-600"
                        : isError
                          ? "bg-rose-500/20 border border-rose-500/30"
                          : "bg-slate-800 border border-slate-700"
                }`}
            >
                {isUser ? (
                    <User size={14} className="text-white" />
                ) : (
                    <Bot size={14} className={isError ? "text-rose-400" : "text-cyan-400"} />
                )}
            </div>

            <div className={`max-w-[80%] min-w-0 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
                <div
                    className={`px-4 py-3 rounded-2xl ${
                        isUser
                            ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-md"
                            : isError
                              ? "bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-tl-md"
                              : "bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-tl-md"
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
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-700/50">
                            {message.sources.map((src) => (
                                <Badge key={src.source} variant="cyan">
                                    [{src.source}] {src.documentName || "doc"}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {!isUser && message.content && (
                    <div className="flex items-center gap-1 mt-1.5 px-1">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Copy"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        {isLast && onRegenerate && (
                            <button
                                type="button"
                                onClick={onRegenerate}
                                className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                                title="Regenerate"
                            >
                                <RotateCcw size={14} />
                            </button>
                        )}
                        {message.sources?.length > 0 && (
                            <button
                                type="button"
                                onClick={() => onShowSources?.(message.sources)}
                                className="p-1.5 text-slate-500 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
                                title="View sources"
                            >
                                <BookOpen size={14} />
                            </button>
                        )}
                        {message.timestamp && (
                            <span className="text-xs text-slate-600 ml-1">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                )}

                {isUser && message.timestamp && (
                    <span className="text-xs text-slate-600 mt-1 px-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                )}
            </div>
        </motion.div>
    );
}

export default MessageBubble;
