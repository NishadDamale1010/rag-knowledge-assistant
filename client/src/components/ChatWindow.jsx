import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import MessageBubble from "./MessageBubble";

function ChatWindow({
    messages,
    loading,
    onRegenerate,
    onShowSources,
    selectedDocs = [],
}) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 min-h-full">
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center min-h-[50vh] text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center mb-5">
                            <Sparkles className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">
                            How can I help you today?
                        </h2>
                        <p className="text-slate-400 text-sm max-w-md mb-6">
                            Ask anything about your uploaded documents. Answers are
                            grounded in your PDFs with source citations.
                        </p>
                        {selectedDocs.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center">
                                {selectedDocs.map((doc) => (
                                    <span
                                        key={doc._id}
                                        className="text-xs bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-700"
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
