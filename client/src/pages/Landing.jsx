import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Sparkles,
    FileText,
    MessageSquare,
    Search,
    Zap,
    Shield,
    ArrowRight,
    Brain,
    Layers,
    ChevronRight,
    Check,
    Star,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import ThemeToggle from "../components/ui/ThemeToggle";

const features = [
    {
        icon: FileText,
        title: "Upload PDFs",
        desc: "Drop documents and build a searchable knowledge base in seconds.",
        gradient: "from-blue-500/20 to-indigo-500/20",
        border: "border-blue-500/20",
        iconColor: "text-blue-400",
        lightGradient: "from-blue-50 to-indigo-50",
        lightBorder: "border-blue-200",
        lightIconColor: "text-blue-500",
    },
    {
        icon: Search,
        title: "Semantic Search",
        desc: "Vector embeddings find the most relevant context from your files.",
        gradient: "from-violet-500/20 to-purple-500/20",
        border: "border-violet-500/20",
        iconColor: "text-violet-400",
        lightGradient: "from-violet-50 to-purple-50",
        lightBorder: "border-violet-200",
        lightIconColor: "text-violet-500",
    },
    {
        icon: MessageSquare,
        title: "AI Chat",
        desc: "Ask natural language questions and get grounded, cited answers.",
        gradient: "from-cyan-500/20 to-teal-500/20",
        border: "border-cyan-500/20",
        iconColor: "text-cyan-400",
        lightGradient: "from-cyan-50 to-teal-50",
        lightBorder: "border-cyan-200",
        lightIconColor: "text-cyan-500",
    },
    {
        icon: Layers,
        title: "Multi-Document",
        desc: "Query across multiple PDFs simultaneously with unified context.",
        gradient: "from-amber-500/20 to-orange-500/20",
        border: "border-amber-500/20",
        iconColor: "text-amber-400",
        lightGradient: "from-amber-50 to-orange-50",
        lightBorder: "border-amber-200",
        lightIconColor: "text-amber-500",
    },
    {
        icon: Zap,
        title: "Streaming",
        desc: "Real-time token streaming for a ChatGPT-level experience.",
        gradient: "from-emerald-500/20 to-green-500/20",
        border: "border-emerald-500/20",
        iconColor: "text-emerald-400",
        lightGradient: "from-emerald-50 to-green-50",
        lightBorder: "border-emerald-200",
        lightIconColor: "text-emerald-500",
    },
    {
        icon: Shield,
        title: "Secure",
        desc: "JWT auth with user-scoped document isolation and rate limiting.",
        gradient: "from-rose-500/20 to-pink-500/20",
        border: "border-rose-500/20",
        iconColor: "text-rose-400",
        lightGradient: "from-rose-50 to-pink-50",
        lightBorder: "border-rose-200",
        lightIconColor: "text-rose-500",
    },
];

const trustBadges = [
    "30 days trial",
    "Quick setup",
    "No credit card required",
];

function Landing() {
    const token = localStorage.getItem("token");
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className={`min-h-screen overflow-hidden noise-bg transition-colors duration-300 ${
            isDark ? "bg-slate-900" : "bg-white"
        }`}>
            {/* Ambient background effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[150px] ${
                    isDark ? "bg-indigo-600/8" : "bg-indigo-500/5"
                }`} />
                <div className={`absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] ${
                    isDark ? "bg-violet-600/8" : "bg-violet-500/5"
                }`} />
                <div className={`absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full blur-[100px] ${
                    isDark ? "bg-cyan-500/5" : "bg-cyan-500/3"
                }`} />
                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} 1px, transparent 1px)`,
                        backgroundSize: "64px 64px",
                    }}
                />
            </div>

            {/* Navbar */}
            <nav className={`relative z-10 flex items-center justify-between px-6 lg:px-12 py-5 border-b transition-colors duration-300 ${
                isDark ? "border-slate-800/60" : "border-slate-100"
            }`}>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center glow-sm">
                            <Brain size={20} className="text-white" />
                        </div>
                        <div className="absolute inset-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 pulse-ring" />
                    </div>
                    <span className="text-xl font-bold gradient-text tracking-tight">Knowva</span>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    {["Solutions", "Integrations", "Resources", "Pricing"].map((item) => (
                        <a
                            key={item}
                            href="#features"
                            className={`text-sm font-medium transition-colors ${
                                isDark
                                    ? "text-slate-400 hover:text-white"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Link to={token ? "/dashboard" : "/auth"}>
                        <Button variant="ghost" size="sm">
                            {token ? "Dashboard" : "Login"}
                        </Button>
                    </Link>
                    <Link to={token ? "/dashboard" : "/auth"}>
                        <Button size="sm">
                            {token ? "Go to App" : "Try for Free"}
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 px-6 lg:px-12 pt-20 pb-16 max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Text content */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] ${
                            isDark ? "text-white" : "text-slate-900"
                        }`}>
                            Automate{" "}
                            <br className="hidden sm:block" />
                            document queries{" "}
                            <br className="hidden sm:block" />
                            with{" "}
                            <span className="gradient-text">AI-Powered</span>
                            {" "}Chat
                        </h1>

                        <p className={`text-lg max-w-lg mb-8 leading-relaxed ${
                            isDark ? "text-slate-400" : "text-slate-600"
                        }`}>
                            Supercharge your knowledge base with Generative AI-powered
                            chatbot. Reduce search time, elevate document experience and grow
                            your productivity.
                        </p>

                        <div className="flex flex-wrap gap-3 mb-8">
                            <Link to={token ? "/dashboard" : "/auth"}>
                                <Button size="lg" className="text-base px-8 py-4">
                                    Book a Demo
                                </Button>
                            </Link>
                            <Link to={token ? "/dashboard" : "/auth"}>
                                <Button variant="secondary" size="lg" className="text-base px-8 py-4">
                                    Try for Free
                                </Button>
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center gap-4">
                            {trustBadges.map((badge) => (
                                <span
                                    key={badge}
                                    className={`flex items-center gap-1.5 text-sm ${
                                        isDark ? "text-slate-400" : "text-slate-500"
                                    }`}
                                >
                                    <Check size={14} className="text-emerald-400" />
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Visual element */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative hidden lg:flex items-center justify-center"
                    >
                        <div className={`relative w-80 h-80 rounded-full ${
                            isDark ? "bg-slate-800/30" : "bg-slate-50"
                        } flex items-center justify-center`}>
                            {/* Central icon */}
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 z-10">
                                <Brain size={36} className="text-white" />
                            </div>
                            {/* Orbiting icons */}
                            {[
                                { icon: FileText, angle: 0, color: "text-blue-400", bg: isDark ? "bg-slate-800" : "bg-white" },
                                { icon: Search, angle: 60, color: "text-violet-400", bg: isDark ? "bg-slate-800" : "bg-white" },
                                { icon: MessageSquare, angle: 120, color: "text-cyan-400", bg: isDark ? "bg-slate-800" : "bg-white" },
                                { icon: Zap, angle: 180, color: "text-amber-400", bg: isDark ? "bg-slate-800" : "bg-white" },
                                { icon: Shield, angle: 240, color: "text-emerald-400", bg: isDark ? "bg-slate-800" : "bg-white" },
                                { icon: Layers, angle: 300, color: "text-rose-400", bg: isDark ? "bg-slate-800" : "bg-white" },
                            ].map((item, i) => {
                                const radius = 130;
                                const x = Math.cos((item.angle * Math.PI) / 180) * radius;
                                const y = Math.sin((item.angle * Math.PI) / 180) * radius;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                        className={`absolute w-12 h-12 rounded-xl ${item.bg} border ${
                                            isDark ? "border-slate-700" : "border-slate-200"
                                        } flex items-center justify-center shadow-lg float`}
                                        style={{
                                            transform: `translate(${x}px, ${y}px)`,
                                            animationDelay: `${i * 0.5}s`,
                                        }}
                                    >
                                        <item.icon size={20} className={item.color} />
                                    </motion.div>
                                );
                            })}
                            {/* Ring */}
                            <div className={`absolute inset-4 rounded-full border-2 border-dashed ${
                                isDark ? "border-slate-700/50" : "border-slate-200"
                            }`} />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Trusted by section */}
            <section className={`relative z-10 py-12 border-y transition-colors duration-300 ${
                isDark ? "border-slate-800/60 bg-slate-900/50" : "border-slate-100 bg-slate-50/50"
            }`}>
                <div className="max-w-6xl mx-auto px-6 lg:px-12">
                    <p className={`text-center text-sm font-medium mb-8 ${
                        isDark ? "text-slate-500" : "text-slate-400"
                    }`}>
                        Trusted globally by leading enterprises and growing startups
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
                        {["TechCorp", "DataFlow", "CloudBase", "InnoVate", "ScaleAI"].map((brand, i) => (
                            <motion.span
                                key={brand}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`text-lg font-bold tracking-wider ${
                                    isDark ? "text-slate-600" : "text-slate-300"
                                }`}
                            >
                                {brand}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Terminal demo */}
            <section className="relative z-10 px-6 lg:px-12 py-20 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 48 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="gradient-border rounded-2xl glow">
                        <div className={`rounded-2xl p-1 ${isDark ? "bg-slate-900" : "bg-white"}`}>
                            <div className={`rounded-xl p-6 lg:p-8 text-left ${
                                isDark ? "bg-slate-800/80" : "bg-slate-50"
                            }`}>
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                                    <span className={`ml-auto text-xs font-mono ${
                                        isDark ? "text-slate-600" : "text-slate-400"
                                    }`}>knowva terminal</span>
                                </div>
                                <div className="space-y-4 font-mono text-sm lg:text-base">
                                    <div className="flex items-start gap-3">
                                        <span className="text-indigo-400 font-semibold shrink-0">you</span>
                                        <span className={isDark ? "text-slate-300" : "text-slate-600"}>
                                            What is retrieval-augmented generation?
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-cyan-400 font-semibold shrink-0">knowva</span>
                                        <span className={isDark ? "text-slate-300" : "text-slate-600"}>
                                            RAG retrieves relevant context from your documents at query time
                                            without model retraining, making answers always up-to-date and
                                            cheaper than fine-tuning.{" "}
                                            <span className={`px-1.5 py-0.5 rounded ${
                                                isDark ? "text-indigo-400 bg-indigo-500/10" : "text-indigo-500 bg-indigo-50"
                                            }`}>[1]</span>{" "}
                                            <span className={`px-1.5 py-0.5 rounded ${
                                                isDark ? "text-indigo-400 bg-indigo-500/10" : "text-indigo-500 bg-indigo-50"
                                            }`}>[2]</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features */}
            <section id="features" className="relative z-10 px-6 lg:px-12 py-20 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <Badge className="mb-5">
                        <Zap size={12} />
                        Features
                    </Badge>
                    <h2 className={`text-3xl lg:text-5xl font-bold mb-4 tracking-tight ${
                        isDark ? "text-white" : "text-slate-900"
                    }`}>
                        Everything you need for{" "}
                        <span className="gradient-text">document AI</span>
                    </h2>
                    <p className={`max-w-xl mx-auto text-lg ${
                        isDark ? "text-slate-400" : "text-slate-500"
                    }`}>
                        A complete RAG pipeline from upload to streaming answers.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <Card hover className="p-6 h-full group">
                                <div
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 ${
                                        isDark
                                            ? `${f.gradient} ${f.border}`
                                            : `${f.lightGradient} ${f.lightBorder}`
                                    }`}
                                >
                                    <f.icon size={22} className={isDark ? f.iconColor : f.lightIconColor} />
                                </div>
                                <h3 className={`font-semibold mb-2 text-lg ${
                                    isDark ? "text-white" : "text-slate-800"
                                }`}>{f.title}</h3>
                                <p className={`text-sm leading-relaxed ${
                                    isDark ? "text-slate-400" : "text-slate-500"
                                }`}>{f.desc}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 px-6 lg:px-12 py-28 max-w-3xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Card className="p-12 lg:p-16 glow relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] ${
                            isDark ? "bg-indigo-500/10" : "bg-indigo-500/5"
                        }`} />
                        <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[80px] ${
                            isDark ? "bg-violet-500/10" : "bg-violet-500/5"
                        }`} />
                        <div className="relative">
                            <h2 className={`text-3xl lg:text-4xl font-bold mb-4 tracking-tight ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}>
                                Ready to try{" "}
                                <span className="gradient-text">Knowva</span>?
                            </h2>
                            <p className={`mb-8 text-lg ${
                                isDark ? "text-slate-400" : "text-slate-500"
                            }`}>
                                Upload your first PDF and start asking questions in under a minute.
                            </p>
                            <Link to={token ? "/dashboard" : "/auth"}>
                                <Button size="lg" className="text-base px-8 py-4">
                                    Launch App
                                    <ArrowRight size={18} />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className={`relative z-10 border-t px-6 py-10 transition-colors duration-300 ${
                isDark ? "border-slate-800/60" : "border-slate-100"
            }`}>
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                            <Brain size={14} className="text-white" />
                        </div>
                        <span className="font-semibold gradient-text text-sm">Knowva</span>
                    </div>
                    <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        Built by Nishad Damale · RAG Knowledge Assistant
                    </p>
                    <a
                        href="https://github.com/NishadDamale1010/rag-knowledge-assistant"
                        target="_blank"
                        rel="noreferrer"
                        className={`transition-colors ${
                            isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    </a>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
