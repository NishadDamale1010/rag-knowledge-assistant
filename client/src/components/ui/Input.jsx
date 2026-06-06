function Input({ className = "", ...props }) {
    return (
        <input
            className={`w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all ${className}`}
            {...props}
        />
    );
}

export default Input;
