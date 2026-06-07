import { useTheme } from "../../context/ThemeContext";

function Badge({ children, variant = "default", className = "" }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const styles = {
        default: isDark
            ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
            : "bg-indigo-50 text-indigo-600 border-indigo-200",
        cyan: isDark
            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
            : "bg-cyan-50 text-cyan-600 border-cyan-200",
        muted: isDark
            ? "bg-slate-700/50 text-slate-400 border-slate-600/50"
            : "bg-slate-100 text-slate-500 border-slate-200",
        green: isDark
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
            : "bg-emerald-50 text-emerald-600 border-emerald-200",
    };

    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border ${styles[variant] || styles.default} ${className}`}
        >
            {children}
        </span>
    );
}

export default Badge;
