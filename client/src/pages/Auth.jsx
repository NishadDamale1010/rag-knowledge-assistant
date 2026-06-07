import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Brain, ArrowLeft, Eye, EyeOff, Mail, Lock, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import ThemeToggle from "../components/ui/ThemeToggle";

function Auth() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const endpoint = isLogin ? "/auth/login" : "/auth/register";
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : formData;

            const res = await api.post(endpoint, payload);
            localStorage.setItem("token", res.data.token);
            toast.success(isLogin ? "Welcome back!" : "Account created!");
            navigate("/dashboard");
        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message;
            toast.error(
                status === 401 ? message || "Invalid credentials" : message || "Authentication failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden noise-bg transition-colors duration-300 ${
            isDark ? "bg-slate-900" : "bg-slate-50"
        }`}>
            {/* Ambient background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[120px] ${
                    isDark ? "bg-indigo-600/8" : "bg-indigo-500/5"
                }`} />
                <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] ${
                    isDark ? "bg-violet-600/6" : "bg-violet-500/3"
                }`} />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} 1px, transparent 1px)`,
                        backgroundSize: "48px 48px",
                    }}
                />
            </div>

            {/* Theme toggle */}
            <div className="absolute top-5 right-5 z-20">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <Link
                    to="/"
                    className={`inline-flex items-center gap-2 text-sm mb-8 transition-colors group ${
                        isDark
                            ? "text-slate-400 hover:text-white"
                            : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to home
                </Link>

                <Card className={`p-8 lg:p-10 ${
                    isDark ? "glass" : "shadow-xl"
                }`}>
                    {/* Logo & title */}
                    <div className="text-center mb-8">
                        <div className="relative inline-block">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-5 glow-sm">
                                <Brain size={30} className="text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold gradient-text tracking-tight">Knowva</h1>
                        <p className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            {isLogin ? "Sign in to your workspace" : "Create your account"}
                        </p>
                    </div>

                    {/* Tab switcher */}
                    <div className={`flex p-1 rounded-xl mb-7 border ${
                        isDark
                            ? "bg-slate-900/80 border-slate-800/50"
                            : "bg-slate-100 border-slate-200"
                    }`}>
                        {["Login", "Register"].map((tab, i) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setIsLogin(i === 0)}
                                className={`relative flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                                    isLogin === (i === 0)
                                        ? isDark ? "text-white" : "text-slate-800"
                                        : isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {isLogin === (i === 0) && (
                                    <motion.div
                                        layoutId="auth-tab"
                                        className={`absolute inset-0 rounded-lg border ${
                                            isDark
                                                ? "bg-slate-800 border-slate-700/50"
                                                : "bg-white border-slate-200 shadow-sm"
                                        }`}
                                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                                    />
                                )}
                                <span className="relative z-10">{tab}</span>
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="name"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative">
                                        <UserIcon size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                                            isDark ? "text-slate-500" : "text-slate-400"
                                        }`} />
                                        <Input
                                            type="text"
                                            name="name"
                                            placeholder="Full name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <Mail size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                                isDark ? "text-slate-500" : "text-slate-400"
                            }`} />
                            <Input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                className="pl-10"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                                isDark ? "text-slate-500" : "text-slate-400"
                            }`} />
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder={isLogin ? "Password" : "Password (min 8 chars, letter + number)"}
                                value={formData.password}
                                onChange={handleChange}
                                className="pl-10 pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                                    isDark
                                        ? "text-slate-500 hover:text-slate-300"
                                        : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
                        </Button>
                    </form>

                    <p className={`text-center text-xs mt-6 ${
                        isDark ? "text-slate-600" : "text-slate-400"
                    }`}>
                        By continuing, you agree to Knowva's terms of service.
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}

export default Auth;
