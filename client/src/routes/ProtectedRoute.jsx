import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
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
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-slate-500">Loading...</div>
            </div>
        );
    }

    if (status === "unauthorized") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
