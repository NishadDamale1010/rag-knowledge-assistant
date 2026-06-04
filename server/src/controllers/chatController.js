const { searchSimilarChunks } = require(
    "../services/vectorSearch"
);
const { generateAnswer } = require(
    "../services/llmService"
);
const { createStream } = require(
    "../services/streamingService"
);

const testSearch = async (req, res) => {
    try {
        const { question, documentId } = req.body;

        const chunks = await searchSimilarChunks(
            question,
            documentId
        );

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
const buildContext = (chunks) => {
    return chunks
        .map(
            (chunk, index) =>
                `[${index + 1}] ${chunk.text}`
        )
        .join("\n\n");
};
const askQuestion = async (req, res) => {
    try {
        const { question, documentId } = req.body;

        const chunks =
            await searchSimilarChunks(
                question,
                documentId
            );

        const context = buildContext(chunks);

        const answer =
            await generateAnswer(
                context,
                question
            );

        res.json({
            success: true,
            answer,
            sources: chunks.map((chunk, index) => ({
                source: index + 1,
                chunkIndex: chunk.chunkIndex,
                score: chunk.score,
                text: chunk.text,
                documentId: chunk.documentId,
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

const streamAnswer = async (
    req,
    res
) => {
    try {
        const {
            question,
            documentId
        } = req.body;

        const chunks =
            await searchSimilarChunks(
                question,
                documentId
            );

        const context =
            buildContext(chunks);

        const stream =
            await createStream(
                context,
                question
            );

        res.setHeader(
            "Content-Type",
            "text/event-stream"
        );

        res.setHeader(
            "Cache-Control",
            "no-cache"
        );

        res.setHeader(
            "Connection",
            "keep-alive"
        );

        for await (const part of stream) {
            const token =
                part.choices?.[0]?.delta
                    ?.content || "";

            if (token) {
                res.write(
                    `data: ${JSON.stringify({
                        token
                    })}\n\n`
                );
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
                }))
            })}\n\n`
        );

        res.end();
    } catch (error) {
        console.error(error);

        res.status(500).end();
    }
};

module.exports = {
    testSearch,
    askQuestion,
    streamAnswer,  
};