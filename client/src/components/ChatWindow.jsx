import { useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";
import MessageBubble from "./MessageBubble";

function ChatWindow({ messages, loading }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full min-h-[40vh] flex flex-col items-center justify-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
                            <MessageSquare className="w-7 h-7 text-indigo-600" />
                        </div>
                        <p className="text-slate-600 font-medium">
                            Start a conversation
                        </p>
                        <p className="text-sm text-slate-400 mt-1 max-w-xs">
                            Ask anything about the content in this document
                        </p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <MessageBubble key={index} message={message} />
                    ))
                )}

                {loading && messages[messages.length - 1]?.role !== "assistant" && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <span className="flex gap-1">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
                                </span>
                                Thinking...
                            </div>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>
        </div>
    );
}

export default ChatWindow;
