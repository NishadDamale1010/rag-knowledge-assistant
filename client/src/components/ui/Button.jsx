const variants = {
    primary:
        "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20",
    secondary:
        "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    ghost: "hover:bg-slate-800 text-slate-300",
    danger: "bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30",
};

const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-3 text-sm rounded-xl",
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
            className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
