import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Auth() {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const endpoint = isLogin
                ? "/auth/login"
                : "/auth/register";

            const payload = isLogin
                ? {
                    email: formData.email,
                    password: formData.password,
                }
                : formData;

            const res = await api.post(
                endpoint,
                payload
            );

            localStorage.setItem(
                "token",
                res.data.token
            );

            navigate("/dashboard");
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Authentication failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center mb-2 text-blue-800">
                    Knowva
                </h1>
                <h3 className="text-xl  text-center mb-2">
                    RAG Knowledge Assistant
                </h3>

                <p className="text-gray-500 text-center mb-6">
                    Chat with your PDFs using Knowva
                </p>

                <div className="flex mb-6">
                    <button
                        className={`flex-1 py-2 rounded-lg ${isLogin
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200"
                            }`}
                        onClick={() =>
                            setIsLogin(true)
                        }
                    >
                        Login
                    </button>

                    <button
                        className={`flex-1 py-2 rounded-lg ml-2 ${!isLogin
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200"
                            }`}
                        onClick={() =>
                            setIsLogin(false)
                        }
                    >
                        Register
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {!isLogin && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        {loading
                            ? "Please wait..."
                            : isLogin
                                ? "Login"
                                : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Auth;