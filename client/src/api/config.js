const PRODUCTION_API_URL =
    "https://rag-knowledge-assistant-psxy.onrender.com";

export function getApiBaseUrl() {
    const raw = (
        import.meta.env.VITE_API_URL ||
        (import.meta.env.PROD
            ? PRODUCTION_API_URL
            : "http://localhost:5000")
    ).replace(/\/+$/, "");

    const origin = raw.endsWith("/api") ? raw.replace(/\/api$/, "") : raw;
    return `${origin}/api/v1`;
}
