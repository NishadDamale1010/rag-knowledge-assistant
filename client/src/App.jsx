import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./context/ThemeContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        borderRadius: "12px",
                        background: isDark ? "#1e293b" : "#ffffff",
                        color: isDark ? "#f1f5f9" : "#0f172a",
                        border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                        boxShadow: isDark
                            ? "0 8px 32px rgba(0,0,0,0.4)"
                            : "0 8px 32px rgba(0,0,0,0.1)",
                    },
                    success: {
                        iconTheme: {
                            primary: "#10b981",
                            secondary: isDark ? "#1e293b" : "#ffffff",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#f43f5e",
                            secondary: isDark ? "#1e293b" : "#ffffff",
                        },
                    },
                }}
            />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/chat/:id"
                    element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
