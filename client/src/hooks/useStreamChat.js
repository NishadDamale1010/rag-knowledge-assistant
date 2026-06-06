import { useState } from "react";
import { getApiBaseUrl } from "../api/config";

function useStreamChat() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (question, documentId) => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            const baseURL = getApiBaseUrl();

            const userMessage = {
                role: "user",
                content: question,
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, userMessage]);

            const response = await fetch(`${baseURL}/chat/stream`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ question, documentId }),
            });

            if (!response.ok) {
                let message = "Chat request failed";
                try {
                    const errorBody = await response.json();
                    message = errorBody.message || message;
                } catch {
                    // response may not be JSON
                }
                throw new Error(message);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiText = "";

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "", timestamp: Date.now() },
            ]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (!line.startsWith("data:")) continue;

                    const data = JSON.parse(line.replace("data: ", ""));

                    if (data.error) {
                        throw new Error(data.error);
                    }

                    if (data.token) {
                        aiText += data.token;

                        setMessages((prev) => {
                            const updated = [...prev];
                            updated[updated.length - 1] = {
                                ...updated[updated.length - 1],
                                content: aiText,
                            };
                            return updated;
                        });
                    }
                }
            }
        } catch (error) {
            console.error(error);
            setMessages((prev) => {
                const last = prev[prev.length - 1];
                const errorMessage =
                    error.message || "Sorry, something went wrong. Please try again.";

                if (last?.role === "assistant" && !last.content) {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        ...last,
                        content: errorMessage,
                        isError: true,
                    };
                    return updated;
                }

                return [
                    ...prev,
                    {
                        role: "assistant",
                        content: errorMessage,
                        timestamp: Date.now(),
                        isError: true,
                    },
                ];
            });
        } finally {
            setLoading(false);
        }
    };

    return { messages, loading, sendMessage };
}

export default useStreamChat;
