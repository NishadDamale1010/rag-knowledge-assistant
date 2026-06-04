const openrouter = require("../config/openrouter");

const generateEmbedding = async (text) => {
    try {
        const response = await openrouter.embeddings.create({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            input: text,
        });

        return response.data[0].embedding;
    } catch (error) {
        console.error("Embedding Error:", error);
        throw new Error("Failed to generate embedding");
    }
};

const generateEmbeddings = async (texts) => {
    try {
        const response = await openrouter.embeddings.create({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            input: texts,
        });

        return response.data.map(item => item.embedding);
    } catch (error) {
        console.error("Embedding Error:", error);
        throw new Error("Failed to generate embeddings");
    }
};

module.exports = {
    generateEmbedding,
    generateEmbeddings,
};