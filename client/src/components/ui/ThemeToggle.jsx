import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function ThemeToggle({ className = "", size = "md" }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const sizes = {
        sm: "w-8 h-8",
        md: "w-9 h-9",
        lg: "w-10 h-10",
    };

    const iconSizes = {
        sm: 14,
        md: 16,
        lg: 18,
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`${sizes[size]} inline-flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700/50"
                    : "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200/50"
            } ${className}`}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? (
                <Sun size={iconSizes[size]} className="transition-transform duration-300 rotate-0 hover:rotate-45" />
            ) : (
                <Moon size={iconSizes[size]} className="transition-transform duration-300" />
            )}
        </button>
    );
}

export default ThemeToggle;
