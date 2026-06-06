import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Brain, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

function Auth() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

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
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to home
                </Link>

                <Card className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 glow">
                            <Brain size={28} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold gradient-text">Knowva</h1>
                        <p className="text-slate-400 text-sm mt-2">
                            {isLogin ? "Sign in to your workspace" : "Create your account"}
                        </p>
                    </div>

                    <div className="flex p-1 bg-slate-900 rounded-xl mb-6">
                        {["Login", "Register"].map((tab, i) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setIsLogin(i === 0)}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                    isLogin === (i === 0)
                                        ? "bg-slate-800 text-white shadow"
                                        : "text-slate-500 hover:text-slate-300"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <Input
                                type="text"
                                name="name"
                                placeholder="Full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        )}
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
                        </Button>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}

export default Auth;
