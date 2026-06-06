import { Bot, User } from "lucide-react";

function MessageBubble({ message }) {
    const isUser = message.role === "user";
    const isError = message.isError;

    return (
        <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isUser
                        ? "bg-indigo-600 text-white"
                        : isError
                          ? "bg-red-100 text-red-600"
                          : "bg-slate-200 text-slate-600"
                }`}
            >
                {isUser ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    isUser
                        ? "bg-indigo-600 text-white rounded-tr-sm"
                        : isError
                          ? "bg-red-50 border border-red-200 text-red-700 rounded-tl-sm"
                          : "bg-white border border-slate-200 shadow-sm text-slate-800 rounded-tl-sm"
                }`}
            >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content || (
                        <span className="text-slate-400 italic">...</span>
                    )}
                </p>

                {message.timestamp && (
                    <div
                        className={`mt-2 text-xs ${
                            isUser ? "text-indigo-200" : "text-slate-400"
                        }`}
                    >
                        {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessageBubble;
