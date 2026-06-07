import { useTheme } from "../../context/ThemeContext";

function Input({ className = "", ...props }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <input
            className={`w-full rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                isDark
                    ? "bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                    : "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-500/30 focus:border-indigo-400"
            } ${className}`}
            {...props}
        />
    );
}

export default Input;
