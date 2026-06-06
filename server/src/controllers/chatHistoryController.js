const ChatSession = require("../models/chatSession");

const getSessions = async (req, res) => {
    try {
        const sessions = await ChatSession.find({
            userId: req.user.id,
        }).sort({ updatedAt: -1 });

        res.json({
            success: true,
            sessions: sessions.map((s) => ({
                _id: s._id,
                title: s.title,
                documentIds: s.documentIds,
                preview:
                    s.messages.find((m) => m.role === "user")?.content?.slice(
                        0,
                        60
                    ) || "Empty chat",
                messageCount: s.messages.length,
                updatedAt: s.updatedAt,
            })),
        });
    } catch (error) {
        console.error("Get Sessions Error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getSession = async (req, res) => {
    try {
        const session = await ChatSession.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        res.json({ success: true, session });
    } catch (error) {
        console.error("Get Session Error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const saveSession = async (req, res) => {
    try {
        const { sessionId, documentIds, messages, title } = req.body;

        if (!messages?.length) {
            return res.status(400).json({
                success: false,
                message: "Messages are required",
            });
        }

        const chatTitle =
            title ||
            messages.find((m) => m.role === "user")?.content?.slice(0, 50) ||
            "New Chat";

        if (sessionId) {
            const session = await ChatSession.findOneAndUpdate(
                { _id: sessionId, userId: req.user.id },
                { documentIds, messages, title: chatTitle },
                { new: true }
            );

            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: "Chat not found",
                });
            }

            return res.json({ success: true, session });
        }

        const session = await ChatSession.create({
            userId: req.user.id,
            documentIds: documentIds || [],
            messages,
            title: chatTitle,
        });

        res.status(201).json({ success: true, session });
    } catch (error) {
        console.error("Save Session Error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteSession = async (req, res) => {
    try {
        const session = await ChatSession.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        res.json({ success: true, message: "Chat deleted" });
    } catch (error) {
        console.error("Delete Session Error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getSessions,
    getSession,
    saveSession,
    deleteSession,
};
