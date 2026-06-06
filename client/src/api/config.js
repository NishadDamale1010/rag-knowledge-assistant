export function getApiBaseUrl() {
    const raw = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
        /\/+$/,
        ""
    );
    return raw.endsWith("/api") ? raw : `${raw}/api`;
}
