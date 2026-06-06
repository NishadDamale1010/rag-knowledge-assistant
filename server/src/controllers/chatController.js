const Document = require("../models/document");
const { searchSimilarChunks } = require("../services/vectorSearch");
const { generateAnswer } = require("../services/llmService");
const { createStream } = require("../services/streamingService");
const asyncHandler = require("../utils/asyncHandler");
const logger = require("../utils/logger");

const getDocumentIds = (body) => {
    if (body.documentIds?.length) return body.documentIds;
    if (body.documentId) return [body.documentId];
    return [];
};

const buildContext = (chunks, docMap = {}) =>
    chunks
        .map((chunk, index) => {
            const docName = docMap[chunk.documentId?.toString()] || "document";
            return `[${index + 1}] (${docName}) ${chunk.text}`;
        })
        .join("\n\n");

const getDocMap = async (chunks) => {
    const ids = [...new Set(chunks.map((c) => c.documentId?.toString()))];
    const docs = await Document.find({ _id: { $in: ids } }).select("name");
    const docMap = {};
    docs.forEach((doc) => {
        docMap[doc._id.toString()] = doc.name;
    });
    return docMap;
};

const mapSources = (chunks, docMap) =>
    chunks.map((chunk, index) => ({
        source: index + 1,
        chunkIndex: chunk.chunkIndex,
        score: chunk.score,
        text: chunk.text,
        documentId: chunk.documentId,
        documentName: docMap[chunk.documentId?.toString()] || "document",
    }));

const testSearch = asyncHandler(async (req, res) => {
    const { question } = req.body;
    const documentIds = getDocumentIds(req.body);
    const chunks = await searchSimilarChunks(question, documentIds);

    res.json({ success: true, count: chunks.length, chunks });
});

const askQuestion = asyncHandler(async (req, res) => {
    const { question } = req.body;
    const documentIds = getDocumentIds(req.body);
    const chunks = await searchSimilarChunks(question, documentIds);
    const docMap = await getDocMap(chunks);
    const context = buildContext(chunks, docMap);
    const answer = await generateAnswer(context, question);

    res.json({
        success: true,
        answer,
        sources: mapSources(chunks, docMap),
        usage: req.usage,
    });
});

const streamAnswer = asyncHandler(async (req, res) => {
    const { question } = req.body;
    const documentIds = getDocumentIds(req.body);

    const chunks = await searchSimilarChunks(question, documentIds);
    const docMap = await getDocMap(chunks);
    const context = buildContext(chunks, docMap);
    const stream = await createStream(context, question);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-RateLimit-Remaining", req.usage?.remaining ?? "");

    try {
        for await (const part of stream) {
            const token = part.choices?.[0]?.delta?.content || "";
            if (token) {
                res.write(`data: ${JSON.stringify({ token })}\n\n`);
            }
        }

        res.write(
            `data: ${JSON.stringify({
                sources: mapSources(chunks, docMap),
                usage: req.usage,
            })}\n\n`
        );
        res.end();
    } catch (error) {
        logger.error("stream_error", { message: error.message, userId: req.user.id });

        if (!res.headersSent) {
            throw error;
        }

        res.write(`data: ${JSON.stringify({ error: "Streaming failed" })}\n\n`);
        res.end();
    }
});

module.exports = { testSearch, askQuestion, streamAnswer };
