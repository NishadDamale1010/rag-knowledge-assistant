import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function CodeBlock({ children, className }) {
    const [copied, setCopied] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const lang = className?.replace("language-", "") || "";
    const code = String(children).replace(/\n$/, "");

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`relative group my-3 rounded-xl overflow-hidden border ${
            isDark ? "border-slate-700" : "border-slate-200"
        }`}>
            <div className={`flex items-center justify-between px-4 py-2 border-b ${
                isDark
                    ? "bg-slate-900 border-slate-700"
                    : "bg-slate-50 border-slate-200"
            }`}>
                <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    {lang || "code"}
                </span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className={`flex items-center gap-1 text-xs transition-colors ${
                        isDark
                            ? "text-slate-400 hover:text-white"
                            : "text-slate-400 hover:text-slate-700"
                    }`}
                >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <pre className={`p-4 overflow-x-auto text-sm ${
                isDark ? "bg-slate-950" : "bg-slate-100"
            }`}>
                <code className={`font-mono ${isDark ? "text-cyan-300" : "text-indigo-600"}`}>
                    {code}
                </code>
            </pre>
        </div>
    );
}

function MarkdownContent({ content }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({ children }) => (
                    <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                    <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                    <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
                ),
                li: ({ children }) => (
                    <li className={isDark ? "text-slate-200" : "text-slate-700"}>
                        {children}
                    </li>
                ),
                strong: ({ children }) => (
                    <strong className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {children}
                    </strong>
                ),
                pre: ({ children }) => <>{children}</>,
                code: ({ className, children }) => {
                    const isBlock = className?.startsWith("language-");
                    if (isBlock) {
                        return <CodeBlock className={className}>{children}</CodeBlock>;
                    }
                    return (
                        <code className={`px-1.5 py-0.5 rounded-md text-xs font-mono border ${
                            isDark
                                ? "bg-slate-900 text-cyan-300 border-slate-700"
                                : "bg-slate-100 text-indigo-600 border-slate-200"
                        }`}>
                            {children}
                        </code>
                    );
                },
                a: ({ href, children }) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className={`underline ${
                            isDark
                                ? "text-indigo-400 hover:text-indigo-300"
                                : "text-indigo-500 hover:text-indigo-600"
                        }`}
                    >
                        {children}
                    </a>
                ),
                blockquote: ({ children }) => (
                    <blockquote className={`border-l-2 pl-4 my-3 italic ${
                        isDark
                            ? "border-indigo-500 text-slate-400"
                            : "border-indigo-400 text-slate-500"
                    }`}>
                        {children}
                    </blockquote>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}

export default MarkdownContent;
