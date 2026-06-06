import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

function useChatHistory() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const res = await api.get("/chat/sessions");
            setSessions(res.data.sessions || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load chat history");
        } finally {
            setLoading(false);
        }
    };

    const saveSession = async ({ sessionId, documentIds, messages, title }) => {
        const res = await api.post("/chat/sessions", {
            sessionId,
            documentIds,
            messages,
            title,
        });

        await fetchSessions();
        return res.data.session;
    };

    const loadSession = async (id) => {
        const res = await api.get(`/chat/sessions/${id}`);
        return res.data.session;
    };

    const deleteSession = async (id) => {
        try {
            await api.delete(`/chat/sessions/${id}`);
            setSessions((prev) => prev.filter((s) => s._id !== id));
            toast.success("Chat deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete chat");
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    return {
        sessions,
        loading,
        fetchSessions,
        saveSession,
        loadSession,
        deleteSession,
    };
}

export default useChatHistory;
