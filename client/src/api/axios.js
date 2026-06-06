import axios from "axios";
import { getApiBaseUrl } from "./config";

const api = axios.create({
    baseURL: getApiBaseUrl(),
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const isAuthRequest = error.config?.url?.includes("/auth/");

            if (!isAuthRequest) {
                localStorage.removeItem("token");
                if (window.location.pathname !== "/") {
                    window.location.href = "/";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
