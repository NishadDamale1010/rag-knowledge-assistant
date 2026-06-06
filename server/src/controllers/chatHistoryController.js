const ChatSession = require("../models/chatSession");
const asyncHandler = require("../utils/asyncHandler");

const getSessions = asyncHandler(async (req, res) => {
    const sessions = await ChatSession.find({ userId: req.user.id }).sort({
        updatedAt: -1,
    });

    res.json({
        success: true,
        sessions: sessions.map((s) => ({
            _id: s._id,
            title: s.title,
            documentIds: s.documentIds,
            preview:
                s.messages.find((m) => m.role === "user")?.content?.slice(0, 60) ||
                "Empty chat",
            messageCount: s.messages.length,
            updatedAt: s.updatedAt,
        })),
    });
});

const getSession = asyncHandler(async (req, res) => {
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
});

const saveSession = asyncHandler(async (req, res) => {
    const { sessionId, documentIds, messages, title } = req.body;

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
});

const deleteSession = asyncHandler(async (req, res) => {
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
});

module.exports = { getSessions, getSession, saveSession, deleteSession };
