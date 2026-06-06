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
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

const features = [
    {
        icon: FileText,
        title: "Upload PDFs",
        desc: "Drop documents and build a searchable knowledge base in seconds.",
    },
    {
        icon: Search,
        title: "Semantic Search",
        desc: "Vector embeddings find the most relevant context from your files.",
    },
    {
        icon: MessageSquare,
        title: "AI Chat",
        desc: "Ask natural language questions and get grounded, cited answers.",
    },
    {
        icon: Layers,
        title: "Multi-Document",
        desc: "Query across multiple PDFs simultaneously with unified context.",
    },
    {
        icon: Zap,
        title: "Streaming",
        desc: "Real-time token streaming for a ChatGPT-level experience.",
    },
    {
        icon: Shield,
        title: "Secure",
        desc: "JWT auth with user-scoped document isolation.",
    },
];

const stats = [
    { value: "RAG", label: "Architecture" },
    { value: "SSE", label: "Streaming" },
    { value: "Atlas", label: "Vector DB" },
    { value: "AI", label: "Powered" },
];

function Landing() {
    const token = localStorage.getItem("token");

    return (
        <div className="min-h-screen bg-slate-900 overflow-hidden">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px]" />
                <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[80px]" />
            </div>

            <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center glow">
                        <Brain size={18} className="text-white" />
                    </div>
                    <span className="text-lg font-bold gradient-text">Knowva</span>
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

            <section className="relative z-10 px-6 lg:px-12 pt-16 pb-24 max-w-6xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge className="mb-6">
                        <Sparkles size={12} />
                        RAG Knowledge Assistant
                    </Badge>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
                        Chat with your{" "}
                        <span className="gradient-text">PDFs</span>
                        <br />
                        like a pro
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Upload documents, ask questions, and get AI answers grounded
                        in your content — with citations, streaming, and multi-document
                        support.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to={token ? "/dashboard" : "/auth"}>
                            <Button size="lg" className="glow">
                                Start for free
                                <ArrowRight size={16} />
                            </Button>
                        </Link>
                        <a href="#features">
                            <Button variant="secondary" size="lg">
                                See features
                            </Button>
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-20 gradient-border rounded-2xl"
                >
                    <div className="bg-slate-900 rounded-2xl p-1">
                        <div className="bg-slate-800/80 rounded-xl p-6 text-left">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-rose-500" />
                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            </div>
                            <div className="space-y-3 font-mono text-sm">
                                <p className="text-slate-500">
                                    <span className="text-indigo-400">user</span> What is RAG?
                                </p>
                                <p className="text-slate-300 leading-relaxed">
                                    <span className="text-cyan-400">knowva</span> RAG retrieves
                                    relevant context at query time without model retraining,
                                    making answers always up-to-date and cheaper than
                                    fine-tuning <span className="text-indigo-400">[1]</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            <section id="features" className="relative z-10 px-6 lg:px-12 py-24 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">
                        Everything you need for{" "}
                        <span className="gradient-text">document AI</span>
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        A complete RAG pipeline from upload to streaming answers.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <Card hover className="p-6 h-full">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
                                    <f.icon size={20} className="text-indigo-400" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="relative z-10 px-6 lg:px-12 py-16 max-w-6xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s) => (
                        <Card key={s.label} className="p-6 text-center">
                            <p className="text-2xl font-bold gradient-text">{s.value}</p>
                            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="relative z-10 px-6 lg:px-12 py-24 max-w-3xl mx-auto text-center">
                <Card className="p-12 glow">
                    <h2 className="text-3xl font-bold mb-4">Ready to try Knowva?</h2>
                    <p className="text-slate-400 mb-8">
                        Upload your first PDF and start asking questions in under a minute.
                    </p>
                    <Link to={token ? "/dashboard" : "/auth"}>
                        <Button size="lg">
                            Launch App
                            <ArrowRight size={16} />
                        </Button>
                    </Link>
                </Card>
            </section>

            <footer className="relative z-10 border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
                Built by Nishad Damale · RAG Knowledge Assistant
            </footer>
        </div>
    );
}

export default Landing;
