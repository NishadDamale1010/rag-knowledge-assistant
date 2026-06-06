import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

function CodeBlock({ children, className }) {
    const [copied, setCopied] = useState(false);
    const lang = className?.replace("language-", "") || "";
    const code = String(children).replace(/\n$/, "");

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-3 rounded-xl overflow-hidden border border-slate-700">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
                <span className="text-xs text-slate-500">{lang || "code"}</span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm bg-slate-950">
                <code className="text-cyan-300 font-mono">{code}</code>
            </pre>
        </div>
    );
}

function MarkdownContent({ content }) {
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
                li: ({ children }) => <li className="text-slate-200">{children}</li>,
                strong: ({ children }) => (
                    <strong className="font-semibold text-white">{children}</strong>
                ),
                pre: ({ children }) => <>{children}</>,
                code: ({ className, children }) => {
                    const isBlock = className?.startsWith("language-");
                    if (isBlock) {
                        return <CodeBlock className={className}>{children}</CodeBlock>;
                    }
                    return (
                        <code className="px-1.5 py-0.5 rounded-md bg-slate-900 text-cyan-300 text-xs font-mono border border-slate-700">
                            {children}
                        </code>
                    );
                },
                a: ({ href, children }) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 underline"
                    >
                        {children}
                    </a>
                ),
                blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-indigo-500 pl-4 my-3 text-slate-400 italic">
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
