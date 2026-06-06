const mongoose = require("mongoose");
const Chunk = require("../models/chunk");
const { generateEmbeddings } = require("./embeddingService");

const searchSimilarChunks = async (queryText, documentIds, k = 5) => {
    try {
        const ids = Array.isArray(documentIds)
            ? documentIds
            : [documentIds];

        console.log("Search query:", queryText);
        console.log("Document IDs:", ids);

        const queryVector = await generateEmbeddings([queryText]).then(
            (embeddings) => embeddings[0]
        );

        const objectIds = ids.map(
            (id) => new mongoose.Types.ObjectId(id)
        );

        const chunkCount = await Chunk.countDocuments({
            documentId: { $in: objectIds },
        });
        console.log("Total chunks for documents:", chunkCount);

        const limit = ids.length > 1 ? 8 : k;

        const results = await Chunk.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector,
                    numCandidates: 100,
                    limit,
                    filter: {
                        documentId: { $in: objectIds },
                    },
                },
            },
            {
                $project: {
                    text: 1,
                    chunkIndex: 1,
                    documentId: 1,
                    score: { $meta: "vectorSearchScore" },
                },
            },
        ]);

        return results;
    } catch (error) {
        console.error("Vector Search Error:", error);
        throw error;
    }
};

module.exports = { searchSimilarChunks };
