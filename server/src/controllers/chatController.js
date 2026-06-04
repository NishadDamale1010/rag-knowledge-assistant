const { searchSimilarChunks } = require(
    "../services/vectorSearch"
);
const { generateAnswer } = require(
    "../services/llmService"
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

module.exports = {
    testSearch,
    askQuestion,  
};