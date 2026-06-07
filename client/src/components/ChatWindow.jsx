import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import MessageBubble from "./MessageBubble";

function ChatWindow({
    messages,
    loading,
    onRegenerate,
    onShowSources,
    selectedDocs = [],
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div className={`flex-1 overflow-y-auto transition-colors duration-300 ${
            isDark ? "bg-slate-900" : "bg-white"
        }`}>
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 min-h-full">
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center min-h-[50vh] text-center"
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${
                            isDark
                                ? "bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30"
                                : "bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200"
                        }`}>
                            <Sparkles className={`w-8 h-8 ${
                                isDark ? "text-indigo-400" : "text-indigo-500"
                            }`} />
                        </div>
                        <h2 className={`text-xl font-semibold mb-2 ${
                            isDark ? "text-white" : "text-slate-800"
                        }`}>
                            How can I help you today?
                        </h2>
                        <p className={`text-sm max-w-md mb-6 ${
                            isDark ? "text-slate-400" : "text-slate-500"
                        }`}>
                            Ask anything about your uploaded documents. Answers are
                            grounded in your PDFs with source citations.
                        </p>
                        {selectedDocs.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center">
                                {selectedDocs.map((doc) => (
                                    <span
                                        key={doc._id}
                                        className={`text-xs px-3 py-1.5 rounded-lg border ${
                                            isDark
                                                ? "bg-slate-800 text-slate-400 border-slate-700"
                                                : "bg-slate-50 text-slate-500 border-slate-200"
                                        }`}
                                    >
                                        {doc.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    messages.map((message, index) => (
                        <MessageBubble
                            key={index}
                            message={message}
                            isLast={
                                index === messages.length - 1 &&
                                message.role === "assistant"
                            }
                            onRegenerate={onRegenerate}
                            onShowSources={onShowSources}
                        />
                    ))
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}

export default ChatWindow;
