function Badge({ children, variant = "default", className = "" }) {
    const styles = {
        default: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
        cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        muted: "bg-slate-700/50 text-slate-400 border-slate-600/50",
    };

    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border ${styles[variant]} ${className}`}
        >
            {children}
        </span>
    );
}

export default Badge;
