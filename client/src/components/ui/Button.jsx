const variants = {
    primary:
        "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98]",
    secondary:
        "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 hover:border-slate-600 active:scale-[0.98]",
    ghost: "hover:bg-slate-800/60 text-slate-300 active:scale-[0.98]",
    danger: "bg-rose-600/15 hover:bg-rose-600/25 text-rose-400 border border-rose-500/25 active:scale-[0.98]",
};

const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-6 py-3 text-sm rounded-xl gap-2",
};

function Button({
    children,
    variant = "primary",
    size = "md",
    className = "",
    disabled,
    ...props
}) {
    return (
        <button
            className={`inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:shadow-none ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
