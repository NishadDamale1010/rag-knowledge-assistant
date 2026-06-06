import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "../api/axios";

function ProtectedRoute({ children }) {
    const [status, setStatus] = useState("checking");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setStatus("unauthorized");
            return;
        }
        api.get("/auth/me")
            .then(() => setStatus("authorized"))
            .catch(() => {
                localStorage.removeItem("token");
                setStatus("unauthorized");
            });
    }, []);

    if (status === "checking") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 gap-3">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                <p className="text-sm text-slate-500">Loading workspace...</p>
            </div>
        );
    }

    if (status === "unauthorized") {
        return <Navigate to="/auth" replace />;
    }

    return children;
}

export default ProtectedRoute;
