import { motion } from "framer-motion";

function Card({ children, className = "", hover = false, ...props }) {
    return (
        <motion.div
            whileHover={hover ? { y: -2 } : undefined}
            className={`bg-slate-800/60 border border-slate-700/50 rounded-2xl ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export default Card;
