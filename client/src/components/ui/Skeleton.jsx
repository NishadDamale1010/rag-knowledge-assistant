import { useTheme } from "../../context/ThemeContext";

function Skeleton({ className = "" }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            className={`animate-pulse rounded-xl ${
                isDark ? "bg-slate-700/50" : "bg-slate-200/70"
            } ${className}`}
        />
    );
}

export default Skeleton;
