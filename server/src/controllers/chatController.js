const Document = require("../models/document");
const { searchSimilarChunks } = require("../services/vectorSearch");
const { generateAnswer } = require("../services/llmService");
const { createStream } = require("../services/streamingService");
const asyncHandler = require("../utils/asyncHandler");
const logger = require("../utils/logger");
const { safeExcerpt } = require("../utils/responseSanitizer");

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
    chunks.map((chunk, index) => {
        const excerpt = safeExcerpt(chunk.text, 320);

        return {
            source: index + 1,
            chunkIndex: chunk.chunkIndex,
            score: chunk.score,
            excerpt: excerpt.text,
            redacted: excerpt.redacted,
            documentId: chunk.documentId,
            documentName: docMap[chunk.documentId?.toString()] || "document",
        };
    });

/**
 * Builds a user-friendly fallback response from retrieved chunks.
 * Used when all LLM providers are unavailable, so the user still gets
 * document-grounded information instead of an error.
 */
const buildChunkFallbackResponse = (chunks, docMap) => {
    if (!chunks || chunks.length === 0) {
        return "I couldn't find any relevant information in the uploaded documents for your question.";
    }

    let response = `Here are the most relevant excerpts I found for your question:\n\n`;

    chunks.forEach((chunk, index) => {
        const docName = docMap[chunk.documentId?.toString()] || "document";
        const excerpt = safeExcerpt(chunk.text, 900);
        if (excerpt.text) {
            response += `**[${index + 1}]** _(${docName})_\n${excerpt.text}\n\n`;
        }
    });

    response += `---\n_These are safe excerpts from your documents. AI summarisation is temporarily unavailable._`;

    return response;
};

const testSearch = asyncHandler(async (req, res) => {
    const { question } = req.body;
    const documentIds = getDocumentIds(req.body);
    const chunks = await searchSimilarChunks(question, documentIds);
    const docMap = await getDocMap(chunks);

    res.json({
        success: true,
        count: chunks.length,
        chunks: mapSources(chunks, docMap),
    });
});

const askQuestion = asyncHandler(async (req, res) => {
    const { question } = req.body;
    const documentIds = getDocumentIds(req.body);
    const chunks = await searchSimilarChunks(question, documentIds);
    const docMap = await getDocMap(chunks);
    const context = buildContext(chunks, docMap);
    const sources = mapSources(chunks, docMap);

    let answer;
    let fallback = false;

    try {
        answer = await generateAnswer(context, question);
    } catch (error) {
        logger.error("llm_all_providers_failed", {
            message: error.message,
            userId: req.user.id,
        });
        // All LLM providers failed, so return safe chunks as fallback.
        answer = buildChunkFallbackResponse(chunks, docMap);
        fallback = true;
    }

    res.json({
        success: true,
        answer,
        sources,
        usage: req.usage,
        fallback,
    });
});

const streamAnswer = asyncHandler(async (req, res) => {
    const { question } = req.body;
    const documentIds = getDocumentIds(req.body);

    const chunks = await searchSimilarChunks(question, documentIds);
    const docMap = await getDocMap(chunks);
    const context = buildContext(chunks, docMap);
    const sources = mapSources(chunks, docMap);

    // Try to get a streaming LLM response
    const stream = await createStream(context, question);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-RateLimit-Remaining", req.usage?.remaining ?? "");

    // If ALL streaming providers failed, return the retrieved chunks directly
    // so the user still gets a useful response from the RAG system.
    if (!stream) {
        logger.error("stream_all_providers_failed", {
            message: "All LLM providers failed, returning chunks as fallback",
            userId: req.user.id,
        });

        const fallbackAnswer = buildChunkFallbackResponse(chunks, docMap);

        // Stream the fallback answer token-by-token to keep the client flow intact.
        for (const token of fallbackAnswer.match(/\S+\s*/g) || []) {
            res.write(`data: ${JSON.stringify({ token })}\n\n`);
        }

        res.write(
            `data: ${JSON.stringify({
                sources,
                usage: req.usage,
                fallback: true,
            })}\n\n`
        );
        res.end();
        return;
    }

    try {
        for await (const { token } of stream) {
            if (token) {
                res.write(`data: ${JSON.stringify({ token })}\n\n`);
            }
        }

        res.write(
            `data: ${JSON.stringify({
                sources,
                usage: req.usage,
                fallback: false,
            })}\n\n`
        );
        res.end();
    } catch (error) {
        logger.error("stream_error", { message: error.message, userId: req.user.id });

        if (!res.headersSent) {
            throw error;
        }

        // Mid-stream failure: try to gracefully finish with chunks fallback
        try {
            const fallbackAnswer = buildChunkFallbackResponse(chunks, docMap);
            res.write(`data: ${JSON.stringify({ token: "\n\n---\n\n" })}\n\n`);
            res.write(`data: ${JSON.stringify({ token: fallbackAnswer })}\n\n`);
            res.write(
                `data: ${JSON.stringify({
                    sources,
                    usage: req.usage,
                    fallback: true,
                })}\n\n`
            );
        } catch (_) {
            res.write(`data: ${JSON.stringify({ error: "Streaming failed" })}\n\n`);
        }
        res.end();
    }
});

module.exports = { testSearch, askQuestion, streamAnswer };
