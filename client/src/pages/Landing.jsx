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
    Github,
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

const features = [
    {
        icon: FileText,
        title: "Upload PDFs",
        desc: "Drop documents and build a searchable knowledge base in seconds.",
        gradient: "from-blue-500/20 to-indigo-500/20",
        border: "border-blue-500/20",
        iconColor: "text-blue-400",
    },
    {
        icon: Search,
        title: "Semantic Search",
        desc: "Vector embeddings find the most relevant context from your files.",
        gradient: "from-violet-500/20 to-purple-500/20",
        border: "border-violet-500/20",
        iconColor: "text-violet-400",
    },
    {
        icon: MessageSquare,
        title: "AI Chat",
        desc: "Ask natural language questions and get grounded, cited answers.",
        gradient: "from-cyan-500/20 to-teal-500/20",
        border: "border-cyan-500/20",
        iconColor: "text-cyan-400",
    },
    {
        icon: Layers,
        title: "Multi-Document",
        desc: "Query across multiple PDFs simultaneously with unified context.",
        gradient: "from-amber-500/20 to-orange-500/20",
        border: "border-amber-500/20",
        iconColor: "text-amber-400",
    },
    {
        icon: Zap,
        title: "Streaming",
        desc: "Real-time token streaming for a ChatGPT-level experience.",
        gradient: "from-emerald-500/20 to-green-500/20",
        border: "border-emerald-500/20",
        iconColor: "text-emerald-400",
    },
    {
        icon: Shield,
        title: "Secure",
        desc: "JWT auth with user-scoped document isolation and rate limiting.",
        gradient: "from-rose-500/20 to-pink-500/20",
        border: "border-rose-500/20",
        iconColor: "text-rose-400",
    },
];

const stats = [
    { value: "RAG", label: "Architecture", icon: "🧠" },
    { value: "SSE", label: "Streaming", icon: "⚡" },
    { value: "Atlas", label: "Vector DB", icon: "🗄️" },
    { value: "AI", label: "Powered", icon: "✨" },
];

function Landing() {
    const token = localStorage.getItem("token");

    return (
        <div className="min-h-screen bg-slate-900 overflow-hidden noise-bg">
            {/* Ambient background effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-indigo-600/8 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-violet-600/8 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]" />
                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "64px 64px",
                    }}
                />
            </div>

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center glow-sm">
                            <Brain size={20} className="text-white" />
                        </div>
                        <div className="absolute inset-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 pulse-ring" />
                    </div>
                    <span className="text-xl font-bold gradient-text tracking-tight">Knowva</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link to={token ? "/dashboard" : "/auth"}>
                        <Button variant="ghost" size="sm">
                            {token ? "Dashboard" : "Sign in"}
                        </Button>
                    </Link>
                    <Link to={token ? "/dashboard" : "/auth"}>
                        <Button size="sm">
                            Get Started
                            <ArrowRight size={14} />
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative z-10 px-6 lg:px-12 pt-20 pb-28 max-w-6xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Badge className="mb-8 shimmer">
                        <Sparkles size={12} className="text-amber-400" />
                        RAG-Powered Knowledge Assistant
                    </Badge>

                    <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-[1.05]">
                        Chat with your{" "}
                        <span className="gradient-text">PDFs</span>
                        <br />
                        <span className="text-slate-400 font-semibold text-4xl sm:text-5xl lg:text-6xl">
                            like never before
                        </span>
                    </h1>

                    <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Upload documents, ask questions, and get AI answers grounded
                        in your content — with citations, streaming, and multi-document
                        support.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to={token ? "/dashboard" : "/auth"}>
                            <Button size="lg" className="glow text-base px-8 py-4">
                                Start for free
                                <ArrowRight size={18} />
                            </Button>
                        </Link>
                        <a href="#features">
                            <Button variant="secondary" size="lg" className="text-base px-8 py-4">
                                Explore features
                                <ChevronRight size={16} />
                            </Button>
                        </a>
                    </div>
                </motion.div>

                {/* Terminal demo */}
                <motion.div
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                    className="mt-24"
                >
                    <div className="gradient-border rounded-2xl glow">
                        <div className="bg-slate-900 rounded-2xl p-1">
                            <div className="bg-slate-800/80 rounded-xl p-6 lg:p-8 text-left">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                                    <span className="ml-auto text-xs text-slate-600 font-mono">knowva terminal</span>
                                </div>
                                <div className="space-y-4 font-mono text-sm lg:text-base">
                                    <div className="flex items-start gap-3">
                                        <span className="text-indigo-400 font-semibold shrink-0">you</span>
                                        <span className="text-slate-300">What is retrieval-augmented generation?</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-cyan-400 font-semibold shrink-0">knowva</span>
                                        <span className="text-slate-300 leading-relaxed">
                                            RAG retrieves relevant context from your documents at query time
                                            without model retraining, making answers always up-to-date and
                                            cheaper than fine-tuning.{" "}
                                            <span className="text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">[1]</span>{" "}
                                            <span className="text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">[2]</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features */}
            <section id="features" className="relative z-10 px-6 lg:px-12 py-28 max-w-6xl mx-auto">
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
                    <h2 className="text-3xl lg:text-5xl font-bold mb-4 tracking-tight">
                        Everything you need for{" "}
                        <span className="gradient-text">document AI</span>
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-lg">
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
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} border ${f.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <f.icon size={22} className={f.iconColor} />
                                </div>
                                <h3 className="font-semibold text-white mb-2 text-lg">{f.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section className="relative z-10 px-6 lg:px-12 py-16 max-w-6xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-6 text-center group hover:border-indigo-500/30 transition-colors">
                                <span className="text-2xl mb-2 block">{s.icon}</span>
                                <p className="text-2xl font-bold gradient-text">{s.value}</p>
                                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
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
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-[80px]" />
                        <div className="relative">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
                                Ready to try{" "}
                                <span className="gradient-text">Knowva</span>?
                            </h2>
                            <p className="text-slate-400 mb-8 text-lg">
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
            <footer className="relative z-10 border-t border-slate-800/60 px-6 py-10">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                            <Brain size={14} className="text-white" />
                        </div>
                        <span className="font-semibold gradient-text text-sm">Knowva</span>
                    </div>
                    <p className="text-sm text-slate-500">
                        Built by Nishad Damale · RAG Knowledge Assistant
                    </p>
                    <a
                        href="https://github.com/NishadDamale1010/rag-knowledge-assistant"
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        <Github size={20} />
                    </a>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
