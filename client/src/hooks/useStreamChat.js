import { useState } from "react";
import { getApiBaseUrl } from "../api/config";

function parseSseData(line) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) return null;

    const jsonStr = trimmed.slice(5).trim();
    if (!jsonStr) return null;

    return JSON.parse(jsonStr);
}

function useStreamChat() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (question, documentIds) => {
        let aiText = "";
        let finalMessages = [];

        const ids = Array.isArray(documentIds)
            ? documentIds
            : [documentIds];

        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            const baseURL = getApiBaseUrl();

            const userMessage = {
                role: "user",
                content: question,
                timestamp: Date.now(),
            };

            setMessages((prev) => {
                finalMessages = [...prev, userMessage];
                return finalMessages;
            });

            const response = await fetch(`${baseURL}/chat/stream`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    question,
                    documentIds: ids,
                }),
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

            const assistantMessage = {
                role: "assistant",
                content: "",
                timestamp: Date.now(),
            };

            setMessages((prev) => {
                finalMessages = [...prev, assistantMessage];
                return finalMessages;
            });

            let buffer = "";
            let sources = null;

            const processLine = (line) => {
                let data;
                try {
                    data = parseSseData(line);
                } catch {
                    return;
                }
                if (!data) return;

                if (data.error) {
                    throw new Error(data.error);
                }

                if (data.token) {
                    aiText += data.token;
                }

                if (data.sources) {
                    sources = data.sources;
                }
            };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    processLine(line);
                }

                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        ...updated[updated.length - 1],
                        content: aiText,
                        ...(sources && { sources }),
                    };
                    finalMessages = updated;
                    return updated;
                });
            }

            buffer += decoder.decode();
            if (buffer.trim()) {
                processLine(buffer);
            }

            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: aiText,
                    ...(sources && { sources }),
                };
                finalMessages = updated;
                return updated;
            });

            return finalMessages;
        } catch (error) {
            console.error(error);

            if (aiText) return finalMessages;

            const errorMessage =
                error.message || "Sorry, something went wrong. Please try again.";

            setMessages((prev) => {
                const last = prev[prev.length - 1];

                if (last?.role === "assistant" && !last.content) {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        ...last,
                        content: errorMessage,
                        isError: true,
                    };
                    finalMessages = updated;
                    return updated;
                }

                finalMessages = [
                    ...prev,
                    {
                        role: "assistant",
                        content: errorMessage,
                        timestamp: Date.now(),
                        isError: true,
                    },
                ];
                return finalMessages;
            });

            return finalMessages;
        } finally {
            setLoading(false);
        }
    };

    return { messages, setMessages, loading, sendMessage };
}

export default useStreamChat;
