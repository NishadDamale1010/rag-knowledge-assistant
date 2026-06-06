import { motion } from "framer-motion";

function Card({ children, className = "", hover = false, ...props }) {
    return (
        <motion.div
            whileHover={hover ? { y: -3, transition: { duration: 0.2 } } : undefined}
            className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/40 rounded-2xl hover:border-slate-600/50 transition-colors duration-300 ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export default Card;
