import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

function Card({ children, className = "", hover = false, ...props }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <motion.div
            whileHover={hover ? { y: -3, transition: { duration: 0.2 } } : undefined}
            className={`rounded-2xl transition-all duration-300 ${
                isDark
                    ? "bg-slate-800/50 backdrop-blur-sm border border-slate-700/40 hover:border-slate-600/50"
                    : "bg-white border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md"
            } ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export default Card;
