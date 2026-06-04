const { searchSimilarChunks } = require(
    "../services/vectorSearch"
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

module.exports = {
    testSearch,
};