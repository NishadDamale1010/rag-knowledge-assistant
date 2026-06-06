function Skeleton({ className = "" }) {
    return (
        <div
            className={`animate-pulse bg-slate-700/50 rounded-xl ${className}`}
        />
    );
}

export default Skeleton;
