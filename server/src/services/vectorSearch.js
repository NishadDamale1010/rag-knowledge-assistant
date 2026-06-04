const mongoose = require("mongoose");
const Chunk = require("../models/chunk");

const { generateEmbeddings } = require("./embeddingService");

const searchSimilarChunks = async (
    queryText,
    documentId,
    k = 5
) => {
    try {
        console.log("Search query:", queryText);
        console.log("Document ID:", documentId);
        
        // Generate query embedding
        const queryVector = await generateEmbeddings([queryText]).then(embeddings => embeddings[0]);
        console.log("Query vector length:", queryVector.length);

        // Check if chunks exist for this document
        const chunkCount = await Chunk.countDocuments({ documentId });
        console.log("Total chunks for document:", chunkCount);

        console.log("Query Vector Length:", queryVector.length);
        const results = await Chunk.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector,
                    numCandidates: 50,
                    limit: k,
                    filter: {
                        documentId: new mongoose.Types.ObjectId(
                            documentId
                        ),
                    },
                },
            },
            {
                $project: {
                    text: 1,
                    chunkIndex: 1,
                    documentId: 1,
                    score: {
                        $meta: "vectorSearchScore",
                    },
                },
            },
        ]);

        return results;
    } catch (error) {
        console.error("Vector Search Error:", error);
        throw error;
    }
};

module.exports = {
    searchSimilarChunks,
};