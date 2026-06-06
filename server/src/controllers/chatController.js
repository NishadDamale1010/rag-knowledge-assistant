const Document = require("../models/document");
const { searchSimilarChunks } = require("../services/vectorSearch");
const { generateAnswer } = require("../services/llmService");
const { createStream } = require("../services/streamingService");

const getDocumentIds = (body) => {
    if (body.documentIds?.length) {
        return body.documentIds;
    }
    if (body.documentId) {
        return [body.documentId];
    }
    return [];
};

const buildContext = (chunks, docMap = {}) => {
    return chunks
        .map((chunk, index) => {
            const docName =
                docMap[chunk.documentId?.toString()] || "document";
            return `[${index + 1}] (${docName}) ${chunk.text}`;
        })
        .join("\n\n");
};

const getDocMap = async (chunks) => {
    const ids = [
        ...new Set(chunks.map((c) => c.documentId?.toString())),
    ];

    const docs = await Document.find({ _id: { $in: ids } }).select(
        "name"
    );

    const docMap = {};
    docs.forEach((doc) => {
        docMap[doc._id.toString()] = doc.name;
    });

    return docMap;
};

const testSearch = async (req, res) => {
    try {
        const { question } = req.body;
        const documentIds = getDocumentIds(req.body);

        if (!documentIds.length) {
            return res.status(400).json({
                success: false,
                message: "At least one document is required",
            });
        }

        const chunks = await searchSimilarChunks(question, documentIds);

        res.json({
            success: true,
            count: chunks.length,
            chunks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const askQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        const documentIds = getDocumentIds(req.body);

        if (!documentIds.length) {
            return res.status(400).json({
                success: false,
                message: "At least one document is required",
            });
        }

        const chunks = await searchSimilarChunks(question, documentIds);
        const docMap = await getDocMap(chunks);
        const context = buildContext(chunks, docMap);
        const answer = await generateAnswer(context, question);

        res.json({
            success: true,
            answer,
            sources: chunks.map((chunk, index) => ({
                source: index + 1,
                chunkIndex: chunk.chunkIndex,
                score: chunk.score,
                text: chunk.text,
                documentId: chunk.documentId,
                documentName:
                    docMap[chunk.documentId?.toString()] || "document",
            })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const streamAnswer = async (req, res) => {
    try {
        const { question } = req.body;
        const documentIds = getDocumentIds(req.body);

        if (!documentIds.length) {
            return res.status(400).json({
                success: false,
                message: "At least one document is required",
            });
        }

        const chunks = await searchSimilarChunks(question, documentIds);
        const docMap = await getDocMap(chunks);
        const context = buildContext(chunks, docMap);
        const stream = await createStream(context, question);

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        for await (const part of stream) {
            const token = part.choices?.[0]?.delta?.content || "";

            if (token) {
                res.write(`data: ${JSON.stringify({ token })}\n\n`);
            }
        }

        res.write(
            `data: ${JSON.stringify({
                sources: chunks.map((chunk, index) => ({
                    source: index + 1,
                    chunkIndex: chunk.chunkIndex,
                    score: chunk.score,
                    text: chunk.text,
                    documentId: chunk.documentId,
                    documentName:
                        docMap[chunk.documentId?.toString()] || "document",
                })),
            })}\n\n`
        );

        res.end();
    } catch (error) {
        console.error("Stream Answer Error:", error);

        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: error.message || "Streaming failed",
            });
        } else {
            res.write(
                `data: ${JSON.stringify({
                    error: error.message || "Streaming failed",
                })}\n\n`
            );
            res.end();
        }
    }
};

module.exports = {
    testSearch,
    askQuestion,
    streamAnswer,
};
